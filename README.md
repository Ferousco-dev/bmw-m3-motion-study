# BMW M3, a scroll-controlled motion study

A single-page motion piece built around a ten second studio film of a BMW M3
(G80). The film is decomposed into 705 stills and scrubbed by scroll position on
a canvas. Annotations are anchored in frame space, so each one stays on the part
it names, and a reference panel carries longer sourced writing about the car.

![Switzer](https://img.shields.io/badge/type-Switzer-111) ![React 19](https://img.shields.io/badge/React-19-111) ![no animation library](https://img.shields.io/badge/animation%20libraries-0-111)

## How it works

**The film is the timeline.** Scroll position maps to a frame index through a
continuous density curve: every annotation raises the local density of scroll
around its midpoint, so the film slows where there is something to read and runs
where there is not. It never stops. An earlier version froze the frame while an
annotation was on screen, which solved readability and created a worse problem,
scrolling with no visual response reads as lag rather than as a pause.

**Rendering.** One canvas with a fixed 1600x900 backing store that is never
resized. Stills are decoded once to `ImageBitmap` and blitted; the renderer
cross-fades the two frames either side of the playhead, which is what removes
stepping between real frames. The blend is skipped above a scrub velocity
threshold, where the two stills are far apart and the dissolve would read as a
double exposure.

**Memory.** 705 decoded bitmaps would be about 3.9 GB. Instead: all blobs are
kept (22 MB), a permanent keyframe set every 24th step guarantees something is
always drawable, and a moving window of plus or minus 48 steps around the
playhead is decoded. Everything else is closed. Resident cost is about 423 MB,
flat, and it does not grow as you travel through the film.

**No animation library.** A ref based publish/subscribe store drives everything
and React never re-renders during scroll.

## Source pipeline

    ffmpeg  ->  split at the two hard cuts (7.71s, 8.54s)
            ->  minterpolate to 72fps, per shot, so nothing is synthesised across a cut
            ->  Lanczos upscale to 1600x900, mild unsharp
            ->  cwebp q72

## Measured

| | |
|---|---|
| Scrub cost | 0.28 ms per update, against 8.3 ms at 120 Hz |
| Time to usable | 182 ms (a 30 frame keyframe pass, then the rest behind it) |
| Resident memory | 423 MB, flat |
| Annotation contrast | 8.3:1 to 9.5:1 against the film beneath |
| Bundle | 68 KB gzip JS, 3 KB CSS |
| Runtime dependencies | React |

## Running it

    npm install
    npm run dev      # http://localhost:5180

In development, `window.__timeline(0..1)` drives the film without scrolling,
`window.__frameAt(p)` returns the fractional frame for a scroll position, and
`window.__loader()` reports loader and memory state. All are stripped from
production builds.

## AI_DESIGN_TEAM

The design process is committed alongside the code: principles, per discipline
rules, ten agent specifications, and the audit reports, including the review that
scored the build 5.6 and the twelve fixes that came out of it.

## Notes

The footage is AI generated and depicts, rather than photographs, a G80 M3.
Specifications in the reference panel are sourced and linked. BMW, M3 and the
roundel are trademarks of BMW AG; this is an unaffiliated design study, and the
roundel in the interface is drawn as plain geometry rather than the brand asset.
