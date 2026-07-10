// ============================================================
//  input.js – Tastatur, Maus (Pointer-Lock) & Touch
// ============================================================

class InputManager {
  constructor() {
    this.keys = new Set();        // gehaltene Tasten (event.code / virtuelle Codes)
    this.pressed = new Set();     // in diesem Frame gedrückt
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.lookDX = 0;              // Kamera-Delta aus Touch-Wischen
    this.lookDY = 0;
    this.wheel = 0;
    this.locked = false;
    this.lockTarget = null;
    this.onLockChange = null;     // Callback (locked:boolean)
    this.touch = false;           // Touch-Modus aktiv?
    this.move = { x: 0, y: 0 };   // virtueller Joystick (-1..1), x = rechts, y = vorwärts
    this._bound = false;
  }

  init(lockTarget) {
    if (this._bound) { this.lockTarget = lockTarget; return; }
    this._bound = true;
    this.lockTarget = lockTarget;

    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      this.keys.add(e.code);
      this.pressed.add(e.code);
      // Browser-Standardaktionen verhindern, die das Spiel stören
      if (['Space', 'Tab', 'KeyQ'].includes(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => this.keys.clear());

    document.addEventListener('mousemove', (e) => {
      if (this.touch) return;
      if (this.locked) {
        this.mouseDX += e.movementX || 0;
        this.mouseDY += e.movementY || 0;
      }
    });
    document.addEventListener('mousedown', (e) => {
      if (this.touch) return;       // auf Touch-Geräten kommen nur synthetische Maus-Events
      const code = 'Mouse' + e.button;
      this.keys.add(code);
      this.pressed.add(code);
    });
    document.addEventListener('mouseup', (e) => { if (!this.touch) this.keys.delete('Mouse' + e.button); });
    document.addEventListener('wheel', (e) => { if (this.locked) this.wheel += Math.sign(e.deltaY); }, { passive: true });
    document.addEventListener('contextmenu', (e) => {
      if (this.locked) e.preventDefault();
    });

    // Erster echter Touch schaltet die Touch-Steuerung frei
    window.addEventListener('touchstart', () => this.enableTouch(), { passive: true });
    // Reine Touch-Geräte (kein Mauszeiger) sofort umstellen
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches &&
        !window.matchMedia('(pointer: fine)').matches) {
      this.enableTouch();
    }

    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === this.lockTarget;
      if (this.onLockChange) this.onLockChange(this.locked);
    });
  }

  enableTouch() {
    if (this.touch) return;
    this.touch = true;
    document.body.classList.add('touch');
  }

  lock() {
    if (this.touch) return;        // Pointer-Lock existiert auf Touch-Geräten nicht
    if (!this.locked && this.lockTarget && document.pointerLockElement !== this.lockTarget) {
      const p = this.lockTarget.requestPointerLock();
      if (p && p.catch) p.catch(() => {});
    }
  }

  unlock() {
    if (document.pointerLockElement) document.exitPointerLock();
  }

  // ---- virtuelle Eingaben (Touch-Buttons) ----
  vKeyDown(code) { this.keys.add(code); this.pressed.add(code); }
  vKeyUp(code) { this.keys.delete(code); }
  vPress(code) { this.pressed.add(code); }
  setMove(x, y) { this.move.x = x; this.move.y = y; }
  addLook(dx, dy) { this.lookDX += dx; this.lookDY += dy; }

  isDown(code) { return this.keys.has(code); }
  wasPressed(code) { return this.pressed.has(code); }

  // am Ende jedes Frames aufrufen
  endFrame() {
    this.pressed.clear();
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.lookDX = 0;
    this.lookDY = 0;
    this.wheel = 0;
  }
}

export const INPUT = new InputManager();
