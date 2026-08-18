# Motion Revision, holds removed
_Supersedes M1 and the run/hold contract in MOTION_RULES.md_

## Owner decision

The hold model, freezing the frame while an annotation is read, was removed.
Reported as "sensibly laggy". The report is correct and the reasoning matters:

**Scrolling with no visual response is indistinguishable from lag.** 45% of the
page's scroll produced no movement. Easing the boundaries (P0-1) made the
entries and exits smooth but could not fix the premise: the film still stopped.

## What replaced it

A continuous **density curve**. Every annotation raises the local density of
scroll around its midpoint, so more scroll distance is spent on those frames,
the film slows where there is something to read and runs where there is not.

    density[i] = 1 + Σ gain · exp(-(i - centre)² / 2σ²)     σ = 26 steps

Because the curve is a sum of gaussians it is smooth everywhere: there are no
segment boundaries to ease and no velocity steps to feel. Frame position is the
normalised prefix sum of density, inverted by binary search.

## Measured, 4,000 samples across the full scroll

| | Before (holds) | Now |
|---|---|---|
| Stalled samples (v < 0.02) | 173 / 400 (43%) | **0** |
| Backwards samples | 0 | **0** |
| Slowest / fastest velocity | 0 | **0.27** |
| Max velocity jump | 5.3% of peak | **1.39% of peak** |
| ms per update, slow scrub | ~1.7 | **0.25** |
| Resident bitmaps | 123 (676 MB) | **56 (323 MB)** |

Annotated moments now run about 3.8× slower than the fastest passage, enough
to read against, while the picture never stops.

## Two bugs found and fixed during this change

1. **The film ran backwards on the first pixel.** Storing bucket *ends* in the
   cumulative array put an off-by-one at the head: at the boundary, one branch
   returned frame 1 and the other frame 0. Rewritten prefix-exclusive, so
   `POS[0]` is exactly 0 and the lookup is monotonic with no special cases.
2. **A dead tail at the end of the page.** Normalising by the full density total
   left `POS[704] < 1`, so the last stretch of scroll sat on the final frame with
   the page still moving. Now normalised so the last frame is reached exactly at
   scroll end.

Both were caught by sampling the mapping, not by looking at it. Neither was
visible as an obvious defect while scrolling.

## Additional smoothness work in the same pass

- **Blend skipped above scrub velocity 0.32.** At speed the two stills are far
  apart, so the cross-dissolve reads as a double exposure *and* costs a second
  full-frame blit exactly when the budget is tightest. Fixes M2 as a side effect.
- **Decoding deferred while scrubbing fast.** Work that lands behind the playhead
  competes with the scroll it is meant to serve; above the same threshold the
  keyframes carry the picture and decoding resumes 90 ms after the scrub settles.
- **Eviction scans only the previously-held band** rather than all 705 entries.
- **Scrub smoothing 0.17 → 0.21**, now that nothing stalls the picture.

## Consequence to accept

Annotations are now read over a slowly moving image. This is a real regression in
reading comfort versus a hard stop, and it is the correct trade: the previous
version bought readability at the cost of the whole page feeling broken.
Contrast (D1) and annotation geometry (R1) matter more now, not less.
