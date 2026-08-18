import { useEffect, useRef, useState } from 'react';
import { FRAME_COUNT, FRAME_SRC } from '../lib/timeline';

/**
 * The sequence: fetched once, decoded on demand, evicted behind you.
 *
 * WHY THIS IS NOT A SIMPLE ARRAY OF BITMAPS
 * A decoded ImageBitmap of these stills costs 1600 × 900 × 4 = 5.76 MB. Holding
 * all 705 resident is ~3.9 GB, which is memory pressure the compositor pays for
 * on every frame no matter how cheap an individual blit is. So:
 *
 *   - every blob is fetched and kept (22 MB total, cheap, and re-decoding from
 *     a held blob costs ~11 ms off the critical path)
 *   - a permanent keyframe set (every 24th step) guarantees something is always
 *     drawable anywhere in the film, including during a fast scrub
 *   - a moving window of ±48 steps around the playhead is decoded; bitmaps that
 *     fall outside it are closed
 *
 * Resident cost: ~127 bitmaps ≈ 730 MB instead of 3.9 GB.
 *
 * The loader is a module-level singleton and is deliberately NOT tied to a
 * component lifecycle: StrictMode double-mounts, and an effect cleanup aborting
 * the lanes stalls the load permanently.
 */

const KEY_STEP = 24;      // permanent, never evicted
const WINDOW = 48;        // decoded either side of the playhead
const RECENTRE = 10;      // steps the playhead must move before we re-window
const FAST = 0.3;         // above this scrub speed, defer decoding entirely

const blobs: (Blob | null)[] = new Array(FRAME_COUNT).fill(null);
const bitmaps: (ImageBitmap | null)[] = new Array(FRAME_COUNT).fill(null);
const isKey = (i: number) => i % KEY_STEP === 0;

export interface SequenceState { progress: number; coarse: boolean }

const listeners = new Set<(s: SequenceState) => void>();
let fetched = 0;
let coarseReady = false;
let started = false;
let centre = 0;
let lastCentre = -999;
let decoding = 0;
let prevLo = 0;
let prevHi = FRAME_COUNT - 1;
let generation = 0;


const coarseCount = Math.ceil(FRAME_COUNT / KEY_STEP);

/* The preloader only tracks the coarse pass; publishing every one of the 705
   fetches meant 675 provable no-op React renders during the scrub. */
const publish = () => {
  if (coarseReady && fetched > coarseCount + 1) return;
  listeners.forEach((fn) => fn({ progress: fetched / FRAME_COUNT, coarse: coarseReady }));
};

async function grab(i: number): Promise<Blob | null> {
  if (blobs[i]) return blobs[i];
  try {
    const res = await fetch(FRAME_SRC(i));
    blobs[i] = await res.blob();
  } catch {
    blobs[i] = null;
  }
  fetched++;
  publish();
  return blobs[i];
}

/** indices currently being decoded, stops two generations racing on one frame */
const inFlight = new Set<number>();

async function decode(i: number) {
  if (bitmaps[i] || !blobs[i] || inFlight.has(i)) return;
  inFlight.add(i);
  decoding++;
  try {
    const bm = await createImageBitmap(blobs[i]!);
    /* A decode started under an earlier window can land after the playhead has
       moved on. Writing it anyway strands it: the next sweep's band no longer
       covers that index, so it is never examined again and never freed. Check
       the CURRENT window at the moment it lands. */
    const lo = centre - WINDOW;
    const hi = centre + WINDOW;
    if ((i >= lo && i <= hi) || isKey(i)) {
      bitmaps[i] = bm;
    } else {
      bm.close();
    }
  } catch {
    /* leave the hole; the renderer falls back to the nearest keyframe */
  } finally {
    decoding--;
    inFlight.delete(i);
  }
}

