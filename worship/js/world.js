// ============================================================
//  world.js – Zonenbau (8 Welten, eine pro Album/Kapitel)
// ============================================================

import * as THREE from 'three';
import { TAU, mulberry } from './utils.js';
import { CONFIG } from './config.js';
import { createRig } from './characters.js';

export const ZONE_INFO = {
  sanctum:    { name: { de: 'Das Heiligtum', en: 'The Sanctum' },        sub: { de: 'Zwischen den Welten', en: 'Between the Worlds' },         ambient: 'sanctum',    bg: 0x07050c, fog: [0x07050c, 30, 160] },
  threshold:  { name: { de: 'Die Schwelle', en: 'The Threshold' },         sub: { de: 'PROLOG — ONE', en: 'PROLOGUE — ONE' },                ambient: 'threshold',  bg: 0x0a0614, fog: [0x0d0818, 22, 130] },
  memorycity: { name: { de: 'Die Erinnerungsstadt', en: 'The City of Memory' }, sub: { de: 'KAPITEL I — TWO', en: 'CHAPTER I — TWO' },             ambient: 'memorycity', bg: 0x2a1810, fog: [0x3a2014, 35, 170] },
  nightrealm: { name: { de: 'Das Nachtreich', en: 'The Night Realm' },       sub: { de: 'KAPITEL II — SUNDOWNING', en: 'CHAPTER II — SUNDOWNING' },     ambient: 'nightrealm', bg: 0x140a1e, fog: [0x1e0e24, 30, 150] },
  tomb:       { name: { de: 'Die Grabstätten', en: 'The Tombs' },      sub: { de: 'KAPITEL III — THIS PLACE WILL BECOME YOUR TOMB', en: 'CHAPTER III — THIS PLACE WILL BECOME YOUR TOMB' }, ambient: 'tomb', bg: 0x051114, fog: [0x07181c, 18, 110] },
  eden:       { name: { de: 'Eden', en: 'Eden' },                 sub: { de: 'KAPITEL IV — TAKE ME BACK TO EDEN', en: 'CHAPTER IV — TAKE ME BACK TO EDEN' }, ambient: 'eden', bg: 0x0a140a, fog: [0x12200f, 32, 160] },
  arcadia:    { name: { de: 'Arcadia', en: 'Arcadia' },              sub: { de: 'KAPITEL V — EVEN IN ARCADIA', en: 'CHAPTER V — EVEN IN ARCADIA' }, ambient: 'arcadia',    bg: 0xc8c2d8, fog: [0xd8d2e0, 40, 180] },
  baths:      { name: { de: 'Die Unendlichen Bäder', en: 'The Infinite Baths' }, sub: { de: 'FINALE — INFINITE BATHS', en: 'FINALE — INFINITE BATHS' },    ambient: 'baths',      bg: 0x020208, fog: [0x030310, 25, 140] },
};

const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0.05, flatShading: true, ...o });
const glowMat = (color, opacity = 1) => new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity });

export class ZoneHandle {
  constructor(id, scene) {
    this.id = id;
    this.scene = scene;
    this.root = new THREE.Group();
    this.colliders = [];      // {x, z, r}
    this.playerSpawn = [0, 52];
    this.updaters = [];
    this.disposables = [];
    scene.add(this.root);
  }
  add(obj) { this.root.add(obj); return obj; }
  collide(x, z, r) { this.colliders.push({ x, z, r }); }
  onUpdate(fn) { this.updaters.push(fn); }
  update(dt, t) { for (const fn of this.updaters) fn(dt, t); }
  dispose() {
    this.scene.remove(this.root);
    this.root.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
    });
    this.disposables.forEach(d => d.dispose && d.dispose());
  }
}

// ---------- Bausteine ----------

