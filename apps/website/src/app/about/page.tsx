import site from "@/content/site.json";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-shell page-copy">
        <p className="section-kicker">About Divergent Solutions</p>
        <h1>{site.about.headline}</h1>
        <p>{site.about.body}</p>
      </section>
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
      <SiteFooter />
    </main>
  );
}
