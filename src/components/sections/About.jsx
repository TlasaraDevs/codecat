import { getDeveloper, getSkills } from "@/lib/content";
import { useContent } from "@/hooks/useContent";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillIcon } from "@/components/ui/SkillIcon";

const CATEGORY_LABELS = {
  Build: "Builds with",
  Support: "Keeps things running",
  Learning: "Levelling up in",
};

export const About = () => {
  const { data: developer } = useContent(getDeveloper);
  const { data: skills = [] } = useContent(getSkills);
  if (!developer) return null;

  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <section id="about" aria-labelledby="about-title" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeading id="about-title" chapter="Chapter 01 · Origin story" title="About me" />

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="space-y-5 text-lg leading-relaxed text-paper/90">
            {developer.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
            <p>
              Proudly part of{" "}
              <a
                href={developer.organization.url}
                className="font-semibold text-red-bright underline decoration-2 underline-offset-4 hover:text-paper"
              >
                {developer.organization.name}
              </a>
              , {developer.organization.description}.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="comic-panel halftone self-start p-6 md:rotate-1">
            <h3 className="comic-caption -ml-9 -mt-9 mb-5 inline-block px-3 py-1 font-display text-xl">
              Meanwhile, off duty…
            </h3>
            <ul className="flex flex-wrap gap-2">
              {developer.interests.map((interest) => (
                <li
                  key={interest}
                  className="border-2 border-black bg-ink px-3 py-1.5 text-sm font-semibold text-paper shadow-[2px_2px_0_0_var(--color-red)]"
                >
                  {interest}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {skills.length > 0 && (
          <div className="mt-20">
            <Reveal>
              <h3 className="font-display text-4xl text-paper">
                Power-ups<span className="text-red">.</span>
              </h3>
            </Reveal>
            <div className="mt-8 space-y-10">
              {categories.map((category) => (
                <div key={category}>
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-red-bright">
                    {CATEGORY_LABELS[category] ?? category}
                  </p>
                  <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {skills
                      .filter((s) => s.category === category)
                      .map((skill, i) => (
                        <Reveal
                          as="li"
                          key={skill.id}
                          delay={i * 0.05}
                          className="group flex items-center gap-3 border-2 border-black bg-panel p-4 shadow-[3px_3px_0_0_var(--color-edge)] transition-shadow hover:shadow-comic-sm"
                        >
                          <SkillIcon
                            name={skill.icon}
                            className="h-6 w-6 shrink-0 text-red transition-transform group-hover:scale-110"
                          />
                          <span className="text-sm font-semibold leading-tight">{skill.name}</span>
                        </Reveal>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
