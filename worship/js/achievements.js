// ============================================================
//  achievements.js – Erfolge
// ============================================================

import { GlobalStore } from './save.js';

export const ACH_DEFS = [
  { id: 'first-pact',     icon: '🤝', name: { de: 'Der erste Pakt', en: 'The First Pact' },            desc: { de: 'Schließe „Thread The Needle" ab.', en: 'Complete "Thread The Needle".' } },
  { id: 'dreamer',        icon: '🌙', name: { de: 'Der Träumer', en: 'The Dreamer' },               desc: { de: 'Schließe den Prolog ONE ab.', en: 'Complete the prologue ONE.' } },
  { id: 'true-love',      icon: '❤️', name: { de: 'Echte Liebe', en: 'True Love' },               desc: { de: 'Schließe „Calcutta" ab.', en: 'Complete "Calcutta".' } },
  { id: 'pilgrim',        icon: '🏜️', name: { de: 'Der Pilger', en: 'The Pilgrim' },                desc: { de: 'Schließe Kapitel TWO ab.', en: 'Complete chapter TWO.' } },
  { id: 'night-not-god',  icon: '🌅', name: { de: 'Die Nacht gehört nicht Gott', en: 'The Night Belongs Not to God' }, desc: { de: 'Schließe Kapitel SUNDOWNING ab.', en: 'Complete chapter SUNDOWNING.' } },
  { id: 'blood-sport',    icon: '🩸', name: { de: 'Blutsport', en: 'Blood Sport' },                 desc: { de: 'Besiege Sleeps Champion.', en: "Defeat Sleep's Champion." } },
  { id: 'shipwrecked',    icon: '🌊', name: { de: 'Der Schiffbrüchige', en: 'The Shipwrecked' },        desc: { de: 'Überlebe „Atlantic".', en: 'Survive "Atlantic".' } },
  { id: 'your-tomb',      icon: '🪦', name: { de: 'Dies wird dein Grab', en: 'This Will Be Your Tomb' },       desc: { de: 'Schließe Kapitel THIS PLACE WILL BECOME YOUR TOMB ab.', en: 'Complete chapter THIS PLACE WILL BECOME YOUR TOMB.' } },
  { id: 'first-resist',   icon: '✊', name: { de: 'Erster Widerstand', en: 'First Resistance' },         desc: { de: 'Widerstehe Sleep in „Alkaline".', en: 'Resist Sleep in "Alkaline".' } },
  { id: 'the-summoning',  icon: '📜', name: { de: 'Die Beschwörung', en: 'The Summoning' },           desc: { de: 'Erfahre den wahren Namen von Sleep.', en: "Learn Sleep's true name." } },
  { id: 'back-to-eden',   icon: '🌿', name: { de: 'Zurück nach Eden', en: 'Back to Eden' },          desc: { de: 'Schließe Kapitel TAKE ME BACK TO EDEN ab.', en: 'Complete chapter TAKE ME BACK TO EDEN.' } },
  { id: 'cycle-breaker',  icon: '⛓️', name: { de: 'Der Kreislaufbrecher', en: 'The Cycle Breaker' },      desc: { de: 'Zerbrich die Ketten in „Euclid".', en: 'Break the chains in "Euclid".' } },
  { id: 'windward',       icon: '🌬️', name: { de: 'Luvwärts', en: 'Windward' },                  desc: { de: 'Besiege das Echo von Sleep.', en: 'Defeat the Echo of Sleep.' } },
  { id: 'emergent',       icon: '👤', name: { de: 'Geburt des Schattens', en: 'Birth of the Shadow' },      desc: { de: 'Besiege The Emergent One.', en: 'Defeat The Emergent One.' } },
  { id: 'past-self',      icon: '🪞', name: { de: 'Das jüngere Ich', en: 'The Younger Self' },           desc: { de: 'Besiege Past Vessel im Spiegelgewölbe.', en: 'Defeat Past Vessel in the mirror vault.' } },
  { id: 'maskmaker',      icon: '🎭', name: { de: 'Hinter der goldenen Maske', en: 'Behind the Golden Mask' }, desc: { de: 'Besiege den Maskenmacher.', en: 'Defeat the Maskmaker.' } },
  { id: 'crowned',        icon: '👑', name: { de: 'Der gekrönte Schlaf', en: 'The Crowned Sleep' },       desc: { de: 'Besiege The Crowned Sleep.', en: 'Defeat The Crowned Sleep.' } },
  { id: 'ending-destroy', icon: '🔥', name: { de: 'Ende I: Vernichtung', en: 'Ending I: Destruction' },       desc: { de: 'Vernichte Sleep und opfere die Traumlande.', en: 'Destroy Sleep and sacrifice the Dreamlands.' } },
  { id: 'ending-seal',    icon: '🔒', name: { de: 'Ende II: Versiegelung', en: 'Ending II: The Seal' },     desc: { de: 'Versiegle Sleep und setze den Kreislauf fort.', en: 'Seal Sleep and continue the cycle.' } },
  { id: 'ending-unite',   icon: '☯️', name: { de: 'Ende III: Vereinigung', en: 'Ending III: Union' },     desc: { de: 'Das wahre Ende: Akzeptiere Sleep als Teil von dir.', en: 'The true ending: accept Sleep as part of you.' } },
  { id: 'all-endings',    icon: '🌌', name: { de: 'Alle drei Wahrheiten', en: 'All Three Truths' },      desc: { de: 'Erlebe alle drei Enden.', en: 'Experience all three endings.' } },
  { id: 'worship',        icon: '🛐', name: { de: 'Worship', en: 'Worship' },                   desc: { de: 'Schließe alle 51 Hauptquests ab.', en: 'Complete all 51 main quests.' } },
  { id: 'band-complete',  icon: '🥁', name: { de: 'Das Ritual ist vollzählig', en: 'The Ritual Is Complete' }, desc: { de: 'Schalte II, III und IV als spielbare Charaktere frei.', en: 'Unlock II, III and IV as playable characters.' } },
  { id: 'shadow-hunter',  icon: '⚔️', name: { de: 'Schattenjäger', en: 'Shadow Hunter' },             desc: { de: 'Besiege 100 Kreaturen in einem Spielstand.', en: 'Defeat 100 creatures in one save.' } },
  { id: 'collector',      icon: '💠', name: { de: 'Bewahrer der Erinnerung', en: 'Keeper of Memory' },   desc: { de: 'Sammle alle 30 Erinnerungsfragmente.', en: 'Collect all 30 memory fragments.' } },
  { id: 'espera',         icon: '🕯️', name: { de: 'Espera', en: 'Espera' },                    desc: { de: 'Finde alle drei verborgenen Sängerinnen.', en: 'Find all three hidden singers.' }, secret: true },
];

