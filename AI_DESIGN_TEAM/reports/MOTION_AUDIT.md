# Motion Audit
_Motion Design Director_

## M1, Velocity discontinuity at every hold boundary, CRITICAL

**Problem** The film stops instantly on entering a hold and starts instantly on
leaving. Ten holds means twenty hard stops per pass.
**Why** `progressToFrameF` treats a hold as a segment whose frame range is
constant. Frame velocity steps from full speed to zero in one scroll pixel.
There is no easing across the boundary.
**Recommended** Ease the last ~12% of each RUN into its hold and the first ~12%
out (`easeInOutCubic` on the local parameter), so the film decelerates into the
stop and accelerates away. Do not shorten the holds, the stop itself is right.
**Visual impact** The largest single improvement available. Turns a mechanism
that feels like stuttering into one that feels like a camera settling.
**Technical impact** Arithmetic only inside an existing function. No new cost.

## M2, Cross-fade ghosting on the fastest passage, HIGH

**Problem** Around the whip through the windscreen the two blended stills are
far apart in content, so the dissolve reads as a double exposure.
**Why** The cross-fade is unconditional and linear in `frac`.
**Recommended** Scale blend by inter-frame difference: skip the second draw when
scrub velocity is high (the store already carries `v`), or ease `frac` so the
blend is concentrated near the midpoint. Cheap either way.
**Visual impact** Removes the only place the technique betrays itself.
**Technical impact** Saves a blit at exactly the moments cost is highest.

## M3, `minterpolate` artefacts on the same passage, MEDIUM

**Problem** Motion-interpolating AI-generated footage warps where motion is
fastest and least coherent.
**Recommended** Rebuild only steps ~196–240 from true frames (24 fps) and let the
cross-fade cover the rate change; the rest of the film stays at 72.
**Technical impact** Slightly fewer files.

## M4, Hold length is unverified against real reading speed, HIGH

**Problem** Hold weight is `0.6 + note.length / 210`, a guess. The longest note
(`track`, 220 characters) and the shortest (`drl`, 150) get 1.65 and 1.31,
a 26% spread for a 47% difference in length.
**Recommended** Weight on a reading-rate model: ~200 wpm for on-screen prose plus
a fixed 0.6s acquisition cost. Verify by scrolling at a natural rate and checking
whether the last line is reachable before the film moves.
**Visual impact** Reading stops feeling rushed on the long notes.

## M5, Smoothing constant fights holds, MEDIUM

**Problem** `SMOOTHING = 0.17` was tuned when the mapping was continuous. During
a hold the smoothed value keeps chasing a target that maps to the same frame, so
the first scroll after a hold spends its inertia budget before anything moves.
**Recommended** Re-tune after M1 lands; the eased boundaries may make this
disappear. Do not change both at once.