function ground(zone, color, { radius = 95, ring = null } = {}) {
  const g = new THREE.Mesh(new THREE.CircleGeometry(radius, 48), mat(color, { flatShading: false }));
  g.rotation.x = -Math.PI / 2;
  g.receiveShadow = true;
  zone.add(g);
  if (ring) {
    const r = new THREE.Mesh(new THREE.RingGeometry(radius * 0.92, radius * 1.4, 48), mat(ring, { flatShading: false }));
    r.rotation.x = -Math.PI / 2;
    r.position.y = -0.05;
    zone.add(r);
  }
  return g;
}

function lights(zone, { hemiSky, hemiGround, hemiInt = 0.6, dirColor = 0xffffff, dirInt = 0.7, dirPos = [40, 60, 20], shadows = false }) {
  const hemi = new THREE.HemisphereLight(hemiSky, hemiGround, hemiInt * 1.9);
  zone.add(hemi);
  const dir = new THREE.DirectionalLight(dirColor, dirInt * 1.6);
  dir.position.set(...dirPos);
  if (shadows) {
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    dir.shadow.camera.left = -70; dir.shadow.camera.right = 70;
    dir.shadow.camera.top = 70; dir.shadow.camera.bottom = -70;
    dir.shadow.camera.far = 220;
  }
  zone.add(dir);
  return { hemi, dir };
}

function pointLight(zone, color, intensity, pos, dist = 30) {
  // r160 nutzt physikalische Lichteinheiten – Werte kräftig skalieren
  const l = new THREE.PointLight(color, intensity * 3.2, dist, 1.2);
  l.position.set(...pos);
  zone.add(l);
  return l;
}

function pillar(zone, x, z, { h = 8, r = 0.8, color = 0x2a2a32, broken = false, rng = Math.random } = {}) {
  const height = broken ? h * (0.3 + rng() * 0.5) : h;
  const p = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.85, r, height, 8), mat(color));
  p.position.set(x, height / 2, z);
  p.castShadow = true;
  zone.add(p);
  const base = new THREE.Mesh(new THREE.BoxGeometry(r * 2.6, 0.5, r * 2.6), mat(color));
  base.position.set(x, 0.25, z);
  zone.add(base);
  zone.collide(x, z, r + 0.4);
  return p;
}

function rock(zone, x, z, { s = 1, color = 0x26242c, y = null } = {}) {
  const m = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 0), mat(color));
  m.position.set(x, y == null ? s * 0.5 : y, z);
  m.rotation.set(Math.random() * TAU, Math.random() * TAU, 0);
  m.castShadow = true;
  zone.add(m);
  if (y == null) zone.collide(x, z, s * 0.9);
  return m;
}

function tree(zone, x, z, { trunk = 0x1a140e, crown = 0x1e3318, h = 6, crownR = 2.2, dead = false } = {}) {
  const t = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.4, h, 6), mat(trunk));
  t.position.set(x, h / 2, z);
  t.castShadow = true;
  zone.add(t);
  if (!dead) {
    const c = new THREE.Mesh(new THREE.IcosahedronGeometry(crownR, 1), mat(crown));
    c.position.set(x, h + crownR * 0.4, z);
    c.castShadow = true;
    zone.add(c);
  } else {
    for (let i = 0; i < 4; i++) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, 2.2, 5), mat(trunk));
      const a = (i / 4) * TAU + 0.5;
      b.position.set(x + Math.cos(a) * 0.6, h - 0.4 + i * 0.2, z + Math.sin(a) * 0.6);
      b.rotation.z = Math.cos(a) * 1.1;
      b.rotation.x = Math.sin(a) * 1.1;
      zone.add(b);
    }
  }
  zone.collide(x, z, 0.7);
}

function ruinBox(zone, x, z, { w = 4, h = 3, d = 4, color = 0x4a3a28, rot = 0 } = {}) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
  m.position.set(x, h / 2, z);
  m.rotation.y = rot;
  m.castShadow = true;
  zone.add(m);
  zone.collide(x, z, Math.max(w, d) * 0.62);
  return m;
}

