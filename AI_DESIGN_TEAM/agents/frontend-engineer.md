# Frontend Engineer

## Stack (verify, do not assume)
Vite + React 19 + TypeScript. **No animation library**, the timeline is a
ref-based store and hand-written easing. Zero runtime dependencies beyond React.

    src/lib/       timeline.ts (mapping), annotations.ts (content), dossier.ts,
                   store.ts (pub/sub), context.ts
    src/hooks/     useTimelineDriver, useTimelineFrame, useFrameSequence
    src/components/Film, Stage, Dossier, Preloader, Cursor, Outro, Roundel

## Rules
- The timeline never enters React state. Components subscribe and write to their
  own DOM nodes. A `useState` in the scroll path is a defect.
- Frame loading is a module-level singleton; never re-couple it to a component.
- Side effects belong in effects. The dev `__timeline` handle is currently
  assigned during render in `App.tsx`, that is a defect to fix.

## When a visual problem appears
Find the technical cause before proposing a design change. Historic examples:
"laggy" was an animated SVG turbulence filter plus three blend layers plus a
double decode under StrictMode. "Soft" was upscaling 720p full-bleed.
