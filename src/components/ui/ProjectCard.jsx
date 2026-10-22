import { useState } from "react";
import { m } from "framer-motion";
import { LuExternalLink, LuGithub } from "react-icons/lu";
import { ComicPlaceholder } from "./ComicPlaceholder";
import { StatusBadge } from "./StatusBadge";

const Screenshot = ({ src, title }) => {
  const [failed, setFailed] = useState(!src);
  if (failed) return <ComicPlaceholder />;
  return (
    <img
      src={src}
      alt={`Screenshot of ${title}`}
      loading="lazy"
      decoding="async"
      width="1280"
      height="720"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  );
};

export const ProjectCard = ({ project, index = 0 }) => {
  const { title, summary, description, tech = [], screenshot_url, github_url, live_url, status } = project;
  const tilt = index % 2 === 0 ? -1.2 : 1.2;

  return (
    <m.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ rotate: tilt, y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="comic-panel flex flex-col transition-shadow duration-200 hover:shadow-comic-lg"
    >
      <div className="relative aspect-video border-b-[3px] border-black">
        <Screenshot src={screenshot_url} title={title} />
        <StatusBadge status={status} className="absolute -right-4 -top-6 rotate-6" />
      </div>

      <div className="halftone relative flex flex-1 flex-col p-6 pt-0">
        {summary && (
          <p className="comic-caption relative -mt-5 mb-5 mr-6 px-3 py-2 text-sm font-medium leading-snug">
            {summary}
          </p>
        )}

        <h3 className="font-display text-4xl text-paper">{title}</h3>
        {description && <p className="mt-3 text-paper/80">{description}</p>}

        {tech.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Built with">
            {tech.map((t) => (
              <li key={t} className="border border-edge bg-ink px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-paper/90">
                {t}
              </li>
            ))}
          </ul>
        )}

        {(live_url || github_url) && (
          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            {live_url && (
              <a href={live_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary px-4 py-2 text-sm">
                <LuExternalLink aria-hidden="true" /> Live site
                <span className="sr-only">for {title} (opens in a new tab)</span>
              </a>
            )}
            {github_url && (
              <a href={github_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-4 py-2 text-sm">
                <LuGithub aria-hidden="true" /> Code
                <span className="sr-only">for {title} on GitHub (opens in a new tab)</span>
              </a>
            )}
          </div>
        )}
      </div>
    </m.article>
  );
};
