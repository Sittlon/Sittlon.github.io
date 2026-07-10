// ============================================================
//  characters.js – prozedurale 3D-Figuren
//  Stilisierte, von den Bühnen-Personas inspirierte Eigeninterpretationen:
//  Vessel (Maske + Dornenkrone, bemalter Oberkörper),
//  II / III / IV (vermummt, schwarze Masken, Körperbemalung),
//  Sleep (Gottheit mit Goldaugen), NPCs, Gegner & Bosse.
// ============================================================

import * as THREE from 'three';
import { TAU, rand } from './utils.js';

const mat = (color, o = {}) => new THREE.MeshStandardMaterial({
  color, roughness: 0.82, metalness: 0.12, flatShading: true, ...o
});
const glow = (color) => new THREE.MeshBasicMaterial({ color });

function capsuleMesh(r, len, material) {
  return new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 3, 8), material);
}
function boxMesh(w, h, d, material) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
}
function coneMesh(r, h, material, seg = 8) {
  return new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), material);
}
function sphereMesh(r, material, seg = 10) {
  return new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(6, seg - 2)), material);
}

// Bodenschatten (weicher dunkler Kreis)
function blobShadow(radius) {
  const m = new THREE.Mesh(
    new THREE.CircleGeometry(radius, 18),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false })
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.02;
  return m;
}

