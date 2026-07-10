// ============================================================
//  quests.js – Quest-Engine: steuert Fortschritt, Spawns,
//  Kapitel, Belohnungen und die drei Enden.
// ============================================================

import { CHAPTERS, ZONE_NPCS, ZONE_PORTALS, ZONE_FRAGMENTS, ZONE_AMBIENT, ZONE_MIX, ENDINGS } from './questdata.js';
import { ZONE_INFO } from './world.js';
import { CONFIG } from './config.js';
import { ACH } from './achievements.js';
import { AUDIO } from './audio.js';
import { dist2 } from './utils.js';
import { t, tx } from './i18n.js';

export class QuestSystem {
  constructor(game) {
    this.game = game;
    this.chapterIdx = 0;
    this.questIdx = 0;
    this.stepIdx = 0;
    this.progress = 0;            // Fortschritt im aktuellen Schritt (Kills/Sammeln)
    this.done = new Set();        // abgeschlossene Quest-IDs
    this.flags = {};              // Story-Flags & Entscheidungen
    this.kills = 0;
    this.fragments = 0;
    this.fragTaken = {};          // { zone: [indices] }
    this.finished = false;
    this._busy = false;           // verhindert Doppel-Trigger während Szenen
    this._stepEntities = [];      // aufzuräumende Marker
    this._pendingBoss = null;
    this._allyTimer = 0;
    this._ambient = [];           // Respawn-Verwaltung
    this._trackTimer = 0;
  }

  // ---------- Zugriff ----------
  get chapter() { return CHAPTERS[this.chapterIdx] || null; }
  get quest() { return this.chapter ? this.chapter.quests[this.questIdx] || null : null; }
  get step() { return this.quest ? this.quest.steps[this.stepIdx] || null : null; }

  chapterUnlocked(id) {
    if (id === 'one') return true;
    return !!this.flags['ch_' + id];
  }

  // ---------- Speicherung ----------
  serialize() {
    return {
      chapterIdx: this.chapterIdx, questIdx: this.questIdx, stepIdx: this.stepIdx,
      progress: this.progress, done: [...this.done], flags: this.flags,
      kills: this.kills, fragments: this.fragments, fragTaken: this.fragTaken,
      finished: this.finished,
    };
  }

  restore(d) {
    if (!d) return;
    this.chapterIdx = d.chapterIdx || 0;
    this.questIdx = d.questIdx || 0;
    this.stepIdx = d.stepIdx || 0;
    this.progress = d.progress || 0;
    this.done = new Set(d.done || []);
    this.flags = d.flags || {};
    this.kills = d.kills || 0;
    this.fragments = d.fragments || 0;
    this.fragTaken = d.fragTaken || {};
    this.finished = !!d.finished;
  }

  // ---------- Zone betreten ----------
  enterZone(zoneId) {
    const em = this.game.em;
    this._stepEntities = [];
    this._pendingBoss = null;
    this._ambient = [];

    // Portale
    for (const p of (ZONE_PORTALS[zoneId] || [])) {
      const locked = p.chapter ? !this.chapterUnlocked(p.chapter) : false;
      em.addPortal({ ...p, locked });
    }

    // Feste NPCs
    for (const def of (ZONE_NPCS[zoneId] || [])) {
      if (def.hideIf && this.flags[def.hideIf]) continue;
      if (def.secretFlag && this.flags[def.secretFlag]) continue; // bereits gefunden
      em.spawnNPC({ ...def, questTag: null });
    }

    // Erinnerungsfragmente
    const taken = this.fragTaken[zoneId] || [];
    (ZONE_FRAGMENTS[zoneId] || []).forEach((pos, idx) => {
      if (!taken.includes(idx)) {
        em.spawnPickup('fragment', pos, { fragId: zoneId + ':' + idx });
      }
    });

    // Umherstreifende Gegner
    const amb = ZONE_AMBIENT[zoneId];
    if (amb && !this.finishedBossActive()) {
      const mix = ZONE_MIX[zoneId] || ['shadow'];
      amb.packs.forEach((center, i) => {
        this._ambient.push({ center, level: amb.level, kinds: mix, timer: 0, alive: [] });
      });
      for (const pack of this._ambient) this._spawnPack(pack);
    }

    // aktuellen Quest-Schritt aktivieren, falls er hier spielt
    const isFinale = this.quest && this.quest.id === 'infinite-baths' && zoneId === 'baths';
    if ((this.quest && this.chapter.zone === zoneId) || isFinale) {
      this.activateStep(true);
    }
    this.updateTracker();
  }

