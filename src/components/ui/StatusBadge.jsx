// Comic "action word" badge for a project's status.
const STATUS = {
  shipped: { label: "SHIPPED!", shape: "burst" },
  in_progress: { label: "IN PROGRESS…", shape: "bubble" },
  planned: { label: "COMING SOON!", shape: "bubble" },
  archived: { label: "THE END", shape: "box" },
};

const BURST =
  "polygon(50% 0%, 59% 18%, 79% 6%, 76% 28%, 98% 24%, 86% 44%, 100% 58%, 80% 64%, 88% 86%, 66% 78%, 57% 100%, 46% 82%, 27% 96%, 26% 75%, 3% 80%, 14% 60%, 0% 44%, 18% 36%, 8% 14%, 31% 20%, 38% 2%)";

export const StatusBadge = ({ status, className = "" }) => {
  const config = STATUS[status];
  if (!config) return null;

  if (config.shape === "burst") {
    return (
      <span className={`inline-block drop-shadow-[3px_3px_0_#000] ${className}`}>
        <span
          style={{ clipPath: BURST }}
          className="flex h-24 w-32 items-center justify-center bg-red-deep pt-1 font-display text-xl text-paper"
        >
          {config.label}
        </span>
      </span>
    );
  }

  if (config.shape === "bubble") {
    return (
      <span
        className={`relative inline-block rounded-[50%] border-2 border-black bg-paper px-5 py-2.5 font-display text-lg text-ink shadow-[3px_3px_0_0_#000] after:absolute after:-bottom-[9px] after:right-7 after:border-x-[7px] after:border-t-[9px] after:border-x-transparent after:border-t-paper ${className}`}
      >
        {config.label}
      </span>
    );
  }

  return (
    <span className={`inline-block border-2 border-black bg-ink px-3 py-1 font-display text-lg text-paper ${className}`}>
      {config.label}
    </span>
  );
};
