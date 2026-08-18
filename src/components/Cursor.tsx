import { useEffect, useRef } from 'react';
import './Cursor.css';

/**
 * A crosshair, not a blob. The film is a studio measurement of an object, so
 * the pointer behaves like a camera reticle: it lags very slightly, squares up
 * over interactive targets, and never draws attention to itself.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer:coarse)').matches) return;
    const el = ref.current;
    if (!el) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let frame = 0;

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const target = (e.target as HTMLElement)?.closest('button,a');
      el.classList.toggle('cursor--live', Boolean(target));
    };

    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', move, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span className="cursor__h" />
      <span className="cursor__v" />
      <span className="cursor__ring" />
    </div>
  );
}
