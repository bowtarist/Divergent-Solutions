import Link from "next/link";
import site from "@/content/site.json";
import { ProofRow } from "../components/ProofRow";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export default function GutterInstallationPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-shell page-copy">
        <p className="section-kicker">Gutter Installation</p>
        <h1>Quality-first gutter installation based on the real project, not rushed guesses.</h1>
        <p>
          Pricing depends on measurements, material choices, home layout, access, downspout needs,
          and overall project scope. The quote process is part of doing the job correctly.
        </p>
        <div className="actions">
          <Link className="button primary" href="/request-a-quote">
            {site.primaryCta}
          </Link>
          <Link className="button secondary" href="/work">
            See Our Work
          </Link>
        </div>
      </section>
      <ProofRow />
      <section className="section-block page-copy">
        <h2>{site.process.headline}</h2>
        <ul>
          {site.process.steps.map((step) => (
            <li key={step.label}>
              <strong>{step.label}:</strong> {step.body}
            </li>
          ))}
        </ul>
        <h2>{site.warranty.headline}</h2>
        <p>{site.warranty.body}</p>
      </section>
      <SiteFooter />
    </main>
  );
}
