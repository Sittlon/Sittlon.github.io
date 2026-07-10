// ============================================================
//  entities.js – NPCs, Gegner, Bosse, Projektile, Portale,
//  Questmarker, Sammelobjekte & der EntityManager
// ============================================================

import * as THREE from 'three';
import { TAU, rand, clamp, dist2 } from './utils.js';
import { CONFIG } from './config.js';
import { createRig } from './characters.js';
import { AUDIO } from './audio.js';
import { tx } from './i18n.js';

// Gegner-Grundwerte: hp/dmg = [Basis, proStufe]
const ENEMY_DEFS = {
  shadow:   { hp: [26, 14], dmg: [6, 2],  speed: 4.4, scale: 1.0, name: 'Schatten' },
  feeder:   { hp: [18, 10], dmg: [5, 2],  speed: 6.2, scale: 1.0, name: 'Traumfresser' },
  servant:  { hp: [24, 12], dmg: [7, 2],  speed: 3.4, scale: 1.0, name: 'Maskendiener', ranged: true },
  guardian: { hp: [64, 30], dmg: [12, 4], speed: 3.0, scale: 1.25, name: 'Wächter', heavy: true },
};

function makeTextSprite(text, color = '#ffffff', size = 26) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 96;
  const ctx = canvas.getContext('2d');
  // Schrift verkleinern, bis der Text auf die Leinwand passt
  let fontSize = size * 2;
  do {
    ctx.font = `600 ${fontSize}px Georgia, serif`;
    if (ctx.measureText(text).width <= 980) break;
    fontSize -= 4;
  } while (fontSize > 18);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.9)';
  ctx.shadowBlur = 14;
  ctx.fillStyle = color;
  ctx.fillText(text, 512, 48);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sprite.scale.set(6.4, 0.6, 1);
  return sprite;
}

function makeBar() {
  const bg = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0x0a0a0a, transparent: true, opacity: 0.75, depthWrite: false }));
  bg.scale.set(1.3, 0.12, 1);
  const fg = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xd03a3a, transparent: true, opacity: 0.95, depthWrite: false }));
  fg.scale.set(1.26, 0.08, 1);
  const group = new THREE.Group();
  group.add(bg, fg);
  return {
    group,
    set(frac) {
      frac = clamp(frac, 0, 1);
      fg.scale.x = 1.26 * frac;
      fg.position.x = -(1 - frac) * 1.26 / 2;
    },
  };
}

// ------------------------------------------------------------
//  NPC
// ------------------------------------------------------------
export class NPC {
  constructor(em, def) {
    this.em = em;
    this.id = def.id;
    this.kind = def.kind;
    this.name = def.name;
    this.lines = def.lines || def.dialog || null;   // Gesprächszeilen (fixe NPCs nutzen `lines`)
    this.questTag = def.questTag || null;
    this.secretFlag = def.secretFlag || null;
    this.rig = createRig(def.kind, { scale: def.scale || 1 });
    this.group = this.rig.group;
    this.group.position.set(def.pos[0], 0, def.pos[1]);
    this.rig.baseY = 0;
    if (def.face != null) this.group.rotation.y = def.face;
    this.talking = false;
    const nameStr = tx(def.name);
    if (nameStr) {
      const label = makeTextSprite(nameStr, def.labelColor || '#e8dfc8');
      label.position.y = (def.scale || 1) * 2.15;
      this.group.add(label);
      this.label = label;
    }
    em.scene_add(this.group);
  }
  get pos() { return this.group.position; }
  update(dt, game) {
    // Spieler anschauen, wenn nah
    const p = game.player.pos;
    const d = dist2(p.x, p.z, this.pos.x, this.pos.z);
    if (d < 10) {
      const target = Math.atan2(p.x - this.pos.x, p.z - this.pos.z);
      this.group.rotation.y += (target - this.group.rotation.y) * Math.min(1, dt * 5);
    }
    this.rig.update(dt, { speed: 0, talk: this.talking });
  }
  dispose() { this.em.scene_remove(this.group); this.rig.dispose(); }
}

