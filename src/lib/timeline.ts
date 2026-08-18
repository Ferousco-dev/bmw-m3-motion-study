/**
 * The film's beat map, measured from the source clip
 * (1280x720, 24fps, 240 frames, 10.000s; hard cuts at 7.71s and 8.54s).
 *
 * Scroll is deliberately NOT linear against film time: the moments that carry
 * the art direction (the doors opening, the cabin) are given far more scroll
 * distance than the approach. This is the "10 seconds stretched" mapping.
 */

/**
 * The source film is 240 frames at 24fps. Scrubbing 240 stills across eight
 * screens of scroll steps visibly, roughly one frame per 30px of travel, so
 * the sequence is motion-interpolated to 72fps, per shot, giving 705 steps.
 * Each shot was interpolated separately: no frame is ever blended across the
 * hard cuts at 7.71s and 8.54s.
 */
export const FRAME_COUNT = 705;      // render steps
export const SOURCE_FRAMES = 240;    // real frames in the film
export const FPS = 72;               // playback rate of the interpolated sequence

/** Delivery resolution of the stills (Lanczos-upscaled from the 1280x720 source). */
export const FRAME_W = 1600;
export const FRAME_H = 900;

/**
 * The film's two hard cuts, as step indices, measured by inter-frame delta
 * (40.25 and 46.06, against 11.50 for the busiest camera move). The sequence was
 * interpolated per shot precisely so nothing would be synthesised across them;
 * the renderer must not undo that by cross-dissolving over the top.
 */
export const CUTS = [550, 608];

/* BASE_URL, not a leading slash: the sequence is fetched at runtime, so nothing
   rewrites it at build time and an absolute path 404s under a subpath host. */
export const FRAME_SRC = (i: number) =>
  `${import.meta.env.BASE_URL}frames/f_${String(i + 1).padStart(4, '0')}.webp`;

/** which real frame of the film a render step corresponds to */
export const sourceFrame = (step: number) =>
  Math.min(SOURCE_FRAMES, Math.round((step / (FRAME_COUNT - 1)) * (SOURCE_FRAMES - 1)) + 1);

import { CALLOUTS } from './annotations';

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a));

/* easings, cinematic, not bouncy */
export const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Scroll -> film mapping, as a continuous density curve.
 *
 * The previous version stopped the film dead while an annotation was on screen.
 * It solved readability and created a worse problem: scrolling with no visual
 * response reads as lag, not as a deliberate pause, 45% of the page felt
 * broken. Velocity now never reaches zero.
 *
 * Instead every annotation raises the local "density" of scroll around its
 * midpoint: more scroll distance is spent on those frames, so the film slows
 * where there is something to read and runs where there is not. Because the
 * density curve is a sum of gaussians it is smooth everywhere, so there are no
 * boundaries to ease and no velocity steps to feel.
 */

const DENSITY_GAIN = 1.35;   // how much slower an annotated moment runs
const DENSITY_SPREAD = 26;   // steps either side of a midpoint that slow down

function buildDensity(): Float64Array {
  const d = new Float64Array(FRAME_COUNT).fill(1);
  const twoSigmaSq = 2 * DENSITY_SPREAD * DENSITY_SPREAD;

  for (const c of CALLOUTS) {
    const centre = (c.frames[0] + c.frames[1]) / 2;
    /* longer notes need more room, but the curve stays smooth either way */
    const gain = DENSITY_GAIN * (0.75 + c.note.length / 420);
    for (let i = 0; i < FRAME_COUNT; i++) {
      const dx = i - centre;
      d[i] += gain * Math.exp(-(dx * dx) / twoSigmaSq);
    }
  }
  return d;
}

/**
 * Scroll position at which each frame is *reached*, normalised to 0..1.
 *
 * Prefix-exclusive on purpose: `POS[0]` is exactly 0 and `POS[i]` is the scroll
 * at which frame `i` begins, so the lookup below is monotonic with no special
 * case at either end. An earlier version stored bucket *ends*, which put an
 * off-by-one at the head and made the film step backwards on the first pixel.
 */
function buildPositions(): Float64Array {
  const d = buildDensity();
  const pos = new Float64Array(FRAME_COUNT);
  let running = 0;
  for (let i = 0; i < FRAME_COUNT; i++) { pos[i] = running; running += d[i]; }
  /* normalise so the LAST frame is reached exactly at scroll end. Dividing by
     the full total instead leaves a dead tail where the final frame is already
     on screen and the page is still scrolling. */
  const span = running - d[FRAME_COUNT - 1] || 1;
  for (let i = 0; i < FRAME_COUNT; i++) pos[i] /= span;
  pos[FRAME_COUNT - 1] = 1;
  return pos;
}

const POS = buildPositions();

/** scroll progress -> fractional frame index (the fraction drives the blend) */
export function progressToFrameF(p: number): number {
  const q = clamp(p);
  if (q <= 0) return 0;
  if (q >= 1) return FRAME_COUNT - 1;

  /* last frame whose start position is at or before q */
  let lo = 0;
  let hi = FRAME_COUNT - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (POS[mid] <= q) lo = mid; else hi = mid - 1;
  }
  if (lo >= FRAME_COUNT - 1) return FRAME_COUNT - 1;

  const span = POS[lo + 1] - POS[lo] || 1;
  return lo + (q - POS[lo]) / span;
}

export const progressToFrame = (p: number) => Math.round(progressToFrameF(p));

export const timecode = (frame: number) => {
  const s = frame / FPS;
  return `${s.toFixed(2).padStart(5, '0')}s`;
};
