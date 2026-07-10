// ============================================================
//  config.js – globale Spielkonstanten & Sprecher-Definitionen
// ============================================================

export const VERSION = '1.0.0';

export const CONFIG = {
  // Bewegung
  moveSpeed: 6.2,
  sprintMult: 1.55,
  dodgeSpeed: 16,
  dodgeTime: 0.32,
  dodgeCooldown: 0.9,
  dodgeEnergy: 12,

  // Kamera
  camDistance: 7.5,
  camMinDist: 3.5,
  camMaxDist: 13,
  camHeight: 2.1,
  camSensitivity: 0.0026,

  // Kampf
  meleeRange: 2.9,
  meleeArc: Math.PI * 0.42,        // halber Winkel
  energyMax: 100,
  energyRegen: 14,                  // pro Sekunde (außerhalb des Kampfes)
  energyRegenCombat: 7,
  invulnAfterHit: 0.45,

  // Fortschritt
  xpKillBase: 12,
  xpKillPerLevel: 6,
  hpPerLevel: 12,
  dmgGrowth: 1.08,                  // Schadens-Multiplikator pro Stufe
  baseHp: 100,
  baseDmg: 11,

  // Welt
  zoneRadius: 80,
  interactRange: 3.2,
  markerRange: 2.8,
  fragmentXp: 40,
  respawnPackSeconds: 35,

  autosaveInterval: 90,             // Sekunden
};

export function xpForLevel(level) {
  return Math.round(90 * Math.pow(level, 1.35));
}

// Sprecher für Dialoge / Szenen (Namen zweisprachig)
export const SPEAKERS = {
  narrator: { name: { de: '', en: '' }, color: '#b9b4c8' },
  vessel:   { name: { de: 'Vessel', en: 'Vessel' }, color: '#cfd2ff' },
  sleep:    { name: { de: 'Sleep', en: 'Sleep' }, color: '#e8b842' },
  two:      { name: { de: 'II', en: 'II' }, color: '#9fe8d0' },
  three:    { name: { de: 'III', en: 'III' }, color: '#9fb6e8' },
  four:     { name: { de: 'IV', en: 'IV' }, color: '#e89f9f' },
  woman:    { name: { de: 'Die Geliebte', en: 'The Beloved' }, color: '#ffd9ec' },
  chronist: { name: { de: 'Der Chronist', en: 'The Chronicler' }, color: '#cfc9a2' },
  espera:   { name: { de: 'Espera', en: 'Espera' }, color: '#fff3c4' },
  echo:     { name: { de: 'Das Echo', en: 'The Echo' }, color: '#9a86c9' },
  mask:     { name: { de: 'Der Maskenmacher', en: 'The Maskmaker' }, color: '#e0c060' },
  past:     { name: { de: 'Vessel (Vergangenheit)', en: 'Vessel (Past)' }, color: '#e8e8e8' },
  voice:    { name: { de: 'Eine Stimme', en: 'A Voice' }, color: '#8fd0c0' },
  mirror:   { name: { de: 'Das Spiegelbild', en: 'The Reflection' }, color: '#ffffff' },
};

// Spielbare Charaktere (Texte zweisprachig)
export const CHAR_INFO = {
  vessel: {
    name: 'Vessel',
    weapon: { de: 'Die Stimme', en: 'The Voice' },
    abilityName: { de: 'Klagelied', en: 'Lament' },
    abilityDesc: { de: 'Schleudert eine Welle aus purer Emotion nach vorn.', en: 'Hurls a wave of pure emotion forward.' },
    desc: { de: 'Das Gefäß. Ausgeglichen in Angriff und Tempo.', en: 'The Vessel. Balanced in attack and speed.' },
    dmgMult: 1.0, atkTime: 0.55, abilityCost: 25, abilityCooldown: 3.0,
  },
  two: {
    name: 'II',
    weapon: { de: 'Kriegstrommeln', en: 'War Drums' },
    abilityName: { de: 'Rhythmus der Erde', en: 'Rhythm of the Earth' },
    abilityDesc: { de: 'Eine Schockwelle wirft alle Feinde im Umkreis zurück.', en: 'A shockwave knocks back all nearby enemies.' },
    desc: { de: 'Der Herzschlag. Langsam, aber verheerend.', en: 'The heartbeat. Slow, but devastating.' },
    dmgMult: 1.55, atkTime: 0.85, abilityCost: 35, abilityCooldown: 5.0,
  },
  three: {
    name: 'III',
    weapon: { de: 'Bass-Stab', en: 'Bass Stave' },
    abilityName: { de: 'Gravitas', en: 'Gravitas' },
    abilityDesc: { de: 'Zieht Feinde heran und verlangsamt sie.', en: 'Pulls enemies in and slows them.' },
    desc: { de: 'Das Fundament. Zäh und unbeirrbar.', en: 'The foundation. Tough and unshakable.' },
    dmgMult: 1.18, atkTime: 0.68, abilityCost: 30, abilityCooldown: 5.5,
  },
  four: {
    name: 'IV',
    weapon: { de: 'Saitenklinge', en: 'String Blade' },
    abilityName: { de: 'Riff', en: 'Riff' },
    abilityDesc: { de: 'Feuert drei schneidende Klangprojektile.', en: 'Fires three slicing sound projectiles.' },
    desc: { de: 'Der Sturm. Schnell und gnadenlos.', en: 'The storm. Fast and merciless.' },
    dmgMult: 0.72, atkTime: 0.34, abilityCost: 20, abilityCooldown: 3.5,
  },
};

export const PLAYABLE_ORDER = ['vessel', 'two', 'three', 'four'];
