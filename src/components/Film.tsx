import { useEffect, useRef, useState } from 'react';
import { useTimelineFrame } from '../hooks/useTimelineFrame';
import { setCentre } from '../hooks/useFrameSequence';
import { CUTS, FRAME_COUNT, FRAME_H, FRAME_W, progressToFrame, progressToFrameF } from '../lib/timeline';
import { CALLOUTS } from '../lib/annotations';
import './Film.css';

const ASPECT = FRAME_W / FRAME_H;

/**
 * Frames outside the decoded window are null. Rather than dropping a frame,
 * fall back to the closest decoded still, in practice a keyframe at most
 * twelve steps away, which during a fast scrub is invisible and resolves as
 * the window catches up.
 */
function nearest(list: (ImageBitmap | null)[], i: number): ImageBitmap | null {
  for (let d = 1; d <= 32; d++) {
    const a = list[i - d];
    if (a) return a;
    const b = list[i + d];
    if (b) return b;
  }
  return null;
}
/** cover-fit bias: keep the car's floor rather than centring the crop */
const Y_BIAS = 0.44;

interface Props {
  frames: React.RefObject<(ImageBitmap | null)[]>;
  onOpen: (entry: string) => void;
}

/**
 * Full-bleed film.
 *
 * The canvas backing store is fixed at the stills' own resolution and never
 * resized: every frame is one constant-cost blit of a pre-decoded bitmap, and
 * the GPU handles the scale to viewport. Resizing the backing store per frame,
 * or drawing at devicePixelRatio, is what makes these pages stutter.
 *
 * Callouts live inside the cover rect rather than the viewport, so they stay
 * pinned to the part they name no matter how the frame is cropped.
 */
const NARROW = 760;
const MARGIN = 16;   // px of viewport the text block must never come closer than

export function Film({ frames, onOpen }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const texts = useRef<(HTMLSpanElement | null)[]>([]);
  const shown = useRef(-1);
  const canvas = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const drawn = useRef(-1);
  const marks = useRef<(HTMLButtonElement | null)[]>([]);
  const [narrow, setNarrow] = useState(
    typeof window !== 'undefined' && window.innerWidth <= NARROW,
  );

  /* Driven by the same resize path as the cover-fit rather than a matchMedia
     listener, so the anchor set and the film box can never disagree about how
     wide the viewport is. */
  useEffect(() => {
    const sync = () => {
      setNarrow(window.innerWidth <= NARROW);
      shown.current = -1;
    };
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    el.width = FRAME_W;
    el.height = FRAME_H;
    ctx.current = el.getContext('2d', { alpha: false });
    drawn.current = -1;

    const fit = () => {
      const node = box.current;
      if (!node) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let w = vw;
      let h = vw / ASPECT;
      if (h < vh) { h = vh; w = vh * ASPECT; }

      node.style.width = `${w}px`;
      node.style.height = `${h}px`;
      node.style.left = `${(vw - w) / 2}px`;
      node.style.top = `${(vh - h) * Y_BIAS}px`;
    };

    fit();
    const onResize = () => { fit(); shown.current = -1; };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /**
   * Nudge the text block back inside the viewport, leaving the dot and leader
   * on the anchor. The anchor is art direction, it points at a part, but the
   * prose is just prose, and prose that runs off the edge is worth nothing.
   * Runs only when the visible callout changes, so it is one rect read per
   * annotation rather than one per frame.
   */
  const clamp = () => {
    const el = texts.current[shown.current];
    if (!el) return;
    el.style.transform = '';
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let dx = 0;
    let dy = 0;
    if (r.left < MARGIN) dx = MARGIN - r.left;
    else if (r.right > vw - MARGIN) dx = vw - MARGIN - r.right;
    if (r.top < MARGIN) dy = MARGIN - r.top;
    else if (r.bottom > vh - MARGIN) dy = vh - MARGIN - r.bottom;

    if (dx || dy) el.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  useTimelineFrame(({ p, v }) => {
    const exact = progressToFrameF(p);
    const frame = progressToFrame(p);

    /* Cross-dissolve the two neighbouring stills. The source film is 24fps
       interpolated to 48; blending the pair either side of the playhead makes
       the scrub continuous rather than stepped, at the cost of one extra blit
      , and unlike generating yet more frames, it costs nothing to download. */
    const base = Math.floor(exact);
    const frac = exact - base;
    const key = Math.round(exact * 20);          // redraw threshold: 1/20th of a frame

    setCentre(frame, v);

    if (key !== drawn.current) {
      const c = ctx.current;
      const a = frames.current[base] ?? nearest(frames.current, base);
      const b = frames.current[Math.min(FRAME_COUNT - 1, base + 1)];

      if (c && a) {
        c.globalAlpha = 1;
        c.drawImage(a, 0, 0, FRAME_W, FRAME_H);
        /* Blending only earns its cost at low speed. Moving quickly, the two
           stills are far apart and the dissolve reads as a double exposure,
           so drop it and save a full-frame blit at the busiest moment. */
        if (b && frac > 0.02 && Math.abs(v) < 0.32 && !CUTS.includes(base + 1)) {
          c.globalAlpha = frac;
          c.drawImage(b, 0, 0, FRAME_W, FRAME_H);
          c.globalAlpha = 1;
        }
        drawn.current = key;
      }
    }

    for (let i = 0; i < CALLOUTS.length; i++) {
      const el = marks.current[i];
      if (!el) continue;
      const [a, b] = CALLOUTS[i].frames;
      const alpha = frame >= a && frame <= b
        ? Math.max(0, Math.min(1, (frame - a) / 5, (b - frame) / 5))
        : 0;
      el.style.opacity = String(alpha);
      /* visibility, not just opacity: an opacity-0 button stays in the tab order
         and paints a focus ring on nothing. Ten of them, across a third of the
         timeline. */
      el.style.visibility = alpha > 0 ? 'visible' : 'hidden';
      el.style.pointerEvents = alpha > 0.35 ? 'auto' : 'none';

      if (alpha > 0 && shown.current !== i) {
        shown.current = i;
        /* synchronous: one layout read per annotation change, not per frame.
           Deferring to rAF meant the clamp had not applied by the time the
           annotation was first painted, and never applied at all wherever rAF
           is throttled. */
        clamp();
      }
    }
  });

  return (
    <div className="film">
      <div className="film__box" ref={box}>
        <canvas ref={canvas} className="film__canvas" />

        {CALLOUTS.map((c, i) => {
          const m = narrow && c.mobile ? c.mobile : null;
          const x = m ? m.x : c.x;
          const y = m ? m.y : c.y;
          const dir = m ? m.dir : c.dir;
          return (
          <button
            type="button"
            key={c.id}
            className={`callout callout--${dir}`}
            style={{ left: `${x}%`, top: `${y}%`, ['--lead' as string]: `${c.lead ?? 40}px` }}
            ref={(el) => { marks.current[i] = el; }}
            onClick={() => onOpen(c.entry)}
            aria-label={c.label}
            aria-describedby={`note-${c.id}`}
          >
            <span className="callout__dot" />
            <span className="callout__leader" />
            <span className="callout__text" ref={(el) => { texts.current[i] = el; }}>
              <span className="callout__label mono">{c.label}</span>
              {/* described-by rather than swallowed by aria-label: the note is
                  ~500 words of the film's own prose and AT never heard it */}
              <span className="callout__note" id={`note-${c.id}`}>{c.note}</span>
            </span>
            <span className="callout__plus" aria-hidden="true" />
          </button>
          );
        })}
      </div>
    </div>
  );
}
