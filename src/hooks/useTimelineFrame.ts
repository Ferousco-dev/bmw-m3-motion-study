import { useContext, useEffect, useRef } from 'react';
import { TimelineContext } from '../lib/context';
import type { TimelineState } from '../lib/store';

/** Subscribe to the timeline without triggering React renders. */
export function useTimelineFrame(fn: (s: TimelineState) => void) {
  const store = useContext(TimelineContext);
  const ref = useRef(fn);
  ref.current = fn;

  useEffect(() => {
    if (!store) return;
    const unsubscribe = store.subscribe((s) => ref.current(s));
    return () => { unsubscribe(); };
  }, [store]);
}
