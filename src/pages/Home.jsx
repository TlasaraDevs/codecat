import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToSection } from "@/lib/scroll";

export const Home = () => {
  const { hash } = useLocation();

  // Arriving at /#section from another page: sections render once their data
  // has loaded, so retry for a short while until the target exists.
  useEffect(() => {
    const id = decodeURIComponent(hash.slice(1));
    if (!id) return;
    let tries = 0;
    let frame = requestAnimationFrame(function attempt() {
      if (!scrollToSection(id) && tries++ < 60) frame = requestAnimationFrame(attempt);
    });
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return <>{/* sections */}</>;
};
