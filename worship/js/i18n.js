// ============================================================
//  i18n.js – Sprachsystem (Deutsch / English)
//  t(key)   -> übersetzte UI-Zeichenkette
//  tx(obj)  -> löst {de, en}-Objekte auf (oder gibt Strings durch)
// ============================================================

export const i18n = {
  lang: 'de',
  listeners: [],

  set(lang) {
    this.lang = (lang === 'en') ? 'en' : 'de';
    document.documentElement.lang = this.lang;
    this.apply();
    this.listeners.forEach(fn => fn(this.lang));
  },

  onChange(fn) { this.listeners.push(fn); },

  // UI-Schlüssel übersetzen, mit {0}-Platzhaltern
  t(key, ...args) {
    const dict = STR[this.lang] || STR.de;
    let s = dict[key] != null ? dict[key] : (STR.de[key] != null ? STR.de[key] : key);
    args.forEach((a, i) => { s = s.replace('{' + i + '}', a); });
    return s;
  },

  // bilinguale Daten-Felder auflösen
  tx(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    return v[this.lang] != null ? v[this.lang] : (v.de != null ? v.de : '');
  },

  // alle Elemente mit data-i18n im DOM aktualisieren
  apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = this.t(el.getAttribute('data-i18n-html'));
    });
  },
};

export const t = (k, ...a) => i18n.t(k, ...a);
export const tx = (v) => i18n.tx(v);