// ------------------------------------------------------------
//  Gegner
// ------------------------------------------------------------
export class Enemy {
  constructor(em, kind, pos, level = 1, opts = {}) {
    this.em = em;
    this.kind = kind;
    const def = ENEMY_DEFS[kind] || ENEMY_DEFS.shadow;
    this.def = def;
    this.level = level;
    this.maxHp = (def.hp[0] + def.hp[1] * level) * (opts.hpMult || 1);
    this.hp = this.maxHp;
    this.dmg = def.dmg[0] + def.dmg[1] * level;
    this.speed = def.speed * (opts.speedMult || 1);
    this.questTag = opts.questTag || null;
    this.isBoss = false;
    this.home = pos.slice();
    this.rig = createRig(kind, { scale: (def.scale || 1) * (opts.scale || 1) });
    this.group = this.rig.group;
    this.group.position.set(pos[0], 0, pos[1]);
    this.state = 'idle';
    this.attackT = null;
    this.attackCd = 0;
    this.hurtCd = 0;
    this.deadT = 0;
    this.dead = false;
    this.shootCd = rand(1, 2.5);
    this.bar = makeBar();
    this.bar.group.position.y = 2.3 * (def.scale || 1) * (opts.scale || 1);
    this.bar.group.visible = false;
    this.group.add(this.bar.group);
    this.aggroRange = opts.aggroRange || 15;
    this.meleeRange = 2.1 * (opts.scale || 1);
    em.scene_add(this.group);
  }

  get pos() { return this.group.position; }

  takeDamage(amount, game, fromPos = null) {
    if (this.dead) return;
    this.hp -= amount;
    this.rig.hitFlash();
    this.bar.group.visible = true;
    this.bar.set(this.hp / this.maxHp);
    this.state = 'chase';
    AUDIO.sfx('hit');
    if (fromPos) {
      // leichter Rückstoß
      const dx = this.pos.x - fromPos.x, dz = this.pos.z - fromPos.z;
      const len = Math.hypot(dx, dz) || 1;
      this.pos.x += (dx / len) * 0.35;
      this.pos.z += (dz / len) * 0.35;
    }
    if (this.hp <= 0) this.die(game);
  }

  die(game) {
    if (this.dead) return;
    this.dead = true;
    this.bar.group.visible = false;
    AUDIO.sfx('death');
    // XP-Kugeln fallen lassen
    const n = this.isBoss ? 10 : 2;
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU);
      this.em.spawnPickup('xp', [this.pos.x + Math.cos(a) * rand(0.3, 1.4), this.pos.z + Math.sin(a) * rand(0.3, 1.4)], {
        value: CONFIG.xpKillBase + CONFIG.xpKillPerLevel * this.level,
      });
    }
    if (!this.isBoss && Math.random() < 0.18) {
      this.em.spawnPickup('heal', [this.pos.x, this.pos.z], { value: 22 });
    }
    game.quests.onEnemyKilled(this);
  }

  update(dt, game) {
    if (this.dead) {
      this.deadT += dt;
      this.rig.update(dt, { dead: this.deadT / 0.9 });
      if (this.deadT > 0.95) this.em.removeEnemy(this);
      return;
    }
    const p = game.player.pos;
    const d = dist2(p.x, p.z, this.pos.x, this.pos.z);
    this.attackCd = Math.max(0, this.attackCd - dt);
    this.shootCd = Math.max(0, this.shootCd - dt);

    let speed = 0;
    if (this.state === 'idle') {
      if (d < this.aggroRange && !game.player.dead) this.state = 'chase';
    } else if (this.state === 'chase' && !game.player.dead) {
      const dir = Math.atan2(p.x - this.pos.x, p.z - this.pos.z);
      this.group.rotation.y = dir;
      if (this.def.ranged) {
        // Distanz halten & schießen
        if (d > 16) { this._move(dir, dt); speed = 1; }
        else if (d < 9) { this._move(dir + Math.PI, dt); speed = 1; }
        if (this.shootCd <= 0 && d < 22) {
          this.shootCd = 2.6;
          this.attackT = 0;
          this.em.spawnProjectile({
            from: [this.pos.x, 1.4, this.pos.z], target: [p.x, 1.2, p.z],
            speed: 13, dmg: this.dmg, owner: 'enemy', color: 0xe8c050, r: 0.22,
          });
          AUDIO.sfx('shoot');
        }
      } else {
        if (d > this.meleeRange) { this._move(dir, dt); speed = 1; }
        else if (this.attackCd <= 0) {
          this.attackT = 0;
          this.attackCd = this.def.heavy ? 2.2 : 1.5;
        }
      }
    }

    // Angriffsanimation + Trefferzeitpunkt
    let animAttack = null;
    if (this.attackT != null) {
      const dur = this.def.heavy ? 1.0 : 0.7;
      const before = this.attackT;
      this.attackT += dt / dur;
      animAttack = clamp(this.attackT, 0, 1);
      if (before < 0.5 && this.attackT >= 0.5 && !this.def.ranged) {
        if (d < this.meleeRange + 0.9 && !game.player.dead) {
          game.player.takeDamage(this.dmg, this.pos);
        }
      }
      if (this.attackT >= 1) { this.attackT = null; animAttack = null; }
    }

    this.em.collideWorld(this.pos);
    this.rig.update(dt, { speed, attackT: animAttack, heavy: this.def.heavy });
  }

  _move(dir, dt) {
    this.pos.x += Math.sin(dir) * this.speed * dt;
    this.pos.z += Math.cos(dir) * this.speed * dt;
  }

  dispose() { this.em.scene_remove(this.group); this.rig.dispose(); }
}