// ------------------------------------------------------------
//  Humanoid-Baukasten
// ------------------------------------------------------------
function buildHumanoid(p) {
  // p: { skin, accent, eyes, mask, maskColor, crown, hood, hoodColor, bulk,
  //      weapon, paint, dress, robe, robeColor, hair, eyeScale, translucent }
  const g = new THREE.Group();
  const parts = { mats: [], eyes: [] };
  const bulk = p.bulk || 1;
  const skinOpts = p.translucent ? { transparent: true, opacity: 0.78 } : {};
  const skin = mat(p.skin, skinOpts); parts.mats.push(skin);
  const accentMat = mat(p.accent || p.skin, { emissive: p.accent || 0x000000, emissiveIntensity: 0.55 });
  parts.mats.push(accentMat);

  const hipY = 0.92;

  // Beine (oder Robe)
  if (p.robe || p.dress) {
    const robeMat = mat(p.robeColor || p.skin, skinOpts); parts.mats.push(robeMat);
    const robe = coneMesh(0.34 * bulk, 1.0, robeMat, 10);
    robe.position.y = hipY - 0.42;
    g.add(robe);
    parts.robe = robe;
  } else {
    for (const side of [-1, 1]) {
      const pivot = new THREE.Group();
      pivot.position.set(0.12 * bulk * side, hipY, 0);
      const leg = capsuleMesh(0.085 * bulk, 0.52, skin);
      leg.position.y = -0.38;
      pivot.add(leg);
      g.add(pivot);
      parts[side < 0 ? 'legL' : 'legR'] = pivot;
    }
  }

  // Torso
  const torso = new THREE.Group();
  torso.position.y = hipY + 0.06;
  const chest = capsuleMesh(0.175 * bulk, 0.4, skin);
  chest.position.y = 0.28;
  torso.add(chest);
  g.add(torso);
  parts.torso = torso;

  // Körperbemalung (leuchtende Markierungen auf Brust & Armen)
  if (p.paint) {
    const paintMat = mat(0x10131c, { emissive: p.paint, emissiveIntensity: 0.5 });
    parts.mats.push(paintMat);
    for (let i = 0; i < 3; i++) {
      const stripe = boxMesh(0.16 * bulk, 0.02, 0.02, paintMat);
      stripe.position.set(0, 0.18 + i * 0.12, 0.165 * bulk);
      stripe.rotation.z = (i - 1) * 0.25;
      torso.add(stripe);
    }
    const sigil = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.012, 6, 14), paintMat);
    sigil.position.set(0, 0.42, 0.17 * bulk);
    torso.add(sigil);
    parts.paintMat = paintMat;
  }

  // Arme
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(0.26 * bulk, 0.52, 0);
    pivot.position.x *= side;
    const arm = capsuleMesh(0.065 * bulk, 0.48, skin);
    arm.position.y = -0.3;
    pivot.add(arm);
    if (p.paint) {
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.075 * bulk, 0.012, 6, 12), parts.paintMat || accentMat);
      band.rotation.x = Math.PI / 2;
      band.position.y = -0.22;
      pivot.add(band);
    }
    torso.add(pivot);
    parts[side < 0 ? 'armL' : 'armR'] = pivot;
  }

  // Kopf
  const head = new THREE.Group();
  head.position.y = 0.78;
  const skull = sphereMesh(0.145, skin);
  head.add(skull);

  if (p.hair) {
    const hairMat = mat(p.hair); parts.mats.push(hairMat);
    const hair = sphereMesh(0.155, hairMat);
    hair.scale.set(1, 1.05, 1);
    hair.position.set(0, 0.03, -0.04);
    head.add(hair);
  }

  // Maske
  if (p.mask) {
    const maskMat = mat(p.maskColor, { roughness: 0.55, metalness: 0.25 });
    parts.mats.push(maskMat);
    const plate = boxMesh(0.21, 0.26, 0.07, maskMat);
    plate.position.set(0, 0, 0.115);
    head.add(plate);
    if (p.mask === 'vessel' || p.mask === 'cracked') {
      // dunkle Risse / Gravuren in der Maske
      const lineMat = mat(0x0a0a0d);
      parts.mats.push(lineMat);
      for (const [x, ry] of [[-0.05, 0.1], [0.02, -0.12], [0.06, 0.06]]) {
        const line = boxMesh(0.012, 0.22, 0.012, lineMat);
        line.position.set(x, 0, 0.155);
        line.rotation.z = ry;
        head.add(line);
      }
      // Kinnpartie
      const jaw = boxMesh(0.16, 0.08, 0.06, mat(0x101014));
      jaw.position.set(0, -0.16, 0.1);
      head.add(jaw);
    }
  }

  // Augen (leuchtend)
  const eyeMat = glow(p.eyes);
  const es = (p.eyeScale || 1) * 0.024;
  for (const side of [-1, 1]) {
    const eye = sphereMesh(es, eyeMat, 8);
    eye.position.set(0.055 * side, 0.015, p.mask ? 0.155 : 0.13);
    head.add(eye);
    parts.eyes.push(eye);
  }
  parts.eyeMat = eyeMat;

  // Dornenkrone (Vessel)
  if (p.crown) {
    const crownMat = mat(0x14110d, { roughness: 0.5, metalness: 0.45 });
    parts.mats.push(crownMat);
    const n = 9;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU;
      const spike = coneMesh(0.018, 0.16 + (i % 3) * 0.07, crownMat, 5);
      spike.position.set(Math.cos(a) * 0.12, 0.13, Math.sin(a) * 0.12);
      spike.rotation.set(Math.sin(a) * 0.7, 0, -Math.cos(a) * 0.7);
      head.add(spike);
    }
    for (const side of [-1, 1]) {
      const horn = coneMesh(0.025, 0.3, crownMat, 5);
      horn.position.set(0.1 * side, 0.16, -0.05);
      horn.rotation.set(-0.5, 0, side * 0.55);
      head.add(horn);
    }
  }

  // Kapuze (II / III / IV, Diener)
  if (p.hood) {
    const hoodMat = mat(p.hoodColor || 0x0b0b10, { side: THREE.DoubleSide });
    parts.mats.push(hoodMat);
    const hood = coneMesh(0.21, 0.42, hoodMat, 9);
    hood.position.set(0, 0.12, -0.03);
    hood.rotation.x = 0.22;
    head.add(hood);
  }

  // Schleier (Espera)
  if (p.veil) {
    const veilMat = mat(p.veil, { transparent: true, opacity: 0.7, side: THREE.DoubleSide });
    parts.mats.push(veilMat);
    const veil = coneMesh(0.2, 0.5, veilMat, 9, true);
    veil.position.set(0, 0.02, 0);
    head.add(veil);
  }

  torso.add(head);
  parts.head = head;

  // Waffen
  if (p.weapon === 'gauntlets') {
    const gMat = mat(0x1a1a22, { metalness: 0.5, roughness: 0.4 });
    parts.mats.push(gMat);
    for (const key of ['armL', 'armR']) {
      const fist = boxMesh(0.16, 0.16, 0.16, gMat);
      fist.position.y = -0.6;
      parts[key].add(fist);
    }
  } else if (p.weapon === 'staff') {
    const sMat = mat(0x232330, { metalness: 0.4, roughness: 0.45 });
    parts.mats.push(sMat);
    const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.6, 6), sMat);
    staff.position.set(0, -0.5, 0.08);
    const tip = sphereMesh(0.06, glow(p.accent || 0x9fb6e8), 8);
    tip.position.y = 0.82;
    staff.add(tip);
    parts.armR.add(staff);
    parts.weaponMesh = staff;
  } else if (p.weapon === 'blade') {
    const bMat = mat(0x2a2a36, { metalness: 0.65, roughness: 0.3 });
    parts.mats.push(bMat);
    const blade = boxMesh(0.05, 0.85, 0.14, bMat);
    blade.position.set(0, -0.95, 0.04);
    const edge = boxMesh(0.012, 0.8, 0.16, mat(0x8a8a96, { metalness: 0.8, roughness: 0.2 }));
    blade.add(edge);
    parts.armR.add(blade);
    parts.weaponMesh = blade;
  }

  g.add(blobShadow(0.45 * bulk));
  return { group: g, parts };
}

