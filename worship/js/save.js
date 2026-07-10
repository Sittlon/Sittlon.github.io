// ============================================================
//  save.js – Speichersystem (localStorage)
//  Slot 0 = Autospeichern, Slots 1–3 = manuell
// ============================================================

const SAVE_PREFIX = 'stg_chronik_save_';
const GLOBAL_KEY = 'stg_chronik_global';
const SETTINGS_KEY = 'stg_chronik_settings';

export const SaveSys = {
  SLOTS: 4,
  AUTO: 0,

  save(slot, data) {
    try {
      data.savedAt = Date.now();
      localStorage.setItem(SAVE_PREFIX + slot, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('Speichern fehlgeschlagen:', e);
      return false;
    }
  },

  load(slot) {
    try {
      const raw = localStorage.getItem(SAVE_PREFIX + slot);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Laden fehlgeschlagen:', e);
      return null;
    }
  },

  del(slot) {
    localStorage.removeItem(SAVE_PREFIX + slot);
  },

  // Metadaten aller Slots für die Lade-Übersicht
  list() {
    const out = [];
    for (let i = 0; i < this.SLOTS; i++) {
      const d = this.load(i);
      out.push(d ? {
        slot: i,
        savedAt: d.savedAt,
        playtime: d.playtime || 0,
        level: d.player ? d.player.level : 1,
        chapterTitle: d.meta ? d.meta.chapterTitle : '–',
        questTitle: d.meta ? d.meta.questTitle : '–',
        zoneName: d.meta ? d.meta.zoneName : '–',
        finished: d.meta ? !!d.meta.finished : false,
      } : { slot: i, empty: true });
    }
    return out;
  },

  hasAny() {
    return this.list().some(s => !s.empty);
  },
};

// Globale Daten (Erfolge & gesehene Enden – unabhängig vom Spielstand)
export const GlobalStore = {
  _read() {
    try { return JSON.parse(localStorage.getItem(GLOBAL_KEY)) || {}; }
    catch (e) { return {}; }
  },
  _write(d) {
    try { localStorage.setItem(GLOBAL_KEY, JSON.stringify(d)); } catch (e) { /* voll */ }
  },
  getAchievements() {
    return this._read().achievements || [];
  },
  addAchievement(id) {
    const d = this._read();
    d.achievements = d.achievements || [];
    if (!d.achievements.includes(id)) {
      d.achievements.push(id);
      this._write(d);
      return true;
    }
    return false;
  },
  getEndings() {
    return this._read().endings || [];
  },
  addEnding(id) {
    const d = this._read();
    d.endings = d.endings || [];
    if (!d.endings.includes(id)) { d.endings.push(id); this._write(d); }
    return d.endings;
  },
};

// Einstellungen (Lautstärke usw.)
export const Settings = {
  data: {
    volume: 0.7,
    music: 0.8,
    sensitivity: 1.0,
    shadows: true,
    quality: 1.5,        // pixelRatio-Deckel
    lang: 'de',          // 'de' | 'en'
  },
  load() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) Object.assign(this.data, JSON.parse(raw));
    } catch (e) { /* Standardwerte */ }
    return this.data;
  },
  save() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.data)); } catch (e) { /* voll */ }
  },
};