// ------------------------------------------------------------
//  Boss
// ------------------------------------------------------------
export class Boss extends Enemy {
  constructor(em, def, pos) {
    super(em, 'shadow', pos, def.level || 1, {});
    // Rig durch Boss-Modell ersetzen
    this.em.scene_remove(this.group);
    this.rig.dispose();
    this.rig = createRig(def.kind, { scale: def.scale || 1.6 });
    this.group = this.rig.group;
    this.group.position.set(pos[0], 0, pos[1]);
    this.bar = makeBar();
    this.bar.group.visible = false;
    this.group.add(this.bar.group);
    em.scene_add(this.group);

    this.isBoss = true;
    this.bossDef = def;
    this.name = tx(def.name);
    this.maxHp = def.hp;
    this.hp = def.hp;
    this.dmg = def.dmg;
    this.speed = def.speed || 3.6;
    this.level = def.level || 5;
    this.meleeRange = 2.6 * (def.scale || 1.6) * 0.8;
    this.aggroRange = 999;
    this.state = 'chase';
    this.patternCd = 2.0;
    this.currentAttack = null;
    this.attackPhase = 0;
    this.telegraph = null;
    this.chargeDir = 0;
    this.summons = 0;
    this.phaseIdx = 0;
    this.questTag = 'boss';
    AUDIO.sfx('boss');
  }

  availableAttacks() {
    let atk = [...(this.bossDef.attacks || ['melee'])];
    const frac = this.hp / this.maxHp;
    for (const ph of this.bossDef.phases || []) {
      if (frac <= ph.below && ph.add) atk = atk.concat(ph.add);
    }
    return atk;
  }

  takeDamage(amount, game, fromPos) {
    super.takeDamage(amount, game, fromPos);
    this.bar.group.visible = false; // Boss nutzt die große Leiste
    if (!this.dead) game.ui.bossBar(true, this.name, this.hp / this.maxHp);
  }

  die(game) {
    if (this.dead) return;
    super.die(game);
    game.ui.bossBar(false);
    this._clearTelegraph();
    game.quests.onBossKilled(this);
  }

  _clearTelegraph() {
    if (this.telegraph) {
      this.em.scene_remove(this.telegraph.mesh);
      this.telegraph.mesh.geometry.dispose();
      this.telegraph.mesh.material.dispose();
      this.telegraph = null;
    }
  }

