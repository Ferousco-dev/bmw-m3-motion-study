import { useEffect, useRef, useState } from 'react';
import './Preloader.css';

interface Props { progress: number; ready: boolean }

/** The load is a frame count, because that is literally what is happening. */
export function Preloader({ progress, ready }: Props) {
  const [gone, setGone] = useState(false);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
  }, [progress]);

  /* Reveal as soon as the coarse pass is in, the film is scrubbable from end
     to end at that point. Waiting for all 705 stills meant staring at a bar
     while 22 MB decoded, for no benefit. */
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => setGone(true), 620);
    return () => window.clearTimeout(t);
  }, [ready]);

  if (gone) return null;

  return (
    <div className={`boot${ready ? ' boot--out' : ''}`}>
      <div className="boot__block">
        <p className="label boot__id">BMW M3</p>
        <span className="boot__bar"><span ref={bar} /></span>
      </div>
    </div>
  );
}
