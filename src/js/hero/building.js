/*
 * Procedural model of the Darik Homes residential block in Kaura District, Abuja.
 *
 * Massing follows the architect's render and the site photos: two wings with
 * projecting balcony frames either side of a recessed centre with stacked
 * balconies, three floors, white render with charcoal accents, inside a walled
 * plot with charcoal pillars, slatted infill and a gatehouse. It is an
 * illustrative model, not a survey: dimensions are plausible, not measured.
 *
 * Every element belongs to a build group. A group knows which construction
 * stage it belongs to and when, inside that stage, it appears.
 */
import {
  BoxGeometry,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Vector3,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { pavingTexture, roadTexture, signTexture, soilTexture } from './textures.js';

export const STAGES = ['plot', 'foundation', 'frame', 'walls', 'finish', 'site'];
const S = Object.fromEntries(STAGES.map((s, i) => [s, i]));

export const BASE = 0.35;
export const FH = 3.3;
const FLOORS = 3;
const SLAB = 0.24;
const WALL = 0.22;
export const ROOF = BASE + FH * FLOORS;
const PARAPET = 0.95;

const PLOT = { x0: -30, x1: 30, z0: -22, z1: 20 };
const GATE = { x0: 13, x1: 19 };
const BAYS = [
  [-12.6, -8.2],
  [8.2, 12.6],
];

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const backOut = (t) => {
  const c = 1.4;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

class Kit {
  constructor() {
    this.groups = new Map();
  }

  group(name, spec) {
    if (!this.groups.has(name)) this.groups.set(name, { name, ...spec, parts: new Map() });
    return name;
  }

  /** Axis-aligned box. x/z are centres, y0 is the bottom face. */
  box(group, mat, cx, y0, cz, w, h, d) {
    if (w <= 0 || h <= 0 || d <= 0) return;
    const g = new BoxGeometry(w, h, d);
    g.translate(cx, y0 + h / 2, cz);
    this.add(group, mat, g);
  }

  /** Box from min/max corners. */
  span(group, mat, x0, y0, z0, x1, y1, z1) {
    this.box(group, mat, (x0 + x1) / 2, y0, (z0 + z1) / 2, x1 - x0, y1 - y0, z1 - z0);
  }

  add(group, mat, geometry) {
    const g = this.groups.get(group);
    if (!g) throw new Error(`unknown group ${group}`);
    if (!g.parts.has(mat)) g.parts.set(mat, []);
    g.parts.get(mat).push(geometry);
  }
}

function makeMaterials(anisotropy) {
  const std = (color, roughness = 0.9, extra = {}) => new MeshStandardMaterial({ color, roughness, metalness: 0, ...extra });
  const soil = soilTexture(anisotropy);
  const paving = pavingTexture(anisotropy);
  return {
    footing: std('#8f897f', 1),
    concrete: std('#bdb8ae', 0.95),
    wallWhite: std('#a7a39a', 0.92),
    wallCharcoal: std('#a7a39a', 0.92),
    accent: std('#3a3e43', 0.85),
    trim: std('#f4f2ec', 0.85),
    window: std('#26211d', 0.95, { envMapIntensity: 0 }),
    rail: std('#2a2d31', 0.45, { metalness: 0.55 }),
    timber: std('#8a6a45', 0.9),
    soil: std('#ffffff', 1, { map: soil }),
    road: std('#ffffff', 1, { map: roadTexture(anisotropy) }),
    paving: std('#ffffff', 0.95, { map: paving, transparent: true, opacity: 0, depthWrite: false }),
    fenceWhite: std('#eeece6', 0.9),
    fenceDark: std('#34383d', 0.8),
    palmTrunk: std('#7b6347', 0.95),
    palmLeaf: std('#3d6a31', 0.8, { side: DoubleSide }),
    tree: std('#ffffff', 0.95, { vertexColors: true, flatShading: true }),
    distant: std('#c7c1b6', 0.95),
    sign: std('#ffffff', 0.7, { map: signTexture(anisotropy) }),
    lamp: new MeshBasicMaterial({ color: '#3b3a36' }),
    line: new LineBasicMaterial({ color: '#4cc3ff', transparent: true, opacity: 0, depthWrite: false }),
    ghost: new LineBasicMaterial({ color: '#7fd4ff', transparent: true, opacity: 0, depthWrite: false }),
  };
}

/* ---------- structure ---------- */

const FOOTPRINT = [
  { x0: -22, x1: -7, z0: -8, z1: 8 },
  { x0: -7, x1: 7, z0: -8, z1: 5 },
  { x0: 7, x1: 22, z0: -8, z1: 8 },
];
const RECESS_BALCONIES = [
  { x0: -6.6, x1: -0.5, z0: 5, z1: 7.4 },
  { x0: 0.5, x1: 6.6, z0: 5, z1: 7.4 },
];

function columnPoints() {
  const xs = [-22, -17.2, -12.6, -7, -2.4, 2.4, 7, 12.6, 17.2, 22];
  const pts = [];
  for (const x of xs) {
    const zFront = Math.abs(x) < 7 ? 5 : 8;
    for (const z of [-8, -2.7, 2.7, zFront]) {
      if (z > zFront) continue;
      pts.push([x, z]);
    }
  }
  for (const b of RECESS_BALCONIES) {
    pts.push([b.x0 + 0.2, b.z1 - 0.2], [b.x1 - 0.2, b.z1 - 0.2]);
  }
  for (const [a, b] of BAYS) pts.push([a + 0.15, 9.15], [b - 0.15, 9.15]);
  return pts;
}

function buildStructure(kit) {
  const cols = columnPoints();

  kit.group('footings', {
    stage: S.foundation,
    t0: 0.0,
    t1: 0.55,
    anim: 'rise',
    baseY: -0.9,
    out: { stage: S.walls, t0: 0, t1: 0.3 },
  });
  for (const [x, z] of cols) kit.box('footings', 'footing', x, -0.9, z, 1.5, 0.9 + 0.05, 1.5);

  kit.group('plinth', { stage: S.foundation, t0: 0.45, t1: 1, anim: 'rise', baseY: 0 });
  for (const f of FOOTPRINT) kit.span('plinth', 'concrete', f.x0, 0, f.z0, f.x1, BASE, f.z1);

  const step = 1 / FLOORS;
  for (let k = 0; k < FLOORS; k++) {
    const y0 = BASE + k * FH;
    const colGroup = kit.group(`columns${k}`, { stage: S.frame, t0: k * step, t1: k * step + step * 0.6, anim: 'rise', baseY: y0 });
    for (const [x, z] of cols) {
      const isBayOrBalcony = z > 8 || (Math.abs(x) < 7 && z > 5);
      if (isBayOrBalcony && k === 0) continue;
      kit.box(colGroup, 'concrete', x, y0, z, 0.36, FH - SLAB, 0.36);
    }
    const top = BASE + (k + 1) * FH;
    const slabGroup = kit.group(`slab${k}`, { stage: S.frame, t0: k * step + step * 0.45, t1: (k + 1) * step, anim: 'drop', baseY: top - SLAB });
    for (const f of FOOTPRINT) kit.span(slabGroup, 'concrete', f.x0 - 0.15, top - SLAB, f.z0 - 0.15, f.x1 + 0.15, top, f.z1 + 0.15);
    if (k < FLOORS - 1) {
      for (const b of RECESS_BALCONIES) kit.span(slabGroup, 'concrete', b.x0, top - SLAB, b.z0, b.x1, top - 0.02, b.z1);
      for (const [a, b] of BAYS) kit.span(slabGroup, 'concrete', a + 0.3, top - SLAB, 8, b - 0.3, top - 0.02, 9.3);
    } else {
      kit.span(slabGroup, 'concrete', -7, top - SLAB, 5, 7, top, 7.6);
    }
  }
}

/* ---------- walls, openings, finishes ---------- */

const windowsFront = (k) => {
  const list = [];
  for (const x of [-18.2, -14.8, 14.8, 18.2]) list.push({ face: 'front', x, z: 8, w: 1.3, h: 1.45, sill: 0.95 });
  for (const [a, b] of BAYS) {
    const cx = (a + b) / 2;
    if (k === 0) list.push({ face: 'front', x: cx, z: 8, w: 1.6, h: 1.45, sill: 0.95 });
    else list.push({ face: 'front', x: cx, z: 8, w: 1.7, h: 2.3, sill: 0.08 });
  }
  if (k === 0) {
    list.push({ face: 'front', x: 0, z: 5, w: 1.8, h: 2.4, sill: 0.05 });
    list.push({ face: 'front', x: -4, z: 5, w: 1.3, h: 1.45, sill: 0.95 });
    list.push({ face: 'front', x: 4, z: 5, w: 1.3, h: 1.45, sill: 0.95 });
  } else {
    list.push({ face: 'front', x: -3.5, z: 5, w: 1.4, h: 2.3, sill: 0.08 });
    list.push({ face: 'front', x: 3.5, z: 5, w: 1.4, h: 2.3, sill: 0.08 });
  }
  return list;
};

const windowsSide = () => {
  const list = [];
  for (const z of [-4.5, 0, 4.5]) {
    list.push({ face: 'left', x: -22, z, w: 1.3, h: 1.45, sill: 0.95 });
    list.push({ face: 'right', x: 22, z, w: 1.3, h: 1.45, sill: 0.95 });
  }
  list.push({ face: 'right', x: -7, z: 6.5, w: 0.8, h: 1.0, sill: 1.2 });
  list.push({ face: 'left', x: 7, z: 6.5, w: 0.8, h: 1.0, sill: 1.2 });
  return list;
};

const windowsBack = () => {
  const list = [];
  for (let x = -19.8; x <= 19.81; x += 3.6) list.push({ face: 'back', x, z: -8, w: 1.3, h: 1.45, sill: 0.95 });
  return list;
};

function placeWindow(kit, group, frameGroup, y0, win, withFrame) {
  const { face, x, z, w, h, sill } = win;
  const yb = y0 + sill;
  const depth = 0.12;
  const t = 0.09;
  const fd = 0.16;
  if (face === 'front' || face === 'back') {
    const s = face === 'front' ? 1 : -1;
    kit.box(group, 'window', x, yb, z + s * 0.02, w, h, depth);
    if (withFrame) {
      const zf = z + s * 0.05;
      kit.box(frameGroup, 'trim', x, yb + h, zf, w + 2 * t, t, fd);
      kit.box(frameGroup, 'trim', x, yb - t, zf, w + 2 * t + 0.12, t, fd + 0.06);
      kit.box(frameGroup, 'trim', x - w / 2 - t / 2, yb, zf, t, h, fd);
      kit.box(frameGroup, 'trim', x + w / 2 + t / 2, yb, zf, t, h, fd);
    }
  } else {
    const s = face === 'right' ? 1 : -1;
    kit.box(group, 'window', x + s * 0.02, yb, z, depth, h, w);
    if (withFrame) {
      const xf = x + s * 0.05;
      kit.box(frameGroup, 'trim', xf, yb + h, z, fd, t, w + 2 * t);
      kit.box(frameGroup, 'trim', xf, yb - t, z, fd + 0.06, t, w + 2 * t + 0.12);
      kit.box(frameGroup, 'trim', xf, yb, z - w / 2 - t / 2, fd, h, t);
      kit.box(frameGroup, 'trim', xf, yb, z + w / 2 + t / 2, fd, h, t);
    }
  }
}

function buildWalls(kit) {
  const step = 1 / FLOORS;
  const wallH = FH - SLAB;
  kit.group('frames', { stage: S.finish, t0: 0.35, t1: 0.8, anim: 'rise', baseY: BASE });

  for (let k = 0; k < FLOORS; k++) {
    const y0 = BASE + k * FH;
    const ground = k === 0;
    const wingMat = ground ? 'wallCharcoal' : 'wallWhite';
    const chunks = [
      kit.group(`wallsL${k}`, { stage: S.walls, t0: k * step, t1: k * step + step * 0.7, anim: 'rise', baseY: y0 }),
      kit.group(`wallsC${k}`, { stage: S.walls, t0: k * step + step * 0.15, t1: k * step + step * 0.85, anim: 'rise', baseY: y0 }),
      kit.group(`wallsR${k}`, { stage: S.walls, t0: k * step + step * 0.3, t1: (k + 1) * step, anim: 'rise', baseY: y0 }),
    ];
    const [L, C, R] = chunks;

    kit.span(L, wingMat, -22, y0, 8 - WALL, -7, y0 + wallH, 8);
    kit.span(L, wingMat, -22, y0, -8, -22 + WALL, y0 + wallH, 8);
    kit.span(L, 'wallWhite', -22, y0, -8, -7, y0 + wallH, -8 + WALL);
    kit.span(L, 'wallWhite', -7 - WALL, y0, 5, -7, y0 + wallH, 8);

    kit.span(C, 'wallCharcoal', -7, y0, 5 - WALL, 7, y0 + wallH, 5);
    kit.span(C, 'wallWhite', -7, y0, -8, 7, y0 + wallH, -8 + WALL);

    kit.span(R, wingMat, 7, y0, 8 - WALL, 22, y0 + wallH, 8);
    kit.span(R, wingMat, 22 - WALL, y0, -8, 22, y0 + wallH, 8);
    kit.span(R, 'wallWhite', 7, y0, -8, 22, y0 + wallH, -8 + WALL);
    kit.span(R, 'wallWhite', 7, y0, 5, 7 + WALL, y0 + wallH, 8);

    for (const win of windowsFront(k)) placeWindow(kit, win.x < -3 ? L : win.x > 3 ? R : C, 'frames', y0, win, true);
    for (const win of windowsSide()) placeWindow(kit, win.x < 0 ? L : R, 'frames', y0, win, true);
    for (const win of windowsBack()) placeWindow(kit, win.x < -7 ? L : win.x > 7 ? R : C, 'frames', y0, win, false);
  }

  kit.group('parapet', { stage: S.walls, t0: 0.85, t1: 1, anim: 'rise', baseY: ROOF });
  const pTop = ROOF + PARAPET;
  const ring = [
    [-22, -8, 22, -8 + WALL],
    [-22, -8, -22 + WALL, 8],
    [22 - WALL, -8, 22, 8],
    [-22, 8 - WALL, -7, 8],
    [7, 8 - WALL, 22, 8],
    [-7 - WALL, 7.6 - WALL, -7, 8],
    [7, 7.6 - WALL, 7 + WALL, 8],
    [-7, 7.6 - WALL, 7, 7.6],
  ];
  for (const [x0, z0, x1, z1] of ring) kit.span('parapet', 'wallWhite', x0, ROOF, z0, x1, pTop, z1);

  kit.group('coping', { stage: S.finish, t0: 0.55, t1: 0.9, anim: 'rise', baseY: pTop });
  for (const [x0, z0, x1, z1] of ring) kit.span('coping', 'trim', x0 - 0.08, pTop, z0 - 0.08, x1 + 0.08, pTop + 0.08, z1 + 0.08);

  kit.group('accents', { stage: S.finish, t0: 0.2, t1: 0.6, anim: 'rise', baseY: BASE + FH });
  for (const [x0, x1] of [
    [-21.2, -20.2],
    [20.2, 21.2],
  ]) {
    kit.span('accents', 'accent', x0, BASE + FH, 8, x1, ROOF + PARAPET * 0.6, 8.05);
  }

  for (const [a, b] of BAYS) {
    kit.span('frames', 'trim', a, BASE, 8, a + 0.3, pTop + 0.35, 9.3);
    kit.span('frames', 'trim', b - 0.3, BASE, 8, b, pTop + 0.35, 9.3);
    kit.span('frames', 'trim', a, pTop - 0.15, 8, b, pTop + 0.35, 9.3);
  }
  kit.span('frames', 'trim', -0.5, BASE, 5, 0.5, ROOF, 7.6);
  kit.span('frames', 'trim', -7, BASE, 7.6 - 0.02, 7, BASE + 0.12, 7.7);
}

function railing(kit, group, x0, x1, z, y) {
  for (const hgt of [0.38, 0.7, 1.0]) kit.span(group, 'rail', x0, y + hgt, z - 0.03, x1, y + hgt + 0.06, z + 0.03);
  kit.span(group, 'rail', x0, y, z - 0.04, x0 + 0.06, y + 1.06, z + 0.04);
  kit.span(group, 'rail', x1 - 0.06, y, z - 0.04, x1, y + 1.06, z + 0.04);
}

function buildRailings(kit) {
  kit.group('railings', { stage: S.finish, t0: 0.6, t1: 1, anim: 'rise', baseY: BASE + FH });
  for (let k = 1; k < FLOORS; k++) {
    const y = BASE + k * FH;
    for (const b of RECESS_BALCONIES) railing(kit, 'railings', b.x0, b.x1, b.z1 - 0.05, y);
    for (const [a, b] of BAYS) railing(kit, 'railings', a + 0.3, b - 0.3, 9.25, y);
  }
}

/* ---------- scaffolding: timber poles, as on the Kaura photos ---------- */

function buildScaffold(kit) {
  const step = 1 / FLOORS;
  const runs = [];
  for (let x = -22.8; x <= 22.81; x += 2.4) runs.push([x, 10.3]);
  for (let z = -7; z <= 8.01; z += 2.5) {
    runs.push([-23.4, z]);
    runs.push([23.4, z]);
  }
  for (let k = 0; k < FLOORS; k++) {
    const y0 = k === 0 ? 0 : BASE + k * FH - 0.6;
    const y1 = BASE + (k + 1) * FH - 0.6;
    const name = kit.group(`scaffold${k}`, {
      stage: S.frame,
      t0: k * step + step * 0.2,
      t1: k * step + step * 0.9,
      anim: 'rise',
      baseY: y0,
      out: { stage: S.finish, t0: 0.05 + (FLOORS - 1 - k) * 0.06, t1: 0.3 + (FLOORS - 1 - k) * 0.06 },
    });
    for (const [x, z] of runs) kit.box(name, 'timber', x, y0, z, 0.09, y1 - y0, 0.09);
    const yh = y0 + 1.6;
    kit.span(name, 'timber', -22.8, yh, 10.26, 22.8, yh + 0.08, 10.34);
    kit.span(name, 'timber', -22.8, y1 - 0.1, 10.26, 22.8, y1 - 0.02, 10.34);
    kit.span(name, 'timber', -23.44, yh, -7, -23.36, yh + 0.08, 8);
    kit.span(name, 'timber', 23.36, yh, -7, 23.44, yh + 0.08, 8);
  }
}

/* ---------- plot: walls, gate, gatehouse, paving, planting ---------- */

function fenceRun(kit, ax, az, bx, bz) {
  const len = Math.hypot(bx - ax, bz - az);
  const n = Math.max(1, Math.round(len / 3.75));
  const alongX = Math.abs(bx - ax) > Math.abs(bz - az);
  for (let i = 0; i <= n; i++) {
    const x = ax + ((bx - ax) * i) / n;
    const z = az + ((bz - az) * i) / n;
    kit.box('pillars', 'fenceDark', x, 0, z, 0.55, 2.65, 0.55);
    kit.box('pillars', 'fenceWhite', x, 2.65, z, 0.66, 0.1, 0.66);
    if (i === n) continue;
    const nx = ax + ((bx - ax) * (i + 1)) / n;
    const nz = az + ((bz - az) * (i + 1)) / n;
    const cx = (x + nx) / 2;
    const cz = (z + nz) / 2;
    const seg = len / n - 0.55;
    const w = alongX ? seg : 0.22;
    const d = alongX ? 0.22 : seg;
    kit.box('panels', 'fenceWhite', cx, 0, cz, w, 1.65, d);
    kit.box('panels', 'fenceDark', cx, 1.65, cz, alongX ? seg : 0.26, 0.08, alongX ? 0.26 : seg);
    for (const y of [1.88, 2.12, 2.36]) kit.box('slats', 'fenceDark', cx, y, cz, alongX ? seg : 0.06, 0.12, alongX ? 0.06 : seg);
  }
}

function buildSite(kit) {
  kit.group('pillars', { stage: S.site, t0: 0.0, t1: 0.35, anim: 'rise', baseY: 0 });
  kit.group('panels', { stage: S.site, t0: 0.1, t1: 0.45, anim: 'rise', baseY: 0 });
  kit.group('slats', { stage: S.site, t0: 0.3, t1: 0.6, anim: 'rise', baseY: 1.7 });
  kit.group('gate', { stage: S.site, t0: 0.45, t1: 0.75, anim: 'rise', baseY: 0 });
  kit.group('gatehouse', { stage: S.site, t0: 0.35, t1: 0.7, anim: 'rise', baseY: 0 });
  kit.group('sign', { stage: S.site, t0: 0.6, t1: 0.85, anim: 'drop', baseY: 0 });

  const { x0, x1, z0, z1 } = PLOT;
  fenceRun(kit, x0, z1, GATE.x0, z1);
  fenceRun(kit, GATE.x1, z1, x1, z1);
  fenceRun(kit, x0, z0, x1, z0);
  fenceRun(kit, x0, z0, x0, z1);
  fenceRun(kit, x1, z0, x1, z1);

  const gw = GATE.x1 - GATE.x0;
  kit.span('gate', 'fenceDark', GATE.x0 + 0.3, 0.05, z1 - 0.06, GATE.x1 - 0.3, 0.25, z1 + 0.06);
  for (let y = 0.35; y < 2.3; y += 0.22) kit.span('gate', 'fenceDark', GATE.x0 + 0.3, y, z1 - 0.05, GATE.x1 - 0.3, y + 0.14, z1 + 0.05);
  kit.span('gate', 'fenceWhite', GATE.x0 + 0.3 + gw / 2 - 0.36, 0.05, z1 - 0.07, GATE.x0 + 0.3 + gw / 2 - 0.3, 2.3, z1 + 0.07);

  const gh = { x0: 20.5, x1: 25.5, z0: 15.2, z1: 19.4 };
  kit.span('gatehouse', 'fenceDark', gh.x0, 0, gh.z0, gh.x1, 1.2, gh.z1);
  kit.span('gatehouse', 'fenceWhite', gh.x0, 1.2, gh.z0, gh.x1, 3.1, gh.z1);
  kit.span('gatehouse', 'fenceWhite', gh.x0 - 0.35, 3.1, gh.z0 - 0.35, gh.x1 + 0.35, 3.32, gh.z1 + 0.35);
  kit.span('gatehouse', 'window', 21.4, 1.5, gh.z1 - 0.02, 23.0, 2.5, gh.z1 + 0.06);
  kit.span('gatehouse', 'window', gh.x0 - 0.06, 1.5, 16.4, gh.x0 + 0.02, 2.5, 18.2);

  kit.span('sign', 'fenceDark', 22.1, 0, 21.9, 22.22, 2.2, 22.02);
  kit.span('sign', 'fenceDark', 24.78, 0, 21.9, 24.9, 2.2, 22.02);
  const board = new PlaneGeometry(3.0, 1.5);
  board.translate(23.5, 2.15, 22.06);
  kit.add('sign', 'sign', board);
  kit.span('sign', 'fenceDark', 21.95, 1.36, 21.96, 25.05, 2.94, 22.04);

  kit.group('lamps', { stage: S.finish, t0: 0.8, t1: 1, anim: 'rise', baseY: BASE });
  for (const x of [-4.2, 4.2]) kit.span('lamps', 'lamp', x - 0.1, BASE + 2.55, 5.0, x + 0.1, BASE + 2.85, 5.12);
  for (const [a, b] of BAYS) {
    const cx = (a + b) / 2;
    kit.span('lamps', 'lamp', cx - 0.1, BASE + 2.6, 8.0, cx + 0.1, BASE + 2.9, 8.12);
  }
}

function palm(seed) {
  const parts = { trunk: [], leaf: [] };
  const h = 7 + (seed % 3) * 1.1;
  const lean = ((seed * 37) % 10) / 10 - 0.5;
  const segs = 6;
  for (let i = 0; i < segs; i++) {
    const t0 = i / segs;
    const r0 = 0.26 - t0 * 0.09;
    const g = new CylinderGeometry(r0 - 0.015, r0, h / segs + 0.05, 7);
    g.translate(lean * t0 * t0 * 1.6, (h / segs) * (i + 0.5), 0);
    parts.trunk.push(g);
  }
  const crown = new Vector3(lean * 1.6, h, 0);
  const fronds = 9;
  for (let i = 0; i < fronds; i++) {
    const a = (i / fronds) * Math.PI * 2 + seed;
    const len = 3.2 + ((seed + i) % 3) * 0.35;
    const g = new BufferGeometry();
    const pos = [];
    const steps = 6;
    for (let s = 0; s < steps; s++) {
      const u0 = s / steps;
      const u1 = (s + 1) / steps;
      const droop = (u) => -Math.pow(u, 1.8) * 1.9 + u * 0.5;
      const wid = (u) => Math.sin(Math.PI * Math.min(1, u * 1.15)) * 0.55;
      const p = (u, side) => {
        const r = u * len;
        const x = Math.cos(a) * r - Math.sin(a) * side * wid(u);
        const z = Math.sin(a) * r + Math.cos(a) * side * wid(u);
        return [crown.x + x, crown.y + droop(u) * 1.0 - Math.abs(side) * wid(u) * 0.25, crown.z + z];
      };
      const a0 = p(u0, 0);
      const a1 = p(u1, 0);
      for (const side of [-1, 1]) {
        const b0 = p(u0, side);
        const b1 = p(u1, side);
        pos.push(...a0, ...b0, ...a1, ...a1, ...b0, ...b1);
      }
    }
    g.setAttribute('position', new Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();
    parts.leaf.push(g);
  }
  return parts;
}

function buildPlanting(kit) {
  const spots = [
    [-26.6, -4],
    [-27.2, 13.5],
    [26.8, -6],
    [27.3, 9.5],
  ];
  spots.forEach(([x, z], i) => {
    const name = kit.group(`palm${i}`, { stage: S.site, t0: 0.55 + i * 0.08, t1: 0.85 + i * 0.04, anim: 'grow', anchor: new Vector3(x, 0, z) });
    const p = palm(i + 2);
    for (const g of p.trunk) {
      g.translate(x, 0, z);
      kit.add(name, 'palmTrunk', g);
    }
    for (const g of p.leaf) {
      g.translate(x, 0, z);
      kit.add(name, 'palmLeaf', g);
    }
  });
}

/* ---------- context: ground, road, distant buildings and trees ---------- */

function buildContext(root, mats) {
  const groundSize = 4000;
  const ground = new Mesh(new PlaneGeometry(groundSize, groundSize), mats.soil);
  mats.soil.map.repeat.set(groundSize / 22, groundSize / 22);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  root.add(ground);

  const road = new Mesh(new PlaneGeometry(240, 9), mats.road);
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, 0.012, 27.5);
  road.receiveShadow = true;
  root.add(road);

  const paving = new Mesh(new PlaneGeometry(PLOT.x1 - PLOT.x0 - 0.6, PLOT.z1 - 8.4), mats.paving);
  paving.rotation.x = -Math.PI / 2;
  paving.position.set(0, 0.03, (8.2 + PLOT.z1 - 0.2) / 2);
  paving.receiveShadow = true;
  paving.renderOrder = 1;
  root.add(paving);

  const far = [];
  let seed = 5;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 70; i++) {
    const a = rnd() * Math.PI * 2;
    const r = 140 + rnd() * 190;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    if (z > -30) continue;
    const w = 12 + rnd() * 18;
    const h = 3.5 + rnd() * 7;
    const g = new BoxGeometry(w, h, 10 + rnd() * 12);
    g.rotateY(rnd() * Math.PI);
    g.translate(x, h / 2, z);
    far.push(g);
  }
  const farMesh = new Mesh(mergeGeometries(far), mats.distant);
  root.add(farMesh);

  const crowns = [];
  const trunks = [];
  const leafTones = [new Color('#4f6f38'), new Color('#5d7d3f'), new Color('#3f5f31'), new Color('#6b8445')];
  for (let i = 0; i < 95; i++) {
    const a = rnd() * Math.PI * 2;
    const r = 48 + rnd() * 170;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    // Camera poses all sit on the +z side; keep the near field there open.
    if (z > 0 && r < 125) continue;
    if (Math.hypot(x + 68, z - 139) < 34) continue;
    const s = 2.2 + rnd() * 2.8;
    const trunkH = s * 0.9;
    const trunk = new CylinderGeometry(0.16 * s * 0.5, 0.22 * s * 0.5, trunkH, 5);
    trunk.translate(x, trunkH / 2, z);
    trunks.push(trunk);
    const crown = new IcosahedronGeometry(s, 0);
    crown.scale(1.15, 0.8 + rnd() * 0.25, 1.15);
    crown.rotateY(rnd() * Math.PI);
    crown.translate(x, trunkH + s * 0.55, z);
    const tone = leafTones[Math.floor(rnd() * leafTones.length)];
    const colors = new Float32Array(crown.attributes.position.count * 3);
    for (let v = 0; v < colors.length; v += 3) {
      const k = 0.9 + rnd() * 0.2;
      colors[v] = tone.r * k;
      colors[v + 1] = tone.g * k;
      colors[v + 2] = tone.b * k;
    }
    crown.setAttribute('color', new Float32BufferAttribute(colors, 3));
    crown.deleteAttribute('uv');
    crowns.push(crown);
  }
  root.add(new Mesh(mergeGeometries(crowns), mats.tree));
  root.add(new Mesh(mergeGeometries(trunks), mats.palmTrunk));
  return { ground, paving };
}

/* ---------- set-out lines and the blueprint ghost ---------- */

function buildLines(root, mats) {
  const v = [];
  const seg = (a, b) => v.push(a[0], 0.06, a[1], b[0], 0.06, b[1]);
  const rect = (x0, z0, x1, z1) => {
    seg([x0, z0], [x1, z0]);
    seg([x1, z0], [x1, z1]);
    seg([x1, z1], [x0, z1]);
    seg([x0, z1], [x0, z0]);
  };
  rect(PLOT.x0, PLOT.z0, PLOT.x1, PLOT.z1);
  const outline = [
    [-22, -8],
    [22, -8],
    [22, 8],
    [7, 8],
    [7, 5],
    [-7, 5],
    [-7, 8],
    [-22, 8],
    [-22, -8],
  ];
  for (let i = 0; i < outline.length - 1; i++) seg(outline[i], outline[i + 1]);
  for (const [x, z] of columnPoints()) {
    seg([x - 0.7, z], [x + 0.7, z]);
    seg([x, z - 0.7], [x, z + 0.7]);
  }
  for (let x = -22; x <= 22.01; x += 4.4) seg([x, -10], [x, -8.6]);
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(v, 3));
  const lines = new LineSegments(g, mats.line);
  lines.renderOrder = 2;
  lines.userData.count = v.length / 3;
  g.setDrawRange(0, 0);
  root.add(lines);

  const ghostGeoms = [];
  const massing = [
    [-22, 0, -8, -7, ROOF + PARAPET, 8],
    [-7, 0, -8, 7, ROOF + PARAPET, 5],
    [7, 0, -8, 22, ROOF + PARAPET, 8],
    [BAYS[0][0], BASE, 8, BAYS[0][1], ROOF + PARAPET + 0.35, 9.3],
    [BAYS[1][0], BASE, 8, BAYS[1][1], ROOF + PARAPET + 0.35, 9.3],
  ];
  for (let k = 1; k < FLOORS; k++) {
    for (const [x0, , z0, x1, , z1] of massing.slice(0, 3)) {
      const y = BASE + k * FH;
      ghostGeoms.push([x0, y, z0, x1, y + 0.001, z1]);
    }
  }
  const pos = [];
  for (const [x0, y0, z0, x1, y1, z1] of [...massing, ...ghostGeoms]) {
    const b = new BoxGeometry(x1 - x0, Math.max(0.001, y1 - y0), z1 - z0);
    b.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    const e = new EdgesGeometry(b);
    pos.push(...e.attributes.position.array);
  }
  const gg = new BufferGeometry();
  gg.setAttribute('position', new Float32BufferAttribute(pos, 3));
  const ghost = new LineSegments(gg, mats.ghost);
  ghost.renderOrder = 2;
  root.add(ghost);
  return { lines, ghost };
}

