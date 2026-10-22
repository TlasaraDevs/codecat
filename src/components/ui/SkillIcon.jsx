import { SiGit, SiJavascript, SiPython, SiReact, SiTailwindcss, SiVite } from "react-icons/si";
import { LuBrainCircuit, LuCpu, LuHeadset, LuShieldCheck, LuSparkles } from "react-icons/lu";

// Maps the `icon` key stored on a skill row to an icon component.
const ICONS = {
  react: SiReact,
  vite: SiVite,
  tailwind: SiTailwindcss,
  javascript: SiJavascript,
  python: SiPython,
  git: SiGit,
  helpdesk: LuHeadset,
  hardware: LuCpu,
  security: LuShieldCheck,
  ai: LuBrainCircuit,
};

export const SkillIcon = ({ name, ...props }) => {
  const Icon = ICONS[name] ?? LuSparkles;
  return <Icon aria-hidden="true" {...props} />;
};