// ------------------------------------------------------------
//  Spezielle Körper (Gott, Bestien, Abstraktes)
// ------------------------------------------------------------
function buildSleepGod(p) {
  // Schwebende Gottheit: kein Beinpaar, Tentakel-Saum, Geweih, Goldaugen
  const g = new THREE.Group();
  const parts = { mats: [], eyes: [], tendrils: [] };
  const skin = mat(p.skin, { roughness: 0.9 }); parts.mats.push(skin);
  const gold = mat(0x14100a, { emissive: p.gold, emissiveIntensity: 0.9 }); parts.mats.push(gold);

  const torso = new THREE.Group();
  torso.position.y = 1.45;
  const chest = capsuleMesh(0.28, 0.7, skin);
  chest.position.y = 0.2;
  torso.add(chest);
  g.add(torso);
  parts.torso = torso;

  // goldenes Siegel auf der Brust
  const sigil = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.02, 6, 16), gold);
  sigil.position.set(0, 0.32, 0.27);
  torso.add(sigil);
  const sigil2 = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.014, 6, 12), gold);
  sigil2.position.set(0, 0.32, 0.28);
  torso.add(sigil2);

  // Arme
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(0.36 * side, 0.5, 0);
    const arm = capsuleMesh(0.09, 0.8, skin);
    arm.position.y = -0.46;
    pivot.add(arm);
    torso.add(pivot);
    parts[side < 0 ? 'armL' : 'armR'] = pivot;
  }

  // Kopf mit Geweih
  const head = new THREE.Group();
  head.position.y = 0.95;
  head.add(sphereMesh(0.2, skin));
  const eyeMat = glow(p.gold);
  parts.eyeMat = eyeMat;
  for (const side of [-1, 1]) {
    const eye = sphereMesh(0.045, eyeMat, 8);
    eye.position.set(0.08 * side, 0.03, 0.17);
    head.add(eye);
    parts.eyes.push(eye);
  }
  const antlerMat = mat(0x0d0c10, { roughness: 0.6 }); parts.mats.push(antlerMat);
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const a = coneMesh(0.022, 0.5 + i * 0.16, antlerMat, 5);
      a.position.set((0.1 + i * 0.05) * side, 0.22 + i * 0.05, -0.04);
      a.rotation.set(-0.35 - i * 0.12, 0, side * (0.5 + i * 0.3));
      head.add(a);
    }
  }
  if (p.crowned) {
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU;
      const s = coneMesh(0.03, 0.34, gold, 5);
      s.position.set(Math.cos(a) * 0.17, 0.24, Math.sin(a) * 0.17);
      s.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5);
      head.add(s);
    }
  }
  torso.add(head);
  parts.head = head;

  // Tentakel-Saum statt Beinen
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU;
    const t = coneMesh(0.09, 1.1, skin, 6);
    t.position.set(Math.cos(a) * 0.2, 0.85, Math.sin(a) * 0.2);
    t.rotation.x = Math.PI; // Spitze nach unten
    t.userData.baseA = a;
    g.add(t);
    parts.tendrils.push(t);
  }

  g.add(blobShadow(0.8));
  return { group: g, parts };
}

