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
          Include the address, project type, notes, and photos if you have them. Photos help us
          understand the project before we call.
        </p>
        <QuoteRequestForm />
      </section>
    </main>
  );
}
