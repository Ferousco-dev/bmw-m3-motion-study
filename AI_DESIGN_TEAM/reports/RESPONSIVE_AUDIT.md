# Responsive Audit
_QA Engineer_

Widths to verify: 1440 · 1280 · 1024 · 768 · 430 · 390 · 375, plus 21:9 and a
short 800×600 viewport.

## R1, Annotation notes overflow the frame box on narrow viewports, HIGH

**Problem** `.callout__text` is `max-width: 330px` with a leader of up to 104 px.
A right-facing callout anchored at x=50% needs ~490 px of clearance; at 390 px
wide there is none, and the note is clipped by the cover-crop box.
**Why** Callout geometry was tuned at 1280.
**Recommended** Scale `max-width` and `--lead` with viewport, and flip leader
direction toward the nearer edge below ~700 px. Below ~500 px, place the note
under the label centred, and shorten the copy via a `short` field.
**Visual impact** Annotations become usable on phones, where they currently are
not. **Technical impact** CSS plus one optional content field.

## R2, Cover-crop loses annotated parts at extreme ratios, HIGH

**Problem** `Y_BIAS = 0.44` fixes the vertical crop. At 21:9 the frame is cropped
top and bottom; callouts anchored at y=22% (`track`) and y=80% (`profile`) fall
outside the visible area while their labels remain on screen, pointing at
nothing.
**Recommended** Clamp anchors into the visible rect at render time, or suppress a
callout whose anchor is off-screen. Clamping is preferable, the label keeps
meaning.

## R3, Closing lockup collides on short viewports, MEDIUM

**Problem** `clamp(72px, 11vw, 168px)` plus the M stripe, inside a footer with
`min-height: 120px`, on an 800×600 viewport leaves the lockup nearly touching
the scrim edge.
**Recommended** Bound the lockup by height as well as width (`min()` against `vh`).

## R4, 620vh mobile rig with the same ten holds, MEDIUM

**Problem** Mobile keeps every hold but compresses total scroll by 22%, so each
hold is shorter on the device where reading is slowest.
**Recommended** Either raise mobile rig height or drop the lowest-value holds on
narrow viewports. Deliberate mobile composition, not a scaled desktop.

## R5, Touch has no hover, and the cursor is desktop-only, MEDIUM

Covered as U5. Recorded here because it presents as a responsive defect.