  update(dt, game) {
    if (this.dead) {
      this.deadT += dt;
      this.rig.update(dt, { dead: this.deadT / 1.6 });
      if (this.deadT > 1.7) this.em.removeEnemy(this);
      return;
    }
    const p = game.player.pos;
    const d = dist2(p.x, p.z, this.pos.x, this.pos.z);
    const frac = this.hp / this.maxHp;
    const enraged = frac < 0.25;
    this.patternCd -= dt * (enraged ? 1.35 : 1);

    game.ui.bossBar(true, this.name, frac);

    // laufender Spezialangriff?
    if (this.currentAttack) {
      this._runAttack(dt, game, d, p);
    } else {
      // Verfolgen
      const dir = Math.atan2(p.x - this.pos.x, p.z - this.pos.z);
      this.group.rotation.y = dir;
      let speed = 0;
      if (d > this.meleeRange * 0.9) {
        this._move(dir, dt);
        speed = 1;
      }
      this.attackCd = Math.max(0, this.attackCd - dt);
      // Nahkampf
      if (d < this.meleeRange && this.attackCd <= 0) {
        this.attackT = 0;
        this.attackCd = 1.6;
      }
      // Muster wählen
      if (this.patternCd <= 0 && !game.player.dead) {
        const opts = this.availableAttacks().filter(a => a !== 'melee');
        if (opts.length) {
          this.currentAttack = opts[Math.floor(Math.random() * opts.length)];
          this.attackPhase = 0;
          this.patternCd = (this.bossDef.patternCd || 4.5) * (enraged ? 0.7 : 1);
        } else {
          this.patternCd = 2;
        }
      }
      let animAttack = null;
      if (this.attackT != null) {
        const before = this.attackT;
        this.attackT += dt / 0.9;
        animAttack = clamp(this.attackT, 0, 1);
        if (before < 0.5 && this.attackT >= 0.5) {
          if (d < this.meleeRange + 1.2 && !game.player.dead) game.player.takeDamage(this.dmg, this.pos);
        }
        if (this.attackT >= 1) { this.attackT = null; animAttack = null; }
      }
      this.em.collideWorld(this.pos);
      this.rig.update(dt, { speed, attackT: animAttack, heavy: true });
    }
  }

