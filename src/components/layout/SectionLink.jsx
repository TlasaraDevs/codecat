import { Link, useLocation, useNavigate } from "react-router-dom";
import { scrollToSection } from "@/lib/scroll";

// A link to a section of the home page that works from any route.
export const SectionLink = ({ id, onNavigate, onClick, ...props }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e) => {
    onClick?.(e);
    onNavigate?.();
    if (location.pathname === "/" && !e.defaultPrevented) {
      e.preventDefault();
      scrollToSection(id);
      navigate({ hash: `#${id}` }, { replace: true, preventScrollReset: true });
    }
  };

  return <Link to={`/#${id}`} onClick={handleClick} {...props} />;
};
