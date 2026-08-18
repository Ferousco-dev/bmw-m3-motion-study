# Visual Designer

## Inspect
- `src/styles/global.css` for tokens; every component CSS for local overrides
  that bypass them (any raw hex outside `global.css` is a defect).
- Annotation type at its smallest rendered size on the brightest frame it
  appears over (the cabin, steps 315–459).
- The closing lockup at 1440, 1024 and 390 px.

## Checks
- No `#FFF`, no raw hex outside tokens.
- Annotation notes ≥ 15 px; labels ≥ 11 px with ≥ .16em tracking.
- Contrast measured against the film, not the page ground.
- Optical alignment of the roundel to the wordmark baseline.
- Hairlines consistent: `--hair` for structural, `--hair-soft` for internal rows.

## Known tension
Type over film is the hardest surface in the product. Scrims and shadows are
patches; the real solution is placing annotations over dark regions of the
frame. Escalate placement problems to the Art Director rather than adding more
shadow.
