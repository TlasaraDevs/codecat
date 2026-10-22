import { LuBriefcase, LuMapPin } from "react-icons/lu";
import { getExperience } from "@/lib/content";
import { formatRange } from "@/lib/format";
import { useContent } from "@/hooks/useContent";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const Experience = () => {
  const { data: experience = [] } = useContent(getExperience);

  return (
    <section id="experience" aria-labelledby="experience-title" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeading id="experience-title" chapter="Chapter 03 · The journey" title="Experience" />

        <ol className="relative ml-3 border-l-[3px] border-red/70 md:ml-4">
          {experience.map((job, i) => (
            <Reveal as="li" key={job.id} delay={i * 0.05} className="relative pb-12 pl-8 last:pb-0 md:pl-12">
              <span
                aria-hidden="true"
                className="absolute -left-[15px] top-1 flex h-7 w-7 items-center justify-center border-2 border-black bg-red-deep text-paper shadow-[2px_2px_0_0_#000]"
              >
                <LuBriefcase className="h-3.5 w-3.5" />
              </span>

              <div className="comic-panel p-6 shadow-comic-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-bright">
                  {formatRange(job.start_date, job.end_date)}
                </p>
                <h3 className="mt-2 font-display text-3xl text-paper">{job.role}</h3>
                <p className="mt-1 font-semibold text-paper/90">
                  {job.organization}
                  {job.department && <span className="font-normal text-muted"> · {job.department}</span>}
                </p>
                {job.location && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                    <LuMapPin aria-hidden="true" /> {job.location}
                  </p>
                )}
                {job.highlights?.length > 0 && (
                  <ul className="mt-4 space-y-2 text-paper/85">
                    {job.highlights.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-red" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
};
