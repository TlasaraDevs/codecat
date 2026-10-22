import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, m } from "framer-motion";
import { LuMenu, LuX } from "react-icons/lu";
import { getDeveloper, getPosts, getTestimonials } from "@/lib/content";
import { buildWorkWithMeUrl } from "@/lib/contact";
import { useContent } from "@/hooks/useContent";
import { useActiveSection } from "@/hooks/useActiveSection";
import { Logo } from "./Logo";
import { SectionLink } from "./SectionLink";

const BASE_LINKS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "testimonials", label: "Testimonials", when: "testimonials" },
  { id: "blog", label: "Blog", when: "posts" },
  { id: "contact", label: "Contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const logo = useRef(null);
  const replayLogo = () => logo.current?.replay();
  const { data: developer } = useContent(getDeveloper);
  const { data: posts } = useContent(getPosts);
  const { data: testimonials } = useContent(getTestimonials);

  const available = { posts: posts?.length > 0, testimonials: testimonials?.length > 0 };
  const links = BASE_LINKS.filter((link) => !link.when || available[link.when]);
  const activeSection = useActiveSection(["home", ...links.map((l) => l.id)]);
  // Section highlighting only makes sense on the home page.
  const active = useLocation().pathname === "/" ? activeSection : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const linkClass = (id) =>
    `relative px-1 py-1 text-sm font-semibold uppercase tracking-wider transition-colors ${
      active === id ? "text-red-bright" : "text-paper/80 hover:text-paper"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b-2 border-black bg-ink/90 backdrop-blur-md"
          : "border-b-2 border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="Main" className="container-page flex h-16 items-center justify-between">
        <Link
          to="/"
          aria-label="codecat — home"
          onClick={() => setOpen(false)}
          onMouseEnter={replayLogo}
          onFocus={replayLogo}
          className="flex items-center py-2"
        >
          <Logo ref={logo} />
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <li key={link.id}>
              <SectionLink
                id={link.id}
                className={linkClass(link.id)}
                aria-current={active === link.id ? "true" : undefined}
              >
                {link.label}
                {active === link.id && (
                  <m.span
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-red"
                  />
                )}
              </SectionLink>
            </li>
          ))}
          {developer && (
            <li>
              <a href={buildWorkWithMeUrl(developer)} className="btn btn-primary px-4 py-2 text-sm">
                Work with me
              </a>
            </li>
          )}
        </ul>

        <button
          type="button"
          className="p-2 text-paper md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <LuX size={26} /> : <LuMenu size={26} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-edge md:hidden"
          >
            <ul className="container-page flex flex-col gap-1 py-4">
              {links.map((link) => (
                <li key={link.id}>
                  <SectionLink
                    id={link.id}
                    onNavigate={() => setOpen(false)}
                    aria-current={active === link.id ? "true" : undefined}
                    className={`block py-3 font-display text-2xl ${
                      active === link.id ? "text-red-bright" : "text-paper"
                    }`}
                  >
                    {link.label}
                  </SectionLink>
                </li>
              ))}
              {developer && (
                <li className="pt-3">
                  <a href={buildWorkWithMeUrl(developer)} className="btn btn-primary w-full">
                    Work with me
                  </a>
                </li>
              )}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
};
