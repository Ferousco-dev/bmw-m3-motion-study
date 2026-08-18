# Final Judge, Pass 1
_After P0. Scores reflect the current build, not intentions._

| Dimension | Score | Note |
|---|---|---|
| Visual Design | 8 | Coherent, restrained, correctly monochrome. Type scale has a gap where removed elements used to sit. |
| Typography | 7 | One family, disciplined. Held back by contrast over the lit cabin, which shadow is currently carrying. |
| Motion | 9 | The run/hold model with eased boundaries is now genuinely good, the single strongest thing in the product. |
| UX | 6 | No orientation cue of any kind. A visitor cannot tell how long the piece is or how far in they are. |
| Art Direction | 8 | Annotations anchored in frame space is the right idea, well executed. Extreme aspect ratios orphan two anchors. |
| Performance | 8 | ~1.7 ms per update, 182 ms to usable, 676 MB resident. Payload is still 22 MB. |
| Accessibility | 5 | Weakest dimension. No focus return, no trap, 5 px hover-only hotspots, `aria-hidden` guarding focusables. |
| Responsive Design | 5 | Tuned at 1280. Annotation geometry overflows below ~700 px; mobile keeps every hold in 22% less scroll. |
| Premium Feel | 8 | Reads as an automotive studio document rather than a template. |
| **Overall** | **7.2** | Not finished. Motion and performance are there; accessibility and responsive are not. |

## 1. What is working, protect it
- The run/hold timeline. It solved the readability problem at the source rather
  than patching it with contrast, and with eased boundaries it now feels like a
  camera settling rather than a mechanism stopping.
- Annotations anchored in frame space, one at a time, each explaining the part
  it touches.
- The restraint. Successive deletions were all correct.
- The rendering architecture: bitmaps, fixed backing store, no React state in
  the scroll path, zero animation dependencies.

## 2. What feels cheap
- Annotation legibility resting on `text-shadow` over bright frames.
- The 5 px hotspot dot with a hover-only `+`. On a touch device the entire
  interactive layer is invisible.

## 3. What feels unfinished
- Mobile. It is currently the desktop composition in less space, which the
  project's own rules forbid.
- Accessibility: focus is dropped when the panel closes.

## 4. What is distracting
- Nothing on screen. The distraction is an absence: with no progress cue, the
  eye keeps hunting for one.

## 5. Fix next, ranked
1. Annotation contrast over the cabin (D1)
2. Annotation geometry below 700 px (R1)
3. Orientation via the roundel ring (U1)
4. Focus return and trap (U4)
5. Hotspot hit area and touch affordance (U5)
6. Cross-fade ghosting on the whip (M2)

## 6. What must NOT be changed
- The palette, Switzer, the hairline annotation language.
- The run/hold model, now that its boundaries are eased.
- Full-bleed presentation. A contained plate was tried and rejected by the owner.
- The spareness. Do not reintroduce the rail, the index, the spec table or the
  cue grid. Orientation must come from something already on screen.
