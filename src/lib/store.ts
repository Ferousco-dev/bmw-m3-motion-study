/**
 * A single source of truth for "where are we in the film".
 *
 * Deliberately outside React state: this value changes every animation frame,
 * and re-rendering a component tree at 120Hz is how these pages die. Components
 * subscribe and write to their own DOM nodes directly.
 */

export interface TimelineState {
  /** smoothed scroll progress across the pinned experience, 0..1 */
  p: number;
  /** raw, unsmoothed progress, used for anything that must not lag */
  raw: number;
  /** signed scroll velocity, roughly -1..1 */
  v: number;
}

type Listener = (s: TimelineState) => void;

export class TimelineStore {
  state: TimelineState = { p: 0, raw: 0, v: 0 };
  private listeners = new Set<Listener>();

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    fn(this.state);
    return () => this.listeners.delete(fn);
  }

  emit(next: TimelineState) {
    this.state = next;
    for (const fn of this.listeners) fn(next);
  }
}