  finishedBossActive() {
    return this.game.em.enemies.some(e => e.isBoss && !e.dead);
  }

  _spawnPack(pack) {
    const em = this.game.em;
    pack.alive = [];
    for (let i = 0; i < 3; i++) {
      const kind = pack.kinds[i % pack.kinds.length];
      const e = em.spawnEnemies(kind, 1, pack.center, 5, pack.level, {})[0];
      pack.alive.push(e);
    }
  }

  // ---------- Schritt aktivieren ----------
  async activateStep(onEnter = false) {
    const step = this.step;
    if (!step || this.finished && step.type !== 'ending') { this.updateTracker(); return; }
    const game = this.game;
    const em = game.em;

    // Schritte laufen nur in der Kapitel-Zone (außer 'zone'/'ending')
    const inZone = game.currentZone === (this.chapter ? this.chapter.zone : null);
    const inBaths = game.currentZone === 'baths';
    if (!inZone && !inBaths && step.type !== 'zone') { this.updateTracker(); return; }

    if (step.type === 'scene') {
      if (this._busy) return;
      this._busy = true;
      await game.dlg.runScene(step.lines);
      if (step.setFlags) Object.assign(this.flags, step.setFlags);
      if (step.healFull) game.player.healFull();
      this._busy = false;
      this.advance();

    } else if (step.type === 'goto') {
      const m = em.addMarker(step.pos, tx(step.label));
      this._stepEntities.push(m);

    } else if (step.type === 'talk') {
      if (step.spawn && !em.findNPC(step.npc)) {
        em.spawnNPC({ id: step.npc, questTag: 'quest', ...step.spawn });
      }
      const npc = em.findNPC(step.npc);
      if (npc) {
        const m = em.addMarker([npc.pos.x + 2, npc.pos.z + 2], null);
        this._stepEntities.push(m);
      }

    } else if (step.type === 'kill') {
      const remaining = step.count - this.progress;
      const kinds = step.enemy === 'mixed' ? (ZONE_MIX[this.chapter.zone] || ['shadow']) : [step.enemy];
      for (let i = 0; i < remaining; i++) {
        em.spawnEnemies(kinds[i % kinds.length], 1, step.center, step.radius, this.chapter.level, { questTag: 'quest' });
      }
      // Wegmarke zum Kampfort setzen, damit die Quest-Gegner auch im Nebel auffindbar sind
      const m = em.addMarker(step.center, tx(step.label));
      this._stepEntities.push(m);

    } else if (step.type === 'collect') {
      step.positions.slice(this.progress).forEach((pos) => {
        em.spawnPickup('quest', pos, { questTag: 'quest' });
      });
      const m = em.addMarker(step.positions[Math.min(this.progress, step.positions.length - 1)], null);
      this._stepEntities.push(m);

    } else if (step.type === 'boss') {
      // Boss erscheint, sobald der Spieler die Arena erreicht
      const m = em.addMarker(step.pos, tx(step.label));
      this._stepEntities.push(m);
      this._pendingBoss = step;

    } else if (step.type === 'zone') {
      if (this._busy) return;
      this._busy = true;
      await game.travelTo(step.to);
      this._busy = false;
      this.advance();

    } else if (step.type === 'ending') {
      if (this._busy) return;
      this._busy = true;
      await this.runEnding();
      this._busy = false;
    }
    this.updateTracker();
  }

  _clearStepEntities() {
    for (const m of this._stepEntities) this.game.em.removeMarker(m);
    this._stepEntities = [];
    this._pendingBoss = null;
  }

