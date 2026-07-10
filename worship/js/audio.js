// ============================================================
//  audio.js – prozeduraler Soundtrack & Effekte (WebAudio)
//  Bewusst KEINE echte Musik der Band – alles wird synthetisiert.
// ============================================================

const AMBIENT_THEMES = {
  // [Grundton Hz, Skala (Halbtonschritte für Pad-Wechsel), Filter Hz, Tempo, Helligkeit]
  menu:      { root: 55.0,  notes: [0, 3, 7, 10], filter: 520,  pad: 14, dark: 0.7 },
  sanctum:   { root: 48.99, notes: [0, 5, 7, 12], filter: 600,  pad: 12, dark: 0.6 },
  threshold: { root: 41.2,  notes: [0, 1, 7, 8],  filter: 420,  pad: 16, dark: 0.9 },
  memorycity:{ root: 55.0,  notes: [0, 4, 7, 9],  filter: 800,  pad: 10, dark: 0.4 },
  nightrealm:{ root: 43.65, notes: [0, 3, 7, 10], filter: 560,  pad: 13, dark: 0.7 },
  tomb:      { root: 36.71, notes: [0, 2, 3, 7],  filter: 380,  pad: 18, dark: 0.95 },
  eden:      { root: 65.4,  notes: [0, 4, 7, 11], filter: 900,  pad: 9,  dark: 0.3 },
  arcadia:   { root: 61.74, notes: [0, 5, 9, 12], filter: 1000, pad: 8,  dark: 0.25 },
  baths:     { root: 32.7,  notes: [0, 7, 12, 19],filter: 300,  pad: 22, dark: 1.0 },
  boss:      { root: 38.89, notes: [0, 1, 6, 7],  filter: 700,  pad: 5,  dark: 1.0 },
};

// ============================================================
//  MELODIE-MOTIVE  ← HIER kannst du deine eigenen Melodien eintragen
// ------------------------------------------------------------
//  WICHTIG: Dies sind EIGENE, stimmungspassende Motive – KEINE
//  Transkriptionen der echten (urheberrechtlich geschützten) Songs.
//  Du kannst sie frei verändern oder durch deine eigenen ersetzen.
//
//  Format pro Motiv:
//    root  : Grundfrequenz in Hz (z. B. 220 = A3). Bestimmt die Tonhöhe.
//    tempo : Schläge pro Minute.
//    wave  : 'triangle' | 'sine' | 'square' | 'sawtooth' (Klangfarbe)
//    gain  : Lautstärke der Melodie (0–0.1 empfohlen, subtil!)
//    seq   : Liste von [halbton, schläge] – Halbton ist der Abstand zum
//            Grundton (0 = root, 7 = Quinte, 12 = Oktave …).
//            Schreibe  [null, n]  für eine Pause über n Schläge.
//
//  Schlüssel sind die Album-/Kapitel-IDs (one, two, sundowning, tomb,
//  eden, arcadia) bzw. Quest-IDs für Einzelstücke (siehe QUEST_MELODY).
// ============================================================
const ALBUM_MELODY = {
  // PROLOG — ONE  (geheimnisvoll, fragend, aufsteigend; Moll)
  one: { root: 196, tempo: 76, wave: 'triangle', gain: 0.05,
    seq: [[0,2],[3,1],[7,1],[10,2],[7,1],[8,1],[7,3],[null,1],[3,2],[5,1],[3,1],[2,4],[null,2]] },
  // KAPITEL I — TWO  (warme Wehmut, Abendrot; dorisch)
  two: { root: 220, tempo: 84, wave: 'triangle', gain: 0.05,
    seq: [[0,1],[3,1],[5,2],[7,1],[5,1],[3,2],[5,1],[7,1],[10,2],[7,1],[5,1],[3,3],[0,1],[null,2]] },
  // KAPITEL II — SUNDOWNING  (fallend, melancholisch; Moll absteigend)
  sundowning: { root: 174, tempo: 72, wave: 'triangle', gain: 0.048,
    seq: [[12,2],[10,1],[8,1],[7,2],[5,1],[3,1],[2,2],[0,2],[3,1],[2,1],[0,4],[null,2]] },
  // KAPITEL III — TPWBYT  (versunken, weit, kühl; große Intervalle)
  tomb: { root: 164, tempo: 60, wave: 'sine', gain: 0.052,
    seq: [[0,3],[7,2],[10,3],[7,2],[3,3],[5,2],[3,4],[null,3],[12,2],[10,4],[null,2]] },
  // KAPITEL IV — TAKE ME BACK TO EDEN  (hoffnungsvoll, lichter; Dur)
  eden: { root: 233, tempo: 90, wave: 'triangle', gain: 0.05,
    seq: [[0,1],[4,1],[7,2],[11,1],[12,1],[11,2],[7,1],[9,1],[7,2],[4,1],[2,1],[0,3],[null,2]] },
  // KAPITEL V — EVEN IN ARCADIA  (schön, aber unheimlich; Dur mit Schatten)
  arcadia: { root: 246, tempo: 96, wave: 'triangle', gain: 0.046,
    seq: [[0,1],[5,1],[9,2],[12,1],[9,1],[8,2],[9,1],[5,1],[4,2],[0,1],[3,1],[0,3],[null,2]] },
  // FINALE — INFINITE BATHS  (unendlich, ruhig, offene Quinten)
  baths: { root: 130.8, tempo: 54, wave: 'sine', gain: 0.055,
    seq: [[0,4],[7,4],[12,4],[7,2],[10,2],[7,4],[0,4],[null,4]] },
};