  _runAttack(dt, game, d, p) {
    const atk = this.currentAttack;
    this.attackPhase += dt;

    if (atk === 'slam') {
      // Telegraph am Spielerort, dann Flächenschlag
      if (!this.telegraph) {
        const r = 4.2;
        const mesh = new THREE.Mesh(
          new THREE.RingGeometry(r - 0.35, r, 28),
          new THREE.MeshBasicMaterial({ color: 0xff4030, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
        );
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(p.x, 0.06, p.z);
        this.em.scene_add(mesh);
        this.telegraph = { mesh, r, t: 0 };
        AUDIO.sfx('roar');
      }
      this.telegraph.t += dt;
      this.telegraph.mesh.material.opacity = 0.35 + Math.sin(this.telegraph.t * 16) * 0.25;
      if (this.telegraph.t >= 1.0) {
        const tp = this.telegraph.mesh.position;
        const inside = dist2(p.x, p.z, tp.x, tp.z) < this.telegraph.r;
        // Aufschlag-Effekt
        this.em.spawnShockRing([tp.x, tp.z], this.telegraph.r, 0xff6a40);
        if (inside && !game.player.dead) game.player.takeDamage(this.dmg * 1.4, tp);
        AUDIO.sfx('shock');
        this._clearTelegraph();
        this.currentAttack = null;
      }
      this.rig.update(dt, { speed: 0, attackT: clamp(this.attackPhase, 0, 1), heavy: true });

    } else if (atk === 'volley') {
      // Projektilring + gezielte Schüsse
      if (this.attackPhase < 0.6) {
        this.rig.update(dt, { speed: 0, attackT: this.attackPhase / 0.6 * 0.4, heavy: true });
      } else {
        const n = 10;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * TAU + rand(-0.1, 0.1);
          this.em.spawnProjectile({
            from: [this.pos.x, 1.6, this.pos.z],
            dir: [Math.sin(a), 0, Math.cos(a)],
            speed: 10.5, dmg: this.dmg * 0.7, owner: 'enemy', color: 0xc890ff, r: 0.26,
          });
        }
        this.em.spawnProjectile({
          from: [this.pos.x, 1.6, this.pos.z], target: [p.x, 1.2, p.z],
          speed: 14, dmg: this.dmg * 0.8, owner: 'enemy', color: 0xe8b842, r: 0.3,
        });
        AUDIO.sfx('shoot');
        this.currentAttack = null;
      }

    } else if (atk === 'charge') {
      if (this.attackPhase < 0.5) {
        // anvisieren
        this.chargeDir = Math.atan2(p.x - this.pos.x, p.z - this.pos.z);
        this.group.rotation.y = this.chargeDir;
        this.rig.update(dt, { speed: 0 });
      } else if (this.attackPhase < 1.3) {
        const sp = this.speed * 3.4;
        this.pos.x += Math.sin(this.chargeDir) * sp * dt;
        this.pos.z += Math.cos(this.chargeDir) * sp * dt;
        this.em.collideWorld(this.pos);
        if (d < this.meleeRange + 0.6 && !game.player.dead && !this._chargeHit) {
          this._chargeHit = true;
          game.player.takeDamage(this.dmg * 1.2, this.pos);
        }
        this.rig.update(dt, { speed: 1.6 });
      } else {
        this._chargeHit = false;
        this.currentAttack = null;
      }

    } else if (atk === 'summon') {
      if (this.attackPhase < 0.8) {
        this.rig.update(dt, { speed: 0, attackT: 0.3, heavy: true });
      } else {
        const living = this.em.enemies.filter(e => !e.isBoss && !e.dead).length;
        const kind = this.bossDef.summonKind || 'shadow';
        for (let i = 0; i < 2 && living + i < 4; i++) {
          const a = rand(0, TAU);
          this.em.spawnEnemy(kind, [this.pos.x + Math.cos(a) * 4, this.pos.z + Math.sin(a) * 4], this.level, { questTag: 'bossadd' });
        }
        AUDIO.sfx('roar');
        this.currentAttack = null;
      }
    } else {
      this.currentAttack = null;
    }
  }
}

// ------------------------------------------------------------
//  Projektil
// ------------------------------------------------------------
class Projectile {
  constructor(em, o) {
    this.em = em;
    this.owner = o.owner;
    this.dmg = o.dmg;
    this.r = o.r || 0.25;
    this.life = o.life || 4;
    this.speed = o.speed;
    const dir = new THREE.Vector3();
    if (o.target) {
      dir.set(o.target[0] - o.from[0], (o.target[1] || 1.2) - o.from[1], o.target[2] - o.from[2]).normalize();
    } else {
      dir.set(o.dir[0], o.dir[1] || 0, o.dir[2]).normalize();
    }
    this.vel = dir.multiplyScalar(o.speed);
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(this.r, 8, 6),
      new THREE.MeshBasicMaterial({ color: o.color || 0xffffff })
    );
    this.mesh.position.set(o.from[0], o.from[1], o.from[2]);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ color: o.color || 0xffffff, transparent: true, opacity: 0.35, depthWrite: false }));
    halo.scale.setScalar(this.r * 6);
    this.mesh.add(halo);
    em.scene_add(this.mesh);
    this.dead = false;
  }
  update(dt, game) {
    this.life -= dt;
    this.mesh.position.addScaledVector(this.vel, dt);
    const mp = this.mesh.position;
    if (this.life <= 0 || Math.hypot(mp.x, mp.z) > 200) { this.dead = true; return; }

    if (this.owner === 'player') {
      for (const e of this.em.enemies) {
        if (e.dead) continue;
        const hitR = e.isBoss ? 1.6 * (e.bossDef.scale || 1.6) : 0.9;
        if (dist2(mp.x, mp.z, e.pos.x, e.pos.z) < hitR + this.r && Math.abs(mp.y - 1.3) < 2.6) {
          e.takeDamage(this.dmg, game, game.player.pos);
          this.dead = true;
          return;
        }
      }
    } else {
      const p = game.player.pos;
      if (!game.player.dead && dist2(mp.x, mp.z, p.x, p.z) < 0.75 + this.r && Math.abs(mp.y - 1.2) < 2.2) {
        game.player.takeDamage(this.dmg, mp);
        this.dead = true;
      }
    }
  }
  dispose() {
    this.em.scene_remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}

