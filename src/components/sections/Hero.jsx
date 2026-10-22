import { useState } from "react";
import { m } from "framer-motion";
import { LuArrowDown, LuMapPin } from "react-icons/lu";
import { getDeveloper } from "@/lib/content";
import { buildWorkWithMeUrl } from "@/lib/contact";
import { useContent } from "@/hooks/useContent";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTypewriter } from "@/hooks/useTypewriter";
import { SectionLink } from "@/components/layout/SectionLink";
import { ComicPlaceholder } from "@/components/ui/ComicPlaceholder";

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

const ProfilePhoto = ({ src, name }) => {
  const [failed, setFailed] = useState(!src);

  return (
    <div className="comic-panel aspect-[4/5] w-full overflow-hidden shadow-comic-lg">
      {failed ? (
        <ComicPlaceholder label="Photo coming soon…" />
      ) : (
        <img
          src={src}
          alt={`Portrait of ${name}`}
          width="640"
          height="800"
          fetchPriority="high"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
};

export const Hero = () => {
  const { data: developer } = useContent(getDeveloper);
  const reduced = useReducedMotion();
  const typed = useTypewriter(developer?.roles ?? [], { enabled: !reduced });

  if (!developer) return <section id="home" className="min-h-[90vh]" />;

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28"
    >
      <div
        aria-hidden="true"
        className="halftone-red pointer-events-none absolute -right-32 -top-32 h-[36rem] w-[36rem] rounded-full [mask-image:radial-gradient(closest-side,black,transparent)]"
      />

      <div className="container-page relative grid items-center gap-14 md:grid-cols-[1.25fr_1fr]">
        <div>
          <m.p
            {...fadeUp(0)}
            className="relative mb-6 inline-block rounded-2xl border-2 border-black bg-paper px-4 py-2 font-bold text-ink shadow-[3px_3px_0_0_var(--color-red)] after:absolute after:-bottom-[10px] after:left-6 after:border-x-[8px] after:border-t-[10px] after:border-x-transparent after:border-t-paper"
          >
            Hi there! I&apos;m
          </m.p>

          <m.h1
            {...fadeUp(0.1)}
            id="hero-title"
            className="font-display text-6xl leading-[0.95] text-paper sm:text-7xl lg:text-8xl"
          >
            {developer.name}
          </m.h1>

          <m.p {...fadeUp(0.2)} className="mt-3 font-display text-3xl text-red sm:text-4xl">
            aka {developer.handle}
          </m.p>

          <m.div {...fadeUp(0.3)} className="mt-6 min-h-[2rem] font-mono text-lg text-paper sm:text-xl">
            <p className="sr-only">{developer.title}</p>
            {reduced ? (
              <p aria-hidden="true" className="text-base text-paper/90">
                {developer.title}
              </p>
            ) : (
              <p aria-hidden="true">
                <span className="text-red-bright">&gt; </span>
                {typed}
                <span className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] animate-blink bg-red" />
              </p>
            )}
          </m.div>

          <m.p {...fadeUp(0.4)} className="mt-6 max-w-xl text-lg text-muted">
            {developer.tagline}
          </m.p>

          <m.div {...fadeUp(0.5)} className="mt-9 flex flex-wrap items-center gap-4">
            <SectionLink id="projects" className="btn btn-primary">
              View my work <LuArrowDown aria-hidden="true" />
            </SectionLink>
            <a href={buildWorkWithMeUrl(developer)} className="btn btn-ghost">
              Work with me
            </a>
          </m.div>

          <m.p {...fadeUp(0.6)} className="mt-8 flex items-center gap-2 text-sm text-muted">
            <LuMapPin aria-hidden="true" className="text-red-bright" /> {developer.location}
          </m.p>
        </div>

        <m.div
          initial={{ opacity: 0, rotate: 0, scale: 0.95 }}
          animate={{ opacity: 1, rotate: 2, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <ProfilePhoto src={developer.photo_url} name={developer.name} />
          <span
            aria-hidden="true"
            className="absolute -bottom-5 -left-5 -rotate-6 border-2 border-black bg-red-deep px-3 py-1 font-display text-2xl text-paper shadow-[3px_3px_0_0_#000]"
          >
            MEOW!
          </span>
        </m.div>
      </div>
    </section>
  );
};
