import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateNextBusinessDayCallDueAt,
  mapWebsiteLeadToInsert,
  validateWebsiteLeadPayload,
} from "./lead-intake";

const validPayload = {
  source: "Website",
  status: "New Web Lead",
  callReminder: "Call new website lead",
  submittedAt: "2026-05-13T18:00:00.000Z",
  name: "Brent Wilbanks",
  phone: "(256) 212-0232",
  email: "brent@example.com",
  projectAddress: "123 Main Street",
  city: "Scottsboro, Alabama",
  customerType: "Homeowner",
  projectType: "Gutter installs",
  propertyType: "New construction",
  timeline: "Within 30 days",
  bestTimeToCall: "Weekday afternoons",
  projectNotes: "Need gutters on a new construction home.",
  photoNames: ["front-before.jpg", "left-side.png"],
};

test("maps a website quote request into a raw lead insert", () => {
  const parsed = validateWebsiteLeadPayload(validPayload);

  assert.equal(parsed.ok, true);

  if (!parsed.ok) {
    throw new Error("Expected payload to be valid");
  }

  const insert = mapWebsiteLeadToInsert(
    parsed.payload,
    new Date("2026-05-13T16:00:00.000-05:00")
  );

  assert.equal(insert.source, "website");
  assert.equal(insert.status, "new");
  assert.equal(insert.call_status, "open");
  assert.equal(insert.name, "Brent Wilbanks");
  assert.equal(insert.contact_name, "Brent Wilbanks");
  assert.equal(insert.first_name, "Brent");
  assert.equal(insert.last_name, "Wilbanks");
  assert.equal(insert.phone, "(256) 212-0232");
  assert.equal(insert.email, "brent@example.com");
  assert.equal(insert.project_type, "Gutter installs");
  assert.equal(insert.project_description, "Need gutters on a new construction home.");
  assert.equal(insert.initial_service_address_text, "123 Main Street, Scottsboro, Alabama");
  assert.equal(insert.service_city, "Scottsboro, Alabama");
  assert.equal(insert.customer_type, "Homeowner");
  assert.equal(insert.property_type, "New construction");
  assert.equal(insert.preferred_timing, "Within 30 days; Best time to call: Weekday afternoons");
  assert.equal(insert.submitted_at, "2026-05-13T18:00:00.000Z");
  assert.deepEqual(insert.metadata.photoNames, ["front-before.jpg", "left-side.png"]);
  assert.equal(insert.metadata.websiteStatus, "New Web Lead");
  assert.equal(insert.metadata.websiteCallReminder, "Call new website lead");
});

test("preserves single-word contact names without inventing a last name", () => {
  const parsed = validateWebsiteLeadPayload({ ...validPayload, name: "Ashley" });

  assert.equal(parsed.ok, true);

  if (!parsed.ok) {
    throw new Error("Expected payload to be valid");
  }

  const insert = mapWebsiteLeadToInsert(parsed.payload, new Date("2026-05-13T16:00:00.000-05:00"));

  assert.equal(insert.name, "Ashley");
  assert.equal(insert.contact_name, "Ashley");
  assert.equal(insert.first_name, "Ashley");
  assert.equal(insert.last_name, null);
});

test("sets Saturday website leads due Monday at 5 PM Central", () => {
  const dueAt = calculateNextBusinessDayCallDueAt(new Date("2026-05-16T10:30:00.000-05:00"));

  assert.equal(dueAt, "2026-05-18T22:00:00.000Z");
});

test("sets Sunday website leads due Monday at 5 PM Central", () => {
  const dueAt = calculateNextBusinessDayCallDueAt(new Date("2026-05-17T10:30:00.000-05:00"));

  assert.equal(dueAt, "2026-05-18T22:00:00.000Z");
});

test("rejects missing required fields and malformed photo names", () => {
  const parsed = validateWebsiteLeadPayload({
    ...validPayload,
    phone: "",
    email: "not-an-email",
    photoNames: ["good.jpg", 123],
  });

  assert.equal(parsed.ok, false);

  if (parsed.ok) {
    throw new Error("Expected payload to be invalid");
  }

  assert.deepEqual(parsed.errors, [
    "phone is required.",
    "email must be a valid email address.",
    "photoNames items must be strings.",
  ]);
});
