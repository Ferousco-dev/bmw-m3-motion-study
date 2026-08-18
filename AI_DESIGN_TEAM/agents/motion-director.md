# Motion Director

The most consequential role in this product.

## Inspect
- `src/lib/timeline.ts`, `SEGMENTS`, `RUN_SHARE`, `HOLD_SHARE`, `progressToFrameF`.
- `src/hooks/useTimelineDriver.ts`, smoothing constant, rAF lifecycle.
- `src/components/Film.tsx`, cross-fade, redraw threshold.

## Method
Scrub the whole film slowly, then fast, then reverse. Then use
`window.__timeline(p)` to sit precisely on each hold boundary.

## Look for
- Velocity discontinuity at hold entry/exit, the film currently stops and
  starts abruptly because a hold is a hard segment boundary with no easing.
- Ghosting from the cross-fade during the fastest motion (the whip through the
  windscreen, ~steps 196–240): blending two distant frames reads as a double
  exposure rather than motion blur.
- Interpolation artefacts from `minterpolate` on the same fast passage.
- Whether hold length actually matches reading time for the longest notes
  (`track`, `profile`, `wheel` are the long ones).
- Any animation that continues after scrolling stops.

## Do not
Add motion. This product's motion problem is never "not enough".
