import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TimelineContext } from './lib/context';
import { TimelineStore } from './lib/store';
import { useTimelineDriver } from './hooks/useTimelineDriver';
import { loaderState, residentBitmaps, useFrameSequence } from './hooks/useFrameSequence';
import { Film } from './components/Film';
import { Stage } from './components/Stage';
import { Preloader } from './components/Preloader';
import { Cursor } from './components/Cursor';
import { Outro } from './components/Outro';
import { Dossier } from './components/Dossier';
import { CAPTIONS } from './lib/annotations';
import { progressToFrameF } from './lib/timeline';
import './App.css';

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function App() {
  const store = useMemo(() => new TimelineStore(), []);
  const rig = useRef<HTMLDivElement>(null);
  const reduced = useMemo(prefersReduced, []);
  const { frames, progress, ready } = useFrameSequence();
  const [entry, setEntry] = useState<string | null>(null);

  const opener = useRef<HTMLElement | null>(null);

  const open = useCallback((id: string) => {
    opener.current = document.activeElement as HTMLElement | null;
    setEntry(id);
  }, []);

  /* return focus to whatever opened the panel, without this a keyboard user
     lands back at the top of an 800vh document */
  const close = useCallback(() => {
    setEntry(null);
    /* after the commit that clears `inert`, or the focus lands on an inert
       ancestor and is silently dropped. A timeout survives rAF throttling. */
    window.setTimeout(() => opener.current?.focus?.(), 0);
  }, []);

  useTimelineDriver(store, rig, reduced);

  /**
   * The film only redraws when the store emits, and the store emits on scroll,
   * resize and mount. At mount every bitmap is still null, so the first draw is
   * skipped and nothing ever asks for it again, the visitor was landing on a
   * black rectangle until they scrolled. Repaint when the decode lands.
   */
  useEffect(() => {
    if (ready) store.emit({ ...store.state });
  }, [ready, store]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const w = window as unknown as {
      __timeline?: (p: number) => void;
      __frameAt?: (p: number) => number;
      __resident?: () => number;
      __loader?: () => unknown;
    };
    w.__timeline = (p) => store.emit({ p, raw: p, v: 0 });
    w.__frameAt = (p) => progressToFrameF(p);   // for motion verification
    w.__resident = residentBitmaps;             // for memory verification
    w.__loader = loaderState;
  }, [store]);

  return (
    <TimelineContext.Provider value={store}>
      <Preloader progress={progress} ready={ready} />
      <Cursor />

      {/* The visual layer is a canvas; the document outline lives here. */}
      <div className="sr">
        <h1>BMW M3</h1>
        <p>
          A studio film of the BMW M3, played back under scroll
          control. Each section below is a moment in that film.
        </p>
        <ol role="list">
          {CAPTIONS.map((c) => (
            <li key={c.kicker}>{c.kicker}: {c.line}</li>
          ))}
        </ol>
      </div>

      <div inert={entry !== null}>
        <Film frames={frames} onOpen={open} />

        <main>
        <div className="rig" ref={rig}>
          <div className="rig__pin">
            <Stage onOpen={open} />
          </div>
        </div>
          <Outro onOpen={open} />
        </main>
      </div>

      <Dossier open={entry !== null} focus={entry} onClose={close} />
    </TimelineContext.Provider>
  );
}