/** decode what is near the playhead, release what is not */
function reWindow() {
  const lo = Math.max(0, centre - WINDOW);
  const hi = Math.min(FRAME_COUNT - 1, centre + WINDOW);

  /* only the band we previously held can contain evictable bitmaps */
  const from = Math.max(0, Math.min(prevLo, lo) - 1);
  const to = Math.min(FRAME_COUNT - 1, Math.max(prevHi, hi) + 1);
  for (let i = from; i <= to; i++) {
    if (i >= lo && i <= hi) continue;
    const bm = bitmaps[i];
    if (bm && !isKey(i)) {
      bm.close();
      bitmaps[i] = null;
    }
  }
  prevLo = lo;
  prevHi = hi;

  /* decode outward from the playhead so the frames you are about to see land
     first; cap concurrency so decoding never starves the scroll */
  const queue: number[] = [];
  for (let d = 0; d <= WINDOW; d++) {
    const a = centre - d;
    const b = centre + d;
    if (a >= lo && !bitmaps[a] && blobs[a]) queue.push(a);
    if (d && b <= hi && !bitmaps[b] && blobs[b]) queue.push(b);
  }

  /* Four lanes IS the concurrency limit. An earlier version also tested
     `decoding < 6`, which made a lane exit permanently on a transient reading,
     so whenever two windows overlapped, the newer queue was abandoned and the
     film ran on keyframes alone. Stale generations cancel instead. */
  const mine = ++generation;
  let cursor = 0;
  const lane = async () => {
    while (cursor < queue.length && mine === generation) await decode(queue[cursor++]);
  };
  void Promise.all([lane(), lane(), lane(), lane()]);
}

let settle: number | undefined;

/**
 * Called by the renderer on every timeline update.
 *
 * Decoding while the user is scrubbing quickly is self-defeating: the work
 * lands behind the playhead and competes with the scroll it is meant to serve.
 * Above FAST we only record the position and let the keyframes carry the
 * picture, then decode once the scrub settles.
 */
export function setCentre(frame: number, velocity = 0) {
  centre = frame;

  if (Math.abs(velocity) > FAST) {
    window.clearTimeout(settle);
    settle = window.setTimeout(() => { lastCentre = centre; reWindow(); }, 90);
    return;
  }

  if (Math.abs(frame - lastCentre) < RECENTRE) return;
  lastCentre = frame;
  reWindow();
}

function start() {
  if (started) return;
  started = true;

  const run = async () => {
    /* 1, keyframes first: the whole film becomes scrubbable, coarsely */
    const keys: number[] = [];
    for (let i = 0; i < FRAME_COUNT; i += KEY_STEP) keys.push(i);

    let k = 0;
    const keyLane = async () => {
      while (k < keys.length) {
        const i = keys[k++];
        await grab(i);
        await decode(i);
      }
    };
    await Promise.all([keyLane(), keyLane(), keyLane(), keyLane(), keyLane(), keyLane()]);

    coarseReady = true;
    publish();
    reWindow();

    /* 2, the rest, fetched but not decoded; the window decodes what is needed */
    const rest: number[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) if (!isKey(i)) rest.push(i);

    let r = 0;
    const restLane = async () => {
      while (r < rest.length) await grab(rest[r++]);
    };
    await Promise.all([restLane(), restLane(), restLane(), restLane(), restLane(), restLane()]);

    reWindow();
  };

  void run();
}

/** dev-only: how many bitmaps are currently decoded and resident */
export const residentBitmaps = () => bitmaps.reduce((n, b) => n + (b ? 1 : 0), 0);

/** dev-only: loader state, for verifying the window actually fills */
export const loaderState = () => ({
  blobs: blobs.reduce((n, b) => n + (b ? 1 : 0), 0),
  resident: residentBitmaps(),
  inFlight: inFlight.size,
  decoding,
  centre,
  window: [Math.max(0, centre - WINDOW), Math.min(FRAME_COUNT - 1, centre + WINDOW)],
});

export function useFrameSequence() {
  const frames = useRef(bitmaps);
  const [state, setState] = useState<SequenceState>({
    progress: fetched / FRAME_COUNT,
    coarse: coarseReady,
  });

  useEffect(() => {
    listeners.add(setState);
    start();
    setState({ progress: fetched / FRAME_COUNT, coarse: coarseReady });
    return () => { listeners.delete(setState); };
  }, []);

  return {
    frames,
    /* the preloader tracks the coarse pass, not the full 22 MB */
    progress: coarseReady ? 1 : Math.min(1, (fetched / coarseCount) || 0),
    ready: state.coarse,
  };
}
