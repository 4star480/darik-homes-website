/*
 * Scroll timeline for the build story.
 *
 * Lengths are in viewport heights of scrolling. A "build" segment advances one
 * construction stage. A "hold" segment freezes the build while its note is
 * shown: the note animates in over the first 20%, stays for 60% and leaves over
 * the last 20%, then the build resumes.
 */
export const SEGMENTS = [
  { kind: 'intro', len: 0.5 },
  { kind: 'build', stage: 0, len: 0.55 },
  { kind: 'hold', note: 0, len: 0.55 },
  { kind: 'build', stage: 1, len: 0.5 },
  { kind: 'hold', note: 1, len: 0.55 },
  { kind: 'build', stage: 2, len: 0.8 },
  { kind: 'hold', note: 2, len: 0.55 },
  { kind: 'build', stage: 3, len: 0.6 },
  { kind: 'hold', note: 3, len: 0.55 },
  { kind: 'build', stage: 4, len: 0.75 },
  { kind: 'hold', note: 4, len: 0.55 },
  { kind: 'build', stage: 5, len: 0.7 },
  { kind: 'hold', note: 5, len: 0.55 },
  { kind: 'reveal', len: 0.75 },
  { kind: 'final', note: 6, len: 0.8 },
];

export const TOTAL = SEGMENTS.reduce((a, s) => a + s.len, 0);

/*
 * Camera pose at the start of each segment, plus one for the very end.
 * az: degrees around the building, 0 = straight on to the front elevation,
 * negative = from the left. el: degrees above the target. tod: time of day,
 * 0 blue hour, 1 morning, 2 midday, 3 sunset.
 */
export const POSES = [
  { az: -26, el: 15, dist: 160, ty: 7, tz: 0, tod: 0 },
  { az: -34, el: 47, dist: 104, ty: 0, tz: 2, tod: 0.05 },
  { az: -30, el: 43, dist: 96, ty: 0, tz: 2, tod: 0.1 },
  { az: -27, el: 41, dist: 94, ty: 0, tz: 2, tod: 0.15 },
  { az: -18, el: 29, dist: 84, ty: 1.5, tz: 2, tod: 0.8 },
  { az: -14, el: 27, dist: 82, ty: 1.5, tz: 2, tod: 0.9 },
  { az: 20, el: 16, dist: 86, ty: 5.5, tz: 2, tod: 1.3 },
  { az: 24, el: 15, dist: 85, ty: 5.5, tz: 2, tod: 1.4 },
  { az: 35, el: 11, dist: 80, ty: 6, tz: 2, tod: 1.8 },
  { az: 38, el: 10.5, dist: 79, ty: 6, tz: 2, tod: 1.9 },
  { az: 14, el: 8.5, dist: 92, ty: 6.5, tz: 3, tod: 2.2 },
  { az: 10, el: 8, dist: 90, ty: 6.5, tz: 3, tod: 2.3 },
  { az: -14, el: 5.5, dist: 92, ty: 5.5, tz: 5, tod: 2.9 },
  { az: -16, el: 5, dist: 90, ty: 5.5, tz: 5, tod: 3.0 },
  { az: -7, el: 2.2, dist: 54, ty: 6, tz: 6, tod: 3.0 },
  { az: -6, el: 2.1, dist: 53, ty: 6, tz: 6, tod: 3.0 },
];

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t) => t * t * (3 - 2 * t);

function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

export function poseAt(index, t) {
  const i1 = Math.min(index, POSES.length - 1);
  const i0 = Math.max(0, i1 - 1);
  const i2 = Math.min(POSES.length - 1, i1 + 1);
  const i3 = Math.min(POSES.length - 1, i1 + 2);
  const out = {};
  for (const k of Object.keys(POSES[0])) out[k] = catmull(POSES[i0][k], POSES[i1][k], POSES[i2][k], POSES[i3][k], t);
  return out;
}

/** Note visibility inside a hold: in over 20%, held for 60%, out over 20%. */
export function noteVisibility(t, stays = false) {
  if (t <= 0) return 0;
  if (t < 0.2) return smooth(t / 0.2);
  if (stays || t <= 0.8) return 1;
  return smooth(1 - (t - 0.8) / 0.2);
}

/** Resolve a scroll position (in viewport heights) into scene state. */
export function resolve(p) {
  const stage = [0, 0, 0, 0, 0, 0];
  const notes = new Array(7).fill(0);
  let acc = 0;
  let poseIndex = 0;
  let poseT = 0;
  let intro = 0;
  let reveal = 0;
  for (let i = 0; i < SEGMENTS.length; i++) {
    const s = SEGMENTS[i];
    const local = clamp01((p - acc) / s.len);
    if (p >= acc) {
      poseIndex = i;
      poseT = local;
    }
    if (s.kind === 'intro') intro = local;
    if (s.kind === 'build') stage[s.stage] = local;
    if (s.kind === 'hold' && p >= acc && p < acc + s.len) notes[s.note] = noteVisibility(local);
    if (s.kind === 'reveal') reveal = local;
    if (s.kind === 'final' && p >= acc) notes[s.note] = noteVisibility(local, true);
    acc += s.len;
  }
  return { stage, notes, pose: poseAt(poseIndex, poseT), intro, reveal, progress: clamp01(p / TOTAL) };
}

/** Scroll offset (viewport heights) where a note is fully visible. */
export function noteOffset(note) {
  let acc = 0;
  for (const s of SEGMENTS) {
    if ((s.kind === 'hold' || s.kind === 'final') && s.note === note) return acc + s.len * 0.3;
    acc += s.len;
  }
  return 0;
}
