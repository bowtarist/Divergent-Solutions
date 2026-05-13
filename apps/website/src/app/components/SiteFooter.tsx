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
      <Link className="button primary" href="/request-a-quote">
        {site.primaryCta}
      </Link>
    </footer>
  );
}
