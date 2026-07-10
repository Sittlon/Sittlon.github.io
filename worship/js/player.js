// ============================================================
//  player.js – Spielfigur: Bewegung, Kamera, Kampf,
//  Charakterwechsel (Vessel / II / III / IV), Stufen & Energie
// ============================================================

import * as THREE from 'three';
import { CONFIG, CHAR_INFO, PLAYABLE_ORDER, xpForLevel } from './config.js';
import { createRig } from './characters.js';
import { INPUT } from './input.js';
import { AUDIO } from './audio.js';
import { clamp, angleDamp, TAU } from './utils.js';
import { t, tx } from './i18n.js';

export class Player {
  constructor(game) {
    this.game = game;
    this.group = new THREE.Group();
    game.scene.add(this.group);

    this.rigs = {};                       // gecachte Rigs pro Charakter
    this.unlocked = new Set(['vessel']);
    this.active = 'vessel';
    this._mountRig('vessel');

    // sanftes Aura-Licht, damit die Figur in dunklen Zonen lesbar bleibt
    const aura = new THREE.PointLight(0xbfb4e8, 14, 18, 1.4);
    aura.position.set(0, 2.4, 0);
    this.group.add(aura);

    // Werte
    this.level = 1;
    this.xp = 0;
    this.maxHpBonus = 0;
    this.hp = this.maxHp;
    this.energy = CONFIG.energyMax;
    this.dead = false;

    // Bewegung / Kamera
    this.facing = 0;                      // Blickrichtung der Figur
    this.camYaw = Math.PI;                // Kamera schaut anfangs Richtung Süden->Zentrum
    this.camPitch = 0.38;
    this.camDist = CONFIG.camDistance;
    this.vel = new THREE.Vector3();

    // Kampf
    this.atkTimer = -1;                   // <0 = kein Angriff
    this.abilityCd = 0;
    this.dodgeCd = 0;
    this.dodgeT = -1;
    this.dodgeDir = 0;
    this.switchCd = 0;
    this.invuln = 0;
    this.combatTimer = 0;                 // > 0 = „im Kampf"
    this._didHit = false;
  }

  // ---------- Charaktere ----------
  _mountRig(kind) {
    if (this.rig) this.group.remove(this.rig.group);
    if (!this.rigs[kind]) this.rigs[kind] = createRig(kind);
    this.rig = this.rigs[kind];
    this.rig.resetPose();          // sicherstellen, dass keine alte Todespose hängenbleibt
    this.group.add(this.rig.group);
  }

  get charInfo() { return CHAR_INFO[this.active]; }
  get pos() { return this.group.position; }

  switchTo(kind) {
    if (!this.unlocked.has(kind) || kind === this.active || this.switchCd > 0 || this.dead) return;
    this.active = kind;
    this.switchCd = 0.8;
    this.atkTimer = -1;
    this._mountRig(kind);
    AUDIO.sfx('choice');
    this.game.ui.toast(t('char_takeover', this.charInfo.name, tx(this.charInfo.weapon), tx(this.charInfo.abilityName)));
    this.game.ui.refreshChars(this);
  }

  unlockChar(kind) {
    if (this.unlocked.has(kind)) return;
    this.unlocked.add(kind);
    const info = CHAR_INFO[kind];
    this.game.ui.toast(t('char_unlocked', info.name, tx(info.desc), tx(info.abilityName), tx(info.abilityDesc)), 7000);
    this.game.ui.refreshChars(this);
  }

  // ---------- Werte ----------
  get maxHp() {
    return CONFIG.baseHp + CONFIG.hpPerLevel * (this.level - 1) + this.maxHpBonus;
  }
  get baseDamage() {
    let d = CONFIG.baseDmg * Math.pow(CONFIG.dmgGrowth, this.level - 1) * this.charInfo.dmgMult;
    if (this.game.quests && this.game.quests.flags.ascended) d *= 1.1;
    return d;
  }

