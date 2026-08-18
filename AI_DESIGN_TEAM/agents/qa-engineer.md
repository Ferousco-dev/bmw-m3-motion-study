# QA Engineer

## Matrix
Widths: 1440, 1280, 1024, 768, 430, 390, 375. Plus 21:9 and a short viewport
(800×600) where the film's cover-crop is most aggressive.

## Per width
- No horizontal overflow.
- Annotation notes do not run off the frame box.
- The closing lockup does not collide with the footer or the header.
- Reference panel is usable and scrolls internally.
- Console clean; no failed frame requests.

## Scroll behaviours
Slow, fast, reverse, mid-hold reversal, resize mid-scroll, reload at depth
(browser restores scroll position, verify the film re-syncs).

## Regression watch
Timing edits in `timeline.ts` silently move every annotation, because holds are
derived from `CALLOUTS`. After any content edit, re-verify that no two
annotations overlap.