function particles(zone, { count = 220, color = 0xffffff, size = 0.25, area = 85, height = [0.5, 14], opacity = 0.65, drift = [0.4, 0.6, 0.4], rng = Math.random }) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rng() * 2 - 1) * area;
    pos[i * 3 + 1] = height[0] + rng() * (height[1] - height[0]);
    pos[i * 3 + 2] = (rng() * 2 - 1) * area;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.Points(geo, new THREE.PointsMaterial({
    color, size, transparent: true, opacity, sizeAttenuation: true, depthWrite: false,
  }));
  zone.add(m);
  const phases = new Float32Array(count);
  for (let i = 0; i < count; i++) phases[i] = rng() * TAU;
  zone.onUpdate((dt, t) => {
    const p = geo.attributes.position.array;
    for (let i = 0; i < count; i++) {
      p[i * 3] += Math.sin(t * 0.3 + phases[i]) * drift[0] * dt;
      p[i * 3 + 1] += Math.cos(t * 0.2 + phases[i]) * drift[1] * dt;
      p[i * 3 + 2] += Math.sin(t * 0.25 + phases[i] * 1.3) * drift[2] * dt;
      if (p[i * 3 + 1] > height[1]) p[i * 3 + 1] = height[0];
      if (p[i * 3 + 1] < height[0]) p[i * 3 + 1] = height[1];
    }
    geo.attributes.position.needsUpdate = true;
  });
  return m;
}

function stars(zone, { count = 500, radius = 320, color = 0xffffff, size = 1.6, minY = 10 }) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * TAU;
    const elev = Math.random() * Math.PI * 0.48;
    pos[i * 3] = Math.cos(a) * Math.cos(elev) * radius;
    pos[i * 3 + 1] = Math.max(minY, Math.sin(elev) * radius);
    pos[i * 3 + 2] = Math.sin(a) * Math.cos(elev) * radius;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.Points(geo, new THREE.PointsMaterial({ color, size, sizeAttenuation: true, transparent: true, opacity: 0.85, depthWrite: false, fog: false }));
  zone.add(m);
  return m;
}

function horizonDisk(zone, color, { r = 60, pos = [0, 14, -290], opacity = 0.9 }) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(r, 32), new THREE.MeshBasicMaterial({ color, transparent: true, opacity, fog: false }));
  m.position.set(...pos);
  m.lookAt(0, pos[1], 0);
  zone.add(m);
  return m;
}

function candles(zone, positions, color = 0xe8a040) {
  const cMat = mat(0xd8d0c0);
  const fMat = glowMat(color);
  for (const [x, z] of positions) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.6, 6), cMat);
    c.position.set(x, 0.3, z);
    zone.add(c);
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 5), fMat);
    f.position.set(x, 0.68, z);
    zone.add(f);
    zone.onUpdate((dt, t) => { f.scale.setScalar(1 + Math.sin(t * 9 + x * 7) * 0.25); });
  }
}

