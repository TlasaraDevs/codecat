import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { LuArrowRight, LuMail } from "react-icons/lu";
import { getDeveloper } from "@/lib/content";
import { buildWorkWithMeUrl } from "@/lib/contact";
import { useContent } from "@/hooks/useContent";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLink } from "@/components/ui/SocialLink";

export const Contact = () => {
  const { data: developer } = useContent(getDeveloper);
  if (!developer) return null;
  const { email, links = {} } = developer;

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeading id="contact-title" chapter="Final chapter · To be continued" title="Let's work together" />

        <Reveal className="comic-panel halftone-red overflow-hidden p-8 shadow-comic-lg md:p-12">
          <div className="grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="font-display text-4xl leading-tight text-paper md:text-5xl">
                Got a project, a role or a wild idea?
              </p>
              <p className="mt-4 max-w-lg text-lg text-paper/85">
                I&apos;d love to hear about it. Send a note through the Tlasara contact form, or drop
                me an email.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href={buildWorkWithMeUrl(developer)} className="btn btn-primary">
                  Work with me <LuArrowRight aria-hidden="true" />
                </a>
                {email && (
                  <a href={`mailto:${email}`} className="btn btn-ghost">
                    <LuMail aria-hidden="true" /> {email}
                  </a>
                )}
              </div>
            </div>

            <div className="md:justify-self-end">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-red-bright">
                Find me online
              </p>
              <ul className="flex gap-5">
                <li>
                  <SocialLink href={links.github} label="GitHub" icon={FaGithub} />
                </li>
                <li>
                  <SocialLink href={links.linkedin} label="LinkedIn" icon={FaLinkedinIn} />
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
