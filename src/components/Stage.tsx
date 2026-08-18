import { useRef } from 'react';
import { useTimelineFrame } from '../hooks/useTimelineFrame';
import { FRAME_COUNT, progressToFrame } from '../lib/timeline';
import { Roundel } from './Roundel';
import './Stage.css';

/** the closing lockup takes over once the film reaches the badge */
const FINALE_FRAME = Math.round(FRAME_COUNT * 0.88);

/**
 * Chrome over the film, deliberately almost nothing: the mark, a way into the
 * reference, and the closing lockup. Everything explanatory now lives on the
 * parts themselves.
 */
export function Stage({ onOpen }: { onOpen: (entry: string) => void }) {
  const finale = useRef<HTMLDivElement>(null);
  const on = useRef(false);

  useTimelineFrame(({ p }) => {
    const showing = progressToFrame(p) >= FINALE_FRAME;
    if (showing === on.current) return;
    on.current = showing;
    finale.current?.classList.toggle('is-on', showing);
  });

  return (
    <div className="chrome">
      <div className="chrome__scrim chrome__scrim--top" aria-hidden="true" />
      <div className="chrome__scrim chrome__scrim--bottom" aria-hidden="true" />

      <header className="chrome__head">
        <span className="chrome__brand">
          <Roundel />
          <span className="label chrome__model">BMW M3</span>
        </span>
        <button type="button" className="mono chrome__ref" onClick={() => onOpen('model')}>
          Reference
        </button>
      </header>

      <footer className="chrome__foot">
        <div className="finale" ref={finale} aria-hidden="true">
          <span className="finale__stripe" />
          <p className="finale__word">M3</p>
        </div>
      </footer>
    </div>
  );
}
