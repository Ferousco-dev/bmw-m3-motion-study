# Design Principles

## 1. The film has visual authority

Nothing on the page may compete with the car. If type and car are fighting for
the same attention at the same moment, the type is wrong, not the car.

Hierarchy, always:

    Vehicle → annotation on the part → section chrome → micro-interaction

## 2. Restraint is the aesthetic

This is a monochrome studio document. The palette is sampled from the footage;
the brightest pixel in the film is `#B5B7BB` and that is the page's white. The
only colour is the M stripe, and it appears exactly once.

Anything decorative that cannot name a reason to exist gets deleted. Historic
deletions, all correct: animated film grain, an SVG turbulence filter, three
`mix-blend-mode` layers, a rotating ring of text, a progress rail, a section
index, a specification table, a design-cues grid, an audio scrubber.

## 3. Reading and moving are different modes

The user cannot read a paragraph that is moving. The timeline therefore holds:
the film stops dead while an annotation is on screen, and resumes when the
reader scrolls past it. Scroll continues; the picture waits.

This is the single most important behaviour in the product. Protect it.

## 4. One idea on screen at a time

Never two annotations simultaneously. Each closes at least six steps before the
next opens. If a moment needs two labels, it needs two moments.

## 5. Honesty

Nothing is claimed about the car that is not sourced or visibly true in the
footage. No invented performance figures. The reference panel carries its
sources as links. Where accounts conflict, the M colours and the Texaco story,
both are given.

## 6. Evolution, not destruction

The direction is decided. Changes are corrections, not restarts. A pass that
proposes "rebuild the layout" has misread the brief.
