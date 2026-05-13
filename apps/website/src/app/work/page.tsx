import site from "@/content/site.json";
import { ProjectCard } from "../components/ProjectCard";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export default function WorkPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-shell">
        <p className="section-kicker">Work / Photos</p>
        <h1>Real project proof from homes, new construction, and larger buildings.</h1>
      </section>
      <section className="section-block">
        <div className="project-grid two-up">
          {site.projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
