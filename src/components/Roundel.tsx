import './Roundel.css';

/**
 * The roundel, drawn as geometry rather than imported as a brand asset: a ring,
 * a quartered field, no wordmark. Rendered in the page's own monochrome so it
 * reads as a mark on this document instead of a logo pasted onto it.
 *
 * For production work this would be replaced by the official asset under licence.
 */
export function Roundel({ size = 18 }: { size?: number }) {
  return (
    <svg
      className="roundel"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="16" cy="16" r="15" className="roundel__ring" />
      <circle cx="16" cy="16" r="11.5" className="roundel__field" />
      <path d="M16 4.5 A11.5 11.5 0 0 1 27.5 16 L16 16 Z" className="roundel__quarter" />
      <path d="M16 27.5 A11.5 11.5 0 0 1 4.5 16 L16 16 Z" className="roundel__quarter" />
      <circle cx="16" cy="16" r="11.5" className="roundel__inner-ring" />
    </svg>
  );
}
