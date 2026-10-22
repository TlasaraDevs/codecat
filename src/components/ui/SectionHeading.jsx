import { Reveal } from "./Reveal";

// Comic "chapter" heading used at the top of each section.
export const SectionHeading = ({ id, chapter, title, intro }) => (
  <Reveal className="mb-12 max-w-2xl">
    <p className="mb-2 inline-block -rotate-1 bg-red-deep px-2 py-0.5 text-xs font-bold uppercase tracking-[0.2em] text-paper">
      {chapter}
    </p>
    <h2 id={id} className="font-display text-5xl text-paper md:text-6xl">
      {title}
      <span className="text-red">.</span>
    </h2>
    {intro && <p className="mt-3 text-muted">{intro}</p>}
  </Reveal>
);
