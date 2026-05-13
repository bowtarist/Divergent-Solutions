import Link from "next/link";
import site from "@/content/site.json";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export default function ServicesPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-shell page-copy">
        <p className="section-kicker">Services</p>
        <h1>Gutter installs first, with broader exterior capability when the project needs it.</h1>
        <p>{site.serviceArea.intro}</p>
        <div className="service-list">
          {site.services.map((service) => (
            <article className={service.primary ? "service-item primary-service" : "service-item"} key={service.title}>
              <h2>{service.title}</h2>
              <p>{service.body}</p>
              {service.primary ? (
                <Link className="button primary" href="/gutter-installation">
                  View Gutter Installation
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