  // Nach dem Tod des Spielers: aktuellen Schritt zurücksetzen
  resetCurrentStep() {
    const em = this.game.em;
    this._clearStepEntities();
    // Bosse & Quest-Gegner entfernen (Fortschritt bei Kill-Schritten bleibt erhalten)
    [...em.enemies].filter(e => e.isBoss || e.questTag === 'quest' || e.questTag === 'bossadd')
      .forEach(e => em.removeEnemy(e));
    this.game.ui.bossBar(false);
    if (this._ally) { em.removeNPC(this._ally); this._ally = null; }
    this.activateStep();
    this.updateTracker();
  }

  // ---------- Fortschritt ----------
  advance() {
    this._clearStepEntities();
    this.progress = 0;
    this.stepIdx++;
    if (this.quest && this.stepIdx >= this.quest.steps.length) {
      this.completeQuest();
    } else {
      this.activateStep();
    }
    this.updateTracker();
    this.game.autosave();
  }

  async completeQuest() {
    const quest = this.quest;
    const chapter = this.chapter;
    if (!quest) return;
    this.done.add(quest.id);
    AUDIO.sfx('quest');
    this.game.ui.toast(t('quest_complete', quest.song, quest.xp));
    this.game.player.gainXP(quest.xp);

    if (quest.ach) ACH.unlock(quest.ach);
    if (this.flags.sacrifice && !this.flags._sacrificeApplied) {
      this.flags._sacrificeApplied = 1;
      this.game.player.applyMaxHpDelta(-10);
    }
    if (this.done.size >= 51) ACH.unlock('worship');

    this.stepIdx = 0;
    this.progress = 0;
    this.questIdx++;

    if (this.questIdx >= chapter.quests.length) {
      await this.completeChapter();
    } else {
      // nächste Quest sanft ankündigen
      const next = this.quest;
      setTimeout(() => {
        this.game.ui.toast(t('quest_new', next.song));
      }, 1500);
      this.activateStep();
    }
    this.updateTracker();
    this.game.autosave();
  }

  async completeChapter() {
    const chapter = this.chapter;
    this._busy = true;
    if (chapter.outro) await this.game.dlg.runScene(chapter.outro);
    this._busy = false;

    if (chapter.ach) ACH.unlock(chapter.ach);
    if (chapter.unlockChar) {
      this.game.player.unlockChar(chapter.unlockChar);
      this.flags['unlocked_' + chapter.unlockChar] = 1;
      // wartenden Band-NPC aus dem Heiligtum entfernen
      const map = { two: 'band-two', three: 'band-three', four: 'band-four' };
      this.game.em.removeNPC(map[chapter.unlockChar]);
      AUDIO.sfx('unlock');
      if (this.flags.unlocked_two && this.flags.unlocked_three && this.flags.unlocked_four) {
        ACH.unlock('band-complete');
      }
    }

    this.chapterIdx++;
    this.questIdx = 0;
    this.stepIdx = 0;
    this.progress = 0;

    if (this.chapter) {
      this.flags['ch_' + this.chapter.id] = 1;
      // Portal im Heiligtum entriegeln (falls wir gerade dort sind)
      for (const p of this.game.em.portals) {
        if (p.zone === this.chapter.zone) p.setLocked(false);
      }
      const zoneName = tx(ZONE_INFO[this.chapter.zone].name);
      this.game.ui.toast(t('chapter_new', tx(this.chapter.title), this.chapter.sub, zoneName));
      this.game.ui.chapterCard(tx(this.chapter.title), this.chapter.sub);
    }
  }

  // ---------- Ereignisse aus der Spielwelt ----------
  onEnemyKilled(e) {
    this.kills++;
    ACH.onKill(this.kills);
    const step = this.step;
    if (step && step.type === 'kill' && e.questTag === 'quest') {
      this.progress++;
      if (this.progress >= step.count) this.advance();
      else this.updateTracker();
    }
  }

