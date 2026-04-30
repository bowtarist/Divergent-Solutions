export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Public Website</p>
        <h1>Brent Construction deserves a site that feels established from day one.</h1>
        <p className="lede">
          This scaffold will become the marketing site for services, trust signals,
          project photos, and the quote request flow that feeds the private app.
        </p>
        <div className="actions">
          <a href="#launch-plan" className="button primary">
            View launch plan
          </a>
          <a href="#lead-flow" className="button secondary">
            Lead intake notes
          </a>
        </div>
      </section>

      <section className="grid" id="launch-plan">
        <article className="card accent">
          <h2>Launch goals</h2>
          <ul>
            <li>Introduce Brent Construction clearly</li>
            <li>Show service area and services</li>
            <li>Build trust with project visuals</li>
            <li>Capture quote requests with photo upload support</li>
          </ul>
        </article>
        <article className="card">
          <h2>First pages</h2>
          <ul>
            <li>Home</li>
            <li>Services</li>
            <li>About</li>
            <li>Gallery</li>
            <li>Contact</li>
            <li>Quote request</li>
          </ul>
        </article>
      </section>

      <section className="card full" id="lead-flow">
        <p className="eyebrow">Lead Flow</p>
        <h2>The website should not become a disconnected brochure.</h2>
        <p>
          Its job is to create high-confidence leads and send them into the private
          operations app as clean records with customer details, service notes, and up to
          three uploaded images.
        </p>
      </section>
    </main>
  );
}
