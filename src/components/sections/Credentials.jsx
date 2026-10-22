import { LuAward, LuExternalLink, LuGraduationCap } from "react-icons/lu";
import { getCertificates, getEducation } from "@/lib/content";
import { formatMonth } from "@/lib/format";
import { useContent } from "@/hooks/useContent";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STATUS_LABELS = { graduated: "Graduated", in_progress: "In progress" };

export const Credentials = () => {
  const { data: education = [] } = useContent(getEducation);
  const { data: certificates = [] } = useContent(getCertificates);
  if (education.length === 0 && certificates.length === 0) return null;

  return (
    <section id="credentials" aria-labelledby="credentials-title" className="bg-coal py-20 md:py-28">
      <div className="container-page">
        <SectionHeading id="credentials-title" chapter="Chapter 04 · Training arc" title="Education & certificates" />

        {education.length > 0 && (
          <div className="mb-14 grid gap-6 md:grid-cols-2">
            {education.map((item) => (
              <Reveal key={item.id} className="comic-panel halftone flex gap-5 p-6">
                <LuGraduationCap aria-hidden="true" className="h-10 w-10 shrink-0 text-red" />
                <div>
                  <h3 className="font-display text-3xl text-paper">{item.qualification}</h3>
                  <p className="mt-1 font-semibold text-paper/90">{item.institution}</p>
                  <p className="mt-1 text-sm text-muted">
                    {[item.location, STATUS_LABELS[item.status], formatMonth(item.end_date)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {certificates.length > 0 && (
          <ul className="grid gap-8 md:grid-cols-2">
            {certificates.map((cert, i) => (
              <Reveal as="li" key={cert.id} delay={i * 0.08} className="comic-panel flex flex-col p-6 shadow-comic-sm">
                <div className="flex items-start gap-4">
                  <LuAward aria-hidden="true" className="h-9 w-9 shrink-0 text-red" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-bright">
                      {cert.issuer}
                      {cert.issued_date && ` · ${formatMonth(cert.issued_date)}`}
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-paper">{cert.title}</h3>
                    {cert.description && <p className="mt-2 text-paper/80">{cert.description}</p>}
                  </div>
                </div>
                {cert.skills?.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label="Skills covered">
                    {cert.skills.map((skill) => (
                      <li key={skill} className="border border-edge bg-ink px-2.5 py-1 text-xs font-medium text-paper/90">
                        {skill}
                      </li>
                    ))}
                  </ul>
                )}
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 self-start pt-6 text-sm font-semibold text-red-bright underline-offset-4 hover:underline"
                  >
                    View credential <LuExternalLink aria-hidden="true" />
                    <span className="sr-only">for {cert.title} on Credly (opens in a new tab)</span>
                  </a>
                )}
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