  onBossKilled(boss) {
    const step = this.step;
    // verbleibende Boss-Adds entfernen
    this.game.em.enemies.filter(e => e.questTag === 'bossadd' && !e.dead).forEach(e => e.die(this.game));
    if (step && step.type === 'boss') this.advance();
  }

  onCollectItem(pickup) {
    const step = this.step;
    AUDIO.sfx('pickup');
    if (step && step.type === 'collect' && pickup.questTag === 'quest') {
      this.progress++;
      this._clearStepEntities();
      if (this.progress >= step.count) {
        this.advance();
      } else {
        const m = this.game.em.addMarker(step.positions[Math.min(this.progress, step.positions.length - 1)], null);
        this._stepEntities.push(m);
        this.updateTracker();
      }
    }
  }

  onFragment(pickup) {
    AUDIO.sfx('fragment');
    this.fragments++;
    ACH.onFragment(this.fragments);
    const [zone, idx] = pickup.fragId.split(':');
    this.fragTaken[zone] = this.fragTaken[zone] || [];
    this.fragTaken[zone].push(parseInt(idx, 10));
    this.game.ui.toast(t('frag_found', this.fragments, CONFIG.fragmentXp));
    this.game.player.gainXP(CONFIG.fragmentXp);
    this.updateTracker();
  }

  async onTalk(npc) {
    if (this._busy) return;
    const step = this.step;

    // Quest-Gespräch?
    if (step && step.type === 'talk' && step.npc === npc.id) {
      this._busy = true;
      const { flags } = await this.game.dlg.runDialog(step.lines, { talkNpc: npc });
      Object.assign(this.flags, flags);
      if (step.healFull) this.game.player.healFull();
      if (step.removeAfter) this.game.em.removeNPC(npc);
      this._busy = false;
      this.advance();
      return;
    }

    // normaler NPC
    if (npc.lines) {
      this._busy = true;
      await this.game.dlg.runDialog(npc.lines, { talkNpc: npc });
      this._busy = false;
      if (npc.secretFlag && !this.flags[npc.secretFlag]) {
        this.flags[npc.secretFlag] = 1;
        const found = ['espera1', 'espera2', 'espera3'].filter(f => this.flags[f]).length;
        this.game.ui.toast(t('espera_found', found));
        ACH.onEspera(this.flags);
        this.game.em.removeNPC(npc);
        this.game.autosave();
      }
    }
  }

  // ---------- Finale ----------
  async runEnding() {
    const game = this.game;
    game.autosave(); // Stand vor der Entscheidung sichern

    await game.dlg.runScene([
      { who: 'narrator', text: { de: 'Die Leere zerfällt. Auf dem stillen Wasser stehen sie einander gegenüber: der Sterbliche, der Diener, der Befreite – und der müde Gott.', en: 'The Void collapses. On the still water they stand face to face: the mortal, the servant, the freed — and the weary god.' } },
      { who: 'sleep', text: { de: 'Nun, Vessel. Es gibt drei Türen. Und nur du hast die Hand, sie zu öffnen.', en: 'Now, Vessel. There are three doors. And only you have the hand to open them.' } },
    ]);

    const choice = await game.ui.showEndingChoice();
    ACH.onEnding(choice);

    const ending = ENDINGS[choice];
    await game.dlg.runScene(ending.lines);

    this.finished = true;
    this.flags['ending_' + choice] = 1;
    if (this.quest) this.done.add(this.quest.id);
    if (this.done.size >= 51) ACH.unlock('worship');
    this.game.player.gainXP(600);

    await game.ui.showCredits(tx(ending.title), choice === 'unite');
    await game.travelTo('sanctum');
    game.ui.toast(t('chronicle_end_toast'));
    game.autosave();
    this.updateTracker();
  }

