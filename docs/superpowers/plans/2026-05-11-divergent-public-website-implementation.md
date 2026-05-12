# Divergent Public Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Divergent Solutions public marketing website from the approved launch strategy and visual direction.

**Architecture:** The public website remains a standalone Next.js App Router app in `apps/website`. Page content is centralized in a JSON content file, visual structure is implemented with focused route components, and the quote form posts to a website API contract that can forward to the private app once a private lead endpoint exists.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS modules via global app CSS, Node built-in test runner for content/asset contract checks.

---

## Scope

This plan builds the public website experience:

- Home
- Services
- Gutter Installation
- Work / Photos
- Reviews
- About
- Request a Quote
- Quote request validation and forwarding contract

This plan does not build the private app lead-ingestion endpoint or database persistence. That should be a separate plan because `apps/app` currently has no lead API, database schema, or authentication boundary for web lead ingestion.

The quote API route in this plan should accept form data, validate it, and forward it only when `PRIVATE_APP_LEADS_ENDPOINT` and `PRIVATE_APP_LEADS_SECRET` are configured. Without those env vars, it should return a clear unavailable response so the site is not silently dropping leads.

## File Structure

Create:

- `apps/website/src/content/site.json`: single source of truth for launch copy, cities, services, reviews, photos, proof points, and process steps.
- `apps/website/src/content/site-content.test.mjs`: Node test that verifies required launch messaging.
- `apps/website/src/content/site-assets.test.mjs`: Node test that verifies referenced image assets exist in `apps/website/public`.
- `apps/website/public/images/brand/divergent-logo.jpg`: current logo asset copied from marketing assets.
- `apps/website/public/images/projects/scottsboro-new-construction-house.jpg`: hero image.
- `apps/website/public/images/projects/woodville-after.jpg`: supporting residential proof image.
- `apps/website/public/images/projects/stevenson-church-after.jpg`: supporting larger-project proof image.
- `apps/website/public/images/projects/house-1-after.jpg`: work/gallery image.
- `apps/website/public/images/projects/house-2-after.jpg`: work/gallery image.
- `apps/website/src/app/components/SiteHeader.tsx`: shared top navigation.
- `apps/website/src/app/components/SiteFooter.tsx`: shared footer and final CTA.
- `apps/website/src/app/components/ProofRow.tsx`: shared proof-stat row.
- `apps/website/src/app/components/ProjectCard.tsx`: reusable project photo card.
- `apps/website/src/app/components/QuoteRequestForm.tsx`: client-side form UI and submission state.
- `apps/website/src/app/api/quote-requests/route.ts`: website API route that validates quote request payloads and forwards to the private app endpoint when configured.
- `apps/website/src/app/services/page.tsx`: services page.
- `apps/website/src/app/gutter-installation/page.tsx`: primary offer page.
- `apps/website/src/app/work/page.tsx`: work/photos page.
- `apps/website/src/app/reviews/page.tsx`: reviews page.
- `apps/website/src/app/about/page.tsx`: about page.
- `apps/website/src/app/request-a-quote/page.tsx`: quote request page.
- `apps/website/.env.example`: documented environment variables for the quote forwarding contract.

Modify:

- `apps/website/package.json`: add `test` script.
- `apps/website/src/app/layout.tsx`: update metadata and keep font relationship.
- `apps/website/src/app/page.tsx`: replace scaffold with the approved homepage.
- `apps/website/src/app/globals.css`: replace scaffold CSS with the approved visual system and responsive layout.

## Task 1: Add Content Contract

**Files:**

- Modify: `apps/website/package.json`
- Create: `apps/website/src/content/site-content.test.mjs`
- Create: `apps/website/src/content/site.json`

- [ ] **Step 1: Add the test script**

Update `apps/website/package.json` so the scripts block is:

```json
{
  "dev": "node ../../node_modules/next/dist/bin/next dev",
  "build": "node ../../node_modules/next/dist/bin/next build",
  "start": "node ../../node_modules/next/dist/bin/next start",
  "lint": "node ../../node_modules/eslint/bin/eslint.js .",
  "test": "node --test src/content/*.test.mjs"
}
```

- [ ] **Step 2: Write the failing content test**

Create `apps/website/src/content/site-content.test.mjs`:

```js
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import site from "./site.json" with { type: "json" };

describe("public website launch content", () => {
  it("keeps the approved CTA and callback promise", () => {
    assert.equal(site.primaryCta, "Request a Quote");
    assert.equal(site.quote.submitText, "Submit Quote Request");
    assert.match(site.quote.confirmationMessage, /within 1 business day/i);
  });

  it("actively advertises every approved service city", () => {
    assert.deepEqual(site.serviceArea.cities, [
      "Scottsboro",
      "Huntsville",
      "Gadsden",
      "Fort Payne",
      "Winchester",
      "Trenton"
    ]);
  });

  it("keeps gutter installation as the first service", () => {
    assert.equal(site.services[0].title, "Gutter Installation");
    assert.equal(site.services[0].primary, true);
  });

  it("uses first name plus last initial for review attribution", () => {
    assert.deepEqual(
      site.reviews.map((review) => review.author),
      ["Brent W.", "Ashley J.", "Ashtin M."]
    );
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run:

```powershell
npm test -w apps/website
```

Expected: FAIL because `apps/website/src/content/site.json` does not exist yet.

- [ ] **Step 4: Add the launch content**

Create `apps/website/src/content/site.json`:

```json
{
  "brand": "Divergent Solutions",
  "domain": "www.divergentsolutionsllc.com",
  "primaryCta": "Request a Quote",
  "hero": {
    "eyebrow": "Licensed and insured gutter installation",
    "headline": "Built around a better install process.",
    "body": "Quality-first gutter installation for homeowners and builders, with clear quotes, dependable follow-through, and a callback within one business day.",
    "primaryImage": "/images/projects/scottsboro-new-construction-house.jpg",
    "secondaryCta": "See Our Work"
  },
  "serviceArea": {
    "intro": "Serving homeowners and builders across the regional service area.",
    "cities": ["Scottsboro", "Huntsville", "Gadsden", "Fort Payne", "Winchester", "Trenton"]
  },
  "proof": [
    { "value": "30", "label": "Years combined experience" },
    { "value": "2yr", "label": "Labor warranty" },
    { "value": "1", "label": "Business day callback" },
    { "value": "5.0", "label": "Google review rating" }
  ],
  "process": {
    "headline": "Measure carefully. Quote clearly. Install cleanly. Follow up.",
    "steps": [
      { "label": "01 Request", "body": "Send your project details and photos through the quote form." },
      { "label": "02 Call", "body": "We call within one business day to understand the project." },
      { "label": "03 Quote", "body": "Your quote is based on actual details, not rushed guesses." },
      { "label": "04 Install", "body": "We install with quality standards and follow up afterward." }
    ]
  },
  "services": [
    { "title": "Gutter Installation", "primary": true, "body": "Quality-first gutter installs for homeowners, builders, new construction, and exterior projects." },
    { "title": "Gutter Guards", "primary": false, "body": "Guard options that help reduce debris buildup and support long-term gutter performance." },
    { "title": "Gutter Repairs", "primary": false, "body": "Repair support for damaged, leaking, or poorly performing gutter sections." },
    { "title": "Fascia & Soffit", "primary": false, "body": "Exterior trim work that supports a clean, finished, durable gutter installation." },
    { "title": "Siding", "primary": false, "body": "Siding support for exterior projects where the gutter work connects to broader improvements." },
    { "title": "New Construction", "primary": false, "body": "Reliable gutter installation for builders and new home projects." },
    { "title": "Home Renovations", "primary": false, "body": "Exterior renovation support when the project needs more than gutter installation." }
  ],
  "reviews": [
    {
      "author": "Brent W.",
      "source": "Google Review",
      "quote": "I had my gutters replaced by Divergent Solutions. They did an amazing job. They were there when they said they would be and are very professional."
    },
    {
      "author": "Ashley J.",
      "source": "Google Review",
      "quote": "They showed up when they said they would, performed super quality work and were professional all the way around!"
    },
    {
      "author": "Ashtin M.",
      "source": "Google Review",
      "quote": "The owner was honest, easy to work with, and made sure everything was done right. The gutters look great and have held up beautifully."
    }
  ],
  "projects": [
    {
      "title": "Scottsboro new construction",
      "role": "Homepage hero",
      "image": "/images/projects/scottsboro-new-construction-house.jpg",
      "body": "Builder and new-construction credibility for the first impression."
    },
    {
      "title": "Woodville finished residential",
      "role": "Residential proof",
      "image": "/images/projects/woodville-after.jpg",
      "body": "Finished homeowner-facing quality and curb appeal."
    },
    {
      "title": "Stevenson Church",
      "role": "Larger-project proof",
      "image": "/images/projects/stevenson-church-after.jpg",
      "body": "Larger-project capability and broader installation credibility."
    },
    {
      "title": "House 1",
      "role": "Whole-home install",
      "image": "/images/projects/house-1-after.jpg",
      "body": "Whole-home gutter scope for a regional residential project."
    },
    {
      "title": "House 2",
      "role": "Gallery support",
      "image": "/images/projects/house-2-after.jpg",
      "body": "Additional before-and-after gallery support."
    }
  ],
  "warranty": {
    "headline": "2-year labor warranty",
    "body": "Our gutter installations include a 2-year labor warranty covering installation workmanship. The warranty does not cover outside damage such as roof leaks, mower damage, tree damage, storm damage, or other issues unrelated to the installation."
  },
  "about": {
    "headline": "Founded by Seth Talley and Brent Wilbanks.",
    "body": "Divergent Solutions brings a combined 30 years of construction industry experience to every project. Our emphasis is simple: quality work and customer service. If an issue ever comes up, we go above and beyond to make it right, and we follow up with our customers to make sure they remain completely satisfied."
  },
  "quote": {
    "submitText": "Submit Quote Request",
    "confirmationMessage": "Thanks. We received your request and will call you back within 1 business day.",
    "requiredFields": ["name", "phone", "email", "projectAddress", "city", "customerType", "projectType", "projectNotes"],
    "optionalFields": ["bestTimeToCall", "propertyType", "timeline", "photos"]
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run:

```powershell
npm test -w apps/website
```

Expected: PASS for `public website launch content`.

- [ ] **Step 6: Commit**

Run:

```powershell
git add apps/website/package.json apps/website/src/content/site-content.test.mjs apps/website/src/content/site.json
git commit -m "Add public website content contract"
```

## Task 2: Add Website Image Assets

**Files:**

- Create: `apps/website/public/images/brand/divergent-logo.jpg`
- Create: `apps/website/public/images/projects/scottsboro-new-construction-house.jpg`
- Create: `apps/website/public/images/projects/woodville-after.jpg`
- Create: `apps/website/public/images/projects/stevenson-church-after.jpg`
- Create: `apps/website/public/images/projects/house-1-after.jpg`
- Create: `apps/website/public/images/projects/house-2-after.jpg`
- Create: `apps/website/src/content/site-assets.test.mjs`

- [ ] **Step 1: Write the failing asset test**

Create `apps/website/src/content/site-assets.test.mjs`:

```js
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import site from "./site.json" with { type: "json" };

const publicDir = path.resolve(process.cwd(), "public");

function publicPathExists(publicPath) {
  return existsSync(path.join(publicDir, publicPath.replace(/^\//, "")));
}

describe("public website image assets", () => {
  it("has the logo asset", () => {
    assert.equal(publicPathExists("/images/brand/divergent-logo.jpg"), true);
  });

  it("has every image referenced by content", () => {
    const imagePaths = [
      site.hero.primaryImage,
      ...site.projects.map((project) => project.image)
    ];

    for (const imagePath of imagePaths) {
      assert.equal(publicPathExists(imagePath), true, `${imagePath} should exist`);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
npm test -w apps/website
```

Expected: FAIL because image files have not been copied into `apps/website/public`.

- [ ] **Step 3: Copy the approved assets into the website app**

Run:

```powershell
New-Item -ItemType Directory -Force -Path "apps/website/public/images/brand", "apps/website/public/images/projects"
Copy-Item -LiteralPath "marketing-assets/project-photos/raw/Logo/IMG_4244.JPG" -Destination "apps/website/public/images/brand/divergent-logo.jpg" -Force
Copy-Item -LiteralPath "marketing-assets/project-photos/raw/Scottsboro New Construction/House.jpeg" -Destination "apps/website/public/images/projects/scottsboro-new-construction-house.jpg" -Force
Copy-Item -LiteralPath "marketing-assets/project-photos/raw/Woodville House/Woodville After.jpeg" -Destination "apps/website/public/images/projects/woodville-after.jpg" -Force
Copy-Item -LiteralPath "marketing-assets/project-photos/raw/Stevenson Church/Left Side After.jpeg" -Destination "apps/website/public/images/projects/stevenson-church-after.jpg" -Force
Copy-Item -LiteralPath "marketing-assets/project-photos/raw/House 1/After.jpeg" -Destination "apps/website/public/images/projects/house-1-after.jpg" -Force
Copy-Item -LiteralPath "marketing-assets/project-photos/raw/House 2/House 2 After.jpeg" -Destination "apps/website/public/images/projects/house-2-after.jpg" -Force
```

- [ ] **Step 4: Run the asset test**

Run:

```powershell
npm test -w apps/website
```

Expected: PASS for both content and asset tests.

- [ ] **Step 5: Commit**

Run:

```powershell
git add apps/website/public/images apps/website/src/content/site-assets.test.mjs
git commit -m "Add public website image assets"
```

## Task 3: Update Site Metadata and Layout

**Files:**

- Modify: `apps/website/src/app/layout.tsx`

- [ ] **Step 1: Update metadata and font variables**

Replace `apps/website/src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Newsreader, Space_Grotesk } from "next/font/google";
import "./globals.css";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Divergent Solutions | Quality Gutter Installation",
  description:
    "Quality-first gutter installation for homeowners and builders across Scottsboro, Huntsville, Gadsden, Fort Payne, Winchester, and Trenton.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable}`}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Run lint and build**

Run:

```powershell
npm run lint:website
npm run build:website
```

Expected: both commands complete without errors.

- [ ] **Step 3: Commit**

Run:

```powershell
git add apps/website/src/app/layout.tsx
git commit -m "Update public website metadata"
```

## Task 4: Add Shared Marketing Components

**Files:**

- Create: `apps/website/src/app/components/SiteHeader.tsx`
- Create: `apps/website/src/app/components/SiteFooter.tsx`
- Create: `apps/website/src/app/components/ProofRow.tsx`
- Create: `apps/website/src/app/components/ProjectCard.tsx`

- [ ] **Step 1: Create the shared header**

Create `apps/website/src/app/components/SiteHeader.tsx`:

```tsx
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
      <Link className="nav-cta" href="/request-a-quote">
        {site.primaryCta}
      </Link>
    </header>
  );
}
```

- [ ] **Step 2: Create the shared footer**

Create `apps/website/src/app/components/SiteFooter.tsx`:

```tsx
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
```

- [ ] **Step 3: Create the proof row**

Create `apps/website/src/app/components/ProofRow.tsx`:

```tsx
import site from "@/content/site.json";

export function ProofRow() {
  return (
    <section className="proof-row" aria-label="Divergent Solutions trust signals">
      {site.proof.map((item) => (
        <div className="proof-item" key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </section>
  );
}
```

- [ ] **Step 4: Create the project card**

Create `apps/website/src/app/components/ProjectCard.tsx`:

```tsx
type ProjectCardProps = {
  image: string;
  role: string;
  title: string;
  body: string;
};

export function ProjectCard({ image, role, title, body }: ProjectCardProps) {
  return (
    <article className="project-card">
      <img src={image} alt={`${title} project photo`} />
      <div className="project-card-body">
        <p className="section-kicker">{role}</p>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </article>
  );
}
```

- [ ] **Step 5: Run verification**

Run:

```powershell
npm test -w apps/website
npm run lint:website
npm run build:website
```

Expected: all commands complete without errors.

- [ ] **Step 6: Commit**

Run:

```powershell
git add apps/website/src/app/components
git commit -m "Add public website shared components"
```

## Task 5: Implement the Homepage

**Files:**

- Modify: `apps/website/src/app/page.tsx`

- [ ] **Step 1: Replace the scaffold homepage**

Replace `apps/website/src/app/page.tsx` with:

```tsx
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
```

- [ ] **Step 2: Run verification**

Run:

```powershell
npm test -w apps/website
npm run lint:website
npm run build:website
```

Expected: all commands complete without errors.

- [ ] **Step 3: Commit**

Run:

```powershell
git add apps/website/src/app/page.tsx
git commit -m "Build public website homepage"
```

## Task 6: Add Global Visual System

**Files:**

- Modify: `apps/website/src/app/globals.css`

- [ ] **Step 1: Replace the scaffold CSS**

Replace `apps/website/src/app/globals.css` with CSS that defines:

```css
:root {
  --cream: #f7f5ed;
  --cream-2: #fffdf7;
  --green: #243a30;
  --green-soft: #dfe7dc;
  --ink: #1c1f1b;
  --muted: #646b61;
  --red: #a92a2a;
  --gold: #c59b46;
  --line: rgba(28, 31, 27, 0.15);
  --shadow: 0 24px 70px rgba(30, 32, 27, 0.15);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  color: var(--ink);
  background: linear-gradient(180deg, #fbfaf5 0%, var(--cream) 100%);
  font-family: var(--font-sans), sans-serif;
}

img {
  display: block;
  max-width: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}

h1,
h2,
h3 {
  font-family: var(--font-serif), serif;
  letter-spacing: 0;
}

.site-header,
.site-footer,
.hero,
.proof-row,
.process-band,
.section-block,
.page-shell {
  width: min(1180px, calc(100% - 2rem));
  margin-inline: auto;
}
```

Continue the same file with classes used by the components:

```css
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.125rem;
  padding: 1.125rem 0;
}

.brand-link img {
  width: 150px;
  height: 48px;
  object-fit: contain;
  mix-blend-mode: multiply;
}

.site-nav {
  display: flex;
  gap: 1.125rem;
  color: #42483f;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nav-cta,
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0.875rem 1.0625rem;
  border: 1px solid var(--line);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nav-cta,
.button.primary {
  color: #fff;
  border-color: var(--red);
  background: var(--red);
}

.button.secondary {
  color: var(--green);
  background: transparent;
}

.hero {
  display: grid;
  grid-template-columns: 0.94fr 1.06fr;
  overflow: hidden;
  border: 1px solid var(--line);
  background: var(--cream-2);
  box-shadow: var(--shadow);
}

.hero-copy {
  display: grid;
  align-content: center;
  padding: 3rem;
  background: linear-gradient(135deg, rgba(223, 231, 220, 0.5), transparent 45%), #fbfaf5;
}

.label,
.section-kicker,
.area-title {
  color: var(--red);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.label {
  width: fit-content;
  margin: 0 0 1.125rem;
  padding: 0.5625rem 0.6875rem;
  color: var(--green);
  background: var(--green-soft);
}

.hero h1 {
  max-width: 9ch;
  margin: 0;
  color: var(--green);
  font-size: clamp(3.25rem, 7vw, 5.625rem);
  line-height: 0.9;
}

.hero-copy > p:not(.label) {
  max-width: 32rem;
  margin: 1.375rem 0 0;
  color: #4c534a;
  font-size: 1.125rem;
  line-height: 1.55;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.service-area {
  margin-top: 1.875rem;
}

.cities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.city {
  padding: 0.5rem 0.625rem;
  border: 1px solid rgba(36, 58, 48, 0.2);
  color: var(--green);
  background: rgba(255, 255, 255, 0.62);
  font-size: 0.8125rem;
  font-weight: 900;
}

.hero-photo {
  position: relative;
  min-height: 620px;
}

.hero-photo > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.review-overlay {
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;
  left: 1.5rem;
  max-width: 32rem;
  margin: 0;
  padding: 1.25rem;
  color: #fffaf0;
  background: rgba(36, 58, 48, 0.88);
  backdrop-filter: blur(8px);
}

.review-overlay blockquote {
  margin: 0;
  font-family: var(--font-serif), serif;
  font-size: 1.375rem;
  line-height: 1.32;
}

.review-overlay figcaption {
  margin-top: 0.625rem;
  color: rgba(255, 250, 240, 0.76);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

Add the remaining responsive and section classes:

```css
.proof-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid var(--line);
  border-top: 0;
  background: #fffdf7;
}

