import assert from "node:assert/strict";
import { describe, it } from "node:test";
import site from "./site.json" with { type: "json" };

const projectImagePathPattern = /^\/images\/projects\//;

function assertNonEmptyString(value, fieldName) {
  assert.equal(typeof value, "string", `${fieldName} should be a string`);
  assert.notEqual(value.trim(), "", `${fieldName} should not be empty`);
}

describe("public website launch content", () => {
  it("keeps the hero content complete and backed by a project image", () => {
    assertNonEmptyString(site.hero.eyebrow, "hero.eyebrow");
    assertNonEmptyString(site.hero.headline, "hero.headline");
    assertNonEmptyString(site.hero.body, "hero.body");
    assertNonEmptyString(site.hero.primaryImage, "hero.primaryImage");
    assertNonEmptyString(site.hero.secondaryCta, "hero.secondaryCta");
    assert.match(site.hero.primaryImage, projectImagePathPattern);
  });

  it("keeps the approved CTA and callback promise", () => {
    assert.equal(site.primaryCta, "Request a Quote");
    assert.equal(site.quote.submitText, "Submit Quote Request");
    assert.match(site.quote.confirmationMessage, /within 1 business day/i);
  });

  it("keeps the approved public phone contact clickable", () => {
    assert.equal(site.contact.phoneDisplay, "(256) 212-0232");
    assert.equal(site.contact.phoneTel, "+12562120232");
    assert.match(site.contact.phoneTel, /^\+\d{11}$/);
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

  it("keeps proof points complete", () => {
    assert.equal(site.proof.length, 4);

    site.proof.forEach((proofPoint, index) => {
      assertNonEmptyString(proofPoint.value, `proof[${index}].value`);
      assertNonEmptyString(proofPoint.label, `proof[${index}].label`);
    });
  });

  it("keeps the process headline and four complete steps", () => {
    assertNonEmptyString(site.process.headline, "process.headline");
    assert.equal(site.process.steps.length, 4);

    site.process.steps.forEach((step, index) => {
      assertNonEmptyString(step.label, `process.steps[${index}].label`);
      assertNonEmptyString(step.body, `process.steps[${index}].body`);
    });
  });

  it("keeps every service complete and explicitly marked as primary or not", () => {
    site.services.forEach((service, index) => {
      assertNonEmptyString(service.title, `services[${index}].title`);
      assertNonEmptyString(service.body, `services[${index}].body`);
      assert.equal(typeof service.primary, "boolean", `services[${index}].primary should be boolean`);
    });
  });

  it("keeps every project complete and backed by a project image", () => {
    site.projects.forEach((project, index) => {
      assertNonEmptyString(project.title, `projects[${index}].title`);
      assertNonEmptyString(project.role, `projects[${index}].role`);
      assertNonEmptyString(project.image, `projects[${index}].image`);
      assertNonEmptyString(project.body, `projects[${index}].body`);
      assert.match(project.image, projectImagePathPattern);
    });
  });

  it("keeps warranty and about sections complete", () => {
    assertNonEmptyString(site.warranty.headline, "warranty.headline");
    assertNonEmptyString(site.warranty.body, "warranty.body");
    assertNonEmptyString(site.about.headline, "about.headline");
    assertNonEmptyString(site.about.body, "about.body");
  });

  it("keeps the approved quote form fields", () => {
    assert.deepEqual(site.quote.requiredFields, [
      "name",
      "phone",
      "email",
      "projectAddress",
      "city",
      "customerType",
      "projectType",
      "projectNotes"
    ]);
    assert.deepEqual(site.quote.optionalFields, ["bestTimeToCall", "propertyType", "timeline", "photos"]);
  });

  it("uses first name plus last initial for review attribution", () => {
    assert.deepEqual(
      site.reviews.map((review) => review.author),
      ["Brent W.", "Ashley J.", "Ashtin M."]
    );
  });
});
