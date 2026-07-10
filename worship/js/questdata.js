// ============================================================
//  questdata.js – DIE CHRONIK DES SCHLAFENDEN GOTTES
//  Alle 51 Hauptquests, Dialoge, NPCs, Portale & Sammelobjekte.
//  Zweisprachig: Texte als { de, en }. Song-/Albumnamen bleiben original.
// ============================================================

// ---------- Prolog beim neuen Spiel ----------
export const INTRO_LINES = [
  { who: 'narrator', text: { de: 'Vor unzähligen Zeitaltern herrschte die uralte Gottheit Sleep über die Traumlande.', en: 'Countless ages ago, the ancient deity Sleep ruled over the Dreamlands.' } },
  { who: 'narrator', text: { de: 'Sleep ernährte sich nicht von Blut oder Seelen – sondern von Emotionen. Liebe. Trauer. Hoffnung. Schmerz.', en: 'Sleep fed not on blood or souls — but on emotions. Love. Grief. Hope. Pain.' } },
  { who: 'narrator', text: { de: 'Je stärker die Gefühle eines Menschen wurden, desto stärker wurde Sleep.', en: "The stronger a mortal's feelings grew, the stronger Sleep became." } },
  { who: 'narrator', text: { de: 'Eines Nachts suchte sich der Gott einen Sterblichen als Gefäß. Dieser Sterbliche wurde bekannt als … Vessel.', en: 'One night the god chose a mortal as his vessel. That mortal became known as … Vessel.' } },
  { who: 'narrator', text: { de: 'Vessel glaubte, auserwählt worden zu sein. Doch in Wahrheit war er nur ein Werkzeug.', en: 'Vessel believed he had been chosen. But in truth he was only a tool.' } },
  { who: 'narrator', text: { de: 'Dies ist die Chronik seines Aufstiegs, seines Falls – und seines Kampfes gegen den Schlafenden Gott.', en: 'This is the chronicle of his rise, his fall — and his war against the Sleeping God.' } },
];

// ---------- Enden ----------
export const ENDINGS = {
  destroy: {
    title: { de: 'ENDE I — VERNICHTUNG', en: 'ENDING I — DESTRUCTION' },
    lines: [
      { who: 'narrator', text: { de: 'Vessel reißt das Herz des Gottes aus dem Ozean der Erinnerungen.', en: 'Vessel tears the heart of the god from the ocean of memories.' } },
      { who: 'sleep', text: { de: 'Wenn ich falle … fallen die Traumlande mit mir.', en: 'If I fall … the Dreamlands fall with me.' } },
      { who: 'narrator', text: { de: 'Licht bricht aus den Rissen der Welt. Arcadia, Eden, das Nachtreich – alles verglüht wie Asche im Wind.', en: 'Light bursts from the cracks of the world. Arcadia, Eden, the Night Realm — all of it burns away like ash in the wind.' } },
      { who: 'narrator', text: { de: 'Vessel erwacht in einer Welt ohne Träume. Frei. Und unendlich leer.', en: 'Vessel awakens in a world without dreams. Free. And infinitely empty.' } },
      { who: 'narrator', text: { de: 'Manche Siege fühlen sich an wie Niederlagen.', en: 'Some victories feel like defeats.' } },
    ],
  },
  seal: {
    title: { de: 'ENDE II — VERSIEGELUNG', en: 'ENDING II — THE SEAL' },
    lines: [
      { who: 'narrator', text: { de: 'Vessel spricht die alten Worte rückwärts und schmiedet aus seinen eigenen Erinnerungen ein Siegel.', en: 'Vessel speaks the old words in reverse, forging a seal from his own memories.' } },
      { who: 'sleep', text: { de: 'Du weißt, dass Ketten nicht ewig halten. Jemand wird mich finden. Jemand findet mich immer.', en: 'You know chains do not hold forever. Someone will find me. Someone always does.' } },
      { who: 'narrator', text: { de: 'Der Gott versinkt im stillen Wasser. Die Traumlande atmen auf – für dieses Zeitalter.', en: 'The god sinks into the still water. The Dreamlands breathe again — for this age.' } },
      { who: 'narrator', text: { de: 'Doch irgendwo, in einer fernen Nacht, öffnet ein neuer Träumer sein Herz einer Stimme mit goldenen Augen.', en: 'But somewhere, on a distant night, a new dreamer opens their heart to a voice with golden eyes.' } },
      { who: 'narrator', text: { de: 'Der Kreislauf beginnt von Neuem.', en: 'The cycle begins anew.' } },
    ],
  },
  unite: {
    title: { de: 'ENDE III — VEREINIGUNG · DAS WAHRE ENDE', en: 'ENDING III — UNION · THE TRUE ENDING' },
    lines: [
      { who: 'vessel', text: { de: 'Ich vernichte dich nicht. Ich versiegle dich nicht. Ich erkenne dich an.', en: 'I will not destroy you. I will not seal you. I acknowledge you.' } },
      { who: 'sleep', text: { de: '… Was tust du da?', en: '… What are you doing?' } },
      { who: 'vessel', text: { de: 'Du bist mein Schmerz. Meine Angst vor der Einsamkeit. Du warst nie mein Feind – du warst immer ein Teil von mir.', en: 'You are my pain. My fear of being alone. You were never my enemy — you were always a part of me.' } },
      { who: 'narrator', text: { de: 'Vessel öffnet die Arme. Und zum ersten Mal seit Anbeginn der Zeitalter … zögert ein Gott.', en: 'Vessel opens his arms. And for the first time since the dawn of ages … a god hesitates.' } },
      { who: 'narrator', text: { de: 'Licht und Dunkelheit fließen ineinander. Der Gott löst sich nicht auf – er wird zu dem, was er immer hätte sein sollen: ein Traum. Nicht mehr ein Herrscher.', en: 'Light and darkness flow together. The god does not dissolve — he becomes what he always should have been: a dream. No longer a ruler.' } },
      { who: 'narrator', text: { de: 'Die Traumlande werden frei. Arcadia bleibt bestehen – nicht als Gefängnis, sondern als Ort der Erinnerung.', en: 'The Dreamlands are freed. Arcadia remains — not as a prison, but as a place of remembrance.' } },
      { who: 'narrator', text: { de: 'Und die Zeitalter der Opfergaben enden.', en: 'And the ages of offerings come to an end.' } },
      { who: 'narrator', text: { de: 'THE NIGHT NO LONGER BELONGS TO GOD.', en: 'THE NIGHT NO LONGER BELONGS TO GOD.' } },
    ],
  },
};

// ---------- Gemischte Gegnergruppen pro Zone ----------
export const ZONE_MIX = {
  threshold: ['shadow'],
  memorycity: ['shadow', 'feeder'],
  nightrealm: ['feeder', 'shadow'],
  tomb: ['shadow', 'servant'],
  eden: ['feeder', 'servant'],
  arcadia: ['servant', 'guardian'],
  baths: ['shadow'],
};

// ---------- Frei umherstreifende Gegner ----------
export const ZONE_AMBIENT = {
  threshold:  { level: 1,  packs: [[-30, 25], [35, 10], [-15, -35]] },
  memorycity: { level: 3,  packs: [[-35, -20], [30, 35], [45, -15]] },
  nightrealm: { level: 6,  packs: [[-40, 20], [25, -38], [48, 22]] },
  tomb:       { level: 10, packs: [[-30, 30], [38, -22], [-45, -38]] },
  eden:       { level: 14, packs: [[-35, 25], [40, 18], [22, -40]] },
  arcadia:    { level: 18, packs: [[-38, -25], [42, 28], [-20, 42]] },
};

// ---------- Erinnerungsfragmente (5 je Zone = 30) ----------
export const ZONE_FRAGMENTS = {
  threshold:  [[-45, -20], [50, 30], [20, -48], [-58, 35], [5, 68]],
  memorycity: [[-50, 28], [55, -35], [12, 58], [-30, -52], [62, 8]],
  nightrealm: [[-55, -30], [48, 44], [-25, 55], [30, -55], [65, -5]],
  tomb:       [[-48, 18], [52, -42], [-20, -58], [25, 60], [-65, -12]],
  eden:       [[-42, -38], [58, 22], [-58, 30], [18, 52], [40, -50]],
  arcadia:    [[-52, 35], [45, -45], [-35, -55], [60, 15], [-15, 60]],
};

// ---------- Feste NPCs pro Zone ----------
export const ZONE_NPCS = {
  sanctum: [
    {
      id: 'chronist', kind: 'chronist', name: { de: 'Der Chronist', en: 'The Chronicler' }, pos: [10, 26], face: 2.6,
      lines: [
        { who: 'chronist', text: { de: 'Willkommen im Heiligtum, Gefäß. Ich schreibe nieder, was die Träumenden vergessen.', en: 'Welcome to the Sanctum, Vessel. I record what the dreaming forget.' } },
        { who: 'chronist', text: { de: 'Die Portale führen in die Kapitel deiner eigenen Geschichte. Nur was du durchlebt hast, steht dir offen.', en: 'The portals lead into the chapters of your own story. Only what you have lived through stands open to you.' } },
        { who: 'chronist', text: { de: 'Sammle die blauen Erinnerungsfragmente, die in den Welten verstreut sind. Sie stärken deine Seele.', en: 'Gather the blue memory fragments scattered through the worlds. They strengthen your soul.' } },
        { who: 'chronist', text: { de: 'Und vergiss nie: Mit den Tasten 1 bis 4 rufst du jene, die mit dir gehen. Jeder von ihnen trägt eine andere Last.', en: 'And never forget: with keys 1 through 4 you call those who walk with you. Each of them carries a different burden.' } },
      ],
    },
    {
      id: 'band-two', kind: 'bandnpc2', name: { de: 'II', en: 'II' }, pos: [-12, 22], face: 1.0, hideIf: 'unlocked_two',
      lines: [
        { who: 'two', text: { de: '…', en: '…' } },
        { who: 'narrator', text: { de: 'Die vermummte Gestalt trommelt lautlos einen Rhythmus auf ihren Unterarm. Sie wartet auf etwas.', en: 'The hooded figure silently drums a rhythm on its forearm. It is waiting for something.' } },
      ],
    },
    {
      id: 'band-three', kind: 'bandnpc3', name: { de: 'III', en: 'III' }, pos: [-16, 26], face: 1.0, hideIf: 'unlocked_three',
      lines: [
        { who: 'three', text: { de: '…', en: '…' } },
        { who: 'narrator', text: { de: 'Tiefe, langsame Schwingungen gehen von der Gestalt aus. Als würde der Boden selbst atmen.', en: 'Deep, slow vibrations radiate from the figure. As if the ground itself were breathing.' } },
      ],
    },
    {
      id: 'band-four', kind: 'bandnpc4', name: { de: 'IV', en: 'IV' }, pos: [-20, 30], face: 1.0, hideIf: 'unlocked_four',
      lines: [
        { who: 'four', text: { de: '…', en: '…' } },
        { who: 'narrator', text: { de: 'Die Gestalt fährt mit den Fingern durch die Luft, als würde sie unsichtbare Saiten zupfen.', en: 'The figure runs its fingers through the air as if plucking invisible strings.' } },
      ],
    },
  ],
  nightrealm: [
    {
      id: 'espera-1', kind: 'espera', name: { de: '???', en: '???' }, pos: [-58, -44], secretFlag: 'espera1',
      lines: [
        { who: 'espera', text: { de: 'Du hörst uns, wenn die Sonne fällt. Wir sind die Stimmen zwischen seinen Worten.', en: 'You hear us when the sun falls. We are the voices between his words.' } },
        { who: 'espera', text: { de: 'Drei von uns wandern durch deine Erinnerung. Finde uns alle – und wir singen für dich, nicht für ihn.', en: 'Three of us wander through your memory. Find us all — and we will sing for you, not for him.' } },
      ],
    },
  ],
  tomb: [
    {
      id: 'espera-2', kind: 'espera', name: { de: '???', en: '???' }, pos: [54, 42], secretFlag: 'espera2',
      lines: [
        { who: 'espera', text: { de: 'Auch unter Wasser verklingt ein Lied nicht. Es wartet nur auf jemanden, der wieder auftaucht.', en: 'Even underwater a song does not fade. It only waits for someone to surface again.' } },
      ],
    },
  ],
  eden: [
    {
      id: 'espera-3', kind: 'espera', name: { de: '???', en: '???' }, pos: [-52, 48], secretFlag: 'espera3',
      lines: [
        { who: 'espera', text: { de: 'Im Garten, in dem alles begann, endet auch jedes Lied. Du hast uns alle gefunden.', en: 'In the garden where it all began, every song also ends. You have found us all.' } },
        { who: 'espera', text: { de: 'Wenn die letzte Stunde kommt, erinnere dich: Nicht der Zorn hat dich so weit getragen. Die Liebe war es.', en: 'When the final hour comes, remember: it was not wrath that carried you this far. It was love.' } },
      ],
    },
  ],
};

