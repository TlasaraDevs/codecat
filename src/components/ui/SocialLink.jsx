import { useId } from "react";

// A social icon link. With no href it stays in the design but is disabled,
// showing a "coming soon" tooltip on hover and keyboard focus.
export const SocialLink = ({ href, label, icon: Icon }) => {
  const tooltipId = useId();
  const base =
    "flex h-14 w-14 items-center justify-center border-[3px] border-black text-2xl transition";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} (opens in a new tab)`}
        className={`${base} bg-panel text-paper shadow-comic-sm hover:-translate-y-0.5 hover:bg-red-deep`}
      >
        <Icon aria-hidden="true" />
      </a>
    );
  }

  return (
    <span className="group relative">
      <span
        role="link"
        aria-disabled="true"
        aria-label={label}
        aria-describedby={tooltipId}
        tabIndex={0}
        className={`${base} cursor-not-allowed bg-panel text-paper/40 shadow-[4px_4px_0_0_var(--color-edge)]`}
      >
        <Icon aria-hidden="true" />
      </span>
      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap border-2 border-black bg-paper px-2 py-1 text-xs font-bold text-ink opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}: coming soon
      </span>
    </span>
  );
};