/* ---------- assembly ---------- */

export function createSite({ anisotropy = 4, shadows = true } = {}) {
  const mats = makeMaterials(anisotropy);
  const kit = new Kit();
  buildStructure(kit);
  buildWalls(kit);
  buildRailings(kit);
  buildScaffold(kit);
  buildSite(kit);
  buildPlanting(kit);

  const root = new Group();
  const context = buildContext(root, mats);
  const lines = buildLines(root, mats);

  const groups = [];
  for (const g of kit.groups.values()) {
    const holder = new Group();
    const pivot = g.anim === 'grow' ? g.anchor : new Vector3(0, g.baseY ?? 0, 0);
    holder.position.copy(pivot);
    for (const [matKey, geoms] of g.parts) {
      if (!geoms.length) continue;
      const merged = mergeGeometries(geoms, false);
      geoms.forEach((x) => x.dispose());
      merged.translate(-pivot.x, -pivot.y, -pivot.z);
      const mesh = new Mesh(merged, mats[matKey]);
      const shadowy = shadows && !['sign', 'lamp', 'window'].includes(matKey);
      mesh.castShadow = shadowy;
      mesh.receiveShadow = shadows && matKey !== 'lamp';
      holder.add(mesh);
    }
    holder.visible = false;
    root.add(holder);
    groups.push({ ...g, holder, pivot, parts: undefined });
  }

  const white = new Color('#f1efe9');
  const charcoal = new Color('#3a3e43');
  const block = new Color('#a7a39a');
  const opening = new Color('#26211d');
  const glass = new Color('#1c2a35');

  function apply(stage) {
    for (const g of groups) {
      let t = clamp01((stage[g.stage] - g.t0) / (g.t1 - g.t0));
      let out = 0;
      if (g.out) out = clamp01((stage[g.out.stage] - g.out.t0) / (g.out.t1 - g.out.t0));
      if (t <= 0 || out >= 1) {
        g.holder.visible = false;
        continue;
      }
      g.holder.visible = true;
      const h = g.holder;
      if (g.anim === 'rise') {
        const e = easeOut(t) * (1 - easeInOut(out));
        h.scale.set(1, Math.max(0.0001, e), 1);
      } else if (g.anim === 'drop') {
        const e = easeOut(t);
        h.position.y = g.pivot.y + (1 - e) * 5;
        h.scale.set(1, 1, 1);
      } else if (g.anim === 'grow') {
        const e = Math.max(0.0001, backOut(t));
        h.scale.set(e, e, e);
      }
    }

    const finish = stage[S.finish];
    const paint = easeInOut(clamp01(finish / 0.55));
    mats.wallWhite.color.copy(block).lerp(white, paint);
    mats.wallCharcoal.color.copy(block).lerp(charcoal, paint);
    const glaze = easeInOut(clamp01((finish - 0.25) / 0.5));
    mats.window.color.copy(opening).lerp(glass, glaze);
    mats.window.roughness = 0.95 - glaze * 0.87;
    mats.window.metalness = glaze * 0.15;
    mats.window.envMapIntensity = glaze * 1.4;

    const plot = stage[S.plot];
    const draw = Math.floor(lines.lines.userData.count * easeInOut(clamp01(plot / 0.7)));
    lines.lines.geometry.setDrawRange(0, draw - (draw % 2));
    const linesOut = clamp01((stage[S.foundation] - 0.55) / 0.45);
    mats.line.opacity = clamp01(plot * 3) * (1 - linesOut) * 0.95;
    lines.lines.visible = mats.line.opacity > 0.001;
    const ghostIn = clamp01((plot - 0.35) / 0.55);
    const ghostOut = clamp01(stage[S.frame] / 0.7);
    mats.ghost.opacity = ghostIn * (1 - ghostOut) * 0.75;
    lines.ghost.visible = mats.ghost.opacity > 0.001;

    const pave = clamp01((stage[S.site] - 0.2) / 0.5);
    mats.paving.opacity = easeInOut(pave);
    mats.paving.depthWrite = pave > 0.99;
    context.paving.visible = pave > 0.001;
  }

  return {
    root,
    materials: mats,
    apply,
    lampMaterial: mats.lamp,
    anchors: {
      plot: new Vector3(0, 0.1, 8),
      foundation: new Vector3(-12.6, 0.3, 8),
      frame: new Vector3(-7, BASE + 2 * FH, 8),
      walls: new Vector3(-16.5, BASE + FH + 1.5, 8),
      finish: new Vector3((BAYS[0][0] + BAYS[0][1]) / 2, BASE + 2 * FH + 1.4, 9.3),
      site: new Vector3((GATE.x0 + GATE.x1) / 2, 1.6, PLOT.z1),
    },
    bounds: { width: PLOT.x1 - PLOT.x0, depth: PLOT.z1 - PLOT.z0, height: ROOF + PARAPET },
  };
}