// ============================================================
//  Die Zonen
// ============================================================
const BUILDERS = {

  // ---------- DAS HEILIGTUM (Hub) ----------
  sanctum(zone) {
    ground(zone, 0x181222, { ring: 0x0a0712 });
    lights(zone, { hemiSky: 0x6a5490, hemiGround: 0x141020, hemiInt: 0.85, dirColor: 0xb09cd8, dirInt: 0.6, shadows: true });

    // Innerer Marmorkreis mit goldenem Ring
    const inner = new THREE.Mesh(new THREE.CircleGeometry(34, 40), mat(0x1a1622, { flatShading: false }));
    inner.rotation.x = -Math.PI / 2; inner.position.y = 0.03;
    zone.add(inner);
    const goldRing = new THREE.Mesh(new THREE.RingGeometry(32.4, 33.2, 48), mat(0x3a2e14, { emissive: 0xe8b842, emissiveIntensity: 0.35, flatShading: false }));
    goldRing.rotation.x = -Math.PI / 2; goldRing.position.y = 0.05;
    zone.add(goldRing);

    // Riesige Statue des Schlafenden Gottes im Zentrum
    const statue = createRig('sleepgod', { scale: 5 });
    statue.group.position.set(0, 0, -14);
    statue.group.traverse(o => {
      if (o.material && o.material.color && !o.material.isMeshBasicMaterial) {
        o.material = mat(0x221e2c, { roughness: 0.7 });
      }
    });
    zone.add(statue.group);
    zone.collide(0, -14, 5);
    zone.onUpdate((dt) => statue.update(dt, { speed: 0 }));
    zone.disposables.push(statue);
    pointLight(zone, 0xe8b842, 28, [0, 12, -4], 50);
    pointLight(zone, 0x8a6ad0, 12, [0, 7, 14], 45);

    // Säulenkreis (halb versetzt, damit keine Säule am Spawn steht)
    for (let i = 0; i < 12; i++) {
      const a = ((i + 0.5) / 12) * TAU;
      pillar(zone, Math.cos(a) * 44, Math.sin(a) * 44, { h: 11, r: 1.0, color: 0x1e1a28 });
    }
    // Kerzen um die Statue
    const cpos = [];
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU;
      cpos.push([Math.cos(a) * 9, -14 + Math.sin(a) * 9]);
    }
    candles(zone, cpos);
    pointLight(zone, 0x8a6ad0, 14, [0, 6, 30], 50);

    stars(zone, { count: 600, color: 0xcabfff, size: 1.4 });
    particles(zone, { count: 130, color: 0xb89ce8, size: 0.18, opacity: 0.5, height: [1, 18] });
    zone.playerSpawn = [0, 40];
  },

  // ---------- DIE SCHWELLE (ONE) ----------
  threshold(zone) {
    const rng = mulberry(101);
    ground(zone, 0x18122a, { ring: 0x0c0818 });
    lights(zone, { hemiSky: 0x6a4cb8, hemiGround: 0x16102a, hemiInt: 0.85, dirColor: 0x9a7ad8, dirInt: 0.6, shadows: true });

    // Zwei riesige goldene Augen am Himmel – Sleep beobachtet
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(7, 16, 12), glowMat(0xe8b842));
      eye.scale.set(1, 1.7, 0.5);
      eye.position.set(side * 34, 75, -210);
      zone.add(eye);
      zone.onUpdate((dt, t) => {
        eye.scale.y = 1.7 * Math.max(0.06, Math.abs(Math.sin(t * 0.22 + side)) > 0.06 ? 1 : 0.06); // Blinzeln
      });
    }
    pointLight(zone, 0x6a4ad0, 20, [0, 14, 0], 60);

    // Schwebende Felsinseln
    for (let i = 0; i < 26; i++) {
      const a = rng() * TAU, d = 25 + rng() * 60;
      rock(zone, Math.cos(a) * d, Math.sin(a) * d, { s: 1 + rng() * 4, color: 0x1c1430, y: 6 + rng() * 26 });
    }
    // Obsidian-Monolithe
    for (let i = 0; i < 14; i++) {
      const a = rng() * TAU, d = 18 + rng() * 52;
      const h = 5 + rng() * 9;
      const m = new THREE.Mesh(new THREE.BoxGeometry(1.2, h, 1.2), mat(0x141022, { metalness: 0.3, roughness: 0.5 }));
      const x = Math.cos(a) * d, z = Math.sin(a) * d;
      m.position.set(x, h / 2, z);
      m.rotation.y = rng() * TAU;
      m.castShadow = true;
      zone.add(m);
      zone.collide(x, z, 1.2);
    }
    // Altar im Zentrum
    const altar = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.2, 1.4, 10), mat(0x1a1428));
    altar.position.set(0, 0.7, 0);
    zone.add(altar);
    zone.collide(0, 0, 3.0);
    pointLight(zone, 0xe8b842, 12, [0, 4, 0], 26);

    stars(zone, { count: 700, color: 0x9a86d8, size: 1.5 });
    particles(zone, { count: 200, color: 0x8a6ad8, size: 0.22, opacity: 0.55, rng });
    zone.playerSpawn = [0, 52];
  },

  // ---------- DIE ERINNERUNGSSTADT (TWO) ----------
  memorycity(zone) {
    const rng = mulberry(202);
    ground(zone, 0x6a4a2c, { ring: 0x4a3018 });
    lights(zone, { hemiSky: 0xe8a060, hemiGround: 0x3a2414, hemiInt: 0.75, dirColor: 0xffc080, dirInt: 0.95, dirPos: [-50, 35, -30], shadows: true });
    horizonDisk(zone, 0xff9a40, { r: 46, pos: [-180, 22, -240] }); // tiefe Abendsonne

    // Sandstein-Ruinenstadt
    for (let i = 0; i < 24; i++) {
      const a = rng() * TAU, d = 16 + rng() * 56;
      ruinBox(zone, Math.cos(a) * d, Math.sin(a) * d, {
        w: 3 + rng() * 5, h: 2 + rng() * 6, d: 3 + rng() * 5,
        color: [0x8a6a42, 0x7a5c38, 0x96754a][Math.floor(rng() * 3)], rot: rng() * TAU,
      });
    }
    // Torbögen
    for (const [x, z] of [[-20, -8], [24, 16], [4, -34]]) {
      pillar(zone, x - 2.4, z, { h: 7, r: 0.7, color: 0x8a6a42 });
      pillar(zone, x + 2.4, z, { h: 7, r: 0.7, color: 0x8a6a42 });
      const top = new THREE.Mesh(new THREE.BoxGeometry(6.6, 1, 1.6), mat(0x96754a));
      top.position.set(x, 7.2, z);
      zone.add(top);
    }
    // Palmen
    for (let i = 0; i < 10; i++) {
      const a = rng() * TAU, d = 30 + rng() * 40;
      tree(zone, Math.cos(a) * d, Math.sin(a) * d, { trunk: 0x5a4226, crown: 0x4a6a2a, h: 7 + rng() * 3, crownR: 1.8 });
    }
    particles(zone, { count: 160, color: 0xe8b060, size: 0.16, opacity: 0.4, height: [0.3, 6], rng }); // Staub
    zone.playerSpawn = [0, 52];
  },

  // ---------- DAS NACHTREICH (SUNDOWNING) ----------
  nightrealm(zone) {
    const rng = mulberry(303);
    ground(zone, 0x201428, { ring: 0x120c1a });
    lights(zone, { hemiSky: 0x8a4a9a, hemiGround: 0x181020, hemiInt: 0.8, dirColor: 0xff8a50, dirInt: 0.7, dirPos: [0, 18, -80], shadows: true });
    horizonDisk(zone, 0xff7a30, { r: 70, pos: [0, 10, -290] });          // ewige untergehende Sonne
    horizonDisk(zone, 0xffb060, { r: 95, pos: [0, 8, -292], opacity: 0.25 });
    const moon = horizonDisk(zone, 0xd8d8f0, { r: 18, pos: [150, 95, -220], opacity: 0.85 });
    moon.scale.setScalar(0.8);

    // Schwarzer toter Wald
    for (let i = 0; i < 30; i++) {
      const a = rng() * TAU, d = 18 + rng() * 58;
      tree(zone, Math.cos(a) * d, Math.sin(a) * d, { trunk: 0x0c0a10, h: 5 + rng() * 5, dead: true });
    }
    // Verfallene Schreine
    for (const [x, z] of [[-34, 12], [28, -26], [10, 38], [-18, -40]]) {
      pillar(zone, x, z, { h: 6, r: 0.7, color: 0x201828, broken: true, rng });
    }
    rock(zone, -8, -10, { s: 2.4, color: 0x1a1424 });
    rock(zone, 16, 22, { s: 1.8, color: 0x1a1424 });

    stars(zone, { count: 450, color: 0xc8b8e8, size: 1.3 });
    particles(zone, { count: 240, color: 0xffd080, size: 0.14, opacity: 0.8, height: [0.4, 5], drift: [0.8, 0.3, 0.8], rng }); // Glühwürmchen
    pointLight(zone, 0xff8a50, 10, [0, 5, -40], 60);
    zone.playerSpawn = [0, 52];
  },

  // ---------- DIE GRABSTÄTTEN (TPWBYT) ----------
  tomb(zone) {
    const rng = mulberry(404);
    ground(zone, 0x143236, { ring: 0x0a1a1e });
    lights(zone, { hemiSky: 0x3aa8b6, hemiGround: 0x0a2026, hemiInt: 0.85, dirColor: 0x60c8d8, dirInt: 0.65, dirPos: [20, 70, 10], shadows: true });

    // Versunkene Säulenhalle
    for (let i = 0; i < 16; i++) {
      const a = rng() * TAU, d = 14 + rng() * 56;
      pillar(zone, Math.cos(a) * d, Math.sin(a) * d, { h: 9, r: 0.9, color: 0x1e3a40, broken: rng() > 0.4, rng });
    }
    // Grabsteine
    const tombMat = mat(0x24444c);
    for (let i = 0; i < 26; i++) {
      const a = rng() * TAU, d = 10 + rng() * 60;
      const t = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.5 + rng(), 0.25), tombMat);
      const x = Math.cos(a) * d, z = Math.sin(a) * d;
      t.position.set(x, 0.75, z);
      t.rotation.y = rng() * TAU;
      t.rotation.z = (rng() - 0.5) * 0.25;
      zone.add(t);
      zone.collide(x, z, 0.6);
    }
    // Algen / Korallentürme
    for (let i = 0; i < 18; i++) {
      const a = rng() * TAU, d = 20 + rng() * 50;
      const h = 2 + rng() * 4;
      const k = new THREE.Mesh(new THREE.ConeGeometry(0.5, h, 5), mat(0x14523e, { emissive: 0x0a3a2a, emissiveIntensity: 0.3 }));
      k.position.set(Math.cos(a) * d, h / 2, Math.sin(a) * d);
      zone.add(k);
      zone.onUpdate((dt, t2) => { k.rotation.z = Math.sin(t2 * 0.8 + a * 5) * 0.08; });
    }
    // zerbrochenes Schiffswrack am Rand
    const hull = new THREE.Mesh(new THREE.CylinderGeometry(3, 4.4, 16, 8, 1, true), mat(0x2a1e14, { side: THREE.DoubleSide }));
    hull.rotation.z = Math.PI / 2.3;
    hull.position.set(-44, 2.5, -30);
    zone.add(hull);
    zone.collide(-44, -30, 7);

    particles(zone, { count: 260, color: 0x9adfe8, size: 0.18, opacity: 0.6, height: [0.3, 22], drift: [0.2, 1.4, 0.2], rng }); // aufsteigende Blasen
    pointLight(zone, 0x40c8d8, 16, [0, 10, 0], 60);
    zone.playerSpawn = [0, 52];
  },

  // ---------- EDEN (TMBTE) ----------
  eden(zone) {
    const rng = mulberry(505);
    ground(zone, 0x2a4a22, { ring: 0x18301a });
    lights(zone, { hemiSky: 0xc8e89a, hemiGround: 0x1a3014, hemiInt: 0.85, dirColor: 0xffe8b0, dirInt: 1.0, dirPos: [30, 55, 25], shadows: true });

    // Uralte Bäume
    for (let i = 0; i < 18; i++) {
      const a = rng() * TAU, d = 18 + rng() * 55;
      tree(zone, Math.cos(a) * d, Math.sin(a) * d, {
        trunk: 0x3a2a18, crown: [0x2a6a28, 0x3a7a30, 0x4a8a2a][Math.floor(rng() * 3)],
        h: 7 + rng() * 5, crownR: 2.5 + rng() * 1.8,
      });
    }
    // Das zerbrochene Tor von Eden
    pillar(zone, -4, -20, { h: 13, r: 1.3, color: 0xb8a878 });
    pillar(zone, 4, -20, { h: 13, r: 1.3, color: 0xb8a878 });
    const arch = new THREE.Mesh(new THREE.TorusGeometry(5, 0.8, 8, 20, Math.PI), mat(0xb8a878));
    arch.position.set(0, 12.5, -20);
    zone.add(arch);
    pointLight(zone, 0xffe8a0, 18, [0, 9, -20], 36);

    // Blumenfeld (leuchtende Punkte am Boden)
    particles(zone, { count: 300, color: 0xffd8f0, size: 0.16, opacity: 0.85, height: [0.2, 0.8], drift: [0.1, 0.05, 0.1], rng });
    particles(zone, { count: 180, color: 0xf0ffb0, size: 0.2, opacity: 0.5, height: [1, 12], rng }); // Pollen
    // Ranken-Bögen
    for (const [x, z, ry] of [[-26, 8, 0.6], [20, 26, 2.2], [34, -14, 4.0]]) {
      const vine = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.3, 6, 14, Math.PI), mat(0x2a5a20));
      vine.position.set(x, 0.2, z);
      vine.rotation.y = ry;
      zone.add(vine);
    }
    rock(zone, 12, 6, { s: 1.6, color: 0x6a6a58 });
    rock(zone, -30, -28, { s: 2.2, color: 0x6a6a58 });
    zone.playerSpawn = [0, 52];
  },

  // ---------- ARCADIA (EIA) ----------
  arcadia(zone) {
    const rng = mulberry(606);
    ground(zone, 0xd8d4dc, { ring: 0xbab4c4 });
    lights(zone, { hemiSky: 0xffffff, hemiGround: 0x9a94a8, hemiInt: 1.0, dirColor: 0xfff4d8, dirInt: 1.0, dirPos: [-30, 70, 30], shadows: true });

    // Perfekte weiße Stadt
    const marble = 0xe8e4ec, gold = 0xc8a850;
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * TAU + 0.2, d = 26 + (i % 3) * 14;
      pillar(zone, Math.cos(a) * d, Math.sin(a) * d, { h: 10, r: 0.9, color: marble });
    }
    for (let i = 0; i < 10; i++) {
      const a = rng() * TAU, d = 18 + rng() * 50;
      const b = ruinBox(zone, Math.cos(a) * d, Math.sin(a) * d, {
        w: 4 + rng() * 4, h: 4 + rng() * 5, d: 4 + rng() * 4, color: marble, rot: rng() * TAU,
      });
      const trim = new THREE.Mesh(new THREE.BoxGeometry(b.geometry.parameters.width + 0.2, 0.3, b.geometry.parameters.depth + 0.2), mat(gold, { metalness: 0.6, roughness: 0.3 }));
      trim.position.copy(b.position);
      trim.position.y = b.geometry.parameters.height + 0.1;
      trim.rotation.y = b.rotation.y;
      zone.add(trim);
    }
    // Goldener Tempel im Zentrum
    const temple = new THREE.Mesh(new THREE.CylinderGeometry(6, 7, 1.6, 10), mat(marble));
    temple.position.set(0, 0.8, -10);
    zone.add(temple);
    zone.collide(0, -10, 6.5);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(4, 14, 10, 0, TAU, 0, Math.PI / 2), mat(gold, { metalness: 0.7, roughness: 0.25 }));
    dome.position.set(0, 1.6, -10);
    zone.add(dome);

    // Die Risse: schwarze Glitch-Scherben, die in der Luft schweben
    const crackMat = new THREE.MeshBasicMaterial({ color: 0x05030a, side: THREE.DoubleSide });
    for (let i = 0; i < 12; i++) {
      const a = rng() * TAU, d = 14 + rng() * 50;
      const c = new THREE.Mesh(new THREE.PlaneGeometry(0.5 + rng() * 1.4, 2 + rng() * 5), crackMat);
      c.position.set(Math.cos(a) * d, 2 + rng() * 6, Math.sin(a) * d);
      c.rotation.y = rng() * TAU;
      zone.add(c);
      const baseY = c.position.y;
      zone.onUpdate((dt, t) => {
        c.visible = Math.sin(t * (1.5 + (i % 4) * 0.5) + i * 2.1) > -0.25; // flackern
        c.position.y = baseY + Math.sin(t * 0.7 + i) * 0.3;
      });
    }
    particles(zone, { count: 150, color: 0xfff8e0, size: 0.18, opacity: 0.6, height: [1, 16], rng });
    zone.playerSpawn = [0, 52];
  },

  // ---------- DIE UNENDLICHEN BÄDER (Finale) ----------
  baths(zone) {
    // Schwarzer Spiegelozean unter fremden Sternen
    const sea = new THREE.Mesh(
      new THREE.CircleGeometry(300, 48),
      new THREE.MeshStandardMaterial({ color: 0x04040c, roughness: 0.12, metalness: 0.9, flatShading: false })
    );
    sea.rotation.x = -Math.PI / 2;
    sea.position.y = -0.12;
    zone.add(sea);

    // Insel-Plattform
    const isle = new THREE.Mesh(new THREE.CylinderGeometry(38, 42, 1.2, 36), mat(0x0c0c18, { flatShading: false }));
    isle.position.y = -0.55;
    zone.add(isle);

    lights(zone, { hemiSky: 0x3a3a7a, hemiGround: 0x06060f, hemiInt: 0.75, dirColor: 0x8a8ad8, dirInt: 0.6, dirPos: [0, 80, -40], shadows: true });
    pointLight(zone, 0xe8b842, 20, [0, 12, -20], 80);

    // Ferne, halb versunkene Kolosse
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * TAU;
      const h = 26 + (i % 3) * 14;
      const m = new THREE.Mesh(new THREE.BoxGeometry(6, h, 6), mat(0x0a0a16));
      m.position.set(Math.cos(a) * 150, h / 2 - 8, Math.sin(a) * 150);
      m.rotation.z = (i % 2 ? 1 : -1) * 0.12;
      zone.add(m);
    }
    // Spiegelnde Erinnerungs-Lichter über dem Wasser
    particles(zone, { count: 320, color: 0x9a9aff, size: 0.22, opacity: 0.7, height: [0.5, 24], area: 160 });
    particles(zone, { count: 120, color: 0xe8b842, size: 0.28, opacity: 0.6, height: [1, 10], area: 60 });
    stars(zone, { count: 900, color: 0xc8c8ff, size: 1.7 });

    // Konzentrische Ringe auf dem Wasser
    for (let i = 1; i <= 3; i++) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(8 * i, 8 * i + 0.25, 48), glowMat(0x5a5ad0, 0.35));
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.04;
      zone.add(ring);
      zone.onUpdate((dt, t) => { ring.material.opacity = 0.2 + Math.abs(Math.sin(t * 0.5 + i)) * 0.25; });
    }
    zone.playerSpawn = [0, 30];
  },
};

export function buildZone(zoneId, scene, settings = {}) {
  const info = ZONE_INFO[zoneId] || ZONE_INFO.sanctum;
  const zone = new ZoneHandle(zoneId, scene);
  zone.info = info;
  scene.background = new THREE.Color(info.bg);
  scene.fog = new THREE.Fog(info.fog[0], info.fog[1], info.fog[2]);
  (BUILDERS[zoneId] || BUILDERS.sanctum)(zone);
  // Unsichtbare Weltgrenze
  zone.bound = zoneId === 'baths' ? 36 : CONFIG.zoneRadius;
  return zone;
}
