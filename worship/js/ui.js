// ============================================================
//  ui.js – HUD, Menüs, Panels, Toasts, Enden & Abspann
// ============================================================

import { CHAR_INFO, PLAYABLE_ORDER, xpForLevel, VERSION } from './config.js';
import { ACH_DEFS, ACH } from './achievements.js';
import { SaveSys, Settings } from './save.js';
import { CHAPTERS } from './questdata.js';
import { ZONE_INFO } from './world.js';
import { AUDIO } from './audio.js';
import { formatTime, formatDate, escapeHtml } from './utils.js';
import { i18n, t, tx } from './i18n.js';

const $ = (id) => document.getElementById(id);

export class UI {
  constructor() {
    this.game = null;
    this._toastQueue = [];
    this._bossVisible = false;
  }

  bind(game) {
    this.game = game;
    ACH.init((def) => this.achievementToast(def));

    // ---- Hauptmenü ----
    $('btn-new').onclick = () => { AUDIO.sfx('click'); game.newGame(); };
    $('btn-continue').onclick = () => { AUDIO.sfx('click'); game.continueGame(); };
    $('btn-load').onclick = () => { AUDIO.sfx('click'); this.openPanel('saves', { mode: 'load' }); };
    $('btn-achievements').onclick = () => { AUDIO.sfx('click'); this.openPanel('achievements'); };
    $('btn-settings').onclick = () => { AUDIO.sfx('click'); this.openPanel('settings'); };
    $('btn-help').onclick = () => { AUDIO.sfx('click'); this.openPanel('help'); };

    // Sprachumschalter im Menü
    $('lang-de').onclick = () => { game.setLanguage('de'); this.refreshLangButtons(); };
    $('lang-en').onclick = () => { game.setLanguage('en'); this.refreshLangButtons(); };
    this.refreshLangButtons();

    // ---- Pausenmenü ----
    $('btn-resume').onclick = () => { AUDIO.sfx('click'); game.resume(); };
    $('btn-p-save').onclick = () => { AUDIO.sfx('click'); this.openPanel('saves', { mode: 'save' }); };
    $('btn-p-load').onclick = () => { AUDIO.sfx('click'); this.openPanel('saves', { mode: 'load' }); };
    $('btn-p-quests').onclick = () => { AUDIO.sfx('click'); this.openPanel('quests'); };
    $('btn-p-achievements').onclick = () => { AUDIO.sfx('click'); this.openPanel('achievements'); };
    $('btn-p-settings').onclick = () => { AUDIO.sfx('click'); this.openPanel('settings'); };
    $('btn-p-help').onclick = () => { AUDIO.sfx('click'); this.openPanel('help'); };
    $('btn-p-menu').onclick = () => { AUDIO.sfx('click'); game.toMainMenu(); };

    $('panel-close').onclick = () => { AUDIO.sfx('click'); this.closePanel(); };
    $('btn-respawn').onclick = () => { AUDIO.sfx('click'); game.respawnPlayer(); };

    this.refreshContinue();
  }

  refreshContinue() {
    const auto = SaveSys.load(SaveSys.AUTO);
    $('btn-continue').disabled = !auto;
    $('btn-load').disabled = !SaveSys.hasAny();
  }

  refreshLangButtons() {
    $('lang-de').classList.toggle('active', i18n.lang === 'de');
    $('lang-en').classList.toggle('active', i18n.lang === 'en');
  }

  // ---------- Bildschirme ----------
  showScreen(name) {
    for (const s of ['screen-menu', 'screen-game', 'screen-loading']) {
      $(s).classList.toggle('hidden', s !== 'screen-' + name);
    }
  }
  loading(show, text = 'Die Traumlande erwachen …') {
    $('screen-loading').classList.toggle('hidden', !show);
    $('loading-text').textContent = text;
  }
  fade(toBlack, ms = 600) {
    const f = $('fader');
    f.style.transitionDuration = ms + 'ms';
    f.classList.toggle('black', toBlack);
    return new Promise(r => setTimeout(r, ms));
  }

