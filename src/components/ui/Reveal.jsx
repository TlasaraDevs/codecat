import { m } from "framer-motion";

// Fades/slides children in the first time they scroll into view.
// Motion is reduced automatically for prefers-reduced-motion (see App.jsx).
export const Reveal = ({ children, delay = 0, y = 24, className, as = "div" }) => {
  const Component = m[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
    >
      {children}
    </Component>
  );
};
