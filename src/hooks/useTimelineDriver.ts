import { useEffect } from 'react';
import type { RefObject } from 'react';
import type { TimelineStore } from '../lib/store';
import { clamp } from '../lib/timeline';

const SMOOTHING = 0.21;   // scrub inertia; lower = heavier film-reel feel
const EPSILON = 0.00005;

/**
 * Drives the store from scroll position.
 *
 * Runs its own rAF loop only while it still has distance to travel, so an idle
 * page costs nothing. Scroll listener is passive; nothing here reads layout
 * outside of a single getBoundingClientRect per event.
 */
export function useTimelineDriver(
  store: TimelineStore,
  ref: RefObject<HTMLElement | null>,
  reduced: boolean,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raw = 0;
    let smooth = 0;
    let last = 0;
    let frame = 0;
    let running = false;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      raw = distance > 0 ? clamp(-rect.top / distance) : 0;
    };

    const tick = () => {
      const diff = raw - smooth;
      smooth = reduced ? raw : smooth + diff * SMOOTHING;

      const v = clamp((smooth - last) * 26, -1, 1);
      last = smooth;

      store.emit({ p: smooth, raw, v });

      if (Math.abs(raw - smooth) > EPSILON) {
        frame = requestAnimationFrame(tick);
      } else {
        store.emit({ p: raw, raw, v: 0 });
        running = false;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const onScroll = () => { measure(); start(); };
    const onResize = () => { measure(); smooth = raw; store.emit({ p: raw, raw, v: 0 }); };

    measure();
    smooth = raw;
    store.emit({ p: raw, raw, v: 0 });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [store, ref, reduced]);
}
