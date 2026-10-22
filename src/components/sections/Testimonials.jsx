import { LuQuote } from "react-icons/lu";
import { getTestimonials } from "@/lib/content";
import { useContent } from "@/hooks/useContent";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Only renders once there is at least one published testimonial.
export const Testimonials = () => {
  const { data: testimonials = [] } = useContent(getTestimonials);
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeading id="testimonials-title" chapter="Side story · Reviews" title="Kind words" />
        <ul className="grid gap-10 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal as="li" key={t.id} delay={i * 0.08}>
              <figure>
                <blockquote className="relative rounded-3xl border-[3px] border-black bg-paper p-6 text-ink shadow-comic after:absolute after:-bottom-[18px] after:left-12 after:border-x-[12px] after:border-t-[18px] after:border-x-transparent after:border-t-paper">
                  <LuQuote aria-hidden="true" className="mb-2 h-7 w-7 text-red-deep" />
                  <p className="text-lg leading-relaxed">{t.quote}</p>
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3 pl-6">
                  {t.avatar_url && (
                    <img
                      src={t.avatar_url}
                      alt=""
                      loading="lazy"
                      width="48"
                      height="48"
                      className="h-12 w-12 rounded-full border-2 border-black object-cover"
                    />
                  )}
                  <span>
                    <span className="block font-bold text-paper">{t.author_name}</span>
                    <span className="block text-sm text-muted">
                      {[t.author_role, t.author_company].filter(Boolean).join(", ")}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
};