  pauseMenu(show) {
    $('pause-menu').classList.toggle('hidden', !show);
  }
  deathScreen(show) {
    $('death-screen').classList.toggle('hidden', !show);
  }

  // ---------- HUD ----------
  hud(player, quests) {
    const hpFrac = Math.max(0, player.hp / player.maxHp);
    $('hp-fill').style.width = (hpFrac * 100) + '%';
    $('hp-text').textContent = `${Math.max(0, Math.ceil(player.hp))} / ${player.maxHp}`;
    $('en-fill').style.width = (player.energy / 100 * 100) + '%';
    const need = xpForLevel(player.level);
    $('xp-fill').style.width = Math.min(100, player.xp / need * 100) + '%';
    $('level-num').textContent = player.level;
    $('frag-count').textContent = quests.fragments;

    // Fähigkeits-Anzeige
    const info = player.charInfo;
    $('ability-name').textContent = tx(info.abilityName);
    const cdFrac = info.abilityCooldown ? player.abilityCd / info.abilityCooldown : 0;
    $('ability-cd').style.height = (cdFrac * 100) + '%';
    const abilityReady = player.abilityCd <= 0 && player.energy >= info.abilityCost;
    $('ability-key').classList.toggle('ready', abilityReady);
    const tbAbility = $('tb-ability');
    if (tbAbility) tbAbility.classList.toggle('ready', abilityReady);
  }

  refreshChars(player) {
    const wrap = $('char-chips');
    wrap.innerHTML = '';
    PLAYABLE_ORDER.forEach((kind, i) => {
      const chip = document.createElement('div');
      const unlocked = player.unlocked.has(kind);
      chip.className = 'chip' + (player.active === kind ? ' active' : '') + (unlocked ? '' : ' locked');
      chip.innerHTML = `<span class="chip-key">${i + 1}</span>${CHAR_INFO[kind].name}`;
      if (unlocked) chip.onclick = () => player.switchTo(kind);
      wrap.appendChild(chip);
    });
  }

  tracker(html) {
    $('tracker').innerHTML = html;
  }
  prompt(text) {
    const el = $('prompt');
    if (text) { el.textContent = text; el.classList.remove('hidden'); }
    else el.classList.add('hidden');
  }

  zoneBanner(name, sub) {
    const b = $('zone-banner');
    b.innerHTML = `<div class="zb-sub">${escapeHtml(sub || '')}</div><div class="zb-name">${escapeHtml(name)}</div>`;
    b.classList.remove('show');
    void b.offsetWidth; // Animation neu starten
    b.classList.add('show');
  }

  chapterCard(title, sub) {
    const c = $('chapter-card');
    c.innerHTML = `<div class="cc-title">${escapeHtml(title)}</div><div class="cc-sub">${escapeHtml(sub)}</div>`;
    c.classList.remove('show');
    void c.offsetWidth;
    c.classList.add('show');
  }

  bossBar(show, name = '', frac = 1) {
    const bar = $('boss-bar');
    bar.classList.toggle('hidden', !show);
    if (show) {
      $('boss-name').textContent = name;
      $('boss-fill').style.width = Math.max(0, frac * 100) + '%';
    }
  }

  damageFlash() {
    const v = $('vignette');
    v.classList.remove('flash');
    void v.offsetWidth;
    v.classList.add('flash');
  }

  // ---------- Toasts ----------
  toast(html, ms = 4200) {
    const box = document.createElement('div');
    box.className = 'toast';
    box.innerHTML = html;
    $('toasts').appendChild(box);
    requestAnimationFrame(() => box.classList.add('in'));
    setTimeout(() => {
      box.classList.remove('in');
      setTimeout(() => box.remove(), 500);
    }, ms);
  }