// ---------- Portale ----------
export const ZONE_PORTALS = {
  sanctum: [
    { zone: 'threshold',  pos: [-28.6, -16.5], label: { de: 'Die Schwelle', en: 'The Threshold' },         color: 0x8a6ad8, chapter: 'one' },
    { zone: 'memorycity', pos: [-28.6, 16.5],  label: { de: 'Die Erinnerungsstadt', en: 'The City of Memory' }, color: 0xe8a050, chapter: 'two' },
    { zone: 'nightrealm', pos: [0, -33],       label: { de: 'Das Nachtreich', en: 'The Night Realm' },       color: 0xff7a30, chapter: 'sundowning' },
    { zone: 'tomb',       pos: [28.6, -16.5],  label: { de: 'Die Grabstätten', en: 'The Tombs' },      color: 0x40c8d8, chapter: 'tomb' },
    { zone: 'eden',       pos: [28.6, 16.5],   label: { de: 'Eden', en: 'Eden' },                 color: 0x6ad84a, chapter: 'eden' },
    { zone: 'arcadia',    pos: [0, 33],        label: { de: 'Arcadia', en: 'Arcadia' },              color: 0xe8e0c8, chapter: 'arcadia' },
  ],
  threshold:  [{ zone: 'sanctum', pos: [0, 64], label: { de: 'Heiligtum', en: 'Sanctum' }, color: 0xe8b842 }],
  memorycity: [{ zone: 'sanctum', pos: [0, 64], label: { de: 'Heiligtum', en: 'Sanctum' }, color: 0xe8b842 }],
  nightrealm: [{ zone: 'sanctum', pos: [0, 64], label: { de: 'Heiligtum', en: 'Sanctum' }, color: 0xe8b842 }],
  tomb:       [{ zone: 'sanctum', pos: [0, 64], label: { de: 'Heiligtum', en: 'Sanctum' }, color: 0xe8b842 }],
  eden:       [{ zone: 'sanctum', pos: [0, 64], label: { de: 'Heiligtum', en: 'Sanctum' }, color: 0xe8b842 }],
  arcadia:    [{ zone: 'sanctum', pos: [0, 64], label: { de: 'Heiligtum', en: 'Sanctum' }, color: 0xe8b842 }],
  baths:      [],
};