.proof-item {
  padding: 1.375rem 1.5rem;
  border-right: 1px solid var(--line);
}

.proof-item:last-child {
  border-right: 0;
}

.proof-item strong {
  display: block;
  color: var(--green);
  font-family: var(--font-serif), serif;
  font-size: 1.75rem;
}

.proof-item span {
  display: block;
  margin-top: 0.5rem;
  color: var(--muted);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.process-band {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 2.25rem;
  padding: 2.625rem 3rem;
  color: #fffaf0;
  background: var(--green);
}

.process-band h2 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.625rem);
  line-height: 1;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.process-step {
  border-left: 1px solid rgba(255, 250, 240, 0.26);
  padding-left: 0.875rem;
}

.process-step strong {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--gold);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.process-step p,
.site-footer p,
.section-head p,
.project-card p,
.page-copy p,
.page-copy li {
  color: var(--muted);
  line-height: 1.55;
}

.process-step p {
  margin: 0;
  color: rgba(255, 250, 240, 0.82);
  font-size: 0.875rem;
}

.section-block,
.page-shell {
  padding: 3rem;
  border: 1px solid var(--line);
  border-top: 0;
  background: #fbfaf5;
}

.section-head {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.375rem;
}

.section-head h2,
.site-footer h2,
.page-shell h1 {
  margin: 0;
  color: var(--green);
  font-size: clamp(2.25rem, 4vw, 3.25rem);
  line-height: 1;
}

