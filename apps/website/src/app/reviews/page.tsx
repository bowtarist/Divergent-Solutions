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