// ------------------------------------------------------------
//  Sammelobjekte (XP, Heilung, Erinnerungsfragmente)
// ------------------------------------------------------------
class Pickup {
  constructor(em, type, pos, opts = {}) {
    this.em = em;
    this.type = type;
    this.value = opts.value || 0;
    this.fragId = opts.fragId || null;
    this.questTag = opts.questTag || null;
    this.dead = false;
    this.t = rand(0, TAU);
    let geo, color;
    if (type === 'xp') { geo = new THREE.OctahedronGeometry(0.14); color = 0x9a86ff; }
    else if (type === 'heal') { geo = new THREE.OctahedronGeometry(0.18); color = 0x50e890; }
    else if (type === 'quest') { geo = new THREE.IcosahedronGeometry(0.3, 0); color = 0xe8b842; }
    else { geo = new THREE.OctahedronGeometry(0.26); color = 0x6ad8ff; } // fragment
    this.mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color }));
    this.mesh.position.set(pos[0], 1.0, pos[1]);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ color, transparent: true, opacity: 0.3, depthWrite: false }));
    halo.scale.setScalar(type === 'fragment' || type === 'quest' ? 1.6 : 0.9);
    this.mesh.add(halo);
    em.scene_add(this.mesh);
  }
  update(dt, game) {
    this.t += dt;
    this.mesh.rotation.y += dt * 2.2;
    this.mesh.position.y = 1.0 + Math.sin(this.t * 2.4) * 0.18;
    const p = game.player.pos;
    const d = dist2(p.x, p.z, this.mesh.position.x, this.mesh.position.z);
    const magnetR = this.type === 'xp' || this.type === 'heal' ? 5.5 : 0;
    if (magnetR && d < magnetR) {
      const dir = new THREE.Vector3(p.x - this.mesh.position.x, 0, p.z - this.mesh.position.z).normalize();
      this.mesh.position.addScaledVector(dir, dt * (10 - d));
    }
    if (d < 1.3) {
      this.dead = true;
      game.onPickup(this);
    }
  }
  dispose() {
    this.em.scene_remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}

// ------------------------------------------------------------
//  Questmarker & Portal
// ------------------------------------------------------------
class Marker {
  constructor(em, pos, label = null) {
    this.em = em;
    this.pos = { x: pos[0], z: pos[1] };
    this.group = new THREE.Group();
    this.group.position.set(pos[0], 0, pos[1]);
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.55, 26, 10, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xe8b842, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false })
    );
    beam.position.y = 13;
    this.group.add(beam);
    this.gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.42), new THREE.MeshBasicMaterial({ color: 0xe8b842 }));
    this.gem.position.y = 2.2;
    this.group.add(this.gem);
    if (label) {
      const s = makeTextSprite(label, '#e8b842', 22);
      s.position.y = 3.4;
      this.group.add(s);
    }
    this.t = 0;
    em.scene_add(this.group);
    this.dead = false;
  }
  update(dt) {
    this.t += dt;
    this.gem.rotation.y += dt * 1.6;
    this.gem.position.y = 2.2 + Math.sin(this.t * 2) * 0.25;
  }
  dispose() {
    this.em.scene_remove(this.group);
    this.group.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  }
}

class Portal {
  constructor(em, def) {
    this.em = em;
    this.id = def.id || def.zone;
    this.zone = def.zone;
    this.label = def.label;
    this.locked = !!def.locked;
    this.spawnAt = def.spawnAt || null;
    this.pos = { x: def.pos[0], z: def.pos[1] };
    this.group = new THREE.Group();
    this.group.position.set(def.pos[0], 0, def.pos[1]);
    if (def.face != null) this.group.rotation.y = def.face;

    const color = this.locked ? 0x3a3a44 : (def.color || 0x8a6ad8);
    this.ringMat = new THREE.MeshStandardMaterial({ color: 0x1a1622, emissive: color, emissiveIntensity: this.locked ? 0.15 : 0.8, roughness: 0.4, metalness: 0.4 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.22, 10, 28), this.ringMat);
    ring.position.y = 2.2;
    this.group.add(ring);
    this.discMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: this.locked ? 0.06 : 0.3, side: THREE.DoubleSide, depthWrite: false });
    const disc = new THREE.Mesh(new THREE.CircleGeometry(1.5, 24), this.discMat);
    disc.position.y = 2.2;
    this.group.add(disc);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.5, 0.4, 10), new THREE.MeshStandardMaterial({ color: 0x1e1a26, roughness: 0.8, flatShading: true }));
    base.position.y = 0.2;
    this.group.add(base);
    const label = makeTextSprite(tx(def.label) + (this.locked ? ' 🔒' : ''), this.locked ? '#777788' : '#cfc0ff', 22);
    label.position.y = 4.6;
    this.group.add(label);
    this.labelSprite = label;
    this.t = 0;
    em.scene_add(this.group);
  }
  setLocked(locked) {
    this.locked = locked;
    this.ringMat.emissiveIntensity = locked ? 0.15 : 0.8;
    this.discMat.opacity = locked ? 0.06 : 0.3;
  }
  update(dt) {
    this.t += dt;
    if (!this.locked) {
      this.discMat.opacity = 0.25 + Math.sin(this.t * 2.2) * 0.1;
    }
  }
  dispose() {
    this.em.scene_remove(this.group);
    this.group.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  }
}