  achievementToast(def) {
    AUDIO.sfx('achievement');
    const box = document.createElement('div');
    box.className = 'toast ach-toast';
    box.innerHTML = `<div class="ach-icon">${def.icon}</div><div><div class="ach-head">${t('ach_unlocked')}</div><b>${escapeHtml(tx(def.name))}</b><br><span class="xs">${escapeHtml(tx(def.desc))}</span></div>`;
    $('toasts').appendChild(box);
    requestAnimationFrame(() => box.classList.add('in'));
    setTimeout(() => {
      box.classList.remove('in');
      setTimeout(() => box.remove(), 500);
    }, 6000);
  }

  // ---------- Panels ----------
  openPanel(type, opts = {}) {
    const panel = $('panel');
    panel.classList.remove('hidden');
    const content = $('panel-content');
    content.innerHTML = '';
    if (type === 'saves') {
      $('panel-title').textContent = opts.mode === 'save' ? t('panel_save') : t('panel_load');
      this._renderSaves(content, opts.mode);
    } else if (type === 'achievements') {
      $('panel-title').textContent = t('panel_achievements', ACH.count(), ACH.total());
      this._renderAchievements(content);
    } else if (type === 'quests') {
      $('panel-title').textContent = t('panel_quests');
      this._renderQuests(content);
    } else if (type === 'settings') {
      $('panel-title').textContent = t('panel_settings');
      this._renderSettings(content);
    } else if (type === 'help') {
      $('panel-title').textContent = t('panel_help');
      this._renderHelp(content);
    }
  }
  closePanel() {
    $('panel').classList.add('hidden');
  }
  get panelOpen() { return !$('panel').classList.contains('hidden'); }

  _renderSaves(root, mode) {
    const list = SaveSys.list();
    for (const meta of list) {
      const row = document.createElement('div');
      row.className = 'save-slot';
      const slotName = meta.slot === 0 ? t('slot_auto') : t('slot_n', meta.slot);
      if (meta.empty) {
        row.innerHTML = `<div class="ss-head">${slotName}</div><div class="ss-body xs">${t('slot_empty')}</div>`;
        if (mode === 'save' && meta.slot !== 0) {
          row.classList.add('clickable');
          row.onclick = () => { this.game.saveToSlot(meta.slot); this.openPanel('saves', { mode }); };
        }
      } else {
        row.innerHTML = `
          <div class="ss-head">${slotName} ${meta.finished ? '· <span class="gold">' + t('completed') + '</span>' : ''}</div>
          <div class="ss-body">
            <b>${escapeHtml(meta.chapterTitle)}</b> – ${escapeHtml(meta.questTitle)}<br>
            <span class="xs">${t('save_level', meta.level)} · ${escapeHtml(meta.zoneName)} · ${t('save_playtime')} ${formatTime(meta.playtime)}<br>${formatDate(meta.savedAt)}</span>
          </div>`;
        row.classList.add('clickable');
        if (mode === 'save') {
          if (meta.slot === 0) { row.classList.remove('clickable'); }
          else row.onclick = () => {
            if (confirm(t('confirm_overwrite', slotName))) { this.game.saveToSlot(meta.slot); this.openPanel('saves', { mode }); }
          };
        } else {
          row.onclick = () => this.game.loadFromSlot(meta.slot);
        }
        const del = document.createElement('button');
        del.className = 'ss-del';
        del.textContent = '✕';
        del.title = t('save_delete_title');
        del.onclick = (e) => {
          e.stopPropagation();
          if (confirm(t('confirm_delete', slotName))) { SaveSys.del(meta.slot); this.refreshContinue(); this.openPanel('saves', { mode }); }
        };
        row.appendChild(del);
      }
      root.appendChild(row);
    }
  }

