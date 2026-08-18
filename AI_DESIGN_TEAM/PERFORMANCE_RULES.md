# Performance Rules

## Budget

| Metric | Budget | Current |
|---|---|---|
| Per-scrub-update main-thread cost | < 8.3 ms (120 Hz) | ~1.7 ms measured |
| Frames drawn per update | 2 (cross-fade) | 2 |
| Canvas backing store | fixed, never resized per frame | 1600 × 900 |
| JS bundle (gzip) | < 80 KB | ~67 KB |
| CSS (gzip) | < 8 KB | ~3 KB |
| Frame payload | see below | **22 MB, over budget** |

## Non-negotiable techniques

- Decode once to `ImageBitmap`, never re-decode. `drawImage` of a bitmap is a
  blit; an `<img>` is re-decoded by the compositor on first paint and shows as a
  hitch the first time a region is scrubbed.
- The canvas backing store is set once at the stills' native resolution. Never
  size it to `devicePixelRatio`, that multiplies fill cost for no fidelity,
  since the source is fixed.
- Draw only when the frame key changes (currently 1/20th-frame granularity).
- Animate `transform` and `opacity` only.
- Loading is a module-level singleton. It must never be tied to a component
  lifecycle, StrictMode double-mounts and an effect cleanup will stall it.

## Banned

`filter`, `backdrop-filter` and animated SVG filters anywhere near the film.
`mix-blend-mode` on full-screen layers. Layout-triggering properties in
animation. Re-render of React state during scroll, the timeline is a ref-based
store precisely so the tree never re-renders while scrubbing.

## Loading

Coarse-first ordering: every 12th step, then the gaps. The experience must be
usable at the end of the coarse pass, **not** at the end of the full load.