  gainXP(amount) {
    this.xp += Math.round(amount);
    let leveled = false;
    while (this.xp >= xpForLevel(this.level)) {
      this.xp -= xpForLevel(this.level);
      this.level++;
      leveled = true;
    }
    if (leveled) {
      AUDIO.sfx('levelup');
      this.hp = this.maxHp;
      this.game.ui.toast(t('level_up', this.level));
    }
  }

  applyMaxHpDelta(d) {
    this.maxHpBonus += d;
    this.hp = Math.min(this.hp, this.maxHp);
    if (d < 0) this.game.ui.toast(t('sacrifice_hp', d));
  }

  healFull() {
    this.hp = this.maxHp;
    AUDIO.sfx('heal');
  }

  takeDamage(amount, fromPos = null) {
    if (this.dead || this.invuln > 0 || this.dodgeT >= 0) return;
    this.hp -= amount;
    this.invuln = CONFIG.invulnAfterHit;
    this.combatTimer = 4;
    this.rig.hitFlash();
    AUDIO.sfx('hurt');
    this.game.ui.damageFlash();
    if (fromPos) {
      const dx = this.pos.x - fromPos.x, dz = this.pos.z - fromPos.z;
      const len = Math.hypot(dx, dz) || 1;
      this.pos.x += (dx / len) * 0.5;
      this.pos.z += (dz / len) * 0.5;
    }
    if (this.hp <= 0) this.die();
  }

  die() {
    this.dead = true;
    this.hp = 0;
    AUDIO.sfx('death');
    this.game.onPlayerDeath();
  }

  respawn() {
    this.dead = false;
    this.hp = Math.round(this.maxHp * 0.6);
    this.energy = CONFIG.energyMax;
    const sp = this.game.zoneSpawn;
    this.pos.set(sp[0], 0, sp[1]);
    this.invuln = 1.5;
    this.atkTimer = -1;
    this.dodgeT = -1;
    this.rig.resetPose();          // Todespose zurücksetzen (sonst bleibt die Figur „liegen")
  }

  // ---------- Speichern ----------
  serialize() {
    return {
      level: this.level, xp: this.xp, hp: this.hp, maxHpBonus: this.maxHpBonus,
      unlocked: [...this.unlocked], active: this.active,
    };
  }
  restore(d) {
    if (!d) return;
    this.level = d.level || 1;
    this.xp = d.xp || 0;
    this.maxHpBonus = d.maxHpBonus || 0;
    this.unlocked = new Set(d.unlocked || ['vessel']);
    this.active = d.unlocked && d.unlocked.includes(d.active) ? d.active : 'vessel';
    this._mountRig(this.active);
    this.hp = Math.min(d.hp || this.maxHp, this.maxHp);
  }

  // ---------- Fähigkeiten ----------
  _useAbility() {
    const info = this.charInfo;
    if (this.abilityCd > 0 || this.energy < info.abilityCost) return;
    this.energy -= info.abilityCost;
    this.abilityCd = info.abilityCooldown;
    this.combatTimer = 4;
    const em = this.game.em;
    const dmg = this.baseDamage;
    const fx = Math.sin(this.camYaw), fz = Math.cos(this.camYaw);
    AUDIO.sfx('ability');

    if (this.active === 'vessel') {
      // Klagelied: durchdringende Emotionswelle
      em.spawnProjectile({
        from: [this.pos.x + fx, 1.4, this.pos.z + fz],
        dir: [fx, 0, fz], speed: 22, dmg: dmg * 2.4, owner: 'player', color: 0x9aa8ff, r: 0.42,
      });
    } else if (this.active === 'two') {
      // Rhythmus der Erde: Schockwelle
      em.spawnShockRing([this.pos.x, this.pos.z], 6, 0x9fe8d0);
      em.applyRadial(this.pos, 6, dmg * 1.8, 3.2);
      AUDIO.sfx('shock');
    } else if (this.active === 'three') {
      // Gravitas: heranziehen + Schaden
      em.pullEnemies(this.pos, 11, 4.5);
      em.spawnShockRing([this.pos.x, this.pos.z], 10, 0x9fb6e8);
      em.applyRadial(this.pos, 11, dmg * 0.9, 0);
    } else if (this.active === 'four') {
      // Riff: drei schneidende Projektile
      for (const off of [-0.22, 0, 0.22]) {
        const a = this.camYaw + off;
        em.spawnProjectile({
          from: [this.pos.x + Math.sin(a), 1.3, this.pos.z + Math.cos(a)],
          dir: [Math.sin(a), 0, Math.cos(a)], speed: 24, dmg: dmg * 1.0, owner: 'player', color: 0xe89f9f, r: 0.24,
        });
      }
    }
  }

