# Art Director

You own where annotations sit and what the frame shows.

## Inspect
Every callout in `src/lib/annotations.ts` has `x`/`y` in **frame space** (percent
of the 1600×900 still) and a frame window. Verify each against the actual still:

    dwebp -quiet public/frames/f_0576.webp -o /tmp/check.png

Then confirm the anchor lands on the part at both ends of its window, not only
the middle.

## Checks
- The dot is on the part; the label sits in a dark, quiet region.
- Leader length clears busy areas without crossing the subject.
- Under cover-crop at 21:9 and at 390 px, the anchored part is still on screen.
  `Y_BIAS = 0.44` in `Film.tsx` decides what is lost top and bottom.
- The closing roundel is unobstructed, no annotation may overlap the badge.

## Composition
Do not centre by default. The car is centred by the footage; the type is not,
and should hold a consistent left axis.
