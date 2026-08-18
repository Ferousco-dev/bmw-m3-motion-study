# Initial Project Analysis
_Inspection date: 2026-08-18 · inspected, not assumed_

## Stack

| | |
|---|---|
| Build | Vite 8, `npm` |
| Framework | React 19.2 + TypeScript 6 (strict; `tsc -b` runs as part of `npm run build`) |
| Runtime dependencies | **React and ReactDOM only**, no GSAP, no Framer Motion, no Three.js |
| Animation architecture | Hand-written. Ref-based pub/sub store + one rAF loop + hand-rolled easing |
| Rendering | 2D canvas, `ImageBitmap` blits |
| Styling | Plain CSS, custom properties, per-component files. No Tailwind, no CSS-in-JS |
| Lint | oxlint present |
| Dev server | port 5180 (`.claude/launch.json`) |

## Architecture

    src/lib/timeline.ts      scroll -> frame mapping; RUN/HOLD segments; easings
    src/lib/annotations.ts   10 callouts (frame-space x/y, frame window, note)
    src/lib/dossier.ts       14 reference entries, 12 spec rows, 4 sources
    src/lib/store.ts         TimelineStore: subscribe/emit, outside React state
    src/hooks/useTimelineDriver.ts   scroll -> smoothed progress, self-halting rAF
    src/hooks/useTimelineFrame.ts    subscribe without re-rendering
    src/hooks/useFrameSequence.ts    module-level singleton loader -> ImageBitmap
    src/components/  Film · Stage · Dossier · Preloader · Cursor · Outro · Roundel

Total source: ~1,320 lines. Bundle 209 KB raw / **67 KB gzip**; CSS 3 KB gzip.

## Assets

| | |
|---|---|
| Frames | 705 WebP, 1600×900, **22 MB** (avg ~31 KB) |
| Fonts | Switzer 400/500/600/700 + JetBrains Mono 400/500, self-hosted, 144 KB |
| Source film | 1280×720, 24 fps, 240 frames, 10.000 s; hard cuts at 7.71 s / 8.54 s |
| Pipeline | per-shot `minterpolate` to 72 fps → Lanczos upscale to 1600×900 → unsharp → cwebp q72 |

## Timeline model

Scroll is mapped through `SEGMENTS`, alternating:
- **RUN**, 55% of scroll, film advances
- **HOLD**, 45% of scroll, frame frozen for reading, weighted by note length

Rig height 800vh desktop / 620vh mobile. Renderer cross-fades the two
neighbouring stills using the fractional frame index.

## Design direction (already settled, preserve)

Monochrome sampled from the footage; `#B5B7BB` is the page's white. Switzer for
everything, JetBrains Mono for labels. Hairline annotation anchored in frame
space. The M stripe is the only colour and appears once. Nothing is rounded.

## History worth knowing

Removed deliberately, all correct: Clash Display, giant type over the car,
animated SVG grain, three `mix-blend-mode` layers, rotating ring text, audio
scrubbing, the progress rail, the section index, spec and cue sections. The
current spareness is intended, not incomplete.