function buildShadow(p) {
  const g = new THREE.Group();
  const parts = { mats: [], eyes: [], float: true };
  const body = sphereMesh(0.45, mat(p.skin, { roughness: 1 }), 8);
  body.scale.set(1, 0.78, 1);
  body.position.y = 0.75;
  parts.mats.push(body.material);
  g.add(body);
  parts.torso = body;
  const eyeMat = glow(p.eyes);
  parts.eyeMat = eyeMat;
  for (const side of [-1, 1]) {
    const eye = sphereMesh(0.05, eyeMat, 8);
    eye.scale.set(1, 1.6, 0.5);
    eye.position.set(0.16 * side, 0.82, 0.36);
    g.add(eye);
    parts.eyes.push(eye);
  }
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU + 0.4;
    const t = coneMesh(0.08, 0.5, body.material, 5);
    t.position.set(Math.cos(a) * 0.25, 0.35, Math.sin(a) * 0.25);
    t.rotation.x = Math.PI;
    g.add(t);
  }
  g.add(blobShadow(0.5));
  return { group: g, parts };
}

function buildFeeder(p) {
  const g = new THREE.Group();
  const parts = { mats: [], eyes: [] };
  const skin = mat(p.skin, { roughness: 0.95 }); parts.mats.push(skin);
  const body = capsuleMesh(0.22, 0.5, skin);
  body.rotation.x = Math.PI / 2;
  body.position.y = 0.5;
  g.add(body);
  parts.torso = body;
  const head = coneMesh(0.16, 0.36, skin, 6);
  head.rotation.x = -Math.PI / 2;
  head.position.set(0, 0.52, 0.5);
  g.add(head);
  const eyeMat = glow(p.eyes);
  parts.eyeMat = eyeMat;
  for (const side of [-1, 1]) {
    const eye = sphereMesh(0.035, eyeMat, 6);
    eye.position.set(0.08 * side, 0.6, 0.45);
    g.add(eye);
    parts.eyes.push(eye);
  }
  parts.legCones = [];
  for (const [x, z] of [[-0.18, 0.2], [0.18, 0.2], [-0.18, -0.2], [0.18, -0.2]]) {
    const leg = coneMesh(0.06, 0.5, skin, 5);
    leg.position.set(x, 0.26, z);
    leg.rotation.x = Math.PI;
    g.add(leg);
    parts.legCones.push(leg);
  }
  g.add(blobShadow(0.45));
  return { group: g, parts };
}

function buildVore(p) {
  // Die Manifestation des Verschlingens: ein schwebender Schlund
  const g = new THREE.Group();
  const parts = { mats: [], eyes: [], float: true, orbiters: [] };
  const skin = mat(p.skin, { roughness: 1 }); parts.mats.push(skin);
  const body = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 1), skin);
  body.position.y = 1.6;
  g.add(body);
  parts.torso = body;
  const toothMat = mat(0xd8d2c4, { roughness: 0.4 });
  parts.mats.push(toothMat);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * TAU;
    const tooth = coneMesh(0.08, 0.34, toothMat, 5);
    tooth.position.set(Math.cos(a) * 0.62, 1.6 + Math.sin(a) * 0.62, 0.78);
    tooth.rotation.z = a + Math.PI;
    tooth.rotation.x = 0.4;
    g.add(tooth);
  }
  const eyeMat = glow(p.eyes);
  parts.eyeMat = eyeMat;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * TAU + 0.3;
    const eye = sphereMesh(0.07, eyeMat, 8);
    eye.position.set(Math.cos(a) * 0.85, 1.95 + Math.sin(a) * 0.45, 0.55);
    g.add(eye);
    parts.eyes.push(eye);
  }
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    const t = coneMesh(0.12, 1.5, skin, 6);
    t.position.set(Math.cos(a) * 0.7, 0.8, Math.sin(a) * 0.7);
    t.rotation.x = Math.PI;
    t.userData.baseA = a;
    g.add(t);
    parts.orbiters.push(t);
  }
  g.add(blobShadow(1.1));
  return { group: g, parts };
}