.project-grid {
  display: grid;
  gap: 1.125rem;
}

.project-grid.two-up {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.project-card {
  overflow: hidden;
  border: 1px solid var(--line);
  background: white;
}

.project-card img {
  width: 100%;
  height: 310px;
  object-fit: cover;
}

.project-card-body {
  padding: 1rem;
}

.project-card h3 {
  margin: 0 0 0.375rem;
  font-size: 1.5rem;
}

.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 3rem;
  padding: 2.125rem 3rem;
  border: 1px solid var(--line);
  border-top: 0;
  background: #fffdf7;
}

@media (max-width: 980px) {
  .site-nav {
    display: none;
  }

  .hero,
  .process-band,
  .section-head,
  .site-footer {
    grid-template-columns: 1fr;
    display: grid;
  }

  .proof-row,
  .process-steps,
  .project-grid.two-up {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .site-header,
  .site-footer,
  .hero,
  .proof-row,
  .process-band,
  .section-block,
  .page-shell {
    width: min(100% - 1rem, 1180px);
  }

  .brand-link img {
    width: 126px;
  }

  .hero-copy,
  .process-band,
  .section-block,
  .page-shell,
  .site-footer {
    padding: 1.5rem;
  }

  .hero h1 {
    font-size: 3.375rem;
  }

  .hero-photo {
    min-height: 420px;
  }

  .proof-row,
  .process-steps,
  .project-grid.two-up {
    grid-template-columns: 1fr;
  }

  .proof-item {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
}
```

- [ ] **Step 2: Run verification**

Run:

```powershell
npm test -w apps/website
npm run lint:website
npm run build:website
```

Expected: all commands complete without errors.

- [ ] **Step 3: Commit**

Run:

```powershell
git add apps/website/src/app/globals.css
git commit -m "Add public website visual system"
```

## Task 7: Add Supporting Pages

**Files:**

- Create: `apps/website/src/app/services/page.tsx`
- Create: `apps/website/src/app/gutter-installation/page.tsx`
- Create: `apps/website/src/app/work/page.tsx`
- Create: `apps/website/src/app/reviews/page.tsx`
- Create: `apps/website/src/app/about/page.tsx`

- [ ] **Step 1: Add Services page**

Create `apps/website/src/app/services/page.tsx`:

```tsx
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
```

- [ ] **Step 2: Add Gutter Installation page**

Create `apps/website/src/app/gutter-installation/page.tsx`:

```tsx
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
```

- [ ] **Step 3: Add Work page**

Create `apps/website/src/app/work/page.tsx`:

```tsx
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
```

- [ ] **Step 4: Add Reviews page**

Create `apps/website/src/app/reviews/page.tsx`:

```tsx
import site from "@/content/site.json";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export default function ReviewsPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-shell">
        <p className="section-kicker">Google Reviews</p>
        <h1>Customers mention the things that matter: showing up, quality work, and professionalism.</h1>
      </section>
      <section className="section-block review-grid">
        {site.reviews.map((review) => (
          <figure className="review-card" key={review.author}>
            <blockquote>{review.quote}</blockquote>
            <figcaption>
              {review.author}, {review.source}
            </figcaption>
          </figure>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
```

- [ ] **Step 5: Add About page**

Create `apps/website/src/app/about/page.tsx`:

```tsx
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
```

- [ ] **Step 6: Add CSS for supporting page patterns**

Append to `apps/website/src/app/globals.css`:

```css
.service-list,
.review-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.service-item,
.review-card {
  margin: 0;
  padding: 1.25rem;
  border: 1px solid var(--line);
  background: #fff;
}

.primary-service {
  border-color: rgba(169, 42, 42, 0.38);
  background: rgba(223, 231, 220, 0.36);
}

.service-item h2,
.page-copy h2 {
  margin: 0 0 0.625rem;
  color: var(--green);
  font-size: 1.75rem;
  line-height: 1.05;
}

.review-card blockquote {
  margin: 0;
  font-family: var(--font-serif), serif;
  font-size: 1.45rem;
  line-height: 1.35;
}

.review-card figcaption {
  margin-top: 1rem;
  color: var(--muted);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 780px) {
  .service-list,
  .review-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 7: Run verification**

Run:

```powershell
npm test -w apps/website
npm run lint:website
npm run build:website
```

Expected: all commands complete without errors.

- [ ] **Step 8: Commit**

Run:

```powershell
git add apps/website/src/app/services apps/website/src/app/gutter-installation apps/website/src/app/work apps/website/src/app/reviews apps/website/src/app/about apps/website/src/app/globals.css
git commit -m "Add public website supporting pages"
```

## Task 8: Add Quote Request Form and API Contract

**Files:**

- Create: `apps/website/src/app/components/QuoteRequestForm.tsx`
- Create: `apps/website/src/app/request-a-quote/page.tsx`
- Create: `apps/website/src/app/api/quote-requests/route.ts`
- Create: `apps/website/.env.example`
- Modify: `apps/website/src/app/globals.css`

- [ ] **Step 1: Create environment example**

Create `apps/website/.env.example`:

```dotenv
NEXT_PUBLIC_SITE_URL=https://www.divergentsolutionsllc.com
PRIVATE_APP_LEADS_ENDPOINT=
PRIVATE_APP_LEADS_SECRET=
```

- [ ] **Step 2: Create the API route**

Create `apps/website/src/app/api/quote-requests/route.ts`:

```ts
import { NextResponse } from "next/server";

const requiredFields = [
  "name",
  "phone",
  "email",
  "projectAddress",
  "city",
  "customerType",
  "projectType",
  "projectNotes",
] as const;

type RequiredField = (typeof requiredFields)[number];

type QuoteRequestPayload = Record<RequiredField, string> & {
  bestTimeToCall?: string;
  propertyType?: string;
  timeline?: string;
  photoNames?: string[];
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validatePayload(input: unknown): { payload?: QuoteRequestPayload; errors: string[] } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { errors: ["Request body must be an object."] };
  }

  const body = input as Record<string, unknown>;
  const errors = requiredFields
    .filter((field) => !isNonEmptyString(body[field]))
    .map((field) => `${field} is required.`);

  if (errors.length > 0) {
    return { errors };
  }

  return {
    errors: [],
    payload: {
      name: String(body.name).trim(),
      phone: String(body.phone).trim(),
      email: String(body.email).trim(),
      projectAddress: String(body.projectAddress).trim(),
      city: String(body.city).trim(),
      customerType: String(body.customerType).trim(),
      projectType: String(body.projectType).trim(),
      projectNotes: String(body.projectNotes).trim(),
      bestTimeToCall: isNonEmptyString(body.bestTimeToCall) ? body.bestTimeToCall.trim() : undefined,
      propertyType: isNonEmptyString(body.propertyType) ? body.propertyType.trim() : undefined,
      timeline: isNonEmptyString(body.timeline) ? body.timeline.trim() : undefined,
      photoNames: Array.isArray(body.photoNames) ? body.photoNames.map(String) : [],
    },
  };
}

export async function POST(request: Request) {
  const parsed = validatePayload(await request.json().catch(() => null));

  if (parsed.errors.length > 0 || !parsed.payload) {
    return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 400 });
  }

  const endpoint = process.env.PRIVATE_APP_LEADS_ENDPOINT;
  const secret = process.env.PRIVATE_APP_LEADS_SECRET;

  if (!endpoint || !secret) {
    return NextResponse.json(
      {
        ok: false,
        error: "Lead forwarding is not configured.",
      },
      { status: 503 }
    );
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({
      source: "Website",
      status: "New Web Lead",
      callReminder: "Call new website lead",
      submittedAt: new Date().toISOString(),
      ...parsed.payload,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, error: "Lead forwarding failed." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Create the client form**

Create `apps/website/src/app/components/QuoteRequestForm.tsx`:

```tsx
"use client";

import { FormEvent, useState } from "react";
import site from "@/content/site.json";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function QuoteRequestForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      projectAddress: String(formData.get("projectAddress") ?? ""),
      city: String(formData.get("city") ?? ""),
      customerType: String(formData.get("customerType") ?? ""),
      projectType: String(formData.get("projectType") ?? ""),
      propertyType: String(formData.get("propertyType") ?? ""),
      timeline: String(formData.get("timeline") ?? ""),
      bestTimeToCall: String(formData.get("bestTimeToCall") ?? ""),
      projectNotes: String(formData.get("projectNotes") ?? ""),
      photoNames: formData.getAll("photos").map((file) => file instanceof File ? file.name : String(file)),
    };

    const response = await fetch("/api/quote-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setState("success");
      setMessage(site.quote.confirmationMessage);
      event.currentTarget.reset();
      return;
    }

    setState("error");
    setMessage(
      response.status === 503
        ? "The quote form is not connected yet. Please call Divergent Solutions directly while we finish lead intake setup."
        : "Please check the required fields and try again."
    );
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Name
          <input name="name" required />
        </label>
        <label>
          Phone
          <input name="phone" required />
        </label>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Project address
          <input name="projectAddress" required />
        </label>
        <label>
          City / service area
          <select name="city" required defaultValue="">
            <option value="" disabled>Select a city</option>
            {site.serviceArea.cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </label>
        <label>
          Customer type
          <select name="customerType" required defaultValue="">
            <option value="" disabled>Select one</option>
            <option>Homeowner</option>
            <option>Builder / GC</option>
            <option>Property manager</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          Project type
          <select name="projectType" required defaultValue="">
            <option value="" disabled>Select one</option>
            {site.services.map((service) => (
              <option key={service.title}>{service.title}</option>
            ))}
            <option>Other</option>
          </select>
        </label>
        <label>
          Property type
          <select name="propertyType" defaultValue="">
            <option value="">Select one</option>
            <option>Existing home</option>
            <option>New construction</option>
            <option>Commercial / light commercial</option>
          </select>
        </label>
        <label>
          Timeline
          <select name="timeline" defaultValue="">
            <option value="">Select one</option>
            <option>ASAP</option>
            <option>Within 30 days</option>
            <option>1-3 months</option>
            <option>Planning ahead</option>
          </select>
        </label>
        <label>
          Best time to call
          <input name="bestTimeToCall" />
        </label>
      </div>
      <label>
        Project notes
        <textarea name="projectNotes" required rows={5} />
      </label>
      <label>
        Photos
        <input name="photos" type="file" multiple accept="image/*" />
        <span className="field-help">Photos help us understand the project before we call.</span>
      </label>
      <button className="button primary" type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Submitting..." : site.quote.submitText}
      </button>
      {message ? <p className={`form-message ${state}`}>{message}</p> : null}
    </form>
  );
}
```

- [ ] **Step 4: Add the quote page**

Create `apps/website/src/app/request-a-quote/page.tsx`:

```tsx
import site from "@/content/site.json";
import { QuoteRequestForm } from "../components/QuoteRequestForm";
import { SiteHeader } from "../components/SiteHeader";

export default function RequestQuotePage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-shell page-copy">
        <p className="section-kicker">Request a Quote</p>
        <h1>Send your project details and we will call you back within one business day.</h1>
        <p>
          Include the address, project type, notes, and photos if you have them.
          Photos help us understand the project before we call.
        </p>
        <QuoteRequestForm />
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Add form CSS**

Append to `apps/website/src/app/globals.css`:

```css
.quote-form {
  display: grid;
  gap: 1rem;
  margin-top: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.quote-form label {
  display: grid;
  gap: 0.45rem;
  color: var(--green);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.quote-form input,
.quote-form select,
.quote-form textarea {
  width: 100%;
  min-height: 46px;
  border: 1px solid var(--line);
  border-radius: 0;
  padding: 0.75rem;
  color: var(--ink);
  background: #fff;
  font: inherit;
  letter-spacing: 0;
}

.quote-form textarea {
  resize: vertical;
}

.field-help {
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
}

.form-message {
  margin: 0;
  padding: 1rem;
  border: 1px solid var(--line);
  background: #fff;
}

.form-message.success {
  border-color: rgba(36, 58, 48, 0.28);
  color: var(--green);
  background: rgba(223, 231, 220, 0.45);
}

.form-message.error {
  border-color: rgba(169, 42, 42, 0.35);
  color: var(--red);
  background: rgba(169, 42, 42, 0.08);
}

@media (max-width: 760px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 6: Run verification**

Run:

```powershell
npm test -w apps/website
npm run lint:website
npm run build:website
```

Expected: all commands complete without errors.

- [ ] **Step 7: Commit**

Run:

```powershell
git add apps/website/.env.example apps/website/src/app/components/QuoteRequestForm.tsx apps/website/src/app/request-a-quote apps/website/src/app/api/quote-requests apps/website/src/app/globals.css
git commit -m "Add public quote request flow"
```

## Task 9: Final Browser Verification

**Files:**

- No file changes expected unless verification finds a bug.

- [ ] **Step 1: Start the website dev server**

Run:

```powershell
npm run dev:website
```

Expected: Next.js starts and prints a local URL, usually `http://localhost:3000`.

- [ ] **Step 2: Verify core pages in the browser**

Open these paths:

```text
/
/services
/gutter-installation
/work
/reviews
/about
/request-a-quote
```

Expected:

- Header logo is visible.
- `Request a Quote` appears in the header.
- Homepage uses Scottsboro new construction as the hero photo.
- City chips show Scottsboro, Huntsville, Gadsden, Fort Payne, Winchester, and Trenton.
- Woodville and Stevenson Church appear lower on the homepage.
- Mobile width does not hide the service-area message.
- Text does not overlap photos or buttons.

- [ ] **Step 3: Verify quote form unavailable state**

Without `PRIVATE_APP_LEADS_ENDPOINT` and `PRIVATE_APP_LEADS_SECRET`, submit a valid quote form.

Expected: the form displays:

```text
The quote form is not connected yet. Please call Divergent Solutions directly while we finish lead intake setup.
```

This confirms the website does not silently discard leads before private app lead ingestion exists.

- [ ] **Step 4: Stop the dev server**

Press `Ctrl+C` in the terminal running `npm run dev:website`.

- [ ] **Step 5: Run final verification**

Run:

```powershell
npm test -w apps/website
npm run lint:website
npm run build:website
```

Expected: all commands complete without errors.

- [ ] **Step 6: Commit verification fixes if any**

If any files changed during verification, run:

```powershell
git status --short
git add <changed-files>
git commit -m "Polish public website launch build"
```

Only commit files changed for public website verification. Do not stage unrelated app/pricing work.

## Follow-Up Plan Required

Create a separate plan for private app lead ingestion. That plan should cover:

- Lead data model
- Private app API route
- Auth/shared secret validation
- Call reminder creation
- Owner/team notification
- File upload/storage strategy for photos
- Website API route happy-path test against the private app endpoint

The public website should not be deployed as a lead-generation site until that follow-up plan is implemented or an alternate real notification path is approved.
