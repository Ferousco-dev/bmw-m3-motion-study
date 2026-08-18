# Typography Rules

**Readability is not negotiable.** Every effect loses to it.

## Hard limits

| Rule | Value |
|---|---|
| Minimum body/annotation size | 15 px desktop, 14 px mobile |
| Minimum label size | 11 px, and only uppercase mono labels may be this small |
| Minimum contrast | WCAG AA (4.5:1 body, 3:1 large) against the *film beneath it*, not the page ground |
| Maximum measure | 45–52 characters |
| Line height | 1.45 annotations, 1.6 reference body |
| Uppercase | labels only, never sentences, always with ≥ .16em tracking |

## Over-film type

The film swings from near-black cyclorama to a lit cabin. Static type over it
must survive both. Permitted mechanisms, in order of preference:

1. Position the type over a dark region of the frame (art direction solves it).
2. A static gradient scrim behind the chrome.
3. `text-shadow` for legibility only.

Forbidden: `mix-blend-mode` for legibility (it fails in mid tones and costs
compositing), `backdrop-filter` (expensive per frame).

## Motion and reading

- Text must never move while it is meant to be read. Annotations fade in, the
  film holds, the text is static for the whole reading window.
- Fade duration for reading type: 250–400 ms. Never a slide of more than 14 px.
- No character-by-character reveals. No text distortion. No marquees.

## Check before approving

Is it ≥ 15 px? Does it hold AA over the *brightest* frame it appears on? Is the
measure under 52 characters? Is it static while readable? Does it survive 390 px
width without overflowing the frame box?
