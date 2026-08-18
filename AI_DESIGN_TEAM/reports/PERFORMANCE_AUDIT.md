# Performance Audit
_Performance Engineer, Frontend Engineer · all figures measured in-page_

## P1, Resident bitmap memory ≈ 3.9 GB, CRITICAL

**Problem** The loader decodes all 705 stills to `ImageBitmap` and holds every
one for the life of the page. Measured: each bitmap is 1600×900, i.e.
1600 × 900 × 4 = **5.76 MB** uncompressed. 705 × 5.76 MB ≈ **3,873 MB**.
**Why** `useFrameSequence` keeps a module-level array of every decoded bitmap
with no eviction. It was written when the set was 240 frames at 1280×720
(~885 MB, already too much, but survivable); the jump to 705 at 1600×900
quadrupled it.
**Severity** CRITICAL. This is the most likely cause of any real-world stutter
on the owner's machine: the compositor is under memory pressure regardless of
how cheap each individual draw is. On a lower-memory device it is a tab crash.
**Recommended** A sliding window: keep a permanent coarse set (every 12th step,
~59 bitmaps ≈ 340 MB) plus a moving window of ±90 steps around the playhead,
closing (`.close()`) bitmaps that fall outside. Keep the fetched blobs, they are
only 22 MB, and re-decode from blob on demand, which is ~11 ms measured and
happens off the critical path.
**Visual impact** None if the window is sized correctly.
**Technical impact** Memory drops from ~3.9 GB to ~600 MB; removes the largest
unmeasured risk in the product.

## P2, First paint gated on the entire 22 MB set, CRITICAL

**Problem** `Preloader` hides only when `progress > 0.999`, and `progress` is
`loaded / 705`. The visitor watches a loading bar until every frame has been
fetched **and** decoded, despite the film being fully scrubbable after the
coarse pass.
**Why** The gate was written when the set was small and the distinction did not
matter. The coarse-first ordering it depends on already exists and works.
**Recommended** Reveal when the coarse pass completes (~59 frames, ~2 MB) or
after a 1.2 s ceiling, whichever comes first; continue filling behind the
revealed page.
**Visual impact** Time-to-usable falls from seconds to well under one.
**Technical impact** None, the ordering already supports it.

## P3, Decode cost concentrated at boot, HIGH

**Problem** Measured 10.9 ms to fetch-and-decode a single cached frame. 705 of
those is ~7.7 s of work, run across 12 lanes at boot, competing with first paint.
**Recommended** Falls out of P1/P2: decode the coarse set eagerly, the rest
lazily around the playhead, and drop lane count to ~6 so decode does not starve
the main thread during first interaction.

## P4, Scrub cost is healthy, no action

~1.7 ms per update across a 400-step sweep, including two blits and all DOM
writes. Budget is 8.3 ms at 120 Hz. Draw path is not the problem; memory is.

## P5, `will-change: opacity` on ten permanent callouts, LOW

Each promotes a layer for the whole session. Trivial next to P1, but should be
set only while a callout is within its window.

## P6, Dev handle assigned during render, LOW

`App.tsx` assigns `window.__timeline` in the render body. Harmless in practice
(DEV-only, idempotent) but it is a side effect during render and violates the
project's own rule. Move to an effect.