  // ---------- pro Frame ----------
  update(dt) {
    const game = this.game;
    const step = this.step;
    const p = game.player.pos;

    // goto-Marker erreicht?
    if (step && step.type === 'goto' && !this._busy && game.currentZone === this.chapter.zone) {
      if (dist2(p.x, p.z, step.pos[0], step.pos[1]) < CONFIG.markerRange) {
        AUDIO.sfx('pickup');
        this.advance();
      }
    }

    // Boss-Arena erreicht?
    if (this._pendingBoss && !this._busy) {
      const b = this._pendingBoss;
      const inBossZone = game.currentZone === this.chapter.zone || game.currentZone === 'baths';
      if (inBossZone && dist2(p.x, p.z, b.pos[0], b.pos[1]) < 24) {
        this._clearStepEntities();
        const def = b.def;
        game.em.spawnBoss(def, b.pos);
        if (b.allySleep) this._spawnAlly();
        this._pendingBoss = null;
      }
    }

    // Verbündeter Sleep in Phase III
    if (this._ally) {
      this._allyTimer -= dt;
      const boss = game.em.enemies.find(e => e.isBoss && !e.dead);
      if (boss && this._allyTimer <= 0) {
        this._allyTimer = 4;
        game.em.spawnProjectile({
          from: [this._ally.pos.x, 2.2, this._ally.pos.z],
          target: [boss.pos.x, 2, boss.pos.z],
          speed: 18, dmg: 60, owner: 'player', color: 0xe8b842, r: 0.4,
        });
        AUDIO.sfx('ability');
      }
      if (!boss && !this.game.em.enemies.some(e => e.isBoss)) {
        // Kampf vorbei
      }
    }

    // Umherstreifende Gegner respawnen
    for (const pack of this._ambient) {
      pack.alive = pack.alive.filter(e => !e.dead && game.em.enemies.includes(e));
      if (pack.alive.length === 0) {
        pack.timer += dt;
        const far = dist2(p.x, p.z, pack.center[0], pack.center[1]) > 28;
        if (pack.timer > CONFIG.respawnPackSeconds && far && !this.finishedBossActive()) {
          pack.timer = 0;
          this._spawnPack(pack);
        }
      }
    }

    // Tracker regelmäßig aktualisieren
    this._trackTimer -= dt;
    if (this._trackTimer <= 0) { this._trackTimer = 0.5; this.updateTracker(); }
  }

  _spawnAlly() {
    this._ally = this.game.em.spawnNPC({
      id: 'ally-sleep', kind: 'sleepgod', name: 'Sleep', pos: [8, 2], scale: 1.6,
      labelColor: '#e8b842', questTag: 'quest',
    });
    this._allyTimer = 2;
  }

  // ---------- Anzeige ----------
  stepLabel() {
    const step = this.step;
    if (!step) return '';
    if (step.type === 'kill') return `${tx(step.label)} (${this.progress}/${step.count})`;
    if (step.type === 'collect') return `${tx(step.label)} (${this.progress}/${step.count})`;
    if (step.type === 'scene') return t('step_watch');
    if (step.type === 'ending') return t('step_decide');
    if (step.type === 'zone') return tx(step.label) || t('step_rift');
    return tx(step.label) || '';
  }

  updateTracker() {
    const ui = this.game.ui;
    // Hintergrund-Melodie an die aktuelle Quest/Album anpassen (idempotent)
    if (this.finished || !this.quest) {
      AUDIO.stopMelody();
    } else {
      console.log(`Updating tracker for quest "${this.quest.id}" in chapter "${this.chapter.id}"`);
      AUDIO.playQuestMelody(this.quest.id, this.chapter.id);
    }
    if (this.finished || !this.quest) {
      ui.tracker(t('chronicle_done'));
      return;
    }
    const chapter = this.chapter;
    const zoneOk = this.game.currentZone === chapter.zone ||
      (this.game.currentZone === 'baths' && this.quest.id === 'infinite-baths');
    let body;
    if (zoneOk) {
      body = this.stepLabel();
    } else {
      const zoneName = tx(ZONE_INFO[chapter.zone].name);
      body = this.game.currentZone === 'sanctum'
        ? t('track_take_portal', zoneName)
        : t('track_travel', zoneName);
    }
    ui.tracker(`<i>${tx(chapter.title)} — ${chapter.sub}</i><b>${this.quest.song}</b><span>${body}</span>`);
  }
}
