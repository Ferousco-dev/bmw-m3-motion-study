# Design Audit
_Visual Designer, Creative Director, Art Director_

## D1, Annotation type fails contrast over the cabin, HIGH

**Problem** Annotation notes are `--softbox` at 78% opacity with a text-shadow.
Over steps 315–459 (the lit cabin) the background is `#8C9596`-ish; the note
lands near 1.6:1. It is legible only because of the shadow.
**Why** Legibility is being handled by shadow alone. Placement was chosen for
anatomy, not for tone.
**Recommended** Art-direct placement onto dark regions first; where impossible,
a local scrim tied to the callout (not a global one). Raise note opacity to 1
and let colour carry the hierarchy instead.
**Visual impact** Text stops feeling stuck onto the picture.
**Technical impact** None; static gradient, no per-frame cost.

## D2, `#0E1113` hard-coded in `Dossier.css`, LOW

**Problem** One raw hex outside the token file.
**Why** Panel ground was chosen by eye during a fast pass.
**Recommended** Promote to `--panel` (already declared and unused).
**Visual impact** None. **Technical impact** None.

## D3, The closing lockup is the only large type left, MEDIUM

**Problem** After removing captions and index, `M3` at up to 168px is the sole
piece of display type. It now reads as a jump in scale rather than a climax.
**Why** Successive removals took the middle of the type scale with them.
**Recommended** Keep the lockup; re-establish one mid-scale voice, the
annotation label, by lifting labels to 12px/600 so the ramp is 12 → 15 → 168
rather than 11 → 15 → 168.
**Visual impact** The ending lands as intended. **Technical impact** None.

## D4, Roundel optical alignment, LOW

**Problem** The 18px roundel is centred on the wordmark's box, not its optical
baseline; it reads 1px high next to uppercase.
**Recommended** Nudge with `transform: translateY(0.5px)`, verify at 1440 and 390.

## D5, No dark/light consideration, LOW, will not fix

The piece is committed to a single dark studio look. Correct for the subject.
Recorded so it is not raised again.
