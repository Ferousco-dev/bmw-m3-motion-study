# Improvement Roadmap
_Ranked by impact on the experience, not by effort_

## P0, Critical. The product is not shippable with these open.

| # | Finding | Source | Why first |
|---|---|---|---|
| 1 | Hold boundaries have no easing, twenty hard stops per pass | M1 | The single most visible defect. It is the reason motion still reads as jerky even after the frame work. |
| 2 | ~3.9 GB of resident bitmaps | P1 | Invisible in a synthetic measurement, decisive on a real machine. Most likely cause of remaining stutter. |
| 3 | First paint gated on the full 22 MB | P2 | A visitor stares at a loading bar for seconds when the film is scrubbable in under one. |

**Sequence matters.** Fix 1 first, it changes how 2 and 3 feel, and it is
arithmetic inside one function. Then 3 (small, self-contained). Then 2, the
largest change, verified against the numbers in `PERFORMANCE_AUDIT.md`.

## P1, High impact

| # | Finding | Source |
|---|---|---|
| 4 | Cross-fade ghosts on the fastest passage | M2 |
| 5 | Annotation contrast over the lit cabin | D1 |
| 6 | Annotations overflow below ~700 px | R1 |
| 7 | No orientation cue anywhere | U1 |
| 8 | Hold length not modelled on reading speed | M4 |
| 9 | Focus not returned from the panel; no trap | U4 |
| 10 | Hotspots 5 px and hover-only | U5 |
| 11 | Cover-crop orphans annotations at extreme ratios | R2 |

## P2, Medium

12 · `minterpolate` artefacts on the whip (M3) · 13 · Smoothing re-tune after
easing lands (M5) · 14 · Type scale gap after removals (D3) · 15 · Hold vs stall
legibility (U2) · 16 · Scroll affordance on cold load (U3) · 17 · `aria-hidden`
wrapper → `inert` (U6) · 18 · Mobile hold compression (R4) · 19 · Lockup on
short viewports (R3) · 20 · Custom cursor risk (U8)

## P3, Polish

21 · `will-change` lifecycle (P5) · 22 · Dev handle in render body (P6) ·
23 · `#0E1113` → `--panel` (D2) · 24 · Roundel optical alignment (D4) ·
25 · Backdrop button semantics (U7)

## Explicitly not changing

- The monochrome palette, Switzer, and the hairline annotation language.
- The run/hold model itself. It is the right answer to the readability problem;
  only its boundaries are wrong.
- The spareness. The removals of the rail, index, spec table and cue grid were
  correct. Orientation returns through the existing mark, not a new element.
- Full-bleed presentation. Already tried contained; owner rejected it.