  _renderAchievements(root) {
    const grid = document.createElement('div');
    grid.className = 'ach-grid';
    for (const def of ACH_DEFS) {
      const has = ACH.has(def.id);
      const card = document.createElement('div');
      card.className = 'ach-card' + (has ? ' unlocked' : '');
      const desc = (!has && def.secret) ? t('secret') : tx(def.desc);
      card.innerHTML = `<div class="ach-icon">${has ? def.icon : '🔒'}</div><div><b>${escapeHtml(tx(def.name))}</b><br><span class="xs">${escapeHtml(desc)}</span></div>`;
      grid.appendChild(card);
    }
    root.appendChild(grid);
  }

  _renderQuests(root) {
    const q = this.game.quests;
    CHAPTERS.forEach((ch, ci) => {
      const det = document.createElement('details');
      det.open = ci === q.chapterIdx;
      const doneCount = ch.quests.filter(x => q.done.has(x.id)).length;
      const locked = ci > q.chapterIdx;
      det.innerHTML = `<summary class="${locked ? 'locked' : ''}">${escapeHtml(tx(ch.title))} — ${escapeHtml(ch.sub)} <span class="xs">(${doneCount}/${ch.quests.length})</span></summary>`;
      const list = document.createElement('div');
      list.className = 'quest-list';
      ch.quests.forEach((quest, qi) => {
        const isDone = q.done.has(quest.id);
        const isCurrent = ci === q.chapterIdx && qi === q.questIdx && !q.finished;
        const row = document.createElement('div');
        row.className = 'quest-row' + (isDone ? ' done' : '') + (isCurrent ? ' current' : '');
        const mark = isDone ? '✓' : (isCurrent ? '▶' : '·');
        const showDesc = isDone || isCurrent;
        row.innerHTML = `<span class="q-mark">${mark}</span><div><b class="gold">${escapeHtml(quest.song)}</b>${showDesc ? `<br><span class="xs">${escapeHtml(tx(quest.desc))}</span>` : ''}</div>`;
        list.appendChild(row);
      });
      det.appendChild(list);
      root.appendChild(det);
    });
  }

  _renderSettings(root) {
    const s = Settings.data;
    root.innerHTML = `
      <div class="set-row"><label>${t('set_language')}</label>
        <select id="set-lang">
          <option value="de" ${i18n.lang === 'de' ? 'selected' : ''}>Deutsch</option>
          <option value="en" ${i18n.lang === 'en' ? 'selected' : ''}>English</option>
        </select>
      </div>
      <div class="set-row"><label>${t('set_volume')}</label><input id="set-vol" type="range" min="0" max="1" step="0.05" value="${s.volume}"></div>
      <div class="set-row"><label>${t('set_music')}</label><input id="set-music" type="range" min="0" max="1" step="0.05" value="${s.music}"></div>
      <div class="set-row"><label>${t('set_sens')}</label><input id="set-sens" type="range" min="0.3" max="2.5" step="0.1" value="${s.sensitivity}"></div>
      <div class="set-row"><label>${t('set_shadows')}</label><input id="set-shadows" type="checkbox" ${s.shadows ? 'checked' : ''}></div>
      <div class="set-row"><label>${t('set_quality')}</label>
        <select id="set-quality">
          <option value="1" ${s.quality === 1 ? 'selected' : ''}>${t('q_low')}</option>
          <option value="1.5" ${s.quality === 1.5 ? 'selected' : ''}>${t('q_mid')}</option>
          <option value="2" ${s.quality === 2 ? 'selected' : ''}>${t('q_high')}</option>
        </select>
      </div>
      <p class="xs dim">${t('set_note')}</p>`;
    $('set-lang').onchange = (e) => { this.game.setLanguage(e.target.value); this.openPanel('settings'); };
    $('set-vol').oninput = (e) => { s.volume = parseFloat(e.target.value); AUDIO.setVolume(s.volume); Settings.save(); };
    $('set-music').oninput = (e) => { s.music = parseFloat(e.target.value); AUDIO.setMusicVolume(s.music); Settings.save(); };
    $('set-sens').oninput = (e) => { s.sensitivity = parseFloat(e.target.value); Settings.save(); };
    $('set-shadows').onchange = (e) => { s.shadows = e.target.checked; Settings.save(); this.game.applyGraphics(); };
    $('set-quality').onchange = (e) => { s.quality = parseFloat(e.target.value); Settings.save(); this.game.applyGraphics(); };
  }

