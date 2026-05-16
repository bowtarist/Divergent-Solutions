const modules = [
  "Leads and CRM intake",
  "Jobs and scheduling",
  "Quotes and approvals",
  "Invoices and Stripe payments",
];

export default function AppHomePage() {
  return (
    <main className="shell">
      <section className="masthead">
        <div>
          <p className="eyebrow">Private Operations App</p>
          <h1>One calm control panel for the real work behind Brent Construction.</h1>
          <a className="primary-link" href="/leads">
            Open lead dashboard
          </a>
        </div>
        <div className="status">
          <span className="status-dot" />
          <span>Scaffolded for Supabase auth, storage, and Stripe integrations</span>
        </div>
      </section>

      <section className="panel overview">
        <div>
          <p className="eyebrow">Phase 1 Direction</p>
          <h2>Start simple, but don&apos;t paint the business into a corner.</h2>
          <p>
            This app will become the system of record for leads, customers, jobs, quotes,
            invoices, and payment visibility. Day one stays lightweight; the structure is
            what keeps future phases clean.
          </p>
        </div>
        <div className="stack">
          {modules.map((module) => (
            <div key={module} className="stack-card">
              {module}
            </div>
          ))}
        </div>
      </section>

      <section className="grid">
        <article className="panel">
          <p className="eyebrow">Login Path</p>
          <h3>Magic link authentication</h3>
          <p>
            Brent and his partner will use email sign-in first, which keeps the barrier low
            while still giving the app real access control from day one.
          </p>
        </article>
        <article className="panel">
          <p className="eyebrow">Payment Path</p>
          <h3>Stripe-hosted checkout first</h3>
          <p>
            The app can own invoices and payment status while Stripe handles the payment
            flow itself. That keeps phase one easier to launch and easier to trust.
          </p>
        </article>
      </section>
    </main>
  );
}
