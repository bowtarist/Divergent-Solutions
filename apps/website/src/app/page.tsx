import Link from "next/link";
import site from "@/content/site.json";
import { ProjectCard } from "./components/ProjectCard";
import { ProofRow } from "./components/ProofRow";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

export default function HomePage() {
  const homepageProjects = site.projects.filter((project) =>
    ["Woodville finished residential", "Stevenson Church"].includes(project.title)
  );
  const featuredReview = site.reviews.find((review) => review.author === "Ashley J.") ?? site.reviews[0];

  return (
    <main>
      <SiteHeader />
      <section className="hero">
        <div className="hero-copy">
          <p className="label">{site.hero.eyebrow}</p>
          <h1>{site.hero.headline}</h1>
          <p>{site.hero.body}</p>
          <div className="actions">
            <Link className="button primary" href="/request-a-quote">
              {site.primaryCta}
            </Link>
            <Link className="button secondary" href="/work">
              {site.hero.secondaryCta}
            </Link>
          </div>
          <div className="service-area">
            <p className="area-title">Serving</p>
            <div className="cities">
              {site.serviceArea.cities.map((city) => (
                <span className="city" key={city}>
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-photo">
          <img src={site.hero.primaryImage} alt="Scottsboro new construction gutter installation" />
          <figure className="review-overlay">
            <blockquote>{featuredReview.quote}</blockquote>
            <figcaption>
              {featuredReview.author}, {featuredReview.source}
            </figcaption>
          </figure>
        </div>
      </section>
      <ProofRow />
      <section className="process-band">
        <h2>{site.process.headline}</h2>
        <div className="process-steps">
          {site.process.steps.map((step) => (
            <article className="process-step" key={step.label}>
              <strong>{step.label}</strong>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section-block">
        <div className="section-head">
          <h2>Proof from homes, builders, and larger projects.</h2>
          <p>
            Real project photography supports the promise: clean finished residential work,
            builder-ready installs, and larger-project capability.
          </p>
        </div>
        <div className="project-grid two-up">
          {homepageProjects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
