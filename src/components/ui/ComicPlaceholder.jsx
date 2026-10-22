import { CatMark } from "./CatMark";

// Stand-in panel for a missing image: halftone, cat mark, narration caption.
export const ComicPlaceholder = ({ label = "Screenshot coming soon…", className = "" }) => (
  <div
    role="img"
    aria-label={label}
    className={`halftone-red relative flex h-full w-full flex-col items-center justify-center gap-3 bg-coal p-6 ${className}`}
  >
    <CatMark className="h-16 w-16 text-red/80" />
    <span className="comic-caption px-3 py-1 font-display text-lg tracking-wider">{label}</span>
  </div>
);
