import Link from "next/link";
import site from "@/content/site.json";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="section-kicker">Divergent Solutions</p>
        <h2>Ready to talk through your gutter project?</h2>
        <p>Send the details and photos. Divergent Solutions will call back within one business day.</p>
      </div>
      <div className="footer-actions">
        <a className="phone-link footer-phone" href={`tel:${site.contact.phoneTel}`}>
          Call {site.contact.phoneDisplay}
        </a>
        <Link className="button primary" href="/request-a-quote">
          {site.primaryCta}
        </Link>
      </div>
    </footer>
  );
}
