import './Outro.css';

/** Just a footer. */
export function Outro({ onOpen }: { onOpen: (entry: string) => void }) {
  return (
    <footer className="end">
      <div className="end__inner">
        <span className="label end__mark">BMW M3</span>

        <nav className="end__nav">
          <button type="button" className="mono end__link" onClick={() => onOpen('model')}>
            Reference
          </button>
          <button
            type="button"
            className="mono end__link"
            onClick={() => window.scrollTo({
              top: 0,
              /* smooth here scrubs all 705 frames backwards over ~8 viewports */
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 'auto' : 'smooth',
            })}
          >
            Back to the top
          </button>
        </nav>

        <span className="mono dim end__by">Ferousco</span>
      </div>
    </footer>
  );
}
