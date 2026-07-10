// ============================================================
//  dialogue.js – Dialoge & Zwischensequenzen
// ============================================================

import { SPEAKERS } from './config.js';
import { AUDIO } from './audio.js';
import { INPUT } from './input.js';
import { escapeHtml } from './utils.js';
import { tx } from './i18n.js';

export class DialogueRunner {
  constructor(game) {
    this.game = game;
    this.active = false;
    this.el = {
      box: document.getElementById('dialog'),
      name: document.getElementById('dialog-name'),
      text: document.getElementById('dialog-text'),
      choices: document.getElementById('dialog-choices'),
      hint: document.getElementById('dialog-hint'),
      scene: document.getElementById('cutscene'),
      sceneText: document.getElementById('scene-text'),
    };
  }

  // Wartet auf Klick / Tipp / Leertaste / E
  _waitAdvance() {
    return new Promise((resolve) => {
      const onKey = (e) => {
        if (['Space', 'KeyE', 'Enter'].includes(e.code)) { cleanup(); resolve(); }
      };
      const onClick = () => { cleanup(); resolve(); };
      const cleanup = () => {
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('pointerdown', onClick);
      };
      window.addEventListener('keydown', onKey);
      window.addEventListener('pointerdown', onClick);
    });
  }

  // Schreibmaschinen-Effekt; vorzeitiger Klick/Tipp zeigt alles sofort
  async _typewrite(elem, text) {
    let skip = false;
    const onSkip = () => { skip = true; };
    window.addEventListener('pointerdown', onSkip);
    window.addEventListener('keydown', onSkip);
    elem.textContent = '';
    for (let i = 0; i < text.length; i++) {
      if (skip) { elem.textContent = text; break; }
      elem.textContent += text[i];
      if (i % 3 === 0) AUDIO.sfx('dialog');
      await new Promise(r => setTimeout(r, 17));
    }
    window.removeEventListener('pointerdown', onSkip);
    window.removeEventListener('keydown', onSkip);
    // kurz warten, damit der Skip-Klick nicht sofort weiterblättert
    await new Promise(r => setTimeout(r, 120));
  }

  // ---------- Dialogbox (Gespräche) ----------
  // lines: [{who, text}], optional letzte Zeile mit choices:[{text, set, value}]
  // gibt {value, flags} zurück
  async runDialog(lines, { talkNpc = null } = {}) {
    if (!lines || !lines.length) return { value: null, flags: {} };
    this.active = true;
    const prevState = this.game.state;
    this.game.setState('DIALOG');
    if (talkNpc) talkNpc.talking = true;
    this.el.box.classList.remove('hidden');
    const flags = {};
    let value = null;

    for (const line of lines) {
      const sp = SPEAKERS[line.who] || SPEAKERS.narrator;
      this.el.name.textContent = tx(sp.name);
      this.el.name.style.color = sp.color;
      this.el.choices.innerHTML = '';
      this.el.choices.classList.add('hidden');
      this.el.hint.classList.remove('hidden');

      await this._typewrite(this.el.text, tx(line.text));

      if (line.choices && line.choices.length) {
        // Auswahl anzeigen
        this.el.hint.classList.add('hidden');
        this.el.choices.classList.remove('hidden');
        INPUT.unlock();
        value = await new Promise((resolve) => {
          const pick = (c, idx) => {
            window.removeEventListener('keydown', onKey);
            AUDIO.sfx('choice');
            if (c.set) Object.assign(flags, c.set);
            resolve(c.value != null ? c.value : idx);
          };
          line.choices.forEach((c, idx) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `<span class="choice-num">${idx + 1}</span> ${escapeHtml(tx(c.text))}`;
            btn.onclick = () => pick(c, idx);
            this.el.choices.appendChild(btn);
          });
          const onKey = (e) => {
            const n = parseInt(e.key, 10);
            if (n >= 1 && n <= line.choices.length) pick(line.choices[n - 1], n - 1);
          };
          window.addEventListener('keydown', onKey);
        });
        // verbrauchte Auswahl sofort entfernen, damit keine verwaisten Buttons bleiben
        this.el.choices.innerHTML = '';
        this.el.choices.classList.add('hidden');
      } else {
        await this._waitAdvance();
      }
    }

    this.el.box.classList.add('hidden');
    this.el.choices.innerHTML = '';
    this.el.choices.classList.add('hidden');
    if (talkNpc) talkNpc.talking = false;
    this.active = false;
    this.game.setState(prevState === 'DIALOG' ? 'PLAYING' : prevState);
    return { value, flags };
  }

  // ---------- Zwischensequenz (Letterbox, zentrierter Text) ----------
  // opaque=true: vollflächig schwarzer Hintergrund (z. B. für die Eröffnung)
  async runScene(lines, { opaque = false } = {}) {
    if (!lines || !lines.length) return;
    this.active = true;
    const prevState = this.game.state;
    this.game.setState('DIALOG');
    this.el.scene.classList.toggle('opaque', opaque);
    this.el.scene.classList.remove('hidden');
    await new Promise(r => setTimeout(r, 350));

    for (const line of lines) {
      const sp = SPEAKERS[line.who] || SPEAKERS.narrator;
      const spName = tx(sp.name);
      const label = spName ? `<span class="scene-speaker" style="color:${sp.color}">${escapeHtml(spName)}</span>` : '';
      this.el.sceneText.innerHTML = label + '<span class="scene-line"></span>';
      const target = this.el.sceneText.querySelector('.scene-line');
      await this._typewrite(target, tx(line.text));
      await this._waitAdvance();
    }

    this.el.scene.classList.add('hidden');
    this.el.scene.classList.remove('opaque');
    this.el.sceneText.innerHTML = '';
    this.active = false;
    this.game.setState(prevState === 'DIALOG' ? 'PLAYING' : prevState);
  }
}
