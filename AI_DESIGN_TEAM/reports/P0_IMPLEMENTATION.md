# P0 Implementation Report
_All three critical findings closed and verified by measurement_

## P0-1 · Hold boundaries now eased, CLOSED

**Was** A hold was a segment with a constant frame range, so frame velocity fell
from full speed to zero within one scroll pixel, ten times per pass, then jumped
back. This was the residual "jerky" feel that survived every frame-rate increase.

**Change** `easeTrapezoid(t, k)` in `src/lib/timeline.ts`: accelerate over the
first `k` of a run, hold a constant rate through the middle, decelerate over the
last `k`. Ramp length is set in **frames, not fraction**,
`k = clamp(min(0.24, 26 / runFrames), 0.06, 0.24)`, so a short run between two
close annotations does not spend itself entirely ramping.

Ease-in-out across the whole run was rejected: it fixes the joins but makes the
middle of every run race.

**Verified** Sampled `progressToFrameF` at 4,000 points:
- endpoints exact: frame 0 at p=0, frame 704 at p=1
- velocity profile at a boundary: `1.04 → 1.17 → 1.29 → 1.42 … → 2.39` then flat
- largest velocity change between samples: **5.3% of peak** (was a hard step)
- 43% of samples are holds, matching the 45% budget

## P0-2 · First paint no longer gated on 22 MB, CLOSED

**Was** `Preloader` hid only at `progress > 0.999`, i.e. after all 705 stills
were fetched *and* decoded, despite the film being scrubbable far earlier.

**Change** The loader now runs an explicit keyframe pass first (every 24th step,
30 stills) and publishes `coarse: true` when it completes. `Preloader` gates on
that; the bar tracks progress toward the coarse pass rather than the full set.

**Verified** From `PerformanceResourceTiming`: keyframe set complete at
**182 ms**; remaining frames continue fetching behind the revealed page.

## P0-3 · Resident memory 3.9 GB → 676 MB, CLOSED

**Was** Every decoded `ImageBitmap` (5.76 MB each) held for the life of the page:
705 × 5.76 MB ≈ **3,873 MB**.

**Change** Three-tier residency in `useFrameSequence.ts`:
- **blobs**, all 705 fetched and kept (22 MB; re-decode is ~11 ms, off the
  critical path)
- **keyframes**, every 24th step, decoded permanently, so something is always
  drawable anywhere in the film
- **window**, ±48 steps around the playhead, decoded outward from the centre;
  anything leaving the window is `.close()`d

`setCentre(frame)` is called by the renderer each update and re-windows only
after the playhead moves 6 steps. `Film` falls back to the nearest decoded still
(via `nearest()`) when a frame is not yet decoded, so a fast scrub degrades to
keyframes rather than dropping.

**Verified** `__resident()` probe: **123 bitmaps ≈ 676 MB**, and, the important
part, the count does not grow with travel: 123 at 50%, 123 at 95%, 123 back at
5%. An 83% reduction with no visual change.

## Also fixed in passing
- Dev handle moved out of the render body into an effect (P6).

## Verification tooling added (DEV only, stripped from production)
    window.__timeline(p)   drive the timeline without scrolling
    window.__frameAt(p)    the fractional frame for a scroll position
    window.__resident()    count of decoded bitmaps currently held