function buildEmergent(p) {
  const g = new THREE.Group();
  const parts = { mats: [], eyes: [], float: true };
  const skin = mat(p.skin, { roughness: 1 });
  const crack = mat(0x140d06, { emissive: 0xe8a040, emissiveIntensity: 0.8 });
  parts.mats.push(skin, crack);
  const cluster = new THREE.Group();
  cluster.position.y = 1.1;
  for (const [x, y, z, r] of [[0, 0, 0, 0.55], [-0.45, 0.3, 0.1, 0.35], [0.4, 0.35, -0.1, 0.4], [0.1, 0.65, 0.15, 0.3], [-0.2, -0.3, 0.2, 0.32]]) {
    const blob = sphereMesh(r, skin, 8);
    blob.position.set(x, y, z);
    cluster.add(blob);
  }
  for (let i = 0; i < 5; i++) {
    const seam = boxMesh(0.03, rand(0.3, 0.7), 0.03, crack);
    seam.position.set(rand(-0.4, 0.4), rand(-0.2, 0.6), 0.42);
    seam.rotation.z = rand(-0.8, 0.8);
    cluster.add(seam);
  }
  const eyeMat = glow(p.eyes);
  parts.eyeMat = eyeMat;
  const eye = sphereMesh(0.13, eyeMat, 10);
  eye.position.set(0.05, 0.25, 0.5);
  cluster.add(eye);
  parts.eyes.push(eye);
  g.add(cluster);
  parts.torso = cluster;
  g.add(blobShadow(0.8));
  return { group: g, parts };
}

function buildVoidheart(p) {
  const g = new THREE.Group();
  const parts = { mats: [], eyes: [], float: true, orbiters: [] };
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(1.25, 24, 18),
    new THREE.MeshStandardMaterial({ color: 0x05030a, roughness: 0.3, metalness: 0.6, emissive: 0x1a0a2e, emissiveIntensity: 0.7 })
  );
  core.position.y = 2.2;
  parts.mats.push(core.material);
  g.add(core);
  parts.torso = core;
  const eyeMat = glow(p.eyes);
  parts.eyeMat = eyeMat;
  const eye = sphereMesh(0.22, eyeMat, 12);
  eye.position.set(0, 2.2, 1.12);
  g.add(eye);
  parts.eyes.push(eye);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.05, 8, 40), mat(0x0d0a14, { emissive: 0x6a4ad0, emissiveIntensity: 0.6 }));
  ring.position.y = 2.2;
  ring.rotation.x = Math.PI / 2.4;
  parts.mats.push(ring.material);
  g.add(ring);
  parts.ring = ring;
  const shardMat = mat(0x14101e, { emissive: 0x8a5ae0, emissiveIntensity: 0.5 });
  parts.mats.push(shardMat);
  for (let i = 0; i < 8; i++) {
    const shard = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 0), shardMat);
    shard.userData.baseA = (i / 8) * TAU;
    shard.userData.r = 1.9;
    g.add(shard);
    parts.orbiters.push(shard);
  }
  g.add(blobShadow(1.4));
  return { group: g, parts };
}