// ============================================================
//  DIE 51 HAUPTQUESTS
//  Anzeigename jeder Quest = Original-Songtitel (Feld `song`).
// ============================================================
export const CHAPTERS = [

  // ==========================================================
  //  PROLOG — ONE
  // ==========================================================
  {
    id: 'one', title: { de: 'PROLOG', en: 'PROLOGUE' }, sub: 'ONE', zone: 'threshold', level: 1,
    ach: 'dreamer', unlockChar: 'two',
    outro: [
      { who: 'narrator', text: { de: 'Der erste Pakt ist geschlossen. Die Schwelle liegt hinter Vessel – und etwas in ihm hat sich für immer verändert.', en: 'The first pact is sealed. The Threshold lies behind Vessel — and something in him has changed forever.' } },
      { who: 'sleep', text: { de: 'Ich schenke dir einen Begleiter, mein Gefäß. Einen Herzschlag. Du wirst ihn II nennen.', en: 'I grant you a companion, my Vessel. A heartbeat. You shall call him II.' } },
      { who: 'narrator', text: { de: 'II ist nun spielbar! Wechsle die Charaktere mit den Tasten 1 und 2.', en: 'II is now playable! Switch characters with keys 1 and 2.' } },
    ],
    quests: [
      {
        id: 'thread-the-needle', song: 'Thread The Needle',
        desc: { de: 'Eine Stimme ruft Vessel in die Träume. Sie verspricht ewige Bedeutung – und fordert nur ein offenes Herz.', en: 'A voice calls Vessel into the dreams. It promises eternal meaning — and asks only for an open heart.' },
        xp: 130, ach: 'first-pact',
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Vessel erwacht an einem Ort, der kein Ort ist. Über ihm öffnen sich zwei goldene Augen wie Monde.', en: 'Vessel awakens in a place that is no place. Above him, two golden eyes open like moons.' } },
            { who: 'sleep', text: { de: 'Ich habe dich über tausend Leben hinweg gesucht. Du fühlst tiefer als alle anderen.', en: 'I have sought you across a thousand lives. You feel deeper than all the others.' } },
            { who: 'sleep', text: { de: 'Komm zu mir, kleines Licht. Folge meiner Stimme.', en: 'Come to me, little light. Follow my voice.' } },
          ]},
          { type: 'goto', pos: [0, 8], label: { de: 'Folge der Stimme zum Altar', en: 'Follow the voice to the altar' } },
          { type: 'talk', npc: 'sleep-vision', label: { de: 'Tritt vor die dunkle Gestalt', en: 'Step before the dark figure' },
            spawn: { kind: 'sleepgod', name: { de: 'Sleep', en: 'Sleep' }, pos: [0, -5], scale: 1.4, labelColor: '#e8b842' },
            removeAfter: true,
            lines: [
              { who: 'sleep', text: { de: 'Öffne dein Herz – und ich werde dich unsterblich machen. Deine Lieder werden Zeitalter überdauern.', en: 'Open your heart — and I will make you immortal. Your songs will outlast the ages.' } },
              { who: 'vessel', text: { de: 'Wer … bist du?', en: 'Who … are you?' } },
              { who: 'sleep', text: { de: 'Ich bin der, der dich niemals verlassen wird. Nun sprich: Nimmst du an?', en: 'I am the one who will never leave you. Now speak: do you accept?' }, choices: [
                { text: { de: 'Ich nehme an. (Der erste Pakt)', en: 'I accept. (The first pact)' }, set: { pact: 1 } },
                { text: { de: 'Ich habe keine Wahl, nicht wahr? … Ich nehme an.', en: 'I have no choice, do I? … I accept.' }, set: { pact: 1, doubt: 1 } },
              ]},
            ]},
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Goldenes Feuer fließt durch Vessels Adern. Der Pakt brennt sich in seine Seele. Doch etwas Dunkles regt sich am Rand der Schwelle …', en: "Golden fire flows through Vessel's veins. The pact burns itself into his soul. But something dark stirs at the edge of the Threshold …" } },
          ]},
          { type: 'kill', enemy: 'shadow', count: 3, center: [0, 4], radius: 10, label: { de: 'Besiege die Zweifel', en: 'Defeat the doubts' } },
        ],
      },
      {
        id: 'fields-of-elation', song: 'Fields Of Elation',
        desc: { de: 'Sleep zeigt Vessel eine perfekte Traumwelt: ohne Leid, ohne Tod, ohne Verlust.', en: 'Sleep shows Vessel a perfect dream world: without suffering, without death, without loss.' },
        xp: 130,
        steps: [
          { type: 'scene', lines: [
            { who: 'sleep', text: { de: 'Sieh, was ich für dich erschaffen habe. Eine Welt ohne Leid. Ohne Tod. Ohne Verlust.', en: 'Behold what I have made for you. A world without suffering. Without death. Without loss.' } },
            { who: 'narrator', text: { de: 'Zwischen den Monolithen flammen Lichter auf – Träume, rein wie frisch gefallener Schnee.', en: 'Lights flare between the monoliths — dreams, pure as freshly fallen snow.' } },
          ]},
          { type: 'goto', pos: [-30, -8], label: { de: 'Betritt die Lichtung der Träume', en: 'Enter the clearing of dreams' } },
          { type: 'collect', count: 3, positions: [[-36, -14], [-26, -18], [-32, 0]], label: { de: 'Sammle die leuchtenden Träume', en: 'Gather the glowing dreams' } },
          { type: 'talk', npc: 'sleep-vision2', label: { de: 'Kehre zur Gestalt zurück', en: 'Return to the figure' },
            spawn: { kind: 'sleepgod', name: { de: 'Sleep', en: 'Sleep' }, pos: [-30, -10], scale: 1.4, labelColor: '#e8b842' },
            removeAfter: true,
            lines: [
              { who: 'vessel', text: { de: 'Es ist … wunderschön. Ich habe nie etwas Schöneres gesehen.', en: 'It is … beautiful. I have never seen anything more beautiful.' } },
              { who: 'sleep', text: { de: 'Und es gehört dir. Für immer. Solange du bei mir bleibst.', en: 'And it belongs to you. Forever. As long as you stay with me.' } },
              { who: 'narrator', text: { de: 'Vessel verliebt sich in diese Vision. Er beginnt, Sleep als göttliche Erlösung zu betrachten.', en: 'Vessel falls in love with this vision. He begins to see Sleep as divine salvation.' } },
            ]},
        ],
      },
      {
        id: 'when-the-bough-breaks', song: 'When The Bough Breaks',
        desc: { de: 'Die ersten Risse erscheinen. Die Traumwelt ist künstlich – doch Vessel kann sich nicht mehr lösen.', en: 'The first cracks appear. The dream world is artificial — but Vessel can no longer pull free.' },
        xp: 200,
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'In einer Nacht ohne Sterne hört Vessel ein Geräusch wie brechendes Glas. Die perfekte Welt … bekommt Risse.', en: 'On a starless night Vessel hears a sound like breaking glass. The perfect world … is cracking.' } },
            { who: 'vessel', text: { de: 'Das Licht – es flackert. Das ist nicht echt. Nichts davon ist echt!', en: 'The light — it flickers. This is not real. None of it is real!' } },
            { who: 'sleep', text: { de: 'Echt ist, was du fühlst. Und du fühlst doch etwas, oder?', en: 'Real is what you feel. And you do feel something, do you not?' } },
          ]},
          { type: 'goto', pos: [28, -22], label: { de: 'Untersuche die Risse in der Traumwelt', en: 'Investigate the cracks in the dream' } },
          { type: 'kill', enemy: 'shadow', count: 4, center: [28, -22], radius: 11, label: { de: 'Besiege die kriechenden Zweifel', en: 'Defeat the crawling doubts' } },
          { type: 'boss', label: { de: 'Bezwinge den Riss-Wächter', en: 'Defeat the Rift Warden' }, pos: [34, -32],
            def: { kind: 'riftwarden', name: { de: 'Der Riss-Wächter', en: 'The Rift Warden' }, hp: 340, dmg: 11, speed: 3.2, scale: 1.5, level: 2,
              attacks: ['melee', 'slam'], phases: [{ below: 0.5, add: ['volley'] }] } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Als der Wächter zerfällt, sieht Vessel zum ersten Mal hinter den Vorhang.', en: 'As the warden crumbles, Vessel sees behind the curtain for the first time.' } },
            { who: 'vessel', text: { de: 'Sleep ist nicht der Retter … Sleep ist ein Parasit.', en: 'Sleep is not the savior … Sleep is a parasite.' } },
            { who: 'narrator', text: { de: 'Doch die Wurzeln des Gottes sitzen bereits tief in seinem Geist. Es gibt kein Zurück. Nur ein Hindurch.', en: "But the god's roots are already deep in his mind. There is no going back. Only through." } },
          ]},
        ],
      },
    ],
  },

  // ==========================================================
  //  KAPITEL I — TWO
  // ==========================================================
  {
    id: 'two', title: { de: 'KAPITEL I', en: 'CHAPTER I' }, sub: 'TWO', zone: 'memorycity', level: 3,
    ach: 'pilgrim', unlockChar: 'three',
    outro: [
      { who: 'narrator', text: { de: 'Die Stadt der Erinnerungen versinkt im Abendrot. Vessel hat geliebt – und Sleep hat es gesehen.', en: 'The city of memories sinks into the sunset glow. Vessel has loved — and Sleep has seen it.' } },
      { who: 'sleep', text: { de: 'Du brauchst ein Fundament, das nicht zerbricht, mein Gefäß. Ich gebe dir III.', en: 'You need a foundation that will not break, my Vessel. I give you III.' } },
      { who: 'narrator', text: { de: 'III ist nun spielbar! (Taste 3)', en: 'III is now playable! (Key 3)' } },
    ],
    quests: [
      {
        id: 'calcutta', song: 'Calcutta',
        desc: { de: 'In der Stadt der Erinnerungen begegnet Vessel einer Frau. Zum ersten Mal empfindet er echte Liebe – keine künstliche.', en: 'In the city of memories Vessel meets a woman. For the first time he feels real love — not the artificial kind.' },
        xp: 170, ach: 'true-love',
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Jahre vergehen. Die Verbindung zwischen Vessel und Sleep wird tiefer. Doch in einer staubigen Stadt aus Sandstein geschieht etwas, das nicht im Plan des Gottes stand.', en: 'Years pass. The bond between Vessel and Sleep deepens. But in a dusty city of sandstone, something happens that was not in the god’s plan.' } },
          ]},
          { type: 'goto', pos: [-18, 10], label: { de: 'Geh zum Markt der Erinnerungen', en: 'Go to the market of memories' } },
          { type: 'talk', npc: 'woman-calcutta', label: { de: 'Sprich mit der Frau am Brunnen', en: 'Speak with the woman at the fountain' },
            spawn: { kind: 'woman', name: { de: 'Die Geliebte', en: 'The Beloved' }, pos: [-18, 5], labelColor: '#ffd9ec' },
            lines: [
              { who: 'woman', text: { de: 'Du siehst aus, als hättest du seit Jahren nicht mehr wirklich geschlafen. Setz dich. Der Abend ist warm.', en: "You look as though you haven't truly slept in years. Sit. The evening is warm." } },
              { who: 'vessel', text: { de: 'Ich … kenne dich nicht. Aber es fühlt sich an, als hätte ich dich schon immer gekannt.', en: "I … don't know you. But it feels as though I have always known you." } },
              { who: 'narrator', text: { de: 'Zum ersten Mal empfindet Vessel echte Liebe. Nicht die künstliche Liebe, die Sleep erschaffen hat.', en: 'For the first time Vessel feels true love. Not the artificial love Sleep created.' } },
              { who: 'sleep', text: { de: '(aus weiter Ferne, kalt) … Was. Ist. Das.', en: '(from far away, cold) … What. Is. This.' } },
            ]},
          { type: 'kill', enemy: 'shadow', count: 4, center: [-24, 14], radius: 12, label: { de: 'Vertreibe die Schatten, die ihr folgen', en: 'Drive off the shadows that follow her' } },
          { type: 'scene', lines: [
            { who: 'sleep', text: { de: 'Ich habe dir eine perfekte Welt gebaut – und du wählst … das? Ein sterbliches Herz, das in achtzig Jahren still steht?', en: 'I built you a perfect world — and you choose … that? A mortal heart that will stop in eighty years?' } },
            { who: 'narrator', text: { de: 'Sleep wird eifersüchtig.', en: 'Sleep grows jealous.' } },
          ]},
        ],
      },
      {
        id: 'nazareth', song: 'Nazareth',
        desc: { de: 'Sleep beginnt, Vessels Erinnerungen zu vergiften. Wahrheit und Lüge verschwimmen.', en: "Sleep begins to poison Vessel's memories. Truth and lie blur together." },
        xp: 170,
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Es beginnt mit Kleinigkeiten. Ein Name, der nicht mehr einfällt. Ein Gesicht, das plötzlich fremd wirkt.', en: 'It starts with little things. A name that will not come. A face that suddenly seems strange.' } },
            { who: 'sleep', text: { de: 'Erinnerst du dich wirklich an diesen Tag? Oder erinnerst du dich nur daran, wie ICH ihn dir erzählt habe?', en: 'Do you truly remember that day? Or do you only remember how I told it to you?' } },
          ]},
          { type: 'collect', count: 3, positions: [[20, 24], [34, 8], [12, 40]], label: { de: 'Berge die vergifteten Erinnerungen', en: 'Recover the poisoned memories' } },
          { type: 'kill', enemy: 'feeder', count: 5, center: [26, 20], radius: 13, label: { de: 'Erschlage die Traumfresser', en: 'Slay the dream-feeders' } },
          { type: 'talk', npc: 'woman-calcutta', label: { de: 'Such die Geliebte', en: 'Seek the Beloved' },
            spawn: { kind: 'woman', name: { de: 'Die Geliebte', en: 'The Beloved' }, pos: [-16, 4], labelColor: '#ffd9ec' },
            lines: [
              { who: 'woman', text: { de: 'Gestern hast du mich mit einem anderen Namen angesprochen. Und deine Augen … waren golden. Was geschieht mit dir?', en: 'Yesterday you called me by another name. And your eyes … were golden. What is happening to you?' } },
              { who: 'vessel', text: { de: 'Ich weiß nicht mehr, welche meiner Erinnerungen mir gehören.', en: 'I no longer know which of my memories are mine.' } },
              { who: 'narrator', text: { de: 'Freunde werden zu Feinden. Schöne Erinnerungen werden vergiftet. Sleep webt Lügen in alles, was Vessel liebt.', en: 'Friends become enemies. Beautiful memories are poisoned. Sleep weaves lies into everything Vessel loves.' } },
            ]},
        ],
      },
      {
        id: 'jericho', song: 'Jericho',
        desc: { de: 'Vessel klammert sich an die echte Liebe. Doch Sleep flüstert – und seine Mauern fallen wie die von Jericho.', en: 'Vessel clings to true love. But Sleep whispers — and his walls fall like those of Jericho.' },
        xp: 240,
        steps: [
          { type: 'scene', lines: [
            { who: 'sleep', text: { de: 'Niemand wird dich jemals so verstehen wie ich. Sie sieht dein Gesicht. Ich sehe deine Seele.', en: 'No one will ever understand you as I do. She sees your face. I see your soul.' } },
            { who: 'narrator', text: { de: 'Vessel beginnt, sich zu isolieren. Die Stadt um ihn herum wird stiller. Leerer. Dunkler.', en: 'Vessel begins to isolate himself. The city around him grows quieter. Emptier. Darker.' } },
          ]},
          { type: 'goto', pos: [25, -36], label: { de: 'Steig zum zerbrochenen Turm hinauf', en: 'Climb to the broken tower' } },
          { type: 'boss', label: { de: 'Stelle dich dem Eifersüchtigen Schatten', en: 'Face the Jealous Shadow' }, pos: [30, -38],
            def: { kind: 'jealous', name: { de: 'Der Eifersüchtige Schatten', en: 'The Jealous Shadow' }, hp: 520, dmg: 13, speed: 4.0, scale: 2.4, level: 4,
              attacks: ['melee', 'charge'], phases: [{ below: 0.6, add: ['summon'] }], summonKind: 'shadow' } },
          { type: 'talk', npc: 'woman-jericho', label: { de: 'Triff die Geliebte ein letztes Mal', en: 'Meet the Beloved one last time' },
            spawn: { kind: 'woman', name: { de: 'Die Geliebte', en: 'The Beloved' }, pos: [20, -28], labelColor: '#ffd9ec' },
            removeAfter: true,
            lines: [
              { who: 'woman', text: { de: 'Ich kann gegen vieles kämpfen, Vessel. Aber nicht gegen etwas, das in deinem Kopf wohnt. Sag mir, was ich tun soll.', en: 'I can fight many things, Vessel. But not something that lives in your head. Tell me what to do.' } },
              { who: 'vessel', text: { de: '…', en: '…' }, choices: [
                { text: { de: '„Bleib bei mir. Bitte. Du bist das Einzige, was echt ist."', en: '"Stay with me. Please. You are the only thing that is real."' }, set: { love: 1 } },
                { text: { de: '„Geh fort von mir. Ich bin nicht mehr sicher."', en: '"Go away from me. I am no longer safe."' }, set: { isolated: 1 } },
              ]},
              { who: 'narrator', text: { de: 'Was auch immer Vessel sagt – die Stimme in seinem Inneren spricht lauter. Die Mauern fallen.', en: 'Whatever Vessel says — the voice within speaks louder. The walls fall.' } },
            ]},
        ],
      },
    ],
  },

  // ==========================================================
  //  KAPITEL II — SUNDOWNING
  // ==========================================================
  {
    id: 'sundowning', title: { de: 'KAPITEL II', en: 'CHAPTER II' }, sub: 'SUNDOWNING', zone: 'nightrealm', level: 6,
    ach: 'night-not-god', unlockChar: 'four',
    outro: [
      { who: 'narrator', text: { de: 'Die Sonne ist untergegangen und nicht wieder aufgegangen. Vessel hat alles verloren – und Sleep hat gewonnen. Vorerst.', en: 'The sun has set and not risen again. Vessel has lost everything — and Sleep has won. For now.' } },
      { who: 'sleep', text: { de: 'Ein letztes Geschenk, mein zerbrochenes Gefäß: IV. Der Sturm. Nutze ihn gut.', en: 'One last gift, my broken Vessel: IV. The storm. Use him well.' } },
      { who: 'narrator', text: { de: 'IV ist nun spielbar! (Taste 4) – Das Ritual ist vollzählig.', en: 'IV is now playable! (Key 4) — The ritual is complete.' } },
    ],
    quests: [
      {
        id: 'tnbtg', song: 'The Night Does Not Belong To God',
        desc: { de: 'Sleep übernimmt die Kontrolle über die Nächte. Jedes Einschlafen wird zu einer Reise in sein Reich.', en: 'Sleep seizes control of the nights. Every time you fall asleep becomes a journey into his realm.' },
        xp: 200,
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Die Sonne geht unter. Dies ist der Beginn von Vessels eigentlichem Untergang.', en: "The sun goes down. This is the beginning of Vessel's true downfall." } },
            { who: 'sleep', text: { de: 'Der Tag mag den anderen Göttern gehören. Aber die Nacht … die Nacht gehört mir.', en: 'The day may belong to the other gods. But the night … the night belongs to me.' } },
          ]},
          { type: 'goto', pos: [-25, -15], label: { de: 'Folge dem ewigen Sonnenuntergang', en: 'Follow the eternal sunset' } },
          { type: 'kill', enemy: 'shadow', count: 5, center: [-25, -15], radius: 12, label: { de: 'Besiege die Geschöpfe der Nacht', en: 'Defeat the creatures of the night' } },
        ],
      },
      {
        id: 'the-offering', song: 'The Offering',
        desc: { de: 'Vessel opfert freiwillig Teile seiner Identität. Er glaubt immer noch, Sleep könne ihn retten.', en: 'Vessel willingly sacrifices parts of his identity. He still believes Sleep can save him.' },
        xp: 200,
        steps: [
          { type: 'collect', count: 3, positions: [[15, -28], [28, -18], [20, -42]], label: { de: 'Sammle die Teile deiner selbst', en: 'Gather the pieces of yourself' } },
          { type: 'talk', npc: 'altar-sleep', label: { de: 'Lege die Opfergabe auf den Altar', en: 'Lay the offering on the altar' },
            spawn: { kind: 'sleepgod', name: { de: 'Sleep', en: 'Sleep' }, pos: [22, -34], scale: 1.5, labelColor: '#e8b842' },
            removeAfter: true,
            lines: [
              { who: 'sleep', text: { de: 'Leg es nieder. Deinen Stolz. Deinen Namen. Dein altes Leben. Ich gebe dir dafür Ewigkeit.', en: 'Lay it down. Your pride. Your name. Your old life. In return I give you eternity.' } },
              { who: 'vessel', text: { de: 'Und wenn nichts von mir übrig bleibt?', en: 'And if nothing of me remains?' }, choices: [
                { text: { de: 'Die Opfergabe niederlegen.', en: 'Lay down the offering.' }, set: { surrendered: 1 } },
                { text: { de: 'Zögern – und sie dann doch niederlegen.', en: 'Hesitate — then lay it down anyway.' }, set: { surrendered: 1, doubt: 1 } },
              ]},
              { who: 'sleep', text: { de: 'Dann bleibt das Beste von dir: das, was MIR gehört.', en: 'Then the best of you remains: that which belongs to ME.' } },
            ]},
        ],
      },
      {
        id: 'levitate', song: 'Levitate',
        desc: { de: 'Die Geliebte entfernt sich immer weiter. Vessel verliert den Halt zur Realität – er beginnt zu schweben.', en: 'The Beloved drifts ever further away. Vessel loses his grip on reality — he begins to float.' },
        xp: 200,
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Vessel träumt, dass er schwebt. Unter ihm wird die Welt klein: die Stadt, der Brunnen, die Frau. Alles entfernt sich.', en: 'Vessel dreams that he is floating. Below him the world grows small: the city, the fountain, the woman. Everything recedes.' } },
          ]},
          { type: 'goto', pos: [-38, 22], label: { de: 'Folge dem Pfad der Schwebenden (1/3)', en: 'Follow the path of the floating (1/3)' } },
          { type: 'goto', pos: [-20, 38], label: { de: 'Folge dem Pfad der Schwebenden (2/3)', en: 'Follow the path of the floating (2/3)' } },
          { type: 'goto', pos: [5, 30], label: { de: 'Folge dem Pfad der Schwebenden (3/3)', en: 'Follow the path of the floating (3/3)' } },
          { type: 'scene', lines: [
            { who: 'woman', text: { de: '(ein Echo, weit entfernt) Vessel? Wo bist du? Ich kann dich nicht mehr erreichen …', en: '(an echo, far away) Vessel? Where are you? I can no longer reach you …' } },
            { who: 'narrator', text: { de: 'Er greift nach ihrer Stimme. Doch seine Hände fassen nur Nachtluft.', en: 'He reaches for her voice. But his hands grasp only night air.' } },
          ]},
        ],
      },
      {
        id: 'dark-signs', song: 'Dark Signs',
        desc: { de: 'Sleep markiert Vessels Seele. Die ersten dauerhaften Flüche brennen sich ein.', en: "Sleep marks Vessel's soul. The first permanent curses burn themselves in." },
        xp: 200,
        steps: [
          { type: 'kill', enemy: 'feeder', count: 6, center: [30, 25], radius: 14, label: { de: 'Zerreiße die Vorboten', en: 'Tear apart the harbingers' } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Als der letzte Vorbote fällt, brennt Schmerz durch Vessels Haut. Schwarze Linien winden sich über seine Arme – Zeichen in einer Sprache, die älter ist als Worte.', en: "As the last harbinger falls, pain burns through Vessel's skin. Black lines coil across his arms — signs in a language older than words." } },
            { who: 'sleep', text: { de: 'Damit jeder Gott und jeder Dämon weiß, wem du gehörst.', en: 'So that every god and every demon knows whom you belong to.' } },
            { who: 'narrator', text: { de: 'Vessel trägt nun das Mal des Schlafenden Gottes. Es wird nie wieder verblassen.', en: 'Vessel now bears the mark of the Sleeping God. It will never fade again.' } },
          ]},
        ],
      },
      {
        id: 'higher', song: 'Higher',
        desc: { de: 'Die Besessenheit wächst. Nicht nur Liebe: Sucht. Abhängigkeit. Kontrolle.', en: 'The obsession grows. Not just love: addiction. Dependence. Control.' },
        xp: 200,
        steps: [
          { type: 'scene', lines: [
            { who: 'vessel', text: { de: 'Nur noch einmal seine Stimme hören. Nur noch ein Traum. Nur noch … einer.', en: 'Just hear his voice once more. Just one more dream. Just … one.' } },
            { who: 'narrator', text: { de: 'Es ist keine Liebe mehr. Es ist Hunger.', en: 'It is no longer love. It is hunger.' } },
          ]},
          { type: 'kill', enemy: 'feeder', count: 4, center: [-30, -35], radius: 12, label: { de: 'Stille den Hunger (Traumfresser)', en: 'Quiet the hunger (dream-feeders)' } },
          { type: 'kill', enemy: 'shadow', count: 4, center: [-42, -25], radius: 12, label: { de: 'Stille den Hunger (Schatten)', en: 'Quiet the hunger (shadows)' } },
        ],
      },
      {
        id: 'take-aim', song: 'Take Aim',
        desc: { de: 'Vessel kämpft gegen imaginäre Feinde. Sleep lenkt seinen Zorn – auf alles und jeden.', en: 'Vessel fights imaginary enemies. Sleep directs his rage — at everyone and everything.' },
        xp: 200,
        steps: [
          { type: 'scene', lines: [
            { who: 'sleep', text: { de: 'Sie alle lachen über dich. Die Stadt. Die Freunde. Sogar SIE. Take aim, mein Gefäß.', en: 'They all laugh at you. The city. The friends. Even SHE. Take aim, my Vessel.' } },
            { who: 'narrator', text: { de: 'Aus dem Nebel formt Sleep Gegner, die es nie gab – mit den Gesichtern von Menschen, die Vessel einst liebte.', en: 'From the mist Sleep forms enemies that never existed — with the faces of people Vessel once loved.' } },
          ]},
          { type: 'kill', enemy: 'servant', count: 5, center: [40, -10], radius: 14, label: { de: 'Besiege die eingebildeten Feinde', en: 'Defeat the imagined enemies' } },
        ],
      },
      {
        id: 'give', song: 'Give',
        desc: { de: 'Sleep verspricht erneut Erlösung. Vessel gibt immer mehr von sich auf.', en: 'Sleep promises salvation once more. Vessel gives up more and more of himself.' },
        xp: 200,
        steps: [
          { type: 'collect', count: 4, positions: [[-15, 45], [10, 52], [-5, 38], [22, 44]], label: { de: 'Sammle, was du noch zu geben hast', en: 'Gather what you still have to give' } },
          { type: 'talk', npc: 'give-altar', label: { de: 'Bring die Gaben zum Schrein', en: 'Bring the offerings to the shrine' },
            spawn: { kind: 'sleepgod', name: { de: 'Sleep', en: 'Sleep' }, pos: [2, 46], scale: 1.5, labelColor: '#e8b842' },
            removeAfter: true,
            lines: [
              { who: 'sleep', text: { de: 'Gib. Und ich nehme. So einfach ist Erlösung.', en: 'Give. And I take. Salvation is that simple.' } },
              { who: 'vessel', text: { de: 'Wie viel noch?', en: 'How much more?' }, choices: [
                { text: { de: 'Alles geben.', en: 'Give everything.' }, set: { surrendered: 1 } },
                { text: { de: 'Einen letzten Funken zurückhalten.', en: 'Hold back one last spark.' }, set: { spark: 1 } },
              ]},
            ]},
        ],
      },
      {
        id: 'gods', song: 'Gods',
        desc: { de: 'Vessel erkennt die wahre Macht seines Gegners: Sleep ist kein Traum. Sleep ist eine Gottheit.', en: 'Vessel realizes the true power of his foe: Sleep is no dream. Sleep is a deity.' },
        xp: 280,
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'In dieser Nacht zeigt sich Sleep nicht als Stimme. Nicht als Schatten. Sondern in seiner wahren Gestalt – und der Himmel kniet nieder.', en: 'That night Sleep appears not as a voice. Not as a shadow. But in his true form — and the heavens kneel.' } },
            { who: 'vessel', text: { de: 'Du bist kein Traum. Du warst nie ein Traum.', en: 'You are no dream. You were never a dream.' } },
          ]},
          { type: 'boss', label: { de: 'Überlebe den Avatar des Schlafs', en: 'Survive the Avatar of Sleep' }, pos: [0, -42],
            def: { kind: 'avatar', name: { de: 'Avatar des Schlafs', en: 'Avatar of Sleep' }, hp: 700, dmg: 15, speed: 3.4, scale: 2.0, level: 7,
              attacks: ['melee', 'slam'], phases: [{ below: 0.55, add: ['volley'] }] } },
          { type: 'scene', lines: [
            { who: 'sleep', text: { de: 'Das war nicht einmal ein Splitter von mir, kleines Licht. Bete, dass du nie das Ganze siehst.', en: 'That was not even a splinter of me, little light. Pray you never see the whole.' } },
          ]},
        ],
      },
      {
        id: 'sugar', song: 'Sugar',
        desc: { de: 'Verführung wird zur Waffe. Die Verbindung wird toxisch – süß und tödlich zugleich.', en: 'Seduction becomes a weapon. The bond turns toxic — sweet and deadly at once.' },
        xp: 200,
        steps: [
          { type: 'scene', lines: [
            { who: 'sleep', text: { de: 'Warum kämpfst du dagegen an? Es schmeckt doch süß. Süßer als alles, was die Wachwelt dir je gegeben hat.', en: 'Why do you fight it? It tastes sweet. Sweeter than anything the waking world ever gave you.' } },
            { who: 'narrator', text: { de: 'Vessel weiß, dass es Gift ist. Er trinkt trotzdem.', en: 'Vessel knows it is poison. He drinks anyway.' } },
          ]},
          { type: 'kill', enemy: 'shadow', count: 6, center: [18, 35], radius: 14, label: { de: 'Zerschlage die zuckersüßen Trugbilder', en: 'Shatter the sugar-sweet illusions' } },
        ],
      },
      {
        id: 'say-that-you-will', song: 'Say That You Will',
        desc: { de: 'Vessel fleht um Antworten. Sleep schweigt.', en: 'Vessel begs for answers. Sleep is silent.' },
        xp: 200,
        steps: [
          { type: 'goto', pos: [0, -42], label: { de: 'Kehre zum Schrein des Gottes zurück', en: 'Return to the shrine of the god' } },
          { type: 'scene', lines: [
            { who: 'vessel', text: { de: 'Sag, dass du mich nicht fallen lässt! Sag, dass all das einen Sinn hat! SAG IRGENDETWAS!', en: 'Say you will not let me fall! Say all of this means something! SAY ANYTHING!' } },
            { who: 'narrator', text: { de: '… Stille. Zum ersten Mal, seit der Pakt geschlossen wurde, antwortet die Stimme nicht.', en: '… Silence. For the first time since the pact was sealed, the voice does not answer.' } },
            { who: 'narrator', text: { de: 'Und diese Stille ist lauter als jeder Schrei.', en: 'And that silence is louder than any scream.' } },
          ]},
        ],
      },
      {
        id: 'drag-me-under', song: 'Drag Me Under',
        desc: { de: 'Vessel versinkt tiefer. Die Grenzen zwischen Traum und Realität verschwinden endgültig.', en: 'Vessel sinks deeper. The boundary between dream and reality vanishes for good.' },
        xp: 200,
        steps: [
          { type: 'kill', enemy: 'feeder', count: 7, center: [-45, 30], radius: 14, label: { de: 'Kämpfe gegen den Sog', en: 'Fight against the undertow' } },
          { type: 'goto', pos: [-55, 42], label: { de: 'Lass dich in die Tiefe ziehen', en: 'Let yourself be dragged into the depths' } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Wach? Träumend? Die Worte haben ihre Bedeutung verloren. Es gibt nur noch das Sinken.', en: 'Awake? Dreaming? The words have lost their meaning. There is only the sinking now.' } },
          ]},
        ],
      },
      {
        id: 'blood-sport', song: 'Blood Sport',
        desc: { de: 'Der Höhepunkt des ersten Falls. Liebe und Schmerz werden untrennbar. Vessel verliert alles.', en: 'The climax of the first fall. Love and pain become inseparable. Vessel loses everything.' },
        xp: 380, ach: 'blood-sport',
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Am Ende des ewigen Sonnenuntergangs wartet eine Arena aus schwarzem Glas. Sleep will ein letztes Spiel.', en: 'At the end of the eternal sunset waits an arena of black glass. Sleep wants one last game.' } },
            { who: 'sleep', text: { de: 'Liebe IST Blutsport, mein Gefäß. Einer verliert immer. Zeig mir, wie du blutest.', en: 'Love IS blood sport, my Vessel. Someone always loses. Show me how you bleed.' } },
          ]},
          { type: 'boss', label: { de: 'Besiege Sleeps Champion', en: "Defeat Sleep's Champion" }, pos: [0, -50],
            def: { kind: 'champion', name: { de: 'Sleeps Champion', en: "Sleep's Champion" }, hp: 950, dmg: 17, speed: 4.2, scale: 1.45, level: 9,
              attacks: ['melee', 'charge', 'slam'], phases: [{ below: 0.5, add: ['summon'] }, { below: 0.25, add: ['volley'] }], summonKind: 'feeder' } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Vessel steht über dem zerschlagenen Champion – und begreift: Der Champion trug sein eigenes Gesicht.', en: 'Vessel stands over the shattered champion — and understands: the champion wore his own face.' } },
            { who: 'narrator', text: { de: 'Die Geliebte ist fort. Die Erinnerungen vergiftet. Der Name geopfert. Vessel hat alles verloren.', en: 'The Beloved is gone. The memories poisoned. The name sacrificed. Vessel has lost everything.' } },
            { who: 'sleep', text: { de: 'Und nun, da du nichts mehr hast … hast du nur noch mich. War es nicht das, was du wolltest?', en: 'And now that you have nothing left … you have only me. Was that not what you wanted?' } },
          ]},
        ],
      },
    ],
  },

  // ==========================================================
  //  KAPITEL III — THIS PLACE WILL BECOME YOUR TOMB
  // ==========================================================
  {
    id: 'tomb', title: { de: 'KAPITEL III', en: 'CHAPTER III' }, sub: 'THIS PLACE WILL BECOME YOUR TOMB', zone: 'tomb', level: 10,
    ach: 'your-tomb',
    outro: [
      { who: 'narrator', text: { de: 'Aus den Grabstätten steigt Vessel verändert empor. Sleep hat Stücke von ihm genommen – doch der Kern beginnt zu glühen.', en: 'From the tombs Vessel rises changed. Sleep has taken pieces of him — but the core begins to glow.' } },
      { who: 'narrator', text: { de: 'Der Weg nach Eden liegt offen.', en: 'The path to Eden lies open.' } },
    ],
    quests: [
      {
        id: 'atlantic', song: 'Atlantic',
        desc: { de: 'Nach einem spirituellen Schiffbruch erwacht Vessel auf dem Grund eines Traum-Ozeans. Er ist gebrochen.', en: 'After a spiritual shipwreck Vessel awakens on the floor of a dream-ocean. He is broken.' },
        xp: 240, ach: 'shipwrecked',
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Das Reich von Sleep wächst. Die Welt beginnt zu verfallen. Vessel erwacht zwischen Grabsteinen, die seinen Namen tragen – in hundert Schreibweisen.', en: "Sleep's realm grows. The world begins to decay. Vessel awakens among gravestones that bear his name — in a hundred spellings." } },
            { who: 'vessel', text: { de: 'Bin ich ertrunken? Oder träume ich, dass ich atme?', en: 'Have I drowned? Or am I dreaming that I breathe?' } },
          ]},
          { type: 'goto', pos: [-37, -26], label: { de: 'Untersuche das Wrack deiner selbst', en: 'Examine the wreck of yourself' } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Im zerborstenen Rumpf findet Vessel die Fracht: tausend Flaschen, und in jeder ein Schrei, den er nie ausgesprochen hat.', en: 'In the shattered hull Vessel finds the cargo: a thousand bottles, and in each a scream he never voiced.' } },
          ]},
        ],
      },
      {
        id: 'hypnosis', song: 'Hypnosis',
        desc: { de: 'Sleep nutzt nun direkte Gedankenkontrolle. Die Welt wird zur Illusion in der Illusion.', en: 'Sleep now uses direct mind control. The world becomes an illusion within the illusion.' },
        xp: 240,
        steps: [
          { type: 'scene', lines: [
            { who: 'sleep', text: { de: 'Schau auf das Pendel meiner Augen. Du musst nicht mehr denken. Ich denke für dich.', en: 'Watch the pendulum of my eyes. You need not think anymore. I will think for you.' } },
          ]},
          { type: 'kill', enemy: 'servant', count: 5, center: [20, 20], radius: 13, label: { de: 'Zerschlage die hypnotischen Trugbilder', en: 'Shatter the hypnotic illusions' } },
          { type: 'goto', pos: [35, 35], label: { de: 'Entkomme dem Spiegelkabinett', en: 'Escape the hall of mirrors' } },
        ],
      },
      {
        id: 'mine', song: 'Mine',
        desc: { de: 'Besitz. Kontrolle. Abhängigkeit. Sleep betrachtet Vessel nun als Eigentum.', en: 'Possession. Control. Dependence. Sleep now regards Vessel as property.' },
        xp: 240,
        steps: [
          { type: 'scene', lines: [
            { who: 'sleep', text: { de: 'Du fragst, was du für mich bist? Du bist MEIN. Mein Instrument. Mein Tempel. Mein Eigentum.', en: 'You ask what you are to me? You are MINE. My instrument. My temple. My property.' } },
            { who: 'vessel', text: { de: 'Ich war ein Mensch. Ich hatte einen Namen.', en: 'I was a person. I had a name.' } },
            { who: 'sleep', text: { de: 'Du WARST. Das ist das schönste Wort der Vergangenheit.', en: 'You WERE. Such a beautiful word of the past tense.' } },
          ]},
          { type: 'kill', enemy: 'shadow', count: 6, center: [-25, 25], radius: 13, label: { de: 'Wehre dich gegen die Besitzergreifung', en: 'Resist the seizure' } },
        ],
      },
      {
        id: 'like-that', song: 'Like That',
        desc: { de: 'Die Manipulation wird Alltag. Vessel erkennt sie – und kann ihr doch nicht entkommen.', en: 'The manipulation becomes routine. Vessel recognizes it — yet cannot escape it.' },
        xp: 240,
        steps: [
          { type: 'collect', count: 3, positions: [[-15, -40], [5, -52], [-30, -48]], label: { de: 'Sammle die Fäden der Manipulation', en: 'Collect the threads of manipulation' } },
          { type: 'scene', lines: [
            { who: 'vessel', text: { de: 'Ich sehe jeden Faden, an dem er zieht. Ich spüre jeden Griff. Und ich tanze trotzdem.', en: 'I see every thread he pulls. I feel every grip. And still I dance.' } },
            { who: 'narrator', text: { de: 'Das ist das Grausamste an der Manipulation: zu wissen – und zu bleiben.', en: 'That is the cruelest thing about manipulation: to know — and to stay.' } },
          ]},
        ],
      },
      {
        id: 'the-love-you-want', song: 'The Love You Want',
        desc: { de: 'Sleep zeigt Vessel alles, was er verloren hat. Nur, um es ihm wieder zu nehmen.', en: 'Sleep shows Vessel everything he has lost. Only to take it away again.' },
        xp: 240,
        steps: [
          { type: 'talk', npc: 'woman-ghost', label: { de: 'Geh zu der vertrauten Gestalt im Licht', en: 'Approach the familiar figure in the light' },
            spawn: { kind: 'woman', name: { de: 'Die Geliebte?', en: 'The Beloved?' }, pos: [10, -25], labelColor: '#ffd9ec' },
            removeAfter: true,
            lines: [
              { who: 'woman', text: { de: 'Vessel! Ich habe dich überall gesucht! Komm nach Hause. Alles kann wieder gut werden.', en: 'Vessel! I have searched everywhere for you! Come home. Everything can be good again.' } },
              { who: 'vessel', text: { de: 'Du … bist du es wirklich?', en: 'You … is it really you?' } },
              { who: 'woman', text: { de: 'Berühr meine Hand und finde es heraus.', en: 'Touch my hand and find out.' } },
              { who: 'narrator', text: { de: 'Vessel greift nach ihr. Seine Finger gehen durch Nebel. Aus der Dunkelheit: leises, goldenes Lachen.', en: 'Vessel reaches for her. His fingers pass through mist. From the darkness: soft, golden laughter.' } },
              { who: 'sleep', text: { de: 'DIE Liebe willst du also. Gut zu wissen, welche Form dein Herz am tiefsten schneidet.', en: 'So THAT is the love you want. Good to know which shape cuts your heart the deepest.' } },
            ]},
          { type: 'kill', enemy: 'feeder', count: 6, center: [10, -25], radius: 13, label: { de: 'Vernichte die Echo-Trugbilder', en: 'Destroy the echo-illusions' } },
        ],
      },
      {
        id: 'fall-for-me', song: 'Fall For Me',
        desc: { de: 'Eine Falle. Sleep fordert völlige Hingabe – formuliert als Liebeserklärung.', en: 'A trap. Sleep demands total surrender — phrased as a declaration of love.' },
        xp: 240,
        steps: [
          { type: 'talk', npc: 'fall-sleep', label: { de: 'Folge dem goldenen Ruf', en: 'Follow the golden call' },
            spawn: { kind: 'sleepgod', name: { de: 'Sleep', en: 'Sleep' }, pos: [-35, 10], scale: 1.6, labelColor: '#e8b842' },
            removeAfter: true,
            lines: [
              { who: 'sleep', text: { de: 'Fall für mich. Nicht auf die Knie – durch dich selbst hindurch. Gib mir auch noch den letzten Winkel.', en: 'Fall for me. Not to your knees — through yourself. Give me even the last corner.' } },
              { who: 'vessel', text: { de: '…', en: '…' }, choices: [
                { text: { de: 'Widerstehen. („Es gibt Winkel, die dir nie gehören werden.")', en: '"There are corners that will never be yours." (Resist)' }, set: { resisted: 1 } },
                { text: { de: 'Nachgeben. („Nimm, was du willst.")', en: '"Take what you want." (Yield)' }, set: { surrendered: 1 } },
              ]},
              { who: 'sleep', text: { de: 'Wie reizend. Dann zeige ich dir jetzt, was mit Herzen geschieht, die zögern.', en: 'How charming. Then let me show you what becomes of hearts that hesitate.' } },
            ]},
          { type: 'kill', enemy: 'feeder', count: 5, center: [-35, 10], radius: 12, label: { de: 'Überlebe den Hinterhalt', en: 'Survive the ambush' } },
        ],
      },
      {
        id: 'alkaline', song: 'Alkaline',
        desc: { de: 'Vessel entdeckt eine innere Stärke, die Sleep nicht gegeben hat. Zum ersten Mal widersteht er wirklich.', en: 'Vessel discovers an inner strength Sleep did not give him. For the first time he truly resists.' },
        xp: 300, ach: 'first-resist',
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Tief unter den Grabstätten findet Vessel etwas Unerwartetes: einen Funken, der nicht golden ist. Der IHM gehört.', en: 'Deep beneath the tombs Vessel finds something unexpected: a spark that is not golden. One that belongs to HIM.' } },
            { who: 'vessel', text: { de: 'Du hast mich verändert, Sleep. Aber Veränderung ist keine Einbahnstraße.', en: 'You changed me, Sleep. But change is not a one-way street.' } },
          ]},
          { type: 'kill', enemy: 'servant', count: 6, center: [40, -25], radius: 14, label: { de: 'Schlag zurück – zum ersten Mal', en: 'Strike back — for the first time' } },
          { type: 'scene', lines: [
            { who: 'sleep', text: { de: 'Was … war DAS? Woher nimmst du diese Kraft? ICH habe sie dir nicht gegeben!', en: 'What … was THAT? Where do you draw this strength from? I did not give it to you!' } },
            { who: 'narrator', text: { de: 'Genau das, uralter Gott. Genau das.', en: 'Exactly, ancient god. Exactly that.' } },
          ]},
        ],
      },
      {
        id: 'distraction', song: 'Distraction',
        desc: { de: 'Sleep reagiert auf den Widerstand mit Ablenkung und Täuschung. Falsche Lichter überall.', en: 'Sleep answers the resistance with distraction and deceit. False lights everywhere.' },
        xp: 240,
        steps: [
          { type: 'collect', count: 4, positions: [[55, 10], [48, 30], [60, -15], [42, 0]], label: { de: 'Lösche die falschen Lichter', en: 'Extinguish the false lights' } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Jedes Licht flüstert eine andere Verheißung: Ruhm. Frieden. Sie. Doch dahinter ist immer nur dasselbe goldene Auge.', en: 'Each light whispers a different promise: glory. Peace. Her. But behind them is always the same golden eye.' } },
          ]},
        ],
      },
      {
        id: 'descending', song: 'Descending',
        desc: { de: 'Die Welt fällt auseinander. Königreiche der Träume kollabieren – eines nach dem anderen.', en: 'The world falls apart. Kingdoms of dreams collapse — one after another.' },
        xp: 240,
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Am Horizont stürzen Traumpaläste lautlos in sich zusammen, wie Kerzen, die man auslöscht. Sleeps Reich frisst sich selbst.', en: "On the horizon dream-palaces collapse in silence, like candles being snuffed out. Sleep's realm devours itself." } },
          ]},
          { type: 'kill', enemy: 'shadow', count: 8, center: [0, -30], radius: 16, label: { de: 'Kämpfe dich durch die kollabierende Welt', en: 'Fight through the collapsing world' } },
        ],
      },
      {
        id: 'telomeres', song: 'Telomeres',
        desc: { de: 'Erinnerungen sterben. Freunde verschwinden. Namen werden vergessen.', en: 'Memories die. Friends vanish. Names are forgotten.' },
        xp: 240,
        steps: [
          { type: 'goto', pos: [-50, 20], label: { de: 'Besuche die verblassende Erinnerung (1/3)', en: 'Visit the fading memory (1/3)' } },
          { type: 'goto', pos: [-38, 45], label: { de: 'Besuche die verblassende Erinnerung (2/3)', en: 'Visit the fading memory (2/3)' } },
          { type: 'goto', pos: [-12, 52], label: { de: 'Besuche die verblassende Erinnerung (3/3)', en: 'Visit the fading memory (3/3)' } },
          { type: 'scene', lines: [
            { who: 'vessel', text: { de: 'Hier stand jemand, den ich … ich kannte sein Lachen. Warum weiß ich seinen Namen nicht mehr?', en: 'Someone stood here whom I … I knew their laugh. Why can I no longer recall their name?' } },
            { who: 'narrator', text: { de: 'Erinnerungen haben Enden, wie Fäden. Und Sleep zieht daran. Jeden Tag ein Stück.', en: 'Memories have ends, like threads. And Sleep pulls at them. A little each day.' } },
          ]},
        ],
      },
      {
        id: 'high-water', song: 'High Water',
        desc: { de: 'Vessel beginnt zurückzukämpfen. Der erste echte, offene Widerstand gegen den Gott.', en: 'Vessel begins to fight back. The first true, open resistance against the god.' },
        xp: 280,
        steps: [
          { type: 'scene', lines: [
            { who: 'vessel', text: { de: 'Das Wasser steigt? Gut. Dann lerne ich eben schwimmen. Hörst du mich, Sleep? ICH GEHE NICHT UNTER!', en: 'The water rises? Good. Then I will learn to swim. Do you hear me, Sleep? I WILL NOT GO UNDER!' } },
          ]},
          { type: 'kill', enemy: 'shadow', count: 5, center: [25, 45], radius: 13, label: { de: 'Erste Welle – halte stand', en: 'First wave — hold the line' } },
          { type: 'kill', enemy: 'servant', count: 4, center: [25, 45], radius: 13, label: { de: 'Zweite Welle – schlag zurück', en: 'Second wave — strike back' } },
        ],
      },
      {
        id: 'missing-limbs', song: 'Missing Limbs',
        desc: { de: 'Der Preis des Widerstands ist hoch. Teile von Vessels Seele gehen für immer verloren.', en: "The price of resistance is high. Parts of Vessel's soul are lost forever." },
        xp: 320,
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Nach der Schlacht zählt Vessel seine Wunden – und merkt: Es fehlt etwas. Kein Arm. Kein Bein. Etwas Tieferes.', en: 'After the battle Vessel counts his wounds — and notices: something is missing. Not an arm. Not a leg. Something deeper.' } },
            { who: 'sleep', text: { de: 'Jeder Schlag gegen mich kostet dich ein Stück von dir. Willst du wirklich weiterzählen, wie viel übrig ist?', en: 'Every blow against me costs you a piece of yourself. Do you really want to keep counting how much is left?' } },
          ]},
          { type: 'talk', npc: 'limbs-altar', label: { de: 'Tritt an den Opferstein', en: 'Step up to the sacrificial stone' },
            spawn: { kind: 'sleepgod', name: { de: 'Sleep', en: 'Sleep' }, pos: [0, 40], scale: 1.6, labelColor: '#e8b842' },
            removeAfter: true,
            lines: [
              { who: 'sleep', text: { de: 'Ein Angebot: Gib mir ein Stück deiner Lebenskraft freiwillig – und ich lasse deine Erinnerungen an SIE unangetastet.', en: 'An offer: give me a piece of your life force willingly — and I will leave your memories of HER untouched.' } },
              { who: 'vessel', text: { de: '…', en: '…' }, choices: [
                { text: { de: 'Das Opfer bringen. (–10 max. LP, aber die Erinnerung bleibt)', en: 'Make the sacrifice. (–10 max HP, but the memory stays)' }, set: { sacrifice: 1 } },
                { text: { de: 'Ablehnen. („Du nimmst dir doch, was du willst.")', en: '"You take what you want anyway." (Refuse)' }, set: { defiant: 1 } },
              ]},
              { who: 'narrator', text: { de: 'So oder so: Vessel verlässt die Grabstätten leichter – und leerer.', en: 'Either way: Vessel leaves the tombs lighter — and emptier.' } },
            ]},
        ],
      },
    ],
  },

  // ==========================================================
  //  KAPITEL IV — TAKE ME BACK TO EDEN
  // ==========================================================
  {
    id: 'eden', title: { de: 'KAPITEL IV', en: 'CHAPTER IV' }, sub: 'TAKE ME BACK TO EDEN', zone: 'eden', level: 14,
    ach: 'back-to-eden',
    outro: [
      { who: 'narrator', text: { de: 'Die Ketten sind zerbrochen. Sleep ist verschwunden – zumindest scheinbar.', en: 'The chains are broken. Sleep has vanished — at least seemingly.' } },
      { who: 'narrator', text: { de: 'Frieden kehrt zurück. Doch jenseits des Gartens wartet ein Ort, der zu perfekt ist, um wahr zu sein: Arcadia.', en: 'Peace returns. But beyond the garden waits a place too perfect to be true: Arcadia.' } },
    ],
    quests: [
      {
        id: 'chokehold', song: 'Chokehold',
        desc: { de: 'Die größte Reise beginnt. Doch Sleep hält Vessel noch immer im Würgegriff.', en: 'The greatest journey begins. But Sleep still holds Vessel in a chokehold.' },
        xp: 280,
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Vessel sucht den Ursprung von Sleep. Der Weg führt nach Eden – dorthin, wo der Gott geboren wurde.', en: 'Vessel seeks the origin of Sleep. The path leads to Eden — to where the god was born.' } },
            { who: 'sleep', text: { de: 'Du willst meine Wiege sehen? Nur zu. Aber vergiss nicht, wessen Hand um deinen Hals liegt.', en: 'You want to see my cradle? Go ahead. But do not forget whose hand is around your throat.' } },
          ]},
          { type: 'kill', enemy: 'servant', count: 6, center: [-20, 15], radius: 14, label: { de: 'Sprenge die Wächter des Würgegriffs', en: 'Break the wardens of the chokehold' } },
        ],
      },
      {
        id: 'the-summoning', song: 'The Summoning',
        desc: { de: 'In einem uralten Ritualkreis wird der wahre Name von Sleep enthüllt – eine Entität jenseits aller Götter.', en: 'In an ancient ritual circle the true name of Sleep is revealed — an entity beyond all gods.' },
        xp: 320, ach: 'the-summoning',
        steps: [
          { type: 'goto', pos: [30, -25], label: { de: 'Finde den uralten Ritualkreis', en: 'Find the ancient ritual circle' } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Im Kreis aus überwucherten Steinen flammen Runen auf. Sie buchstabieren einen Namen, der älter ist als Sprache.', en: 'In the circle of overgrown stones, runes flare to life. They spell a name older than language.' } },
            { who: 'narrator', text: { de: 'Kein Gott. Kein Dämon. Etwas Drittes: DER HUNGER ZWISCHEN DEN TRÄUMEN.', en: 'No god. No demon. Something third: THE HUNGER BETWEEN DREAMS.' } },
            { who: 'vessel', text: { de: 'Das ist dein wahrer Name. Du wurdest nie geboren – du bist entstanden. Wie Schimmel. Wie Rost.', en: 'That is your true name. You were never born — you emerged. Like mold. Like rust.' } },
            { who: 'sleep', text: { de: '(zum ersten Mal ohne Spott) Sprich diesen Namen nie wieder aus.', en: '(for the first time without mockery) Never speak that name again.' } },
          ]},
        ],
      },
      {
        id: 'granite', song: 'Granite',
        desc: { de: 'Vessel verhärtet sein Herz. Was ihn früher zerbrochen hätte, prallt nun ab.', en: 'Vessel hardens his heart. What once would have broken him now glances off.' },
        xp: 280,
        steps: [
          { type: 'scene', lines: [
            { who: 'vessel', text: { de: 'Du hast mein Herz so oft zerschlagen, dass es nun härter nachwächst. Granit statt Glas.', en: 'You have shattered my heart so often that it grows back harder. Granite instead of glass.' } },
          ]},
          { type: 'kill', enemy: 'guardian', count: 3, center: [-35, -20], radius: 13, label: { de: 'Zerschmettere die steinernen Prüfer', en: 'Smash the stone testers' } },
        ],
      },
      {
        id: 'aqua-regia', song: 'Aqua Regia',
        desc: { de: 'Alte Wahrheiten werden freigelegt: Die gesamte Geschichte war manipuliert – von Anfang an.', en: 'Old truths are laid bare: the entire story was manipulated — from the very beginning.' },
        xp: 280,
        steps: [
          { type: 'collect', count: 3, positions: [[15, 30], [-10, 42], [28, 45]], label: { de: 'Löse die versiegelten Wahrheiten', en: 'Dissolve the sealed truths' } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Königswasser löst selbst Gold. Und Vessels neue Klarheit löst selbst die goldenen Lügen des Gottes.', en: "Aqua regia dissolves even gold. And Vessel's new clarity dissolves even the god's golden lies." } },
            { who: 'vessel', text: { de: 'Die „Auserwählung". Der „Pakt". Sogar mein „Zufall", ihr zu begegnen … Du hast ALLES inszeniert.', en: 'The "chosen one." The "pact." Even my "chance" meeting with her … You staged EVERYTHING.' } },
          ]},
        ],
      },
      {
        id: 'vore', song: 'Vore',
        desc: { de: 'Sleep gibt die Maskerade auf und versucht, Vessel vollständig zu verschlingen.', en: 'Sleep abandons the masquerade and tries to devour Vessel entirely.' },
        xp: 420,
        steps: [
          { type: 'scene', lines: [
            { who: 'sleep', text: { de: 'Genug. Wenn du dich nicht hingeben willst … dann werde ich dich eben VERSCHLINGEN.', en: 'Enough. If you will not surrender … then I will simply DEVOUR you.' } },
            { who: 'narrator', text: { de: 'Der Boden öffnet sich. Aus der Tiefe steigt ein Schlund aus Hunger und Zähnen.', en: 'The ground splits open. From the depths rises a maw of hunger and teeth.' } },
          ]},
          { type: 'boss', label: { de: 'Kämpfe gegen die Manifestation des Verschlingens', en: 'Fight the Manifestation of Devouring' }, pos: [0, -35],
            def: { kind: 'vore', name: { de: 'Manifestation des Verschlingens', en: 'Manifestation of Devouring' }, hp: 1400, dmg: 20, speed: 3.0, scale: 1.8, level: 15,
              attacks: ['melee', 'slam', 'volley'], phases: [{ below: 0.5, add: ['summon'] }], summonKind: 'feeder', patternCd: 4 } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Vessel steht im Zentrum des erlöschenden Schlunds – verschluckt und wieder ausgespuckt. Unverdaulich geworden.', en: 'Vessel stands at the center of the dying maw — swallowed and spat back out. Become indigestible.' } },
          ]},
        ],
      },
      {
        id: 'ascensionism', song: 'Ascensionism',
        desc: { de: 'Vessel erhebt sich. Er erkennt seine eigene Macht – gewachsen aus jedem überlebten Schmerz.', en: 'Vessel rises. He recognizes his own power — grown from every pain he has survived.' },
        xp: 320,
        steps: [
          { type: 'kill', enemy: 'mixed', count: 8, center: [35, 20], radius: 16, label: { de: 'Erhebe dich über die Diener des Gottes', en: 'Rise above the servants of the god' } },
          { type: 'scene', lines: [
            { who: 'vessel', text: { de: 'All die Zeit dachte ich, du machst mich stark. Aber ICH war es. Jede Narbe – meine. Jeder Aufstieg – meiner.', en: 'All this time I thought you made me strong. But it was ME. Every scar — mine. Every ascent — mine.' } },
            { who: 'narrator', text: { de: 'Vessels Schläge tragen von nun an das Gewicht dieser Erkenntnis. (+10 % Schaden)', en: "Vessel's blows now carry the weight of this realization. (+10% damage)" } },
          ], setFlags: { ascended: 1 }},
        ],
      },
      {
        id: 'are-you-really-okay', song: 'Are You Really Okay?',
        desc: { de: 'Die Folgen des Krieges werden sichtbar: Trauma. Schuld. Verlust. Jemand stellt die einfachste, schwerste Frage.', en: 'The cost of war becomes visible: trauma. Guilt. Loss. Someone asks the simplest, hardest question.' },
        xp: 280,
        steps: [
          { type: 'talk', npc: 'stille-schwester', label: { de: 'Sprich mit der stillen Schwester', en: 'Speak with the Silent Sister' },
            spawn: { kind: 'espera', name: { de: 'Die Stille Schwester', en: 'The Silent Sister' }, pos: [-15, -30], labelColor: '#fff3c4' },
            healFull: true,
            lines: [
              { who: 'espera', text: { de: 'Setz dich, Gefäß. Kein Kampf. Keine Prüfung. Nur eine Frage: Geht es dir wirklich gut?', en: 'Sit, Vessel. No battle. No trial. Just one question: are you really okay?' } },
              { who: 'vessel', text: { de: '…', en: '…' }, choices: [
                { text: { de: '„Nein. Schon sehr lange nicht mehr."', en: '"No. Not for a very long time."' }, set: { honest: 1 } },
                { text: { de: '„Ich muss weitermachen. Das ist wichtiger."', en: '"I have to keep going. That matters more."' }, set: { repressed: 1 } },
              ]},
              { who: 'espera', text: { de: 'Was auch immer du trägst – hier darfst du es einen Moment absetzen. Ruh dich aus. Die Wunden warten, bis du bereit bist.', en: 'Whatever you carry — here you may set it down for a moment. Rest. The wounds will wait until you are ready.' } },
              { who: 'narrator', text: { de: '(Vessel wurde vollständig geheilt.)', en: '(Vessel was fully healed.)' } },
            ]},
        ],
      },
      {
        id: 'the-apparition', song: 'The Apparition',
        desc: { de: 'Die Geister der Vergangenheit kehren zurück – jeder ungeklärte Abschied bekommt ein Gesicht.', en: 'The ghosts of the past return — every unresolved farewell gains a face.' },
        xp: 280,
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Im Zwielicht des Gartens stehen plötzlich Gestalten: halb durchsichtig, halb vertraut. Alle, die Vessel verloren hat.', en: 'In the twilight of the garden, figures suddenly stand: half-transparent, half-familiar. All those Vessel has lost.' } },
            { who: 'voice', text: { de: 'Warum hast du uns vergessen? Warum durfte ER bleiben – und wir nicht?', en: 'Why did you forget us? Why was HE allowed to stay — and we were not?' } },
          ]},
          { type: 'kill', enemy: 'shadow', count: 5, center: [-30, 35], radius: 13, label: { de: 'Erlöse die ruhelosen Erscheinungen', en: 'Release the restless apparitions' } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Die Geister verwehen – nicht zornig, sondern dankbar. Erinnert zu werden ist manchmal Erlösung genug.', en: 'The ghosts drift away — not angry, but grateful. To be remembered is sometimes salvation enough.' } },
          ]},
        ],
      },
      {
        id: 'dywtylm', song: 'DYWTYLM',
        desc: { de: 'Vessel stellt die wichtigste Frage von allen: Kann ich mich selbst überhaupt lieben?', en: 'Vessel asks the most important question of all: can I even love myself?' },
        xp: 280,
        steps: [
          { type: 'talk', npc: 'mirror-self', label: { de: 'Tritt vor den Spiegel aus Tau', en: 'Step before the mirror of dew' },
            spawn: { kind: 'mirror', name: { de: 'Das Spiegelbild', en: 'The Reflection' }, pos: [20, -45], labelColor: '#ffffff' },
            removeAfter: true,
            lines: [
              { who: 'mirror', text: { de: 'Du fragst alle, ob sie dich lieben. Sleep. Sie. Die Welt. Aber du hast EINEN nie gefragt.', en: 'You ask everyone if they love you. Sleep. Her. The world. But there is ONE you never asked.' } },
              { who: 'vessel', text: { de: 'Liebst du … liebe ICH mich?', en: 'Do you … do I love myself?' }, choices: [
                { text: { de: '„Ich weiß es nicht. Aber ich will es lernen."', en: '"I do not know. But I want to learn."' }, set: { selflove: 1 } },
                { text: { de: '„Wie könnte ich? Nach allem, was ich getan habe?"', en: '"How could I? After everything I have done?"' }, set: { selfhate: 1 } },
              ]},
              { who: 'mirror', text: { de: 'Jede Antwort ist ein Anfang. Lügen wäre das Ende gewesen.', en: 'Every answer is a beginning. A lie would have been the end.' } },
            ]},
        ],
      },
      {
        id: 'rain', song: 'Rain',
        desc: { de: 'Reinigung. Vergebung. Neuanfang. Zum ersten Mal seit Jahren regnet es in den Traumlanden.', en: 'Cleansing. Forgiveness. A new beginning. For the first time in years it rains in the Dreamlands.' },
        xp: 280,
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Wolken ziehen über Eden – echte Wolken, von keinem Gott bestellt. Und dann: Regen. Er wäscht die goldene Farbe von allem.', en: 'Clouds drift over Eden — real clouds, commanded by no god. And then: rain. It washes the golden color from everything.' } },
          ]},
          { type: 'collect', count: 5, positions: [[0, 20], [-18, 28], [12, 35], [-8, 45], [22, 28]], label: { de: 'Fang die reinigenden Tropfen', en: 'Catch the cleansing drops' } },
          { type: 'scene', lines: [
            { who: 'vessel', text: { de: 'Ich vergebe dir nicht, Sleep. Noch nicht. Aber ich vergebe MIR. Und das ist der Anfang von allem.', en: 'I do not forgive you, Sleep. Not yet. But I forgive MYSELF. And that is the beginning of everything.' } },
          ], healFull: true },
        ],
      },
      {
        id: 'take-me-back-to-eden', song: 'Take Me Back To Eden',
        desc: { de: 'Der Weg führt zum Garten, in dem Sleep einst geboren wurde. Dort wartet die Wahrheit aller Wahrheiten.', en: 'The path leads to the garden where Sleep was once born. There waits the truth of all truths.' },
        xp: 360,
        steps: [
          { type: 'goto', pos: [0, -20], label: { de: 'Durchschreite das zerbrochene Tor von Eden', en: 'Pass through the broken gate of Eden' } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Hinter dem Tor liegt kein Paradies. Nur eine kleine, stille Lichtung – und in ihrer Mitte eine Mulde, wie von einem schlafenden Tier.', en: 'Beyond the gate lies no paradise. Only a small, silent clearing — and at its center a hollow, as if left by a sleeping animal.' } },
            { who: 'narrator', text: { de: 'Hier wurde Sleep geboren. Nicht von Göttern. Nicht von Sternen. Sondern aus der Angst der Menschheit vor der Einsamkeit.', en: "Here Sleep was born. Not of gods. Not of stars. But of humanity's fear of being alone." } },
            { who: 'vessel', text: { de: 'Du warst niemals ein Gott. Nur ein Gedanke. Ein Parasit, der sich von unserer Angst ernährt, allein zu sein.', en: 'You were never a god. Just a thought. A parasite that feeds on our fear of being alone.' } },
            { who: 'sleep', text: { de: 'Und ist das nicht göttlich genug? Eure Angst hat Kathedralen gebaut, Kriege entfacht, Lieder geschrieben. ICH bin eure ehrlichste Schöpfung.', en: 'And is that not divine enough? Your fear has built cathedrals, ignited wars, written songs. I am your most honest creation.' } },
          ]},
        ],
      },
      {
        id: 'euclid', song: 'Euclid',
        desc: { de: 'Vessel durchbricht den Kreislauf. Die Ketten zerbrechen. Sleep verschwindet – zumindest scheinbar.', en: 'Vessel breaks the cycle. The chains shatter. Sleep vanishes — at least seemingly.' },
        xp: 400, ach: 'cycle-breaker',
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Jede Geometrie hat Regeln. Auch die Geometrie eines Fluchs: Pakt, Hingabe, Verlust, Wiederholung. Eine perfekte, geschlossene Form.', en: 'Every geometry has rules. Even the geometry of a curse: pact, surrender, loss, repetition. A perfect, closed shape.' } },
            { who: 'vessel', text: { de: 'Und jede Form zerbricht, wenn man eine einzige Linie verweigert. Ich verweigere.', en: 'And every shape breaks if you refuse a single line. I refuse.' } },
          ]},
          { type: 'kill', enemy: 'mixed', count: 6, center: [0, -10], radius: 15, label: { de: 'Zerschlage die letzten Glieder der Kette', en: 'Shatter the last links of the chain' } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Mit einem Klang wie eine zerreißende Saite … zerbricht der Kreislauf. Die goldenen Augen am Himmel schließen sich.', en: 'With a sound like a snapping string … the cycle breaks. The golden eyes in the sky close.' } },
            { who: 'narrator', text: { de: 'Sleep ist fort. Zum ersten Mal seit Zeitaltern: Stille, die niemandem gehört.', en: 'Sleep is gone. For the first time in ages: silence that belongs to no one.' } },
            { who: 'vessel', text: { de: '… Warum fühlt sich Freiheit so leer an?', en: '… Why does freedom feel so empty?' } },
          ]},
        ],
      },
    ],
  },

  // ==========================================================
  //  KAPITEL V — EVEN IN ARCADIA
  // ==========================================================
  {
    id: 'arcadia', title: { de: 'KAPITEL V', en: 'CHAPTER V' }, sub: 'EVEN IN ARCADIA', zone: 'arcadia', level: 18,
    ach: null,
    outro: null, // führt direkt ins Finale
    quests: [
      {
        id: 'look-to-windward', song: 'Look To Windward',
        desc: { de: 'Vessel erreicht die Küsten von Arcadia. Dort hört er sie wieder: die Stimme. Nicht als Befehl – als Erinnerung.', en: 'Vessel reaches the shores of Arcadia. There he hears it again: the voice. Not as a command — as a memory.' },
        xp: 360, ach: 'windward',
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Frieden kehrt zurück. Doch Arcadia ist nicht das Paradies – Arcadia ist die ILLUSION eines Paradieses.', en: 'Peace returns. But Arcadia is not paradise — Arcadia is the ILLUSION of a paradise.' } },
            { who: 'narrator', text: { de: 'Und eine schreckliche Wahrheit wartet: Sleep existierte niemals außerhalb von Vessel. Arcadia ist keine Welt. Arcadia ist sein Unterbewusstsein.', en: 'And a terrible truth waits: Sleep never existed outside of Vessel. Arcadia is not a world. Arcadia is his subconscious.' } },
            { who: 'sleep', text: { de: '(wie aus einer alten Aufnahme) … öffne dein Herz … und ich werde dich …', en: '(as if from an old recording) … open your heart … and I will make you …' } },
          ]},
          { type: 'goto', pos: [42, 32], label: { de: 'Folge dem Flüstern zur Küste', en: 'Follow the whisper to the coast' } },
          { type: 'boss', label: { de: 'Besiege das Echo von Sleep', en: 'Defeat the Echo of Sleep' }, pos: [48, 38],
            def: { kind: 'echo', name: { de: 'Das Echo von Sleep', en: 'The Echo of Sleep' }, hp: 1500, dmg: 21, speed: 4.4, scale: 1.5, level: 18,
              attacks: ['melee', 'volley', 'charge'], patternCd: 4 } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Das Echo zerfällt zu goldenem Staub. Zurück bleibt ein Erinnerungsfragment: „Die Erste Opfergabe".', en: 'The echo crumbles to golden dust. A memory fragment remains: "The First Offering."' } },
            { who: 'vessel', text: { de: 'Er ist nicht zurückgekommen. Er war nie fort. Er hat sich nur … tiefer vergraben. In mir.', en: 'He did not come back. He was never gone. He only … buried himself deeper. In me.' } },
          ]},
        ],
      },
      {
        id: 'emergence', song: 'Emergence',
        desc: { de: 'Aus verdrängten Erinnerungen gerinnt eine neue Kreatur: The Emergent One – geboren aus Schuld, Sehnsucht und alten Fehlern.', en: 'From repressed memories a new creature congeals: The Emergent One — born of guilt, longing and old mistakes.' },
        xp: 360, ach: 'emergent',
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'In den Tiefen des zerbrochenen Heiligtums regt sich etwas. Alles, was Vessel je verdrängt hat, sucht sich einen Körper.', en: 'In the depths of the broken sanctuary something stirs. Everything Vessel has ever repressed seeks a body.' } },
          ]},
          { type: 'goto', pos: [-32, -22], label: { de: 'Steig hinab ins zerbrochene Heiligtum', en: 'Descend into the broken sanctuary' } },
          { type: 'kill', enemy: 'servant', count: 4, center: [-32, -22], radius: 12, label: { de: 'Bahne dir den Weg durch die Verdrängten', en: 'Carve your way through the repressed' } },
          { type: 'boss', label: { de: 'Besiege The Emergent One', en: 'Defeat The Emergent One' }, pos: [-40, -30],
            def: { kind: 'emergent', name: { de: 'The Emergent One', en: 'The Emergent One' }, hp: 1600, dmg: 22, speed: 3.4, scale: 1.7, level: 19,
              attacks: ['melee', 'slam'], phases: [{ below: 0.6, add: ['summon'] }, { below: 0.3, add: ['volley'] }], summonKind: 'shadow' } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Die Kreatur zerfließt – und am Rand der Pfütze gerinnt bereits ein neuer Schatten.', en: 'The creature dissolves — and at the edge of the puddle a new shadow is already congealing.' } },
            { who: 'vessel', text: { de: 'Jeder besiegte Schatten erschafft einen neuen. Ich kann nicht ewig schneiden. Ich muss an die Wurzel.', en: 'Every shadow I defeat creates a new one. I cannot keep cutting forever. I must reach the root.' } },
          ]},
        ],
      },
      {
        id: 'past-self', song: 'Past Self',
        desc: { de: 'Im Spiegelgewölbe trifft Vessel auf sein jüngeres Ich: den Gläubigen. Den Träumer. Den Diener.', en: 'In the mirror vault Vessel meets his younger self: the believer. The dreamer. The servant.' },
        xp: 360, ach: 'past-self',
        steps: [
          { type: 'goto', pos: [25, -40], label: { de: 'Betritt das Spiegelgewölbe', en: 'Enter the mirror vault' } },
          { type: 'talk', npc: 'past-vessel', label: { de: 'Sprich mit deinem jüngeren Ich', en: 'Speak with your younger self' },
            spawn: { kind: 'pastvessel', name: { de: 'Vessel (Vergangenheit)', en: 'Vessel (Past)' }, pos: [25, -46], labelColor: '#e8e8e8' },
            removeAfter: true,
            lines: [
              { who: 'past', text: { de: 'Du bist … ich? Nein. Du bist das, was aus mir WIRD? Diese Narben, diese kalten Augen – was hast du mit unserem Wunder gemacht?', en: 'You are … me? No. You are what I BECOME? These scars, these cold eyes — what have you done with our miracle?' } },
              { who: 'vessel', text: { de: 'Es war nie ein Wunder. Es war ein Käfig mit goldenen Stäben.', en: 'It was never a miracle. It was a cage with golden bars.' } },
              { who: 'past', text: { de: 'LÜGNER! Er hat uns auserwählt! Er liebt uns! Ich lasse nicht zu, dass du uns das wegnimmst!', en: 'LIAR! He chose us! He loves us! I will not let you take that from us!' }, choices: [
                { text: { de: '„Dann zeig mir, wie fest dein Glaube ist."', en: '"Then show me how firm your faith is."' }, set: {} },
                { text: { de: '„Es tut mir leid. Auch um dich."', en: '"I am sorry. For you too."' }, set: { compassion: 1 } },
              ]},
            ]},
          { type: 'boss', label: { de: 'Besiege Past Vessel', en: 'Defeat Past Vessel' }, pos: [25, -46],
            def: { kind: 'pastvessel', name: { de: 'Past Vessel', en: 'Past Vessel' }, hp: 1500, dmg: 20, speed: 5.0, scale: 1.2, level: 19,
              attacks: ['melee', 'charge', 'volley'], patternCd: 3.5 } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Der Träumer sinkt nieder – und lächelt im Fallen. „Danke", flüstert er, „dass du es besser weißt als ich."', en: 'The dreamer sinks down — and smiles as he falls. "Thank you," he whispers, "for knowing better than I did."' } },
            { who: 'narrator', text: { de: 'Vessel kann nun Illusionen durchschauen. Die Welt wird nie wieder ganz lügen können.', en: 'Vessel can now see through illusions. The world will never be able to wholly lie again.' } },
          ], setFlags: { clearsight: 1 }},
        ],
      },
      {
        id: 'dangerous', song: 'Dangerous',
        desc: { de: 'Sleep erscheint erstmals in menschlicher Gestalt – als die Person, die Vessel immer geliebt hat. Kein Kampf. Nur Worte.', en: 'Sleep appears in human form for the first time — as the person Vessel always loved. No battle. Only words.' },
        xp: 360,
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Auf einer Marmorterrasse steht eine vertraute Silhouette im Gegenlicht. Kein Monster. Kein Gott. Sie.', en: 'On a marble terrace a familiar silhouette stands against the light. No monster. No god. Her.' } },
          ]},
          { type: 'talk', npc: 'dangerous-sleep', label: { de: 'Geh zu der Gestalt auf der Terrasse', en: 'Approach the figure on the terrace' },
            spawn: { kind: 'woman', name: { de: '???', en: '???' }, pos: [-15, 35], labelColor: '#e8b842' },
            removeAfter: true,
            lines: [
              { who: 'sleep', text: { de: 'Hallo, Vessel. Gefällt dir diese Form? Ich habe sie aus deinen schönsten Erinnerungen genäht.', en: 'Hello, Vessel. Do you like this form? I sewed it from your most beautiful memories.' } },
              { who: 'vessel', text: { de: 'Du wagst es, IHR Gesicht zu tragen?', en: 'You dare to wear HER face?' } },
              { who: 'sleep', text: { de: 'Ich trage, was du liebst. Ich kann sie dir zurückgeben. Jeden Morgen ihr Lachen. Jede Nacht ihre Wärme. Kein Kampf mehr. Nur … Glück. Du musst nur aufhören zu graben.', en: 'I wear what you love. I can give her back to you. Her laughter every morning. Her warmth every night. No more fighting. Just … happiness. You only have to stop digging.' } },
              { who: 'sleep', text: { de: 'Was sagst du, mein Gefäß?', en: 'What do you say, my Vessel?' }, choices: [
                { text: { de: 'Widerstehen. („Sie würde mich niemals bitten aufzuhören.")', en: '"She would never ask me to stop." (Resist)' }, set: { d_resist: 1 } },
                { text: { de: 'Schwanken. („Ich … will es so sehr. Aber nicht so. NICHT SO.")', en: '"I … want it so much. But not like this. NOT LIKE THIS." (Waver)' }, set: { d_waver: 1 } },
              ]},
              { who: 'sleep', text: { de: '(Die Gestalt lächelt traurig und zerfällt zu Gold.) Du warst immer am gefährlichsten, wenn du liebst. Ich erinnere mich.', en: '(The figure smiles sadly and crumbles to gold.) You were always most dangerous when you love. I remember.' } },
            ]},
        ],
      },
      {
        id: 'caramel', song: 'Caramel',
        desc: { de: 'Arcadia zeigt seine schönste Seite: perfekte Städte, perfekte Menschen. Doch unter dem Gold liegt Fäulnis.', en: 'Arcadia shows its loveliest face: perfect cities, perfect people. But beneath the gold lies rot.' },
        xp: 380, ach: 'maskmaker',
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Die goldene Hauptstadt empfängt Vessel mit Jubel. Jeder kennt seinen Namen. Jeder liebt ihn. Niemand hat ein Gesicht unter der Maske.', en: 'The golden capital greets Vessel with cheers. Everyone knows his name. Everyone loves him. No one has a face beneath the mask.' } },
            { who: 'vessel', text: { de: 'Süß. Klebrig. Künstlich. Wie Karamell über verdorbenem Obst.', en: 'Sweet. Sticky. Artificial. Like caramel over spoiled fruit.' } },
          ]},
          { type: 'collect', count: 3, positions: [[30, 10], [19, 28], [38, -8]], label: { de: 'Reiß die goldenen Masken herunter', en: 'Tear down the golden masks' } },
          { type: 'boss', label: { de: 'Stelle den Maskenmacher', en: 'Confront the Maskmaker' }, pos: [28, 8],
            def: { kind: 'maskmaker', name: { de: 'Der Maskenmacher', en: 'The Maskmaker' }, hp: 1700, dmg: 22, speed: 3.6, scale: 1.6, level: 20,
              attacks: ['melee', 'volley'], phases: [{ below: 0.5, add: ['summon'] }], summonKind: 'servant', patternCd: 4 } },
          { type: 'scene', lines: [
            { who: 'mask', text: { de: '(im Fallen) Ich habe ihnen nur gegeben … was sie wollten. Niemand … will ein echtes Gesicht …', en: '(falling) I only gave them … what they wanted. No one … wants a real face …' } },
            { who: 'narrator', text: { de: 'Unter seiner letzten Maske: nichts. Arcadia wurde von Sleep erschaffen – Schicht um Schicht, Lüge um Lüge.', en: 'Beneath his last mask: nothing. Arcadia was made by Sleep — layer upon layer, lie upon lie.' } },
          ]},
        ],
      },
      {
        id: 'even-in-arcadia', song: 'Even In Arcadia',
        desc: { de: 'Vessel erreicht das Herz der Traumwelt. Hier begann alles: Hier wurde er auserwählt.', en: 'Vessel reaches the heart of the dream world. Here it all began: here he was chosen.' },
        xp: 400,
        steps: [
          { type: 'goto', pos: [0, -3], label: { de: 'Betritt den goldenen Tempel im Zentrum', en: 'Enter the golden temple at the center' } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Im Inneren des Tempels: ein Kinderzimmer. Vessels Kinderzimmer. Bis ins letzte Detail – inklusive der Angst unter dem Bett.', en: "Inside the temple: a child's bedroom. Vessel's bedroom. Down to the last detail — including the fear under the bed." } },
            { who: 'narrator', text: { de: 'Arcadia war von Anfang an Sleeps letzte Verteidigung. Nicht Eden. Nicht die Traumlande. HIER wurde Vessel ausgewählt. Hier begann alles.', en: "Arcadia was Sleep's last defense from the beginning. Not Eden. Not the Dreamlands. HERE Vessel was chosen. Here it all began." } },
            { who: 'vessel', text: { de: 'Du hast mich nicht in den Träumen gefunden. Du warst schon da, als ich das erste Mal allein im Dunkeln lag.', en: 'You did not find me in the dreams. You were already there the first time I lay alone in the dark.' } },
          ]},
          { type: 'boss', label: { de: 'Besiege den Ersten Traum', en: 'Defeat the First Dream' }, pos: [0, -22],
            def: { kind: 'firstdream', name: { de: 'Der Erste Traum', en: 'The First Dream' }, hp: 1900, dmg: 24, speed: 3.6, scale: 2.2, level: 21,
              attacks: ['melee', 'slam', 'volley'], phases: [{ below: 0.5, add: ['charge'] }], patternCd: 4 } },
        ],
      },
      {
        id: 'providence', song: 'Providence',
        desc: { de: 'Im Archiv der Erinnerungen wird der Ursprung enthüllt: Sleep ist keine Gottheit. Sleep ist die Summe aller Ängste.', en: 'In the archive of memories the origin is revealed: Sleep is no deity. Sleep is the sum of all fears.' },
        xp: 380,
        steps: [
          { type: 'goto', pos: [-45, 20], label: { de: 'Betritt das Archiv der Erinnerungen', en: 'Enter the archive of memories' } },
          { type: 'collect', count: 4, positions: [[-50, 25], [-40, 32], [-55, 12], [-38, 15]], label: { de: 'Öffne die ältesten Archive', en: 'Open the oldest archives' } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Die Archive zeigen keine Götterschlachten. Sie zeigen: ein Kind, das nachts weint. Eine Witwe am leeren Tisch. Einen Soldaten, der nicht schlafen kann.', en: 'The archives show no battles of gods. They show: a child crying at night. A widow at an empty table. A soldier who cannot sleep.' } },
            { who: 'narrator', text: { de: 'Jeder Schmerz. Jede Sehnsucht. Jede unerfüllte Liebe. Tropfen für Tropfen, Zeitalter um Zeitalter – daraus gerann Sleep.', en: 'Every pain. Every longing. Every unfulfilled love. Drop by drop, age by age — from these Sleep congealed.' } },
            { who: 'vessel', text: { de: 'Wir haben dich erschaffen. Alle zusammen. Und dann haben wir uns vor dir gefürchtet – vor unserem eigenen Spiegelbild.', en: 'We created you. All of us together. And then we feared you — feared our own reflection.' } },
          ]},
        ],
      },
      {
        id: 'gethsemane', song: 'Gethsemane',
        desc: { de: 'Wie einst in einem Garten vor einer Opferung muss Vessel seine Entscheidung treffen. Davor: die stärkste Form des Gottes.', en: 'As once in a garden before a sacrifice, Vessel must make his choice. Before it: the strongest form of the god.' },
        xp: 450, ach: 'crowned',
        steps: [
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Ein Garten aus weißem Marmor, still wie vor einem Urteil. Vessel durchlebt Visionen aller Zeitalter: One. Two. Sundowning. Die Grabstätten. Eden.', en: 'A garden of white marble, still as before a verdict. Vessel relives visions of every age: One. Two. Sundowning. The Tombs. Eden.' } },
          ]},
          { type: 'goto', pos: [-20, -45], label: { de: 'Durchschreite die Vision der Schwelle', en: 'Walk through the vision of the Threshold' } },
          { type: 'goto', pos: [5, -55], label: { de: 'Durchschreite die Vision der Nacht', en: 'Walk through the vision of the Night' } },
          { type: 'goto', pos: [30, -48], label: { de: 'Durchschreite die Vision von Eden', en: 'Walk through the vision of Eden' } },
          { type: 'scene', lines: [
            { who: 'sleep', text: { de: 'Genug der Pilgerfahrt. Du willst eine Entscheidung treffen? Dann triff sie vor meiner WAHREN Gestalt.', en: 'Enough of the pilgrimage. You want to make a choice? Then make it before my TRUE form.' } },
            { who: 'narrator', text: { de: 'Der Himmel über Arcadia reißt auf. Gekrönt mit dem Gold aller Opfergaben steigt der Gott herab.', en: 'The sky over Arcadia tears open. Crowned with the gold of all offerings, the god descends.' } },
          ]},
          { type: 'boss', label: { de: 'Bezwinge The Crowned Sleep', en: 'Defeat The Crowned Sleep' }, pos: [10, -50],
            def: { kind: 'crowned', name: { de: 'The Crowned Sleep', en: 'The Crowned Sleep' }, hp: 2400, dmg: 26, speed: 3.8, scale: 2.6, level: 22,
              attacks: ['melee', 'slam', 'volley'], phases: [{ below: 0.66, add: ['charge'] }, { below: 0.33, add: ['summon'] }], summonKind: 'servant', patternCd: 3.8 } },
          { type: 'scene', lines: [
            { who: 'sleep', text: { de: '(die Krone zerbricht) Du … kniest nicht mehr. Wann genau … hast du aufgehört zu knien?', en: '(the crown shatters) You … no longer kneel. When exactly … did you stop kneeling?' } },
            { who: 'narrator', text: { de: 'Hinter dem fallenden Gott öffnet sich ein Riss in der Wirklichkeit. Dahinter: Wasser, das die Sterne spiegelt. Der letzte Ort.', en: 'Behind the falling god a rift opens in reality. Beyond it: water that mirrors the stars. The final place.' } },
          ]},
        ],
      },
      {
        id: 'infinite-baths', song: 'Infinite Baths',
        desc: { de: 'Das Ende aller Träume. Ein Ozean aus Erinnerungen, unendlich und still. Hier wartet Sleep – nicht als Feind. Als Spiegel.', en: 'The end of all dreams. An ocean of memories, infinite and still. Here Sleep waits — not as a foe. As a mirror.' },
        xp: 600,
        steps: [
          { type: 'zone', to: 'baths', label: { de: 'Durchschreite den Riss', en: 'Step through the rift' } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Der letzte Ort existiert außerhalb von Raum und Zeit. Ein Ozean aus Erinnerungen. Unendlich. Still.', en: 'The final place exists outside space and time. An ocean of memories. Infinite. Still.' } },
            { who: 'narrator', text: { de: 'Auf dem Wasser wartet eine Gestalt. Nicht drohend. Nicht göttlich. Nur … müde.', en: 'A figure waits upon the water. Not threatening. Not divine. Just … tired.' } },
            { who: 'sleep', text: { de: 'Willkommen am Grund von allem, Vessel. Lass uns beenden, was deine Angst begonnen hat.', en: 'Welcome to the bottom of everything, Vessel. Let us finish what your fear began.' } },
          ]},
          { type: 'boss', label: { de: 'Phase I – Vessel gegen Sleep', en: 'Phase I — Vessel against Sleep' }, pos: [0, -15],
            def: { kind: 'sleepgod', name: { de: 'Sleep', en: 'Sleep' }, hp: 2000, dmg: 26, speed: 3.8, scale: 2.4, level: 23,
              attacks: ['melee', 'slam', 'volley'], phases: [{ below: 0.5, add: ['charge'] }], patternCd: 3.6 } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Der Gott sinkt ins Wasser – und das Wasser wirft ein Bild zurück. Vessels Bild. Es steigt heraus und zieht eine Klinge aus Licht.', en: "The god sinks into the water — and the water throws back an image. Vessel's image. It rises and draws a blade of light." } },
            { who: 'mirror', text: { de: 'Du kannst ihn nicht besiegen, ohne MICH zu besiegen. Ich bin alles, was du an dir hasst.', en: 'You cannot defeat him without defeating ME. I am everything you hate about yourself.' } },
          ]},
          { type: 'boss', label: { de: 'Phase II – Vessel gegen sich selbst', en: 'Phase II — Vessel against himself' }, pos: [0, -12],
            def: { kind: 'mirror', name: { de: 'Das Spiegelbild', en: 'The Reflection' }, hp: 1600, dmg: 24, speed: 5.2, scale: 1.25, level: 23,
              attacks: ['melee', 'charge', 'volley'], patternCd: 3.0 } },
          { type: 'scene', lines: [
            { who: 'narrator', text: { de: 'Das Spiegelbild zerspringt. Doch aus den Scherben kriecht etwas Drittes: kälter als Sleep, leerer als jede Nacht. DIE LEERE – das, was bleibt, wenn man alle Träume tötet.', en: 'The reflection shatters. But from the shards crawls something third: colder than Sleep, emptier than any night. THE VOID — what remains when you kill all dreams.' } },
            { who: 'sleep', text: { de: '(richtet sich neben Vessel auf) Das … ist nicht meins. Das ist, was nach mir käme. Kämpfen wir. EIN letztes Mal – zusammen.', en: '(rises beside Vessel) That … is not mine. That is what would come after me. Let us fight. ONE last time — together.' } },
          ]},
          { type: 'boss', label: { de: 'Phase III – Vessel & Sleep gegen die Leere', en: 'Phase III — Vessel & Sleep against the Void' }, pos: [0, -18], allySleep: true,
            def: { kind: 'voidheart', name: { de: 'Die Leere', en: 'The Void' }, hp: 2200, dmg: 26, speed: 2.6, scale: 1.6, level: 24,
              attacks: ['volley', 'slam'], phases: [{ below: 0.5, add: ['summon'] }], summonKind: 'shadow', patternCd: 3.2 } },
          { type: 'ending' },
        ],
      },
    ],
  },
];

// Anzahl aller Quests (zur Kontrolle: muss 51 sein)
export const TOTAL_QUESTS = CHAPTERS.reduce((n, c) => n + c.quests.length, 0);
