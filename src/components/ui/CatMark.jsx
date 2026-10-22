// The cat-head mark from the favicon, for placeholders and decoration.
export const CatMark = ({ className = "" }) => (
  <svg aria-hidden="true" viewBox="0 0 64 64" className={className}>
    <path fill="currentColor" d="M11 33 15 7l15 13h4L49 7l4 26c0 13-9.5 22-21 22S11 46 11 33Z" />
    <path fill="var(--color-ink)" d="M21 34c2-3 6-3 8 0-2 2-6 2-8 0Zm14 0c2-3 6-3 8 0-2 2-6 2-8 0Z" />
  </svg>
);