function buildMaskmaker(p) {
  const base = buildHumanoid({
    skin: 0x121018, eyes: 0xe8c050, mask: 'blank', maskColor: 0xe0c060,
    hood: true, hoodColor: 0x1a1410, robe: true, robeColor: 0x16121c,
    bulk: 1.1, paint: 0xe0b040,
  });
  const { group, parts } = base;
  parts.orbiters = [];
  const maskMat = mat(0xd8d2c4, { roughness: 0.4 });
  parts.mats.push(maskMat);
  for (let i = 0; i < 6; i++) {
    const m = boxMesh(0.16, 0.22, 0.04, maskMat);
    const eye1 = boxMesh(0.03, 0.03, 0.02, mat(0x0a0a0a));
    eye1.position.set(-0.04, 0.03, 0.03);
    const eye2 = eye1.clone();
    eye2.position.x = 0.04;
    m.add(eye1, eye2);
    m.userData.baseA = (i / 6) * TAU;
    m.userData.r = 0.95;
    group.add(m);
    parts.orbiters.push(m);
  }
  parts.float = true;
  return base;
}

// ------------------------------------------------------------
//  Charakter-Katalog
// ------------------------------------------------------------
const KIND_DEFS = {
  // ---- Spielbare ----
  vessel: () => buildHumanoid({
    skin: 0x191c26, eyes: 0xffffff, mask: 'vessel', maskColor: 0xc9c4b4,
    crown: true, paint: 0x9aa8ff, weapon: 'none',
  }),
  two: () => buildHumanoid({
    skin: 0x0e0e13, eyes: 0xdfffF2, mask: 'blank', maskColor: 0x16161c,
    hood: true, bulk: 1.18, paint: 0x9fe8d0, weapon: 'gauntlets',
  }),
  three: () => buildHumanoid({
    skin: 0x0e0e13, eyes: 0xdfeaff, mask: 'blank', maskColor: 0x16161c,
    hood: true, bulk: 1.05, paint: 0x9fb6e8, weapon: 'staff',
  }),
  four: () => buildHumanoid({
    skin: 0x0e0e13, eyes: 0xffe2e2, mask: 'blank', maskColor: 0x16161c,
    hood: true, bulk: 0.95, paint: 0xe89f9f, weapon: 'blade',
  }),

  // ---- NPCs ----
  sleepgod: () => buildSleepGod({ skin: 0x07070c, gold: 0xe8b842 }),
  woman: () => buildHumanoid({
    skin: 0xd8c2b4, eyes: 0x4a3528, dress: true, robeColor: 0x8c2f45,
    hair: 0x2a1f1a, eyeScale: 0.8,
  }),
  chronist: () => buildHumanoid({
    skin: 0xb8a890, eyes: 0xd8c890, robe: true, robeColor: 0x2e2a22,
    hood: true, hoodColor: 0x2e2a22, eyeScale: 0.8,
  }),
  espera: () => buildHumanoid({
    skin: 0xd8d0c0, eyes: 0xfff3c4, robe: true, robeColor: 0xcfc4a8,
    veil: 0xe8e0c8, paint: 0xe8d8a0, eyeScale: 0.9,
  }),
  bandnpc2: () => buildHumanoid({
    skin: 0x0e0e13, eyes: 0x9fe8d0, mask: 'blank', maskColor: 0x16161c, hood: true, bulk: 1.18,
  }),
  bandnpc3: () => buildHumanoid({
    skin: 0x0e0e13, eyes: 0x9fb6e8, mask: 'blank', maskColor: 0x16161c, hood: true, bulk: 1.05,
  }),
  bandnpc4: () => buildHumanoid({
    skin: 0x0e0e13, eyes: 0xe89f9f, mask: 'blank', maskColor: 0x16161c, hood: true, bulk: 0.95,
  }),

  // ---- Gegner ----
  shadow:   () => buildShadow({ skin: 0x0a0a12, eyes: 0xffffff }),
  feeder:   () => buildFeeder({ skin: 0x16101a, eyes: 0xff5a5a }),
  servant:  () => buildHumanoid({
    skin: 0x101016, eyes: 0xe8c050, mask: 'blank', maskColor: 0xd8d2c4,
    hood: true, robe: true, robeColor: 0x14141c,
  }),
  guardian: () => buildHumanoid({
    skin: 0x3a3a46, eyes: 0xb080ff, mask: 'blank', maskColor: 0x2a2a34,
    bulk: 1.55, paint: 0x8a60d0, weapon: 'gauntlets',
  }),

  // ---- Bosse ----
  riftwarden: () => buildHumanoid({
    skin: 0x2e2440, eyes: 0xc890ff, mask: 'cracked', maskColor: 0x4a3a66,
    bulk: 1.5, paint: 0xa070e8, weapon: 'gauntlets',
  }),
  jealous: () => buildShadow({ skin: 0x0c1410, eyes: 0xc8e850 }),
  avatar: () => buildSleepGod({ skin: 0x0c0c14, gold: 0xb08830 }),
  champion: () => buildHumanoid({
    skin: 0x1a1218, eyes: 0xff4040, mask: 'cracked', maskColor: 0x3a2028,
    crown: true, bulk: 1.3, paint: 0xc02040, weapon: 'blade',
  }),
  vore: () => buildVore({ skin: 0x120a16, eyes: 0xe8e8ff }),
  echo: () => buildHumanoid({
    skin: 0x0c0c14, eyes: 0xe8b842, mask: 'vessel', maskColor: 0x2a2a30,
    crown: true, paint: 0xe8b842, translucent: true,
  }),
  emergent: () => buildEmergent({ skin: 0x14101a, eyes: 0xe8a040 }),
  pastvessel: () => buildHumanoid({
    skin: 0x222630, eyes: 0xffffff, mask: 'vessel', maskColor: 0xe8e4d8,
    paint: 0xc8d0ff,
  }),
  maskmaker: () => buildMaskmaker({}),
  firstdream: () => buildSleepGod({ skin: 0xc8c2b2, gold: 0xe8b842 }),
  crowned: () => buildSleepGod({ skin: 0x07070c, gold: 0xffd060, crowned: true }),
  mirror: () => buildHumanoid({
    skin: 0xe6e6ee, eyes: 0x111118, mask: 'vessel', maskColor: 0x222228,
    crown: true, paint: 0x303040,
  }),
  voidheart: () => buildVoidheart({ eyes: 0xe8e8ff }),
};