  _renderHelp(root) {
    root.innerHTML = `
      <table class="help-table">
        <tr><td><kbd>W A S D</kbd></td><td>${t('help_move')}</td></tr>
        <tr><td><kbd>${i18n.lang === 'en' ? 'Mouse' : 'Maus'}</kbd></td><td>${t('help_cam')}</td></tr>
        <tr><td><kbd>Shift</kbd></td><td>${t('help_sprint')}</td></tr>
        <tr><td><kbd>${i18n.lang === 'en' ? 'Space' : 'Leertaste'}</kbd></td><td>${t('help_dodge')}</td></tr>
        <tr><td><kbd>${i18n.lang === 'en' ? 'Left click' : 'Linksklick'}</kbd></td><td>${t('help_attack')}</td></tr>
        <tr><td><kbd>${i18n.lang === 'en' ? 'Right click' : 'Rechtsklick'} / Q</kbd></td><td>${t('help_ability')}</td></tr>
        <tr><td><kbd>E</kbd></td><td>${t('help_interact')}</td></tr>
        <tr><td><kbd>1 – 4</kbd></td><td>${t('help_switch')}</td></tr>
        <tr><td><kbd>J</kbd></td><td>${t('help_quests')}</td></tr>
        <tr><td><kbd>Esc</kbd></td><td>${t('help_pause')}</td></tr>
        <tr><td><kbd>${i18n.lang === 'en' ? 'Mouse wheel' : 'Mausrad'}</kbd></td><td>${t('help_zoom')}</td></tr>
      </table>
      <p class="xs">${t('help_note1')}</p>
      <p class="xs dim">${t('help_note2')}</p>
      <p class="xs dim">Version ${VERSION}</p>`;
  }

  // ---------- Fan-Hinweis vor dem Spielstart ----------
  showIntroNote() {
    return new Promise((resolve) => {
      const el = $('intro-note');
      i18n.apply();                 // sicherstellen, dass der Text übersetzt ist
      el.classList.remove('hidden');
      const finish = () => {
        AUDIO.sfx('click');
        el.classList.add('hidden');
        resolve();
      };
      $('btn-intro-note').onclick = finish;
    });
  }

  // ---------- Finale ----------
  showEndingChoice() {
    return new Promise((resolve) => {
      const screen = $('ending-choice');
      screen.classList.remove('hidden');
      i18n.apply();
      const opts = [
        { id: 'destroy', title: t('end_destroy_t'), sub: t('end_destroy_s') },
        { id: 'seal', title: t('end_seal_t'), sub: t('end_seal_s') },
        { id: 'unite', title: t('end_unite_t'), sub: t('end_unite_s') },
      ];
      const wrap = $('ending-options');
      wrap.innerHTML = '';
      opts.forEach((o) => {
        const card = document.createElement('button');
        card.className = 'ending-card ' + o.id;
        card.innerHTML = `<b>${o.title}</b><span>${o.sub}</span>`;
        card.onclick = () => {
          AUDIO.sfx('choice');
          screen.classList.add('hidden');
          resolve(o.id);
        };
        wrap.appendChild(card);
      });
    });
  }

  showCredits(endingTitle, isTrueEnding) {
    return new Promise((resolve) => {
      const screen = $('credits');
      screen.classList.remove('hidden');
      $('credits-title').textContent = endingTitle;
      $('credits-true').classList.toggle('hidden', !isTrueEnding);
      $('btn-credits-close').onclick = () => {
        AUDIO.sfx('click');
        screen.classList.add('hidden');
        resolve();
      };
    });
  }
}
