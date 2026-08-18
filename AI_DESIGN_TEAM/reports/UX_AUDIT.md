# UX Audit
_UX Designer, Accessibility Engineer_

## U1, No orientation cue of any kind, HIGH

**Problem** Progress rail and section index were both removed at the owner's
request. The visitor now has no way to know how long the piece is, how far
through they are, or that it ends.
**Why** Two separate removals, each individually justified, together removed the
entire orientation layer.
**Recommended** Something quieter than either, respecting both constraints (no
line across the screen, no list): the clearest option is that the header mark
itself carries progress, the roundel's ring fills as the film advances. It is
already on screen, it is circular, and it costs one SVG attribute per update.
**Visual impact** Restores orientation without adding an element.
**Technical impact** One `stroke-dashoffset` write per update.

## U2, A hold is indistinguishable from a stall, HIGH

**Problem** During a hold the film is frozen and nothing indicates that this is
intentional or how long it lasts. On a slow connection it is indistinguishable
from a frame failing to load.
**Recommended** After M1's eased boundaries land, re-evaluate: deceleration into
a stop usually reads as deliberate on its own. If it does not, the annotation's
own fade-in is the honest signal, tie it explicitly to hold entry.

## U3, No affordance to scroll on first load, MEDIUM

**Problem** The "Scroll" hint was replaced by the Reference control. A cold
visitor sees a car and two words of chrome.
**Recommended** Restore a single quiet cue that retires permanently after the
first scroll input.

## U4, Focus is not returned when the panel closes, HIGH (a11y)

**Problem** Opening the dossier from a hotspot and closing it drops focus to the
document. Keyboard users lose their place in a 800vh page.
**Recommended** Store the opener element, restore focus on close, and trap focus
within the panel while open.

## U5, Hotspots are 5 px and hover-dependent, HIGH (a11y)

**Problem** The dot is a 5 px target; the `+` affordance only appears on hover,
so on touch there is no indication a callout is interactive.
**Recommended** Pad the hit area to ≥ 44 px without changing the visual dot;
show the affordance persistently on coarse pointers.

## U6, `aria-hidden` wrapper contains focusable children, MEDIUM (a11y)

**Problem** `.dossier` sets `aria-hidden={!open}` while containing buttons and
links guarded only by `tabIndex={-1}`. Correct in effect, fragile by design.
**Recommended** Use the `inert` attribute, or unmount the panel when closed.

## U7, Backdrop is a `<button>`, LOW (a11y)

A full-screen button is announced as an interactive control with an unhelpful
label. Prefer a click handler on a `div` plus the existing Escape and Close.

## U8, Custom cursor suppresses the system cursor, MEDIUM

`body, button { cursor: none }` on fine pointers. Guarded for reduced-motion,
but a visitor who simply loses the custom cursor to a rendering hiccup has no
pointer at all. Low probability, high severity when it happens.
