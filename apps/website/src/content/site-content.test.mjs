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