class AchievementManager {
  constructor() {
    this.unlocked = new Set(GlobalStore.getAchievements());
    this.toastFn = null;     // wird von der UI gesetzt
  }

  init(toastFn) { this.toastFn = toastFn; }

  has(id) { return this.unlocked.has(id); }
  count() { return this.unlocked.size; }
  total() { return ACH_DEFS.length; }

  unlock(id) {
    if (this.unlocked.has(id)) return false;
    const def = ACH_DEFS.find(a => a.id === id);
    if (!def) { console.warn('Unbekannter Erfolg:', id); return false; }
    this.unlocked.add(id);
    GlobalStore.addAchievement(id);
    if (this.toastFn) this.toastFn(def);
    return true;
  }

  // zentrale Zähl-Logik
  onKill(totalKills) {
    if (totalKills >= 100) this.unlock('shadow-hunter');
  }
  onFragment(totalFragments) {
    if (totalFragments >= 30) this.unlock('collector');
  }
  onEspera(flags) {
    if (flags.espera1 && flags.espera2 && flags.espera3) this.unlock('espera');
  }
  onEnding(endingId) {
    const map = { destroy: 'ending-destroy', seal: 'ending-seal', unite: 'ending-unite' };
    this.unlock(map[endingId]);
    const seen = GlobalStore.addEnding(endingId);
    if (seen.length >= 3) this.unlock('all-endings');
  }
}

export const ACH = new AchievementManager();
