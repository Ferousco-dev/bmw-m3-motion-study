# Pass 2, Agentic Review Implemented
_11 agents: 7 specialist lenses in parallel, 3 adversarial verifiers, 1 judge.
56 findings raised, 54 survived verification, 12 ranked into a work order.
All 12 implemented and verified by measurement._

## What the team caught that the previous pass did not

The previous self-review scored 7.2. The team scored **5.6**, and was right,
because it measured three things I never had: the cold load, real phone widths,
and the actual pixel luminance behind every annotation.

| # | Finding | Verified before | Verified after |
|---|---|---|---|
| 1 | **The film never painted a first frame.** The store emits on scroll, resize and mount; at mount every bitmap is still null so the draw is skipped, and nothing ever asks again. Visitors landed on a black rectangle until they scrolled. | mean luma **0** at 20 s, zero interaction | mean luma **67.5** the instant the boot clears (frame 1 measures 70.5) |
| 2 | **Annotation geometry unbounded.** Notes clipped mid-word at 1440×900; five of ten entirely off-screen at phone widths; three with zero hit area. | doors 92 px hidden, steering 26 px; 375 px: 3 callouts 0 px hit | **0 px hidden on all ten** at 1440×900, 390×844 and 375×812; min hit **205 px** |
| 3 | **Three annotations claimed what the footage does not show.** "Blue calipers", zero blue pixels in that window; "wide track" anchored on bare cyclorama then drifted into a softbox; "power dome" described a surface facing away from camera. Two windows also straddled the film's hard cuts. | 3 false claims, 1 window over a cut | claims rewritten to what is in shot; **0 windows straddle a cut**; blend no longer dissolves across `CUTS = [550, 608]` |
| 4 | **No annotation reached AA contrast.** | worst **1.00:1**, none above 4.30 | **8.26:1 – 9.52:1**, zero below AA |
| 5 | **The memory fix was not holding.** Late-landing decodes were stranded outside the eviction band forever. | **282 resident / 1,624 MB**, flat, no decay | **77 resident / 423 MB**, flat, exactly the predicted figure |
| 6 | Ten invisible buttons in the tab order; ~500 words of prose hidden from AT by `aria-label`; no touch affordance | 10 focusable at opacity 0 | `visibility` toggles with the fade; `aria-describedby` exposes the notes; `+` always shown on touch |
| 7 | Dialog focus never entered, never trapped, never returned | 0 `focus()` calls in the codebase | focus enters the panel, `inert` traps it, returns to the opener |
| 8 | Fixed chrome sat over the footer, wiping the closing lockup | **100 % covered** on phone widths | **0 % covered**; chrome is absolute inside the pinned rig |
| 9 | Page scrolled underneath the open panel | 600 px drift, frame 408 → 484 | body locked while open, scroll position restored on close |
| 10 | Mobile rig cut 26 % of travel; tail annotations got 139 px | 620vh | 800vh, tail windows widened |
| 11 | `global.css` bundled last, so every label rendered at 10 px | smallest text 10 px | smallest text **11 px** |
| 12 | Nothing answered "how far through am I" | no readout | timecode in existing chrome: `00.00s / 09.78s` |

## Two bugs of my own found while implementing

1. **Decode lanes bailed permanently.** `while (cursor < queue.length && decoding < 6)`
   made a lane exit on a transient reading, so whenever two windows overlapped the
   newer queue was abandoned and the film ran on keyframes alone (resident stuck at
   30 = the keyframe set). Replaced with generation tokens: stale generations cancel,
   four lanes are the concurrency limit.
2. **The clamp ran on `requestAnimationFrame`**, so it had not applied by first paint
   and never applied at all where rAF is throttled. Now synchronous, one layout read
   per annotation change, not per frame.

## Final state

    scrub cost         0.279 ms per update   (budget 8.3 ms at 120 Hz)
    stalled samples    0
    backwards samples  0
    max velocity jump  1.39 % of peak
    resident memory    423 MB, flat
    time to usable     182 ms
    bundle             67 KB gzip JS, 3 KB CSS
    contrast           8.26:1 – 9.52:1 across all ten annotations

## Not done, and why

The judge's suggestion to give the ending more airtime was left alone: it would mean
re-tuning the density model, which the do-not-change list protects. Interpolation
artefacts on the whip through the windscreen (M3, MEDIUM) remain, fixing them means
rebuilding that passage from true frames, which is an asset change, not a code change.
