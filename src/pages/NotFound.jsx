import { Link } from "react-router-dom";
import { m } from "framer-motion";
import { LuArrowLeft } from "react-icons/lu";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { CatMark } from "@/components/ui/CatMark";

export const NotFound = () => {
  useDocumentTitle("Page not found");

  return (
    <section aria-labelledby="not-found-title" className="container-page flex min-h-[70vh] items-center py-16">
      <m.div
        initial={{ opacity: 0, rotate: -3, scale: 0.95 }}
        animate={{ opacity: 1, rotate: -1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="comic-panel halftone-red mx-auto w-full max-w-2xl p-8 text-center shadow-comic-lg md:p-12"
      >
        <p className="comic-caption mx-auto -mt-14 mb-8 inline-block px-4 py-1.5 font-display text-xl md:-mt-16">
          Meanwhile, somewhere off the map…
        </p>
        <h1 id="not-found-title" className="font-display text-8xl leading-none text-red md:text-9xl">
          404!
        </h1>
        <CatMark className="mx-auto mt-6 h-20 w-20 text-paper" />
        <p className="mt-6 font-display text-3xl text-paper">This panel is missing from the comic.</p>
        <p className="mt-3 text-muted">The page you&apos;re looking for doesn&apos;t exist, or it moved.</p>
        <Link to="/" className="btn btn-primary mt-8">
          <LuArrowLeft aria-hidden="true" /> Back to the start
        </Link>
      </m.div>
    </section>
  );
};
