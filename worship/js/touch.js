// ============================================================
//  touch.js – Touch-Steuerung für Mobilgeräte
//  Linker Daumen: virtueller Joystick (Bewegung)
//  Rechte Seite: Wischen = Kamera
//  Buttons: Angriff (halten), Fähigkeit, Ausweichen, Interagieren, Pause
//  Alles speist die bestehende INPUT-Logik (virtuelle Tastencodes).
// ============================================================

import { INPUT } from './input.js';

const LOOK_MUL = 1.3;     // Empfindlichkeit des Kamera-Wischens
const JOY_RADIUS = 64;    // px – maximaler Daumen-Ausschlag

export function initTouchControls(game) {
  const canvas = game.renderer.domElement;
  const joy = document.getElementById('joystick');
  const knob = document.getElementById('joystick-knob');

  let moveId = null, moveOrigin = null;
  let lookId = null, lookLast = null;

  // Linke untere Bildhälfte steuert die Bewegung, der Rest die Kamera
  const isMoveZone = (t) =>
    t.clientX < window.innerWidth * 0.45 && t.clientY > window.innerHeight * 0.3;

  canvas.addEventListener('touchstart', (e) => {
    if (game.state !== 'PLAYING') return;
    for (const t of e.changedTouches) {
      if (moveId === null && isMoveZone(t)) {
        moveId = t.identifier;
        moveOrigin = { x: t.clientX, y: t.clientY };
        joy.style.left = t.clientX + 'px';
        joy.style.top = t.clientY + 'px';
        joy.classList.add('on');
        knob.style.transform = 'translate(-50%, -50%)';
      } else if (lookId === null) {
        lookId = t.identifier;
        lookLast = { x: t.clientX, y: t.clientY };
      }
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === moveId) {
        const dx = t.clientX - moveOrigin.x;
        const dy = t.clientY - moveOrigin.y;
        const len = Math.hypot(dx, dy) || 1;
        const clamped = Math.min(len, JOY_RADIUS);
        const ux = dx / len, uy = dy / len;
        // Bildschirm-y nach oben = vorwärts (+)
        INPUT.setMove(ux * (clamped / JOY_RADIUS), -uy * (clamped / JOY_RADIUS));
        knob.style.transform =
          `translate(calc(-50% + ${ux * clamped}px), calc(-50% + ${uy * clamped}px))`;
      } else if (t.identifier === lookId) {
        INPUT.addLook((t.clientX - lookLast.x) * LOOK_MUL, (t.clientY - lookLast.y) * LOOK_MUL);
        lookLast = { x: t.clientX, y: t.clientY };
      }
    }
  }, { passive: true });

  const endTouch = (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === moveId) {
        moveId = null;
        INPUT.setMove(0, 0);
        joy.classList.remove('on');
      } else if (t.identifier === lookId) {
        lookId = null;
      }
    }
  };
  canvas.addEventListener('touchend', endTouch, { passive: true });
  canvas.addEventListener('touchcancel', endTouch, { passive: true });

  // ---- Buttons ----
  const hold = (id, code) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('touchstart', (e) => {
      e.preventDefault(); e.stopPropagation();
      INPUT.vKeyDown(code); el.classList.add('pressed');
    }, { passive: false });
    const up = (e) => { e.preventDefault(); INPUT.vKeyUp(code); el.classList.remove('pressed'); };
    el.addEventListener('touchend', up, { passive: false });
    el.addEventListener('touchcancel', up, { passive: false });
  };
  const tap = (id, fn) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('touchstart', (e) => {
      e.preventDefault(); e.stopPropagation();
      fn(); el.classList.add('pressed');
    }, { passive: false });
    const up = (e) => { e.preventDefault(); el.classList.remove('pressed'); };
    el.addEventListener('touchend', up, { passive: false });
    el.addEventListener('touchcancel', up, { passive: false });
  };

  hold('tb-attack', 'Mouse0');
  tap('tb-ability', () => INPUT.vPress('KeyQ'));
  tap('tb-dodge', () => INPUT.vPress('Space'));
  tap('tb-interact', () => INPUT.vPress('KeyE'));
  tap('tb-pause', () => { if (game.state === 'PLAYING') game.pause(); });
}
