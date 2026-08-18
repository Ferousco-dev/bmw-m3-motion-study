# Motion Rules

## The run/hold contract

The timeline is not linear against film time. It alternates:

    RUN  , the film advances with scroll (55% of total scroll)
    HOLD , the frame is frozen while an annotation is read (45%)

Implemented in `src/lib/timeline.ts` as `SEGMENTS`, built from `CALLOUTS`:
each annotation's midpoint frame becomes a hold, weighted by note length
(`0.6 + note.length / 210`) so longer text gets more reading distance.

**Rules for holds**
- A hold exists because there is something to read. No decorative holds.
- Hold weight must scale with reading time, never be uniform.
- Entering and leaving a hold must not produce a velocity discontinuity, the
  film should decelerate into the stop and accelerate out of it.

## Easing

- `linear` is banned except for the scrub itself, which is driven by the user.
- Scrub smoothing is a critically-damped lerp: `smooth += (raw - smooth) * 0.17`
  in `useTimelineDriver`. Lower is heavier. Do not exceed 0.25 (twitchy) or drop
  below 0.10 (soupy, feels broken).
- UI transitions: 250–600 ms, `cubic-bezier(.2,.7,.2,1)` for entrances,
  `cubic-bezier(.16,.84,.24,1)` for the panel.

## Frame rendering

- The sequence is motion-interpolated per shot to 72 fps (705 steps). Shots were
  interpolated **separately** so no frame blends across the cuts at 7.71 s and
  8.54 s. Never interpolate the clip as a whole.
- The renderer cross-fades the two neighbouring stills using the fractional
  frame index. This is what removes stepping; more frames alone cannot.

## Forbidden

Parallax on the film. Independent motion between the car and its own
annotations. Animation that restarts on scroll direction change. Any effect
that continues after the user stops scrolling.