export const CHAR_KINDS = Object.keys(KIND_DEFS);

// Schwebende Wesen
const FLOATERS = new Set(['sleepgod', 'avatar', 'firstdream', 'crowned', 'shadow', 'jealous', 'servant', 'vore', 'echo', 'emergent', 'maskmaker', 'voidheart']);

// ------------------------------------------------------------
//  Rig – animierbare Figur
// ------------------------------------------------------------
export class Rig {
  constructor(kind, opts = {}) {
    const def = KIND_DEFS[kind] || KIND_DEFS.shadow;
    const { group, parts } = def();
    this.kind = kind;
    this.group = group;
    this.parts = parts;
    this.walkT = rand(0, TAU);
    this.idleT = rand(0, TAU);
    this.flash = 0;
    this.baseY = 0;
    this.floats = FLOATERS.has(kind) || parts.float;
    if (opts.scale) group.scale.setScalar(opts.scale);
    this.scale = opts.scale || 1;
    if (opts.eyeColor && parts.eyeMat) parts.eyeMat.color.set(opts.eyeColor);
    // Original-Emissive-Werte für Treffer-Blitz merken
    this._flashable = (parts.mats || []).filter(m => m && m.emissive);
    this._origEmissive = this._flashable.map(m => m.emissive.getHex());
    // Original-Transparenz merken (für das Zurücksetzen nach der Todesanimation)
    this._origOpacity = this._flashable.map(m => m.opacity);
    this._origTransparent = this._flashable.map(m => m.transparent);
  }

  // Setzt die Figur aus der Todespose (eingesunken/gekippt/transparent) zurück.
  resetPose() {
    this.group.rotation.x = 0;
    this.group.position.y = this.baseY;
    this.group.scale.setScalar(this.scale);
    this._flashable.forEach((m, i) => {
      m.opacity = this._origOpacity[i];
      m.transparent = this._origTransparent[i];
    });
  }