// ============================================================
//  MELODIE PRO QUEST  ← HIER komponierst du jede Quest einzeln!
// ------------------------------------------------------------
//  Jede der 51 Quests hat ihren eigenen Eintrag. Er wird gespielt,
//  sobald du die jeweilige Quest aktiv hast, und subtil über den
//  Ambient gelegt. Bearbeite einfach die `seq`-Notenfolge (und bei
//  Bedarf root/tempo/wave/gain) für jeden Song nach deinem Geschmack.
//
//  Erinnerung Format:  seq: [[halbton, schläge], ...]
//    halbton: 0 = Grundton (root), 7 = Quinte, 12 = Oktave, 3 = kleine Terz …
//             negative Werte gehen tiefer (z. B. -5 = Quarte darunter).
//    schläge: Länge der Note;  [null, n] = Pause über n Schläge.
//    root: Grundfrequenz in Hz (220 = A3, 261.6 = C4, 196 = G3 …).
//    tempo: Schläge pro Minute.  wave: 'triangle'|'sine'|'square'|'sawtooth'.
//    gain: Lautstärke (subtil halten, ~0.03–0.06).
//
//  Die Werte unten sind eigene Platzhalter-Stimmungen je Album –
//  KEINE Transkriptionen der echten Songs. Ersetze sie durch deine
//  eigenen Kompositionen. Fehlt ein Eintrag, greift das Album-Motiv.
// ============================================================
const QUEST_MELODY = {
  // —— PROLOG · ONE ——
'thread-the-needle': { 
  root: 196,           // G3 (adjust if your engine uses different base; song is ~G#m / E feel)
  tempo: 76, 
  wave: 'triangle', 
  gain: 0.05, 
  seq: [
    // Main ethereal lead motif (verse/piano style)
    [0, 2], [3, 1], [5, 2], [7, 1], [5, 1], [3, 3], [null, 1],   // rising + hold
    [0, 2], [3, 1], [5, 1], [8, 2], [7, 1], [5, 4], [null, 2],    // variation + longer resolve
    [3, 2], [5, 1], [7, 1], [10, 2], [8, 1], [7, 3], [null, 1],   // build / tension
    [5, 2], [3, 1], [5, 1], [7, 4], [null, 2],                     // descent + breath
    // Chorus / "thread the needle" phrasing
    [0, 2], [null, 1], [3, 2], [5, 1], [3, 1], [2, 3], [null, 2],
    [0, 2], [3, 1], [5, 2], [7, 3], [null, 1]
  ]
},
  'fields-of-elation': { 
  root: 233,           // ~Bb3 (matches Bb minor key)
  tempo: 144, 
  wave: 'triangle', 
  gain: 0.05, 
  seq: [
    [0, 2], [3, 1], [5, 2], [7, 1], [5, 1], [3, 3], [null, 1],
    [0, 2], [4, 1], [7, 2], [8, 1], [7, 1], [5, 4], [null, 2],
    [3, 2], [5, 1], [8, 2], [10, 1], [8, 3], [null, 1],
    [5, 2], [3, 1], [5, 2], [7, 4], [null, 2],
    [0, 2], [3, 1], [5, 3], [null, 2]
  ]
},
  'when-the-bough-breaks': { 
  root: 185,           // ~F#3 / F#m feel
  tempo: 137, 
  wave: 'triangle', 
  gain: 0.045, 
  seq: [
    [0, 2], [2, 1], [5, 2], [7, 1], [5, 1], [3, 3], [null, 2],
    [0, 2], [3, 1], [7, 2], [8, 1], [7, 1], [5, 4], [null, 2],
    [-1, 2], [2, 1], [5, 2], [7, 1], [5, 3], [null, 1],
    [3, 2], [5, 1], [8, 2], [7, 1], [5, 4], [null, 2],
    [0, 2], [null, 2], [3, 2], [5, 3], [null, 2]
  ]
},

  // —— KAPITEL I · TWO ——
  'calcutta': { 
  root: 196,           // Around G#/Ab feel — adjust root if needed
  tempo: 130, 
  wave: 'triangle', 
  gain: 0.05, 
  seq: [
    [0, 2], [3, 1], [5, 2], [7, 1], [5, 1], [3, 3], [null, 1],
    [0, 2], [4, 1], [7, 2], [8, 1], [7, 1], [5, 4], [null, 2],
    [3, 2], [5, 1], [8, 2], [7, 1], [5, 3], [null, 1],
    [0, 2], [3, 1], [5, 2], [7, 4], [null, 2]
  ]
},
  'nazareth': { 
  root: 175,           // Closer to F / Fm feel (common in covers)
  tempo: 85, 
  wave: 'triangle', 
  gain: 0.05, 
  seq: [
    [0, 2], [3, 1], [5, 1], [7, 2], [5, 2], [3, 3], [null, 1],
    [0, 2], [3, 1], [5, 1], [8, 2], [7, 1], [5, 4], [null, 2],
    [-2, 2], [0, 1], [3, 2], [5, 1], [3, 3], [null, 1],
    [0, 2], [5, 1], [7, 2], [8, 3], [null, 2]
  ]
},
  'jericho': { 
  root: 196,           // G#m / darker feel
  tempo: 87,           // Half-time feel of the ~173 BPM track
  wave: 'triangle', 
  gain: 0.04, 
  seq: [
    [0, 2], [2, 1], [5, 2], [7, 1], [5, 1], [3, 3], [null, 2],
    [0, 2], [3, 1], [7, 2], [8, 1], [7, 1], [5, 4], [null, 2],
    [3, 2], [5, 1], [7, 2], [10, 1], [8, 3], [null, 1],
    [5, 2], [3, 1], [5, 2], [7, 4], [null, 2]
  ]
},

  // —— KAPITEL II · SUNDOWNING ——
  'tnbtg':            { root: 174, tempo: 72, wave: 'triangle', gain: 0.048, seq: [[12,2],[10,1],[8,1],[7,2],[5,1],[3,1],[2,2],[0,2],[3,1],[2,1],[0,4],[null,2]] }, // The Night Does Not Belong To God
  'the-offering':     { root: 174, tempo: 72, wave: 'triangle', gain: 0.048, seq: [[12,2],[10,1],[8,1],[7,2],[5,1],[3,1],[2,2],[0,2],[3,1],[2,1],[0,4],[null,2]] }, // The Offering
  'levitate':         { root: 174, tempo: 72, wave: 'triangle', gain: 0.048, seq: [[12,2],[10,1],[8,1],[7,2],[5,1],[3,1],[2,2],[0,2],[3,1],[2,1],[0,4],[null,2]] }, // Levitate
  'dark-signs':       { root: 174, tempo: 72, wave: 'triangle', gain: 0.048, seq: [[12,2],[10,1],[8,1],[7,2],[5,1],[3,1],[2,2],[0,2],[3,1],[2,1],[0,4],[null,2]] }, // Dark Signs
  'higher':           { root: 174, tempo: 72, wave: 'triangle', gain: 0.048, seq: [[12,2],[10,1],[8,1],[7,2],[5,1],[3,1],[2,2],[0,2],[3,1],[2,1],[0,4],[null,2]] }, // Higher
  'take-aim':         { root: 174, tempo: 72, wave: 'triangle', gain: 0.048, seq: [[12,2],[10,1],[8,1],[7,2],[5,1],[3,1],[2,2],[0,2],[3,1],[2,1],[0,4],[null,2]] }, // Take Aim
  'give':             { root: 174, tempo: 72, wave: 'triangle', gain: 0.048, seq: [[12,2],[10,1],[8,1],[7,2],[5,1],[3,1],[2,2],[0,2],[3,1],[2,1],[0,4],[null,2]] }, // Give
  'gods':             { root: 174, tempo: 72, wave: 'triangle', gain: 0.048, seq: [[12,2],[10,1],[8,1],[7,2],[5,1],[3,1],[2,2],[0,2],[3,1],[2,1],[0,4],[null,2]] }, // Gods
  'sugar':            { root: 174, tempo: 72, wave: 'triangle', gain: 0.048, seq: [[12,2],[10,1],[8,1],[7,2],[5,1],[3,1],[2,2],[0,2],[3,1],[2,1],[0,4],[null,2]] }, // Sugar
  'say-that-you-will':{ root: 174, tempo: 72, wave: 'triangle', gain: 0.048, seq: [[12,2],[10,1],[8,1],[7,2],[5,1],[3,1],[2,2],[0,2],[3,1],[2,1],[0,4],[null,2]] }, // Say That You Will
  'drag-me-under':    { root: 174, tempo: 72, wave: 'triangle', gain: 0.048, seq: [[12,2],[10,1],[8,1],[7,2],[5,1],[3,1],[2,2],[0,2],[3,1],[2,1],[0,4],[null,2]] }, // Drag Me Under
  'blood-sport':      { root: 174, tempo: 72, wave: 'triangle', gain: 0.048, seq: [[12,2],[10,1],[8,1],[7,2],[5,1],[3,1],[2,2],[0,2],[3,1],[2,1],[0,4],[null,2]] }, // Blood Sport

  // —— KAPITEL III · THIS PLACE WILL BECOME YOUR TOMB ——
  'atlantic':      { root: 164, tempo: 60, wave: 'sine', gain: 0.052, seq: [[0,3],[7,2],[10,3],[7,2],[3,3],[5,2],[3,4],[null,3],[12,2],[10,4],[null,2]] }, // Atlantic
  'hypnosis':      { root: 164, tempo: 60, wave: 'sine', gain: 0.052, seq: [[0,3],[7,2],[10,3],[7,2],[3,3],[5,2],[3,4],[null,3],[12,2],[10,4],[null,2]] }, // Hypnosis
  'mine':          { root: 164, tempo: 60, wave: 'sine', gain: 0.052, seq: [[0,3],[7,2],[10,3],[7,2],[3,3],[5,2],[3,4],[null,3],[12,2],[10,4],[null,2]] }, // Mine
  'like-that':     { root: 164, tempo: 60, wave: 'sine', gain: 0.052, seq: [[0,3],[7,2],[10,3],[7,2],[3,3],[5,2],[3,4],[null,3],[12,2],[10,4],[null,2]] }, // Like That
  'the-love-you-want':{ root: 164, tempo: 60, wave: 'sine', gain: 0.052, seq: [[0,3],[7,2],[10,3],[7,2],[3,3],[5,2],[3,4],[null,3],[12,2],[10,4],[null,2]] }, // The Love You Want
  'fall-for-me':   { root: 164, tempo: 60, wave: 'sine', gain: 0.052, seq: [[0,3],[7,2],[10,3],[7,2],[3,3],[5,2],[3,4],[null,3],[12,2],[10,4],[null,2]] }, // Fall For Me
  'alkaline':      { root: 164, tempo: 60, wave: 'sine', gain: 0.052, seq: [[0,3],[7,2],[10,3],[7,2],[3,3],[5,2],[3,4],[null,3],[12,2],[10,4],[null,2]] }, // Alkaline
  'distraction':   { root: 164, tempo: 60, wave: 'sine', gain: 0.052, seq: [[0,3],[7,2],[10,3],[7,2],[3,3],[5,2],[3,4],[null,3],[12,2],[10,4],[null,2]] }, // Distraction
  'descending':    { root: 164, tempo: 60, wave: 'sine', gain: 0.052, seq: [[0,3],[7,2],[10,3],[7,2],[3,3],[5,2],[3,4],[null,3],[12,2],[10,4],[null,2]] }, // Descending
  'telomeres':     { root: 164, tempo: 60, wave: 'sine', gain: 0.052, seq: [[0,3],[7,2],[10,3],[7,2],[3,3],[5,2],[3,4],[null,3],[12,2],[10,4],[null,2]] }, // Telomeres
  'high-water':    { root: 164, tempo: 60, wave: 'sine', gain: 0.052, seq: [[0,3],[7,2],[10,3],[7,2],[3,3],[5,2],[3,4],[null,3],[12,2],[10,4],[null,2]] }, // High Water
  'missing-limbs': { root: 164, tempo: 60, wave: 'sine', gain: 0.052, seq: [[0,3],[7,2],[10,3],[7,2],[3,3],[5,2],[3,4],[null,3],[12,2],[10,4],[null,2]] }, // Missing Limbs

  // —— KAPITEL IV · TAKE ME BACK TO EDEN ——
  'chokehold':     { root: 233, tempo: 90, wave: 'triangle', gain: 0.05, seq: [[0,1],[4,1],[7,2],[11,1],[12,1],[11,2],[7,1],[9,1],[7,2],[4,1],[2,1],[0,3],[null,2]] }, // Chokehold
  'the-summoning': { root: 233, tempo: 90, wave: 'triangle', gain: 0.05, seq: [[0,1],[4,1],[7,2],[11,1],[12,1],[11,2],[7,1],[9,1],[7,2],[4,1],[2,1],[0,3],[null,2]] }, // The Summoning
  'granite':       { root: 233, tempo: 90, wave: 'triangle', gain: 0.05, seq: [[0,1],[4,1],[7,2],[11,1],[12,1],[11,2],[7,1],[9,1],[7,2],[4,1],[2,1],[0,3],[null,2]] }, // Granite
  'aqua-regia':    { root: 233, tempo: 90, wave: 'triangle', gain: 0.05, seq: [[0,1],[4,1],[7,2],[11,1],[12,1],[11,2],[7,1],[9,1],[7,2],[4,1],[2,1],[0,3],[null,2]] }, // Aqua Regia
  'vore':          { root: 233, tempo: 90, wave: 'triangle', gain: 0.05, seq: [[0,1],[4,1],[7,2],[11,1],[12,1],[11,2],[7,1],[9,1],[7,2],[4,1],[2,1],[0,3],[null,2]] }, // Vore
  'ascensionism':  { root: 233, tempo: 90, wave: 'triangle', gain: 0.05, seq: [[0,1],[4,1],[7,2],[11,1],[12,1],[11,2],[7,1],[9,1],[7,2],[4,1],[2,1],[0,3],[null,2]] }, // Ascensionism
  'are-you-really-okay':{ root: 233, tempo: 90, wave: 'triangle', gain: 0.05, seq: [[0,1],[4,1],[7,2],[11,1],[12,1],[11,2],[7,1],[9,1],[7,2],[4,1],[2,1],[0,3],[null,2]] }, // Are You Really Okay?
  'the-apparition':{ root: 233, tempo: 90, wave: 'triangle', gain: 0.05, seq: [[0,1],[4,1],[7,2],[11,1],[12,1],[11,2],[7,1],[9,1],[7,2],[4,1],[2,1],[0,3],[null,2]] }, // The Apparition
  'dywtylm':       { root: 233, tempo: 90, wave: 'triangle', gain: 0.05, seq: [[0,1],[4,1],[7,2],[11,1],[12,1],[11,2],[7,1],[9,1],[7,2],[4,1],[2,1],[0,3],[null,2]] }, // DYWTYLM
  'rain':          { root: 233, tempo: 90, wave: 'triangle', gain: 0.05, seq: [[0,1],[4,1],[7,2],[11,1],[12,1],[11,2],[7,1],[9,1],[7,2],[4,1],[2,1],[0,3],[null,2]] }, // Rain
  'take-me-back-to-eden':{ root: 233, tempo: 90, wave: 'triangle', gain: 0.05, seq: [[0,1],[4,1],[7,2],[11,1],[12,1],[11,2],[7,1],[9,1],[7,2],[4,1],[2,1],[0,3],[null,2]] }, // Take Me Back To Eden
  'euclid':        { root: 233, tempo: 90, wave: 'triangle', gain: 0.05, seq: [[0,1],[4,1],[7,2],[11,1],[12,1],[11,2],[7,1],[9,1],[7,2],[4,1],[2,1],[0,3],[null,2]] }, // Euclid

  // —— KAPITEL V · EVEN IN ARCADIA ——
  'look-to-windward':{ root: 246, tempo: 96, wave: 'triangle', gain: 0.046, seq: [[0,1],[5,1],[9,2],[12,1],[9,1],[8,2],[9,1],[5,1],[4,2],[0,1],[3,1],[0,3],[null,2]] }, // Look To Windward
  'emergence':     { root: 246, tempo: 96, wave: 'triangle', gain: 0.046, seq: [[0,1],[5,1],[9,2],[12,1],[9,1],[8,2],[9,1],[5,1],[4,2],[0,1],[3,1],[0,3],[null,2]] }, // Emergence
  'past-self':     { root: 246, tempo: 96, wave: 'triangle', gain: 0.046, seq: [[0,1],[5,1],[9,2],[12,1],[9,1],[8,2],[9,1],[5,1],[4,2],[0,1],[3,1],[0,3],[null,2]] }, // Past Self
  'dangerous':     { root: 246, tempo: 96, wave: 'triangle', gain: 0.046, seq: [[0,1],[5,1],[9,2],[12,1],[9,1],[8,2],[9,1],[5,1],[4,2],[0,1],[3,1],[0,3],[null,2]] }, // Dangerous
  'caramel':       { root: 246, tempo: 96, wave: 'triangle', gain: 0.046, seq: [[0,1],[5,1],[9,2],[12,1],[9,1],[8,2],[9,1],[5,1],[4,2],[0,1],[3,1],[0,3],[null,2]] }, // Caramel
  'even-in-arcadia':{ root: 246, tempo: 96, wave: 'triangle', gain: 0.046, seq: [[0,1],[5,1],[9,2],[12,1],[9,1],[8,2],[9,1],[5,1],[4,2],[0,1],[3,1],[0,3],[null,2]] }, // Even In Arcadia
  'providence':    { root: 246, tempo: 96, wave: 'triangle', gain: 0.046, seq: [[0,1],[5,1],[9,2],[12,1],[9,1],[8,2],[9,1],[5,1],[4,2],[0,1],[3,1],[0,3],[null,2]] }, // Providence
  'gethsemane':    { root: 246, tempo: 96, wave: 'triangle', gain: 0.046, seq: [[0,1],[5,1],[9,2],[12,1],[9,1],[8,2],[9,1],[5,1],[4,2],[0,1],[3,1],[0,3],[null,2]] }, // Gethsemane

  // —— FINALE · INFINITE BATHS ——
  'infinite-baths':{ root: 130.8, tempo: 54, wave: 'sine', gain: 0.055, seq: [[0,4],[7,4],[12,4],[7,2],[10,2],[7,4],[0,4],[null,4]] }, // Infinite Baths
};

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.volume = 0.7;
    this.musicVolume = 0.8;
    this.muted = false;
    this.ambient = null;       // aktive Ambient-Knoten
    this.ambientTheme = null;
    this.padTimer = null;
    this.noteIdx = 0;
    // Melodie-Spur
    this.melodyKey = null;
    this.melodyTimer = null;
    this.melodyVoice = null;   // { gain } – gemeinsamer Ausgang der Melodie
    this.melodyStep = 0;
  }

  // Muss nach einer Nutzer-Interaktion aufgerufen werden
  ensure() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return true;
    }
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { return false; }
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : this.volume;
    this.master.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = this.musicVolume * 0.5;
    this.musicGain.connect(this.master);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.9;
    this.sfxGain.connect(this.master);
    return true;
  }

  setVolume(v) {
    this.volume = v;
    if (this.master && !this.muted) this.master.gain.value = v;
  }
  setMusicVolume(v) {
    this.musicVolume = v;
    if (this.musicGain) this.musicGain.gain.value = v * 0.5;
  }
  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : this.volume;
  }

  // ---------- Ambient / Musik ----------
  playAmbient(themeName) {
    if (!this.ensure()) return;
    if (this.ambientTheme === themeName) return;
    this.stopAmbient();
    const theme = AMBIENT_THEMES[themeName] || AMBIENT_THEMES.sanctum;
    this.ambientTheme = themeName;

    const ctx = this.ctx;
    const out = ctx.createGain();
    out.gain.value = 0;
    out.gain.linearRampToValueAtTime(1, ctx.currentTime + 3);
    out.connect(this.musicGain);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = theme.filter;
    filter.Q.value = 0.8;
    filter.connect(out);

    // Zwei tiefe, leicht verstimmte Drones
    const oscs = [];
    for (const det of [-4, 3]) {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = theme.root;
      o.detune.value = det;
      const g = ctx.createGain();
      g.gain.value = 0.16;
      o.connect(g); g.connect(filter);
      o.start();
      oscs.push(o, g);
    }
    // Sub-Sinus eine Oktave tiefer
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.value = theme.root / 2;
    const subG = ctx.createGain();
    subG.gain.value = 0.22;
    sub.connect(subG); subG.connect(out);
    sub.start();

    // Langsame Filterbewegung
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.05;
    const lfoG = ctx.createGain();
    lfoG.gain.value = theme.filter * 0.5;
    lfo.connect(lfoG); lfoG.connect(filter.frequency);
    lfo.start();

    // Atmosphärisches Rauschen
    const noiseBuf = this._noiseBuffer(2);
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf; noise.loop = true;
    const nFilter = ctx.createBiquadFilter();
    nFilter.type = 'bandpass';
    nFilter.frequency.value = 300 + theme.dark * 200;
    nFilter.Q.value = 0.5;
    const nG = ctx.createGain();
    nG.gain.value = 0.05;
    noise.connect(nFilter); nFilter.connect(nG); nG.connect(out);
    noise.start();

    this.ambient = { out, oscs, sub, subG, lfo, lfoG, noise, nG, filter, theme };

    // Gelegentliche Pad-Töne (Melodiefragmente)
    const padLoop = () => {
      if (!this.ambient || this.ambientTheme !== themeName) return;
      this._padNote(theme);
      this.padTimer = setTimeout(padLoop, theme.pad * 1000 * (0.7 + Math.random() * 0.6));
    };
    this.padTimer = setTimeout(padLoop, 2500);
  }

  _padNote(theme) {
    const ctx = this.ctx;
    const semis = theme.notes[this.noteIdx % theme.notes.length];
    this.noteIdx += (Math.random() < 0.7 ? 1 : 2);
    const freq = theme.root * 4 * Math.pow(2, semis / 12);
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.value = freq;
    const g = ctx.createGain();
    const t = ctx.currentTime;
    const dur = 6 + Math.random() * 4;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.07, t + dur * 0.4);
    g.gain.linearRampToValueAtTime(0, t + dur);
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 1200;
    o.connect(f); f.connect(g); g.connect(this.musicGain);
    o.start(t); o.stop(t + dur + 0.1);
  }

  stopAmbient() {
    if (this.padTimer) { clearTimeout(this.padTimer); this.padTimer = null; }
    if (!this.ambient) { this.ambientTheme = null; return; }
    const a = this.ambient;
    const t = this.ctx.currentTime;
    try {
      a.out.gain.cancelScheduledValues(t);
      a.out.gain.setValueAtTime(a.out.gain.value, t);
      a.out.gain.linearRampToValueAtTime(0, t + 1.2);
    } catch (e) { /* ignorieren */ }
    setTimeout(() => {
      try {
        a.oscs.forEach(n => { if (n.stop) n.stop(); n.disconnect(); });
        a.sub.stop(); a.sub.disconnect(); a.subG.disconnect();
        a.lfo.stop(); a.lfo.disconnect(); a.lfoG.disconnect();
        a.noise.stop(); a.noise.disconnect(); a.nG.disconnect();
        a.filter.disconnect(); a.out.disconnect();
      } catch (e) { /* bereits gestoppt */ }
    }, 1400);
    this.ambient = null;
    this.ambientTheme = null;
  }

  _noiseBuffer(seconds) {
    const len = this.ctx.sampleRate * seconds;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  // ---------- Melodie-Spur (pro Quest/Album) ----------
  // Wählt das Motiv für die aktuelle Quest (Quest-ID schlägt Album-ID).
  playQuestMelody(questId, albumId) {
    const motif = QUEST_MELODY[questId] || ALBUM_MELODY[albumId] || null;
    const key = motif ? (QUEST_MELODY[questId] ? questId : albumId) : null;
    this.setMelody(key, motif);

    console.log(`Playing melody for quest "${questId}" (album "${albumId}")`, motif);
  }

  setMelody(key, motif) {
    if (!this.ensure()) return;
    if (this.melodyKey === key) return;
    this.melodyKey = key;
    this._stopMelodyVoice();
    if (!motif) return;

    const ctx = this.ctx;
    const out = ctx.createGain();
    out.gain.value = 0;
    out.gain.linearRampToValueAtTime(1, ctx.currentTime + 2.5);
    // sanftes Tiefpassfilter, damit die Melodie im Hintergrund bleibt
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 1500; f.Q.value = 0.4;
    f.connect(out);
    out.connect(this.musicGain);
    this.melodyVoice = { out, filter: f, motif };
    this.melodyStep = 0;
    this._scheduleMelody();
  }

  _scheduleMelody() {
    const v = this.melodyVoice;
    if (!v) return;
    const motif = v.motif;
    const beat = 60 / (motif.tempo || 80);
    const step = motif.seq[this.melodyStep % motif.seq.length];
    this.melodyStep++;
    const [semi, beats] = step;
    const dur = beats * beat;

    if (semi != null) {
      const ctx = this.ctx;
      const t = ctx.currentTime;
      const freq = motif.root * Math.pow(2, semi / 12);
      const o = ctx.createOscillator();
      o.type = motif.wave || 'triangle';
      o.frequency.value = freq;
      // leichte zweite Stimme eine Oktave höher, sehr leise (Glanz)
      const o2 = ctx.createOscillator();
      o2.type = 'sine'; o2.frequency.value = freq * 2; o2.detune.value = 4;
      const g = ctx.createGain();
      const peak = motif.gain != null ? motif.gain : 0.05;
      const sus = dur * 0.92;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(peak, t + 0.04);
      g.gain.setValueAtTime(peak, t + sus * 0.5);
      g.gain.exponentialRampToValueAtTime(0.0008, t + sus);
      const g2 = ctx.createGain();
      g2.gain.value = 0.28;
      o.connect(g); o2.connect(g2); g2.connect(g);
      g.connect(v.filter);
      o.start(t); o.stop(t + sus + 0.05);
      o2.start(t); o2.stop(t + sus + 0.05);
    }
    this.melodyTimer = setTimeout(() => this._scheduleMelody(), dur * 1000);
  }

  _stopMelodyVoice() {
    if (this.melodyTimer) { clearTimeout(this.melodyTimer); this.melodyTimer = null; }
    const v = this.melodyVoice;
    if (!v) return;
    const t = this.ctx.currentTime;
    try {
      v.out.gain.cancelScheduledValues(t);
      v.out.gain.setValueAtTime(v.out.gain.value, t);
      v.out.gain.linearRampToValueAtTime(0, t + 0.8);
    } catch (e) { /* ignorieren */ }
    const old = v;
    setTimeout(() => { try { old.out.disconnect(); old.filter.disconnect(); } catch (e) {} }, 1000);
    this.melodyVoice = null;
  }

  stopMelody() {
    this.melodyKey = null;
    this._stopMelodyVoice();
  }

  // ---------- Effekte ----------
  sfx(name) {
    if (!this.ctx) return;
    const fn = this['_sfx_' + name];
    if (fn) fn.call(this);
  }

  _tone(freq, dur, { type = 'sine', vol = 0.2, slide = 0, delay = 0, filterHz = 0 } = {}) {
    const ctx = this.ctx;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    let node = o;
    if (filterHz) {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.value = filterHz;
      o.connect(f); node = f;
    }
    node.connect(g); g.connect(this.sfxGain);
    o.start(t); o.stop(t + dur + 0.05);
  }

  _noise(dur, { vol = 0.25, filterHz = 1000, type = 'lowpass', delay = 0, q = 1 } = {}) {
    const ctx = this.ctx;
    const t = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = this._noiseBuffer(Math.min(dur + 0.1, 1.5));
    const f = ctx.createBiquadFilter();
    f.type = type; f.frequency.value = filterHz; f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f); f.connect(g); g.connect(this.sfxGain);
    src.start(t); src.stop(t + dur + 0.05);
  }

  _sfx_swing()   { this._noise(0.14, { vol: 0.12, filterHz: 1600, type: 'bandpass', q: 0.7 }); }
  _sfx_hit()     { this._noise(0.16, { vol: 0.3, filterHz: 700 }); this._tone(140, 0.12, { type: 'square', vol: 0.12, slide: -60 }); }
  _sfx_hurt()    { this._tone(220, 0.25, { type: 'sawtooth', vol: 0.2, slide: -120, filterHz: 900 }); }
  _sfx_dodge()   { this._noise(0.22, { vol: 0.1, filterHz: 2400, type: 'highpass' }); }
  _sfx_pickup()  { this._tone(660, 0.12, { type: 'sine', vol: 0.15 }); this._tone(990, 0.18, { type: 'sine', vol: 0.12, delay: 0.07 }); }
  _sfx_fragment(){ this._tone(523, 0.15, { vol: 0.16 }); this._tone(784, 0.2, { vol: 0.14, delay: 0.1 }); this._tone(1047, 0.3, { vol: 0.12, delay: 0.2 }); }
  _sfx_heal()    { this._tone(440, 0.3, { vol: 0.12, slide: 220 }); this._tone(660, 0.4, { vol: 0.1, delay: 0.15, slide: 160 }); }
  _sfx_levelup() { [392, 523, 659, 784].forEach((f, i) => this._tone(f, 0.35, { vol: 0.16, delay: i * 0.09, type: 'triangle' })); }
  _sfx_quest()   { [523, 659, 784].forEach((f, i) => this._tone(f, 0.4, { vol: 0.15, delay: i * 0.12, type: 'sine' })); }
  _sfx_achievement() { [659, 880, 1109, 1319].forEach((f, i) => this._tone(f, 0.45, { vol: 0.13, delay: i * 0.08, type: 'triangle' })); }
  _sfx_dialog()  { this._tone(880, 0.05, { vol: 0.05, type: 'sine' }); }
  _sfx_choice()  { this._tone(587, 0.12, { vol: 0.12, type: 'triangle' }); }
  _sfx_click()   { this._tone(440, 0.06, { vol: 0.08, type: 'sine' }); }
  _sfx_portal()  { this._tone(110, 1.2, { vol: 0.18, slide: 440, type: 'sine' }); this._noise(1.0, { vol: 0.1, filterHz: 800 }); }
  _sfx_death()   { this._tone(180, 1.4, { vol: 0.22, slide: -140, type: 'sawtooth', filterHz: 600 }); }
  _sfx_boss()    { this._tone(55, 1.6, { vol: 0.3, type: 'sawtooth', filterHz: 300 }); this._noise(1.2, { vol: 0.2, filterHz: 250 }); }
  _sfx_roar()    { this._tone(80, 0.9, { vol: 0.25, slide: -30, type: 'sawtooth', filterHz: 500 }); this._noise(0.8, { vol: 0.22, filterHz: 400 }); }
  _sfx_ability() { this._tone(330, 0.4, { vol: 0.18, slide: 200, type: 'sawtooth', filterHz: 1400 }); }
  _sfx_shock()   { this._noise(0.5, { vol: 0.35, filterHz: 280 }); this._tone(60, 0.5, { vol: 0.3, slide: -20, type: 'sine' }); }
  _sfx_shoot()   { this._tone(520, 0.18, { vol: 0.12, slide: -260, type: 'square', filterHz: 1200 }); }
  _sfx_unlock()  { [440, 554, 659, 880].forEach((f, i) => this._tone(f, 0.5, { vol: 0.14, delay: i * 0.1, type: 'sine' })); }
}

export const AUDIO = new AudioEngine();