// ------------------------------------------------------------
//  EntityManager
// ------------------------------------------------------------
export class EntityManager {
  constructor(game) {
    this.game = game;
    this.npcs = [];
    this.enemies = [];
    this.projectiles = [];
    this.pickups = [];
    this.markers = [];
    this.portals = [];
    this.effects = [];      // kurzlebige Effekte (Schockringe)
    this.colliders = [];
    this.bound = CONFIG.zoneRadius;
  }

  scene_add(o) { this.game.scene.add(o); }
  scene_remove(o) { this.game.scene.remove(o); }

  setWorld(colliders, bound) {
    this.colliders = colliders;
    this.bound = bound;
  }

  collideWorld(pos) {
    // Kreis-Kollision mit Weltobjekten
    for (const c of this.colliders) {
      const dx = pos.x - c.x, dz = pos.z - c.z;
      const d = Math.hypot(dx, dz);
      if (d < c.r && d > 0.001) {
        pos.x = c.x + (dx / d) * c.r;
        pos.z = c.z + (dz / d) * c.r;
      }
    }
    // Weltgrenze
    const d = Math.hypot(pos.x, pos.z);
    if (d > this.bound) {
      pos.x = (pos.x / d) * this.bound;
      pos.z = (pos.z / d) * this.bound;
    }
  }

  // ---- Spawner ----
  spawnNPC(def) {
    const npc = new NPC(this, def);
    this.npcs.push(npc);
    return npc;
  }
  findNPC(id) { return this.npcs.find(n => n.id === id); }
  removeNPC(idOrObj) {
    const npc = typeof idOrObj === 'string' ? this.findNPC(idOrObj) : idOrObj;
    if (!npc) return;
    npc.dispose();
    this.npcs = this.npcs.filter(n => n !== npc);
  }

