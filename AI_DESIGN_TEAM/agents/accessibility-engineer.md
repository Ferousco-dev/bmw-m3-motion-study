# Accessibility Engineer

## Inspect
- Keyboard only: reach Reference, open, traverse, close, return.
- `prefers-reduced-motion` on: scrub smoothing disabled, no transitions,
  custom cursor suppressed.
- Screen reader: the semantic outline lives in the `.sr` block in `App.tsx`
  because the visual layer is canvas.

## Known defects to verify
- The dossier wrapper sets `aria-hidden` while containing focusable children;
  `tabIndex={-1}` is used as the guard. Confirm nothing is reachable when closed.
- Focus is not returned to the opening control on close.
- No focus trap while the panel is open.
- The backdrop is a `<button>`, verify this is announced sanely or replace.
- Hotspot dots are 5 px: fine for a mouse, unusable for touch or low motor
  control. Hit area needs padding, not a bigger dot.