  // anim = { speed:0..1, attackT:null|0..1, dead:0..1, talk:bool, heavy:bool }
  update(dt, anim = {}) {
    const p = this.parts;
    const speed = anim.speed || 0;
    this.walkT += dt * (4 + speed * 7) * (speed > 0.02 ? 1 : 0);
    this.idleT += dt;

    const swing = Math.sin(this.walkT) * 0.55 * Math.min(1, speed * 1.4);

    if (p.legL && p.legR) {
      p.legL.rotation.x = swing;
      p.legR.rotation.x = -swing;
    }
    if (p.legCones) {
      p.legCones.forEach((leg, i) => { leg.rotation.z = Math.sin(this.walkT + i * 1.7) * 0.3 * Math.min(1, speed + 0.2); });
    }

    // Arme: Gehen oder Angriff
    if (p.armL && p.armR) {
      let armRX = -swing * 0.8;
      let armLX = swing * 0.8;
      if (anim.attackT != null) {
        const t = anim.attackT;
        let pose;
        if (t < 0.4) pose = -2.3 * (t / 0.4);            // ausholen
        else if (t < 0.6) pose = -2.3 + 3.1 * ((t - 0.4) / 0.2); // zuschlagen
        else pose = 0.8 * (1 - (t - 0.6) / 0.4);          // zurück
        armRX = pose;
        if (anim.heavy) armLX = pose;                     // beidarmig (II)
      }
      p.armR.rotation.x = armRX;
      p.armL.rotation.x = armLX;
      p.armL.rotation.z = 0.12;
      p.armR.rotation.z = -0.12;
    }

    // Atmen / Schweben
    if (p.torso) {
      const breathe = Math.sin(this.idleT * 1.8) * 0.015;
      if (p.torso.isGroup || p.torso.isMesh) {
        p.torso.scale.y = 1 + breathe;
      }
    }
    if (this.floats) {
      this.group.position.y = this.baseY + 0.12 + Math.sin(this.idleT * 1.6) * 0.08;
    }

    // Sprechen: leichtes Kopfnicken
    if (p.head && anim.talk) {
      p.head.rotation.x = Math.sin(this.idleT * 6) * 0.05;
    }

    // Tentakel / Orbiter
    if (p.tendrils) {
      p.tendrils.forEach((t) => {
        const a = t.userData.baseA;
        t.rotation.z = Math.sin(this.idleT * 1.4 + a * 2) * 0.18;
      });
    }
    if (p.orbiters) {
      p.orbiters.forEach((o) => {
        const a = o.userData.baseA + this.idleT * 0.8;
        const r = o.userData.r || 0.95;
        const cy = o.userData.cy != null ? o.userData.cy : (this.kind === 'voidheart' ? 2.2 : 1.2);
        o.position.set(Math.cos(a) * r, cy + Math.sin(this.idleT * 1.3 + a) * 0.2, Math.sin(a) * r);
        o.rotation.y = a + Math.PI / 2;
      });
    }
    if (p.ring) p.ring.rotation.z += dt * 0.4;

    // Sterben: einsinken & kippen
    if (anim.dead != null && anim.dead > 0) {
      const d = Math.min(1, anim.dead);
      this.group.rotation.x = d * 0.9;
      this.group.position.y = this.baseY - d * 0.6;
      this.group.scale.setScalar(this.scale * (1 - d * 0.4));
      this._flashable.forEach(m => { m.transparent = true; m.opacity = 1 - d * 0.9; });
    }

    // Treffer-Blitz
    if (this.flash > 0) {
      this.flash = Math.max(0, this.flash - dt * 5);
      const f = this.flash;
      this._flashable.forEach((m, i) => {
        m.emissive.setHex(this._origEmissive[i]);
        m.emissive.lerp(new THREE.Color(0xffffff), f * 0.85);
      });
    }
  }

  hitFlash() { this.flash = 1; }

  setEyeIntensity(v) {
    if (this.parts.eyeMat) this.parts.eyeMat.color.multiplyScalar(v);
  }

  dispose() {
    this.group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
      }
    });
  }
}

export function createRig(kind, opts = {}) {
  return new Rig(kind, opts);
}
