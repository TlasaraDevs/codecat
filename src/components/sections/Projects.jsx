import { getProjects } from "@/lib/content";
import { useContent } from "@/hooks/useContent";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";

export const Projects = () => {
  const { data: projects = [] } = useContent(getProjects);

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative bg-coal py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          id="projects-title"
          chapter="Chapter 02 · The work"
          title="Projects"
          intro="Things I've designed, built and shipped (or am shipping right now)."
        />
        <div className="grid gap-12 md:grid-cols-2 md:gap-10">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
