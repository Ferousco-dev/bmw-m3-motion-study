# UX Rules

## Orientation

The user must be able to answer, at any moment:
- What am I looking at? → the annotation on the part
- How far through am I? → **currently unanswered; see UX_AUDIT**
- How do I get more? → the Reference control, top right
- How do I leave? → Escape, backdrop, or Close

Removing the progress rail and the section index was a deliberate aesthetic
decision by the product owner. The cost is orientation. Any replacement must be
quieter than a rail and must not be a line across the screen.

## Control

- Scroll is the only required input. Everything else is optional.
- Nothing may hijack scroll: no snap that fights the user, no scroll-jacking,
  no forced duration.
- A hold must never feel like the page has frozen. If a user cannot tell a hold
  from a stall, the hold is too long or too abrupt.

## Comprehension

- Content must be understandable without waiting. If an annotation needs 3
  seconds of animation before it can be read, it is wrong.
- The reference panel is the depth layer. The film carries the summary.

## Touch

- Custom cursor is desktop-only and must never suppress the system cursor on
  touch or for reduced-motion users.
- Hotspots need a 44 px minimum touch target on coarse pointers; the current
  5 px dot does not qualify and is desktop-only by consequence.
