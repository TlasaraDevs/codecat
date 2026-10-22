// "codecat" wordmark; the "a" wears a pair of red cat ears.
export const Logo = ({ className = "" }) => (
  <span className={`font-display text-3xl leading-none text-paper ${className}`}>
    codec
    <span className="relative inline-block">
      <svg
        aria-hidden="true"
        viewBox="0 0 20 8"
        className="absolute -top-[0.32em] left-1/2 w-[0.72em] -translate-x-1/2 fill-red"
      >
        <path d="M1 8 3 0l5 6h4l5-6 2 8Z" />
      </svg>
      a
    </span>
    t
  </span>
);
