import { useEffect, useRef } from 'react';
import { ENTRIES, GROUPS, SOURCES } from '../lib/dossier';
import { Roundel } from './Roundel';
import './Dossier.css';

interface Props {
  open: boolean;
  focus: string | null;
  onClose: () => void;
}

/**
 * The reading layer.
 *
 * The film answers "what does it look like"; this answers "what am I looking
 * at". It opens over the film rather than replacing it, closes on Escape and on
 * backdrop click, and returns focus to the page when dismissed.
 */
export function Dossier({ open, focus, onClose }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  /* Focus enters the scroll container itself: in Safari it holds every entry,
     is not keyboard-focusable by default, and a keyboard-only reader could
     otherwise reach exactly one screenful. */
  useEffect(() => {
    if (open) body.current?.focus();
  }, [open]);

  /* Lock the page while the panel is open. The scrim is a fixed element, not a
     scroll container, so wheel and touch over it were driving the document,
     open at one moment in the film, close at another. */
  useEffect(() => {
    if (!open) return;
    const y = window.scrollY;
    const { style } = document.body;
    const prev = { position: style.position, top: style.top, width: style.width };
    style.position = 'fixed';
    style.top = `-${y}px`;
    style.width = '100%';
    return () => {
      style.position = prev.position;
      style.top = prev.top;
      style.width = prev.width;
      window.scrollTo(0, y);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !focus) return;
    const el = panel.current?.querySelector(`[data-entry="${focus}"]`);
    const gentle = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el?.scrollIntoView({ block: 'center', behavior: gentle ? 'smooth' : 'auto' });
    el?.classList.add('is-lit');
    const t = window.setTimeout(() => el?.classList.remove('is-lit'), 1800);
    return () => window.clearTimeout(t);
  }, [open, focus]);

  return (
    <div className={`dossier${open ? ' is-open' : ''}`} inert={!open}>
      {/* a div, not a button: a full-viewport control was the first tab stop of
          the page, and Escape plus the real Close button already cover keyboard */}
      <div className="dossier__scrim" aria-hidden="true" onClick={onClose} />

      <aside
        className="dossier__panel"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="BMW M3 reference"
      >
        <header className="dossier__head">
          <h2 className="sr">BMW M3 reference</h2>
          <span className="dossier__brand">
            <Roundel />
            <span className="label">BMW M3</span>
            <span className="mono dim dossier__code">G80</span>
          </span>
          <button type="button" className="mono dossier__close" onClick={onClose}>
            Close ✕
          </button>
        </header>

        <div className="dossier__body" ref={body} tabIndex={-1}>
          {GROUPS.map((group) => (
            <section key={group} className="dossier__group">
              <h3 className="mono dim dossier__group-name">{group}</h3>
              {ENTRIES.filter((e) => e.group === group).map((e) => (
                <article key={e.id} className="entry" data-entry={e.id}>
                  <h4 className="entry__title">{e.title}</h4>
                  <p className="entry__body">{e.body}</p>
                </article>
              ))}
            </section>
          ))}

          <section className="dossier__group">
            <h3 className="mono dim dossier__group-name">Sources</h3>
            <ul className="dossier__sources">
              {SOURCES.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noreferrer noopener">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
    </div>
  );
}