// ------------------------------------------------------------
//  Zeichenketten
// ------------------------------------------------------------
const STR = {
  de: {
    // Menü
    menu_title: 'Die Chronik des<br>Schlafenden Gottes',
    btn_new: 'Neues Spiel',
    btn_continue: 'Fortsetzen',
    btn_load: 'Laden',
    btn_achievements: 'Erfolge',
    btn_settings: 'Einstellungen',
    btn_help: 'Steuerung & Info',
    menu_lang: 'Sprache / Language',
    menu_footer: 'Inoffizielles Fan-Projekt · keine Originalmusik, keine Songtexte · nur für den privaten Gebrauch',
    loading_text: 'Die Traumlande erwachen …',

    // Fan-Hinweis vor dem Spielbeginn
    disclaimer_title: 'Ein Fan-Projekt',
    disclaimer_body: 'Dies ist <b>kein offizielles Spiel</b>. Es ist ein von Fans gemachtes Werk und meine ganz <b>persönliche Interpretation</b> der Geschichte rund um die Band <b>Sleep Token</b> und ihre Songs.<br><br>Die Handlung, die Charaktere und die Welt sind meine eigene Deutung – nicht die offizielle Lesart der Band.<br><br>Das Spiel enthält <b>keine Originalmusik und keine Songtexte</b>. Der gesamte Soundtrack wird live im Browser erzeugt; die Songtitel dienen nur als Namen der Quests.<br><br>Entstanden aus Begeisterung für die Musik. Nur für den privaten Gebrauch.<br><br><span class="gold">Worship.</span>',
    disclaimer_continue: 'Die Chronik beginnen',

    // Pause
    pause_title: 'Pause',
    btn_resume: 'Fortsetzen',
    btn_save: 'Speichern',
    btn_quests: 'Questlog (J)',
    btn_menu: 'Zum Hauptmenü',
    btn_controls: 'Steuerung',

    // Tod
    death_title: 'VOM TRAUM VERSCHLUNGEN',
    death_text: 'Die Traumlande geben dich noch nicht frei.',
    btn_respawn: 'Wieder erwachen',

    // Ende
    ending_decision_title: 'DIE LETZTE ENTSCHEIDUNG',
    ending_decision_sub: 'Was geschieht mit dem Schlafenden Gott?',
    end_destroy_t: 'Vernichte Sleep',
    end_destroy_s: 'Die Traumlande vergehen mit ihm. Endgültige Freiheit – um jeden Preis.',
    end_seal_t: 'Versiegle Sleep',
    end_seal_s: 'Der Kreislauf beginnt von Neuem. Frieden für dieses Zeitalter.',
    end_unite_t: 'Akzeptiere Sleep',
    end_unite_s: 'Licht und Dunkelheit vereinen. Mensch und Gott werden eins.',
    credits_true: '✦ DAS WAHRE ENDE ✦',
    menu_title_credits: 'SLEEP TOKEN<br>DIE CHRONIK DES SCHLAFENDEN GOTTES',
    credits_sub1: 'Ein Fan-RPG in 6 Kapiteln und 51 Quests',
    credits_chapters: 'PROLOG — ONE<br>KAPITEL I — TWO<br>KAPITEL II — SUNDOWNING<br>KAPITEL III — THIS PLACE WILL BECOME YOUR TOMB<br>KAPITEL IV — TAKE ME BACK TO EDEN<br>KAPITEL V — EVEN IN ARCADIA<br>FINALE — INFINITE BATHS',
    credits_cast: 'Gespielt von: Vessel · II · III · IV',
    credits_disclaimer: 'Inoffizielles, nicht-kommerzielles Fan-Projekt,<br>inspiriert von der Band Sleep Token.<br>Enthält keine Originalmusik und keine Songtexte.',
    btn_credits_close: 'Zurück in die Traumlande',

    // Fatal
    fatal_title: 'Das Ritual ist fehlgeschlagen',
    fatal_text: 'Bitte nutze einen aktuellen Browser (Chrome, Firefox, Safari) und starte das Spiel über „Spiel starten.command" bzw. einen lokalen Webserver.',

    // HUD / Hinweise
    dialog_hint: 'Weiter mit Klick / Leertaste',
    prompt_lock: 'Klicke ins Bild, um die Maus zu fangen',
    prompt_talk: 'Mit {0} sprechen',
    prompt_enter: '{0} betreten',
    prompt_sealed: '🔒 {0} – noch versiegelt',
    interact_e: '[E] {0}',

    // Panels
    panel_save: 'Spiel speichern',
    panel_load: 'Spiel laden',
    panel_achievements: 'Erfolge ({0}/{1})',
    panel_quests: 'Die Chronik – Questlog',
    panel_settings: 'Einstellungen',
    panel_help: 'Steuerung & Hinweise',
    slot_auto: 'Autospeichern',
    slot_n: 'Slot {0}',
    slot_empty: '— leer —',
    completed: 'Vollendet',
    save_level: 'Stufe {0}',
    save_playtime: 'Spielzeit',
    save_delete_title: 'Spielstand löschen',
    confirm_overwrite: '{0} überschreiben?',
    confirm_delete: '{0} wirklich löschen?',
    no_save_slot: 'Kein Spielstand in diesem Slot.',
    saved_slot: '<b>Gespeichert</b> (Slot {0}).',
    save_loaded: '<b>Spielstand geladen.</b>',

    // Einstellungen
    set_volume: 'Gesamtlautstärke',
    set_music: 'Musiklautstärke',
    set_sens: 'Maus-Empfindlichkeit',
    set_shadows: 'Schatten',
    set_quality: 'Auflösungsskala',
    set_language: 'Sprache',
    q_low: 'Niedrig (schnell)',
    q_mid: 'Mittel',
    q_high: 'Hoch',
    set_note: 'Änderungen werden sofort übernommen und gespeichert.',

    // Hilfe
    help_move: 'Bewegen',
    help_cam: 'Kamera (Klick ins Spiel = Maus fangen)',
    help_sprint: 'Sprinten',
    help_dodge: 'Ausweichrolle (kurz unverwundbar)',
    help_attack: 'Angriff',
    help_ability: 'Spezialfähigkeit des Charakters',
    help_interact: 'Interagieren (Sprechen / Portale)',
    help_switch: 'Charakter wechseln (Vessel, II, III, IV)',
    help_quests: 'Questlog',
    help_pause: 'Pause',
    help_zoom: 'Kamera-Zoom',
    help_note1: 'Die goldenen Lichtsäulen markieren dein aktuelles Questziel. Blaue Fragmente sind sammelbare Erinnerungen.<br>Heilung: grüne Kugeln von Gegnern, Stufenaufstiege und besondere Begegnungen.',
    help_note2: 'Inoffizielles Fan-Projekt, inspiriert von Sleep Token. Enthält keine Originalmusik und keine Songtexte – der Soundtrack wird live im Browser synthetisiert. Nur für den privaten Gebrauch.',

    // Questlog / Tracker
    chronicle_done: '<b>Die Chronik ist vollendet</b><span>Freies Spiel – alle Welten stehen offen.</span>',
    free_roam_title: 'Die Chronik ist vollendet',
    free_roam_body: 'Freies Spiel – alle Welten stehen offen.',
    track_take_portal: 'Nimm das Portal „{0}".',
    track_travel: 'Reise nach „{0}" (über das Heiligtum).',
    step_watch: 'Beobachte, was geschieht …',
    step_decide: 'Triff deine Entscheidung.',
    step_rift: 'Durchschreite den Riss',

    // Toasts
    quest_complete: '<b>Quest abgeschlossen:</b> „{0}"<br><span class="xs">+{1} EP</span>',
    quest_new: '<b>Neue Quest:</b> „{0}"',
    chapter_new: '<b>Neues Kapitel:</b> {0} — {1}<br><span class="xs">Reise durch das Portal „{2}" im Heiligtum.</span>',
    level_up: '<b>Stufe {0} erreicht!</b><br><span class="xs">Lebenspunkte aufgefüllt, Schaden erhöht.</span>',
    frag_found: '<b>Erinnerungsfragment</b> gefunden ({0}/30)<br><span class="xs">+{1} EP</span>',
    espera_found: '<b>Espera gefunden</b> ({0}/3)',
    sacrifice_hp: '<span class="xs">Ein Teil deiner Lebenskraft wurde geopfert ({0} max. LP).</span>',
    char_takeover: '<b>{0}</b> übernimmt.<br><span class="xs">{1} — {2}</span>',
    char_unlocked: '<b>Neuer Charakter: {0}</b><br><span class="xs">{1}<br>{2}: {3}</span>',
    ach_unlocked: 'Erfolg freigeschaltet',
    chronicle_end_toast: '<b>Die Chronik ist vollendet.</b><br><span class="xs">Lade einen Spielstand, um andere Enden zu erleben – oder wandere frei durch die Traumlande.</span>',

    secret: '???',
    version_quests: 'Version {0} · {1} Hauptquests',
  },

  en: {
    menu_title: 'Chronicle of the<br>Sleeping God',
    btn_new: 'New Game',
    btn_continue: 'Continue',
    btn_load: 'Load',
    btn_achievements: 'Achievements',
    btn_settings: 'Settings',
    btn_help: 'Controls & Info',
    menu_lang: 'Sprache / Language',
    menu_footer: 'Unofficial fan project · no original music, no lyrics · for private use only',
    loading_text: 'The Dreamlands awaken …',

    // Fan disclaimer before the game starts
    disclaimer_title: 'A Fan Project',
    disclaimer_body: 'This is <b>not an official game</b>. It is a fan-made work and my own <b>personal interpretation</b> of the story surrounding the band <b>Sleep Token</b> and their songs.<br><br>The plot, the characters and the world are my own reading — not the band\'s official one.<br><br>The game contains <b>no original music and no lyrics</b>. The entire soundtrack is generated live in the browser; the song titles serve only as quest names.<br><br>Made out of love for the music. For private use only.<br><br><span class="gold">Worship.</span>',
    disclaimer_continue: 'Begin the Chronicle',

    pause_title: 'Paused',
    btn_resume: 'Resume',
    btn_save: 'Save',
    btn_quests: 'Quest Log (J)',
    btn_menu: 'Main Menu',
    btn_controls: 'Controls',

    death_title: 'DEVOURED BY THE DREAM',
    death_text: 'The Dreamlands do not release you yet.',
    btn_respawn: 'Awaken Again',

    ending_decision_title: 'THE FINAL DECISION',
    ending_decision_sub: 'What becomes of the Sleeping God?',
    end_destroy_t: 'Destroy Sleep',
    end_destroy_s: 'The Dreamlands perish with him. Absolute freedom — at any cost.',
    end_seal_t: 'Seal Sleep',
    end_seal_s: 'The cycle begins anew. Peace for this age.',
    end_unite_t: 'Accept Sleep',
    end_unite_s: 'Unite light and darkness. Mortal and god become one.',
    credits_true: '✦ THE TRUE ENDING ✦',
    menu_title_credits: 'SLEEP TOKEN<br>CHRONICLE OF THE SLEEPING GOD',
    credits_sub1: 'A fan RPG in 6 chapters and 51 quests',
    credits_chapters: 'PROLOGUE — ONE<br>CHAPTER I — TWO<br>CHAPTER II — SUNDOWNING<br>CHAPTER III — THIS PLACE WILL BECOME YOUR TOMB<br>CHAPTER IV — TAKE ME BACK TO EDEN<br>CHAPTER V — EVEN IN ARCADIA<br>FINALE — INFINITE BATHS',
    credits_cast: 'Played as: Vessel · II · III · IV',
    credits_disclaimer: 'Unofficial, non-commercial fan project,<br>inspired by the band Sleep Token.<br>Contains no original music and no lyrics.',
    btn_credits_close: 'Back to the Dreamlands',

    fatal_title: 'The Ritual Has Failed',
    fatal_text: 'Please use a modern browser (Chrome, Firefox, Safari) and launch the game via "Spiel starten.command" or a local web server.',

    dialog_hint: 'Continue with click / spacebar',
    prompt_lock: 'Click the screen to capture the mouse',
    prompt_talk: 'Talk to {0}',
    prompt_enter: 'Enter {0}',
    prompt_sealed: '🔒 {0} – still sealed',
    interact_e: '[E] {0}',

    panel_save: 'Save Game',
    panel_load: 'Load Game',
    panel_achievements: 'Achievements ({0}/{1})',
    panel_quests: 'The Chronicle – Quest Log',
    panel_settings: 'Settings',
    panel_help: 'Controls & Notes',
    slot_auto: 'Autosave',
    slot_n: 'Slot {0}',
    slot_empty: '— empty —',
    completed: 'Completed',
    save_level: 'Level {0}',
    save_playtime: 'Playtime',
    save_delete_title: 'Delete save',
    confirm_overwrite: 'Overwrite {0}?',
    confirm_delete: 'Really delete {0}?',
    no_save_slot: 'No save in this slot.',
    saved_slot: '<b>Saved</b> (slot {0}).',
    save_loaded: '<b>Save loaded.</b>',

    set_volume: 'Master volume',
    set_music: 'Music volume',
    set_sens: 'Mouse sensitivity',
    set_shadows: 'Shadows',
    set_quality: 'Resolution scale',
    set_language: 'Language',
    q_low: 'Low (fast)',
    q_mid: 'Medium',
    q_high: 'High',
    set_note: 'Changes apply immediately and are saved.',

    help_move: 'Move',
    help_cam: 'Camera (click the game to capture the mouse)',
    help_sprint: 'Sprint',
    help_dodge: 'Dodge roll (briefly invulnerable)',
    help_attack: 'Attack',
    help_ability: "Character's special ability",
    help_interact: 'Interact (talk / portals)',
    help_switch: 'Switch character (Vessel, II, III, IV)',
    help_quests: 'Quest log',
    help_pause: 'Pause',
    help_zoom: 'Camera zoom',
    help_note1: 'The golden pillars of light mark your current quest objective. Blue fragments are collectible memories.<br>Healing: green orbs from enemies, level-ups and special encounters.',
    help_note2: 'Unofficial fan project, inspired by Sleep Token. Contains no original music and no lyrics – the soundtrack is synthesized live in the browser. For private use only.',

    chronicle_done: '<b>The Chronicle is complete</b><span>Free roam – all worlds are open.</span>',
    free_roam_title: 'The Chronicle is complete',
    free_roam_body: 'Free roam – all worlds are open.',
    track_take_portal: 'Take the portal "{0}".',
    track_travel: 'Travel to "{0}" (via the Sanctum).',
    step_watch: 'Watch what unfolds …',
    step_decide: 'Make your choice.',
    step_rift: 'Step through the rift',

    quest_complete: '<b>Quest complete:</b> "{0}"<br><span class="xs">+{1} XP</span>',
    quest_new: '<b>New quest:</b> "{0}"',
    chapter_new: '<b>New chapter:</b> {0} — {1}<br><span class="xs">Travel through the portal "{2}" in the Sanctum.</span>',
    level_up: '<b>Level {0} reached!</b><br><span class="xs">Health restored, damage increased.</span>',
    frag_found: '<b>Memory fragment</b> found ({0}/30)<br><span class="xs">+{1} XP</span>',
    espera_found: '<b>Espera found</b> ({0}/3)',
    sacrifice_hp: '<span class="xs">A part of your life force was sacrificed ({0} max HP).</span>',
    char_takeover: '<b>{0}</b> takes over.<br><span class="xs">{1} — {2}</span>',
    char_unlocked: '<b>New character: {0}</b><br><span class="xs">{1}<br>{2}: {3}</span>',
    ach_unlocked: 'Achievement unlocked',
    chronicle_end_toast: '<b>The Chronicle is complete.</b><br><span class="xs">Load a save to experience other endings – or roam the Dreamlands freely.</span>',

    secret: '???',
    version_quests: 'Version {0} · {1} main quests',
  },
};
