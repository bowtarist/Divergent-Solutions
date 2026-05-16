import Link from "next/link";
import site from "@/content/site.json";

const navItems = [
  { href: "/services", label: "Services" },
  { href: "/gutter-installation", label: "Gutter Installation" },
  { href: "/work", label: "Work" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand-link" aria-label="Divergent Solutions home">
        <img src="/images/brand/divergent-logo.jpg" alt="Divergent Solutions" />
      </Link>
      <nav className="site-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <a className="phone-link nav-phone" href={`tel:${site.contact.phoneTel}`}>
          Call {site.contact.phoneDisplay}
        </a>
        <Link className="nav-cta" href="/request-a-quote">
          {site.primaryCta}
        </Link>
      </div>
    </header>
  );
}