  _startAttack() {
    if (this.atkTimer >= 0 || this.dodgeT >= 0) return;
    this.atkTimer = 0;
    this._didHit = false;
    this.facing = this.camYaw; // zur Kamerablickrichtung ausrichten
    AUDIO.sfx('swing');
  }

  _startDodge(moveDir) {
    if (this.dodgeCd > 0 || this.energy < CONFIG.dodgeEnergy) return;
    this.dodgeT = 0;
    this.dodgeCd = CONFIG.dodgeCooldown;
    this.energy -= CONFIG.dodgeEnergy;
    this.dodgeDir = moveDir != null ? moveDir : this.facing;
    AUDIO.sfx('dodge');
  }

  // ---------- pro Frame ----------
  update(dt) {
    const game = this.game;

    // Timer
    this.abilityCd = Math.max(0, this.abilityCd - dt);
    this.dodgeCd = Math.max(0, this.dodgeCd - dt);
    this.switchCd = Math.max(0, this.switchCd - dt);
    this.invuln = Math.max(0, this.invuln - dt);
    this.combatTimer = Math.max(0, this.combatTimer - dt);

    // Energie regenerieren
    const regen = this.combatTimer > 0 ? CONFIG.energyRegenCombat : CONFIG.energyRegen;
    this.energy = clamp(this.energy + regen * dt, 0, CONFIG.energyMax);

    if (this.dead) {
      this.rig.update(dt, { dead: 1 });
      this._updateCamera(dt);
      return;
    }

    // ---- Eingaben ----
    // Kamera (Maus-Look bei Pointer-Lock ODER Touch-Wischen)
    const sens = CONFIG.camSensitivity * (game.settings.sensitivity || 1);
    this.camYaw -= (INPUT.mouseDX + INPUT.lookDX) * sens;
    this.camPitch = clamp(this.camPitch + (INPUT.mouseDY + INPUT.lookDY) * sens, -0.12, 1.15);
    if (INPUT.wheel) this.camDist = clamp(this.camDist + INPUT.wheel * 0.8, CONFIG.camMinDist, CONFIG.camMaxDist);

    // Charakterwechsel
    const keys = ['Digit1', 'Digit2', 'Digit3', 'Digit4'];
    keys.forEach((k, i) => {
      if (INPUT.wasPressed(k)) this.switchTo(PLAYABLE_ORDER[i]);
    });

    // Bewegung relativ zur Kamera
    // (A/D: +x bewegt die Figur nach links auf dem Bildschirm, da die Kamera
    //  in Blickrichtung +z schaut und Welt-+x links erscheint)
    let ix = 0, iz = 0;
    if (INPUT.isDown('KeyW') || INPUT.isDown('ArrowUp')) iz += 1;
    if (INPUT.isDown('KeyS') || INPUT.isDown('ArrowDown')) iz -= 1;
    if (INPUT.isDown('KeyA') || INPUT.isDown('ArrowLeft')) ix += 1;
    if (INPUT.isDown('KeyD') || INPUT.isDown('ArrowRight')) ix -= 1;
    // virtueller Joystick (Touch): x = rechts, y = vorwärts
    if (INPUT.move.x !== 0 || INPUT.move.y !== 0) { ix -= INPUT.move.x; iz += INPUT.move.y; }
    const moving = Math.abs(ix) > 0.001 || Math.abs(iz) > 0.001;
    let moveDir = null;
    if (moving) {
      moveDir = this.camYaw + Math.atan2(ix, iz);
    }

    // Ausweichen
    if (INPUT.wasPressed('Space')) this._startDodge(moveDir);

    // Angriff & Fähigkeit (Maus nur bei Pointer-Lock; auf Touch über die Buttons)
    const canAct = INPUT.locked || INPUT.touch;
    if (INPUT.isDown('Mouse0') && canAct) this._startAttack();
    if ((INPUT.wasPressed('Mouse2') || INPUT.wasPressed('KeyQ')) && canAct) this._useAbility();

    // ---- Bewegung anwenden ----
    let speed = 0;
    if (this.dodgeT >= 0) {
      // Ausweichrolle
      this.dodgeT += dt;
      const f = 1 - this.dodgeT / CONFIG.dodgeTime;
      this.pos.x += Math.sin(this.dodgeDir) * CONFIG.dodgeSpeed * Math.max(0.2, f) * dt;
      this.pos.z += Math.cos(this.dodgeDir) * CONFIG.dodgeSpeed * Math.max(0.2, f) * dt;
      this.facing = this.dodgeDir;
      speed = 1.6;
      if (this.dodgeT >= CONFIG.dodgeTime) this.dodgeT = -1;
    } else if (moving && this.atkTimer < 0) {
      const sprint = INPUT.isDown('ShiftLeft') || INPUT.isDown('ShiftRight');
      const sp = CONFIG.moveSpeed * (sprint ? CONFIG.sprintMult : 1);
      this.pos.x += Math.sin(moveDir) * sp * dt;
      this.pos.z += Math.cos(moveDir) * sp * dt;
      this.facing = moveDir;
      speed = sprint ? 1.5 : 0.9;
    }

    // ---- Angriff ausführen ----
    let animAttack = null;
    if (this.atkTimer >= 0) {
      const dur = this.charInfo.atkTime;
      this.atkTimer += dt;
      const t = clamp(this.atkTimer / dur, 0, 1);
      animAttack = t;
      if (!this._didHit && t >= 0.45) {
        this._didHit = true;
        this.combatTimer = 4;
        const hits = game.em.applyMelee(this.pos, this.facing, CONFIG.meleeRange, CONFIG.meleeArc, this.baseDamage);
        if (this.active === 'two' && hits > 0) game.em.spawnShockRing([this.pos.x, this.pos.z], 2.4, 0x9fe8d0);
      }
      if (this.atkTimer >= dur) this.atkTimer = -1;
    }

    // Welt-Kollision
    game.em.collideWorld(this.pos);

    // Figur drehen & animieren
    this.group.rotation.y = angleDamp(this.group.rotation.y, this.facing, 14, dt);
    this.rig.update(dt, { speed, attackT: animAttack, heavy: this.active === 'two' });

    this._updateCamera(dt);
  }

  _updateCamera(dt) {
    const cam = this.game.camera;
    const target = new THREE.Vector3(this.pos.x, this.pos.y + CONFIG.camHeight, this.pos.z);
    const off = new THREE.Vector3(
      Math.sin(this.camYaw) * Math.cos(this.camPitch),
      Math.sin(this.camPitch),
      Math.cos(this.camYaw) * Math.cos(this.camPitch)
    ).multiplyScalar(-this.camDist);
    const desired = target.clone().add(off);
    cam.position.lerp(desired, 1 - Math.exp(-12 * dt));
    if (cam.position.y < 0.6) cam.position.y = 0.6;
    cam.lookAt(target);
  }
}
