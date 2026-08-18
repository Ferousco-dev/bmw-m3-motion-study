# Design System, actual values in use

Source of truth: `src/styles/global.css`. This file documents it; it does not
duplicate it. If they disagree, the CSS is right and this file is stale.

## Colour

Sampled from the footage, not invented.

| Token | Value | Role |
|---|---|---|
| `--void` | `#0B0D0F` | page ground, cyclorama shadow |
| `--panel` | `#101315` | reference panel ground |
| `--graphite` | `#272D2F` | body panel core (reference only) |
| `--ash` | `#6D7375` | secondary type |
| `--softbox` | `#B5B7BB` | primary type, the film's brightest pixel |
| `--halo` | `#DCE6EC` | emphasis; headlight bloom |
| `--m-blue` `--m-navy` `--m-red` | `#0066B1` `#1C3F94` `#E22718` | the M stripe, used **once** |

Rules:
- Never `#FFF`. Pure white sits outside the film's world.
- The M stripe appears on the closing lockup only. Not on hovers, not on rails.
- Hairlines: `--hair` `rgba(181,183,187,.18)`, `--hair-soft` at `.09`.

## Type

| Family | Use |
|---|---|
| Switzer 400/500/600/700 | everything |
| JetBrains Mono 400/500 | labels, indices, data |

Self-hosted, `public/fonts`, ~144 KB total. Switzer is the closest self-hostable
neutral grotesk to BMW's own. **Clash Display was removed and must not return**,
it was the single strongest "AI-generated" signal in an earlier revision.

## Spacing and measure

- `--gutter`: `clamp(18px, 3vw, 52px)`, all page-edge padding derives from it.
- `--plate`: shared content width for footer and panel.
- Annotation note measure: max 330 px (~45 characters).
- Reference body measure: max 52 characters.

## Geometry

Nothing on this page is rounded except the roundel and the 5 px callout dot.
No border radius on panels, buttons or containers. No shadows except type
shadows used purely for legibility over film.