  spawnEnemy(kind, pos, level, opts = {}) {
    const e = new Enemy(this, kind, pos, level, opts);
    this.enemies.push(e);
    return e;
  }
  spawnEnemies(kind, count, center, radius, level, opts = {}) {
    const out = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * TAU + rand(-0.4, 0.4);
      const r = rand(radius * 0.4, radius);
      out.push(this.spawnEnemy(kind, [center[0] + Math.cos(a) * r, center[1] + Math.sin(a) * r], level, opts));
    }
    return out;
  }
  spawnBoss(def, pos) {
    const b = new Boss(this, def, pos);
    this.enemies.push(b);
    this.game.ui.bossBar(true, b.name, 1);
    return b;
  }
  removeEnemy(e) {
    e.dispose();
    this.enemies = this.enemies.filter(x => x !== e);
  }

  spawnProjectile(o) {
    this.projectiles.push(new Projectile(this, o));
  }
  spawnPickup(type, pos, opts = {}) {
    const p = new Pickup(this, type, pos, opts);
    this.pickups.push(p);
    return p;
  }
  addMarker(pos, label) {
    const m = new Marker(this, pos, label);
    this.markers.push(m);
    return m;
  }
  removeMarker(m) {
    if (!m) return;
    m.dispose();
    this.markers = this.markers.filter(x => x !== m);
  }
  addPortal(def) {
    const p = new Portal(this, def);
    this.portals.push(p);
    return p;
  }

  spawnShockRing(pos, maxR, color = 0xffa040) {
    const mesh = new THREE.Mesh(
      new THREE.RingGeometry(0.2, 0.5, 28),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(pos[0], 0.08, pos[1]);
    this.scene_add(mesh);
    this.effects.push({ mesh, t: 0, maxR, dead: false });
  }

  // Spieler-Nahkampf: Sektor-Treffer
  applyMelee(fromPos, facing, range, arc, dmg) {
    let hit = 0;
    for (const e of this.enemies) {
      if (e.dead) continue;
      const dx = e.pos.x - fromPos.x, dz = e.pos.z - fromPos.z;
      const d = Math.hypot(dx, dz);
      const hitR = e.isBoss ? 1.4 * (e.bossDef.scale || 1.6) : 0.8;
      if (d > range + hitR) continue;
      const ang = Math.atan2(dx, dz);
      let diff = Math.abs(ang - facing) % TAU;
      if (diff > Math.PI) diff = TAU - diff;
      if (diff < arc || d < 1.3) {
        e.takeDamage(dmg, this.game, fromPos);
        hit++;
      }
    }
    return hit;
  }

  // alle Gegner im Radius (für Fähigkeiten)
  applyRadial(fromPos, radius, dmg, knockback = 0) {
    let hit = 0;
    for (const e of this.enemies) {
      if (e.dead) continue;
      const dx = e.pos.x - fromPos.x, dz = e.pos.z - fromPos.z;
      const d = Math.hypot(dx, dz);
      if (d < radius + (e.isBoss ? 1.5 : 0.8)) {
        e.takeDamage(dmg, this.game, knockback ? fromPos : null);
        if (knockback && !e.isBoss && d > 0.01) {
          e.pos.x += (dx / d) * knockback;
          e.pos.z += (dz / d) * knockback;
        }
        hit++;
      }
    }
    return hit;
  }

  pullEnemies(toPos, radius, strength) {
    for (const e of this.enemies) {
      if (e.dead || e.isBoss) continue;
      const dx = toPos.x - e.pos.x, dz = toPos.z - e.pos.z;
      const d = Math.hypot(dx, dz);
      if (d < radius && d > 2) {
        e.pos.x += (dx / d) * strength;
        e.pos.z += (dz / d) * strength;
      }
    }
  }

  // nächstes interagierbares Objekt (Label wird in main.js übersetzt gebaut)
  nearestInteractable(pos) {
    let best = null, bestD = CONFIG.interactRange;
    for (const n of this.npcs) {
      const d = dist2(pos.x, pos.z, n.pos.x, n.pos.z);
      if (d < bestD) { best = { type: 'npc', obj: n }; bestD = d; }
    }
    for (const p of this.portals) {
      const d = dist2(pos.x, pos.z, p.pos.x, p.pos.z);
      if (d < bestD + 0.8) {
        best = { type: p.locked ? 'locked' : 'portal', obj: p };
        bestD = d;
      }
    }
    return best;
  }

  clearQuestEntities(tag = null) {
    const match = (e) => tag == null ? e.questTag != null : e.questTag === tag;
    this.enemies.filter(e => match(e) || e.questTag === 'bossadd').forEach(e => this.removeEnemy(e));
    this.pickups.filter(p => match(p)).forEach(p => { p.dispose(); });
    this.pickups = this.pickups.filter(p => !match(p));
    this.npcs.filter(n => match(n)).forEach(n => this.removeNPC(n));
  }

  clearAll() {
    [...this.enemies].forEach(e => this.removeEnemy(e));
    this.npcs.forEach(n => n.dispose());
    this.projectiles.forEach(p => p.dispose());
    this.pickups.forEach(p => p.dispose());
    this.markers.forEach(m => m.dispose());
    this.portals.forEach(p => p.dispose());
    this.effects.forEach(f => { this.scene_remove(f.mesh); f.mesh.geometry.dispose(); f.mesh.material.dispose(); });
    this.npcs = []; this.enemies = []; this.projectiles = [];
    this.pickups = []; this.markers = []; this.portals = []; this.effects = [];
    this.game.ui.bossBar(false);
  }

  update(dt) {
    const game = this.game;
    for (const n of this.npcs) n.update(dt, game);
    for (const e of [...this.enemies]) e.update(dt, game);
    for (const p of this.projectiles) p.update(dt, game);
    this.projectiles = this.projectiles.filter(p => (p.dead ? (p.dispose(), false) : true));
    for (const p of this.pickups) p.update(dt, game);
    this.pickups = this.pickups.filter(p => (p.dead ? (p.dispose(), false) : true));
    for (const m of this.markers) m.update(dt);
    for (const p of this.portals) p.update(dt);
    for (const f of this.effects) {
      f.t += dt;
      const r = f.maxR * Math.min(1, f.t / 0.4);
      f.mesh.scale.setScalar(Math.max(0.01, r));
      f.mesh.material.opacity = 0.8 * (1 - f.t / 0.45);
      if (f.t > 0.45) { f.dead = true; this.scene_remove(f.mesh); f.mesh.geometry.dispose(); f.mesh.material.dispose(); }
    }
    this.effects = this.effects.filter(f => !f.dead);
  }
}
