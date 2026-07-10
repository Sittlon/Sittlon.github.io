// ============================================================
//  main.js – Spielkern: Zustände, Zonen, Speichern, Game-Loop
//  SLEEP TOKEN – DIE CHRONIK DES SCHLAFENDEN GOTTES
//  (Inoffizielles Fan-Projekt – ohne Originalmusik & Songtexte)
// ============================================================

import * as THREE from 'three';
import { VERSION, CONFIG } from './config.js';
import { INPUT } from './input.js';
import { AUDIO } from './audio.js';
import { SaveSys, Settings } from './save.js';
import { UI } from './ui.js';
import { DialogueRunner } from './dialogue.js';
import { EntityManager } from './entities.js';
import { Player } from './player.js';
import { QuestSystem } from './quests.js';
import { initTouchControls } from './touch.js';
import { buildZone, ZONE_INFO } from './world.js';
import { INTRO_LINES, TOTAL_QUESTS } from './questdata.js';
import { i18n, t, tx } from './i18n.js';

class Game {
  constructor() {
    this.settings = Settings.load();
    i18n.set(this.settings.lang || 'de');

    // ---- Renderer ----
    const canvasHost = document.getElementById('app');
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.shadowMap.enabled = this.settings.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.settings.quality));
    canvasHost.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 600);
    this.camera.position.set(0, 20, 60);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ---- Systeme ----
    INPUT.init(this.renderer.domElement);
    AUDIO.volume = this.settings.volume;
    AUDIO.musicVolume = this.settings.music;

    this.ui = new UI();
    this.dlg = new DialogueRunner(this);
    this.em = new EntityManager(this);
    this.player = new Player(this);
    this.quests = new QuestSystem(this);
    this.ui.bind(this);

    this.state = 'MENU';          // MENU | PLAYING | DIALOG | PAUSED | DEAD
    this.currentZone = null;
    this.zone = null;
    this.zoneSpawn = [0, 40];
    this.playtime = 0;
    this._autosaveTimer = 0;
    this._menuAngle = 0;
    this._traveling = false;

    // Maus fangen / freigeben (Desktop). Auf Touch-Geräten tut INPUT.lock() nichts.
    this.renderer.domElement.addEventListener('click', () => {
      AUDIO.ensure();
      if (this.state === 'PLAYING') INPUT.lock();
    });
    // Nach Dialogen die Maus automatisch wieder einfangen, sobald man sich bewegt.
    const moveKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    window.addEventListener('keydown', (e) => {
      if (this.state === 'PLAYING' && !INPUT.touch && !INPUT.locked &&
          !this.dlg.active && !this.ui.panelOpen && moveKeys.includes(e.code)) {
        INPUT.lock();
      }
    });
    INPUT.onLockChange = (locked) => {
      // Verlust des Pointer-Locks (Esc / Fensterwechsel) pausiert; Dialoge sind ausgenommen.
      if (!locked && this.state === 'PLAYING' && !this.dlg.active && !this._traveling && !this.player.dead) {
        this.pause();
      }
    };

    // Touch-Bedienelemente + Referenzen für die Sichtbarkeit
    this._touchUI = document.getElementById('touch-ui');
    this._tbInteract = document.getElementById('tb-interact');
    initTouchControls(this);

    // Menü-Hintergrund laden
    this._loadZoneVisual('sanctum');
    this.player.group.visible = false;
    this.ui.showScreen('menu');
    document.getElementById('menu-version').textContent = t('version_quests', VERSION, TOTAL_QUESTS);
    // bei Sprachwechsel dynamische Menütexte neu setzen
    i18n.onChange(() => {
      document.getElementById('menu-version').textContent = t('version_quests', VERSION, TOTAL_QUESTS);
    });
    this.ui.fade(false, 1200); // Start-Schleier heben

    // ---- Loop ----
    this.clock = new THREE.Clock();
    this.elapsed = 0;
    this.renderer.setAnimationLoop(() => this.loop());
  }

  // ---------------------------------------------------------
  setState(s) {
    this.state = s;
    if (s === 'PLAYING') {
      this.ui.pauseMenu(false);
      INPUT.lock();
    }
  }

  applyGraphics() {
    this.renderer.shadowMap.enabled = this.settings.shadows;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.settings.quality));
    this.scene.traverse(o => { if (o.material) o.material.needsUpdate = true; });
  }

  setLanguage(lang) {
    this.settings.lang = lang;
    Settings.save();
    i18n.set(lang);
    AUDIO.sfx('click');
    // dynamische Anzeigen auffrischen
    if (this.state !== 'MENU') {
      this.ui.refreshChars(this.player);
      this.quests.updateTracker();
    }
  }

  // ---------- Zonen ----------
  _loadZoneVisual(zoneId) {
    if (this.zone) this.zone.dispose();
    this.zone = buildZone(zoneId, this.scene, this.settings);
    this.currentZone = zoneId;
    this.zoneSpawn = this.zone.playerSpawn;
    this.em.setWorld(this.zone.colliders, this.zone.bound);
  }

  async travelTo(zoneId, opts = {}) {
    if (this._traveling) return;
    this._traveling = true;
    AUDIO.sfx('portal');
    await this.ui.fade(true, 500);

    this.em.clearAll();
    this._loadZoneVisual(zoneId);

    const sp = opts.pos || this.zone.playerSpawn;
    this.player.pos.set(sp[0], 0, sp[1]);
    this.player.group.visible = true;
    this.player.facing = Math.atan2(-sp[0], -sp[1]); // zum Zentrum schauen
    this.player.group.rotation.y = this.player.facing;
    this.player.camYaw = this.player.facing;

    this.quests.enterZone(zoneId);
    AUDIO.playAmbient(ZONE_INFO[zoneId].ambient);

    await this.ui.fade(false, 500);
    const info = ZONE_INFO[zoneId];
    this.ui.zoneBanner(tx(info.name), tx(info.sub));
    this._traveling = false;
  }

  // ---------- Spielstart ----------
  async newGame() {
    AUDIO.ensure();
    this.ui.showScreen('game');
    this.ui.loading(false);

    // frische Systeme
    this.scene.remove(this.player.group);
    this.player = new Player(this);
    this.quests = new QuestSystem(this);
    this.playtime = 0;

    this.ui.refreshChars(this.player);
    this.setState('DIALOG');                  // Spiel-Loop ruht, keine Maus-Sperre

    await this.ui.fade(true, 50);             // Menüwechsel verdecken
    await this.ui.showIntroNote();            // Fan-Hinweis (liegt über dem Schleier)
    await this.ui.fade(false, 1);             // Schleier sofort heben …
    await this.dlg.runScene(INTRO_LINES, { opaque: true }); // … Sequenz auf eigenem schwarzem Grund
    await this.travelTo('threshold');
    const ch0 = this.quests.chapter;
    this.ui.chapterCard(tx(ch0.title), ch0.sub);
  }

  continueGame() {
    this.loadFromSlot(SaveSys.AUTO);
  }

  async loadFromSlot(slot) {
    const data = SaveSys.load(slot);
    if (!data) { this.ui.toast('Kein Spielstand in diesem Slot.'); return; }
    AUDIO.ensure();
    this.ui.closePanel();
    this.ui.showScreen('game');

    this.scene.remove(this.player.group);
    this.player = new Player(this);
    this.quests = new QuestSystem(this);
    this.player.restore(data.player);
    this.quests.restore(data.quests);
    this.playtime = data.playtime || 0;
    this.ui.refreshChars(this.player);
    this.ui.deathScreen(false);

    this.setState('PLAYING');
    await this.travelTo(data.scene.zone || 'sanctum', { pos: data.scene.pos });
    this.ui.toast('<b>Spielstand geladen.</b>');
  }

  _saveData() {
    const chapter = this.quests.chapter;
    const quest = this.quests.quest;
    return {
      version: VERSION,
      playtime: Math.round(this.playtime),
      meta: {
        chapterTitle: this.quests.finished ? t('free_roam_title') : (chapter ? `${tx(chapter.title)} — ${chapter.sub}` : '—'),
        questTitle: this.quests.finished ? t('free_roam_body') : (quest ? quest.song : '—'),
        zoneName: ZONE_INFO[this.currentZone] ? tx(ZONE_INFO[this.currentZone].name) : '—',
        finished: this.quests.finished,
      },
      scene: {
        zone: this.currentZone === 'baths' && !this.quests.finished ? 'arcadia' : this.currentZone,
        pos: this.currentZone === 'baths' && !this.quests.finished ? null : [this.player.pos.x, this.player.pos.z],
        },
      player: this.player.serialize(),
      quests: this.quests.serialize(),
    };
  }

  saveToSlot(slot) {
    if (this.state === 'MENU') return;
    const ok = SaveSys.save(slot, this._saveData());
    if (ok && slot !== SaveSys.AUTO) {
      this.ui.toast(`<b>Gespeichert</b> (Slot ${slot}).`);
      AUDIO.sfx('pickup');
    }
    this.ui.refreshContinue();
  }

  autosave() {
    if (this.state === 'MENU' || !this.currentZone || this.currentZone === 'sanctum' && this.state === 'MENU') return;
    this.saveToSlot(SaveSys.AUTO);
  }

  // ---------- Pause / Tod / Menü ----------
  pause() {
    if (this.state !== 'PLAYING') return;
    this.state = 'PAUSED';
    this.ui.pauseMenu(true);
    INPUT.unlock();
  }
  resume() {
    this.ui.closePanel();
    this.ui.pauseMenu(false);
    this.setState('PLAYING');
  }

  onPlayerDeath() {
    this.state = 'DEAD';
    INPUT.unlock();
    setTimeout(() => this.ui.deathScreen(true), 900);
  }

  respawnPlayer() {
    this.ui.deathScreen(false);
    this.player.respawn();
    this.quests.resetCurrentStep();
    this.setState('PLAYING');
  }

  async toMainMenu() {
    this.autosave();
    this.ui.closePanel();
    this.ui.pauseMenu(false);
    await this.ui.fade(true, 400);
    this.em.clearAll();
    this._loadZoneVisual('sanctum');
    this.player.group.visible = false;
    this.state = 'MENU';
    INPUT.unlock();
    this.ui.showScreen('menu');
    this.ui.refreshContinue();
    AUDIO.stopMelody();
    AUDIO.playAmbient('menu');
    await this.ui.fade(false, 400);
  }

  // ---------- Aufsammeln ----------
  onPickup(p) {
    if (p.type === 'xp') { this.player.gainXP(p.value); AUDIO.sfx('pickup'); }
    else if (p.type === 'heal') {
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + p.value);
      AUDIO.sfx('heal');
    }
    else if (p.type === 'fragment') this.quests.onFragment(p);
    else if (p.type === 'quest') this.quests.onCollectItem(p);
  }

  // ---------- Loop ----------
  loop() {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.elapsed += dt;

    // Touch-Steuerung nur während des aktiven Spiels einblenden
    if (this._touchUI) this._touchUI.classList.toggle('active', INPUT.touch && this.state === 'PLAYING');

    if (this.state === 'MENU') {
      // langsame Kamerafahrt ums Heiligtum
      this._menuAngle += dt * 0.06;
      const r = 52;
      this.camera.position.set(Math.sin(this._menuAngle) * r, 16, Math.cos(this._menuAngle) * r);
      this.camera.lookAt(0, 6, -10);
      this.zone && this.zone.update(dt, this.elapsed);

    } else if (this.state === 'PLAYING') {
      this.playtime += dt;
      this._autosaveTimer += dt;
      if (this._autosaveTimer > CONFIG.autosaveInterval) {
        this._autosaveTimer = 0;
        this.autosave();
      }

      this.player.update(dt);
      this.em.update(dt);
      this.quests.update(dt);
      this.zone && this.zone.update(dt, this.elapsed);

      // Interaktion
      const it = this.em.nearestInteractable(this.player.pos);
      if (it) {
        let txt;
        if (it.type === 'locked') txt = t('prompt_sealed', tx(it.obj.label));
        else if (it.type === 'portal') txt = t('interact_e', t('prompt_enter', tx(it.obj.label)));
        else txt = t('interact_e', t('prompt_talk', tx(it.obj.name)));
        this.ui.prompt(txt);
      } else {
        this.ui.prompt(null);
      }
      // Touch-Interaktionsbutton nur bei erreichbarem Ziel zeigen
      if (this._tbInteract) this._tbInteract.classList.toggle('hidden', !it);
      if (INPUT.wasPressed('KeyE') && it && !this.dlg.active) {
        if (it.type === 'npc') this.quests.onTalk(it.obj);
        else if (it.type === 'portal') this.travelTo(it.obj.zone);
      }

      // Pause (falls die Maus nicht gefangen war, löst Esc kein pointerlockchange aus)
      if (INPUT.wasPressed('Escape') && !INPUT.locked && !this.dlg.active) {
        if (this.ui.panelOpen) this.ui.closePanel();
        else this.pause();
      }

      // Questlog
      if (INPUT.wasPressed('KeyJ') || INPUT.wasPressed('Tab')) {
        if (this.ui.panelOpen) this.ui.closePanel();
        else { this.ui.openPanel('quests'); }
      }

      this.ui.hud(this.player, this.quests);

    } else if (this.state === 'DIALOG') {
      this.playtime += dt;
      // Welt atmet weiter, aber niemand kämpft
      this.zone && this.zone.update(dt, this.elapsed);
      for (const n of this.em.npcs) n.update(dt, this);
      this.player.rig.update(dt, { speed: 0, talk: false });
      this.player._updateCamera(dt);

    } else if (this.state === 'PAUSED') {
      if (INPUT.wasPressed('Escape')) {
        if (this.ui.panelOpen) this.ui.closePanel();
        else this.resume();
      }
    } else if (this.state === 'DEAD') {
      this.zone && this.zone.update(dt, this.elapsed);
      this.em.update(dt);
      this.player.rig.update(dt, { dead: 1 });
    }

    INPUT.endFrame();
    this.renderer.render(this.scene, this.camera);
  }
}

// ---------- Start ----------
window.addEventListener('DOMContentLoaded', () => {
  try {
    window.game = new Game();
    window.AUDIO = AUDIO;   // zum Debuggen/Testen der Musik in der Browser-Konsole
  } catch (err) {
    console.error(err);
    const el = document.getElementById('fatal');
    if (el) {
      el.classList.remove('hidden');
      el.querySelector('p').textContent = 'Fehler beim Start: ' + err.message;
    }
  }
});
