import assert from "node:assert/strict";
import test from "node:test";
import { normalizeLeadRecord } from "./lead-dashboard";

test("normalizes a Supabase lead row into dashboard display fields", () => {
  const lead = normalizeLeadRecord(
    {
      id: "lead-123",
      status: "new",
      call_status: "open",
      source: "website",
      name: "Brent Wilbanks",
      contact_name: "Brent Wilbanks",
      phone: "(256) 212-0232",
      email: "brent@example.com",
      project_type: "Gutter installs",
      project_description: "Need gutters on the new build.",
      preferred_timing: "Within 30 days; Best time to call: Morning",
      initial_service_address_text: "123 Main Street, Scottsboro, Alabama",
      service_city: "Scottsboro, Alabama",
      customer_type: "Homeowner",
      property_type: "New construction",
      submitted_at: "2026-05-15T14:30:00.000Z",
      call_reminder_due_at: "2026-05-15T22:00:00.000Z",
      metadata: {
        photoNames: ["front-before.jpg", "front-after.jpg"],
        internalNotes: [{ text: "Left voicemail", createdAt: "2026-05-15T18:10:00.000Z" }],
      },
    },
    new Date("2026-05-15T23:00:00.000Z")
  );

  assert.equal(lead.id, "lead-123");
  assert.equal(lead.status, "new");
  assert.equal(lead.name, "Brent Wilbanks");
  assert.equal(lead.phoneHref, "tel:+12562120232");
  assert.equal(lead.emailHref, "mailto:brent@example.com");
  assert.equal(lead.statusLabel, "New");
  assert.equal(lead.callStatusLabel, "Open");
  assert.equal(lead.isCallDue, true);
  assert.equal(lead.photoNames.length, 2);
  assert.equal(lead.internalNotes.length, 1);
  assert.equal(lead.internalNotes[0]?.text, "Left voicemail");
});

test("uses safe fallbacks for incomplete lead rows", () => {
  const lead = normalizeLeadRecord(
    {
      id: "lead-456",
      status: null,
      call_status: null,
      source: null,
      name: null,
      contact_name: null,
      phone: null,
      email: null,
      project_type: null,
      project_description: null,
      preferred_timing: null,
      initial_service_address_text: null,
      service_city: null,
      customer_type: null,
      property_type: null,
      submitted_at: null,
      call_reminder_due_at: null,
      metadata: null,
    },
    new Date("2026-05-15T23:00:00.000Z")
  );

  assert.equal(lead.name, "Unnamed lead");
  assert.equal(lead.phoneHref, null);
  assert.equal(lead.emailHref, null);
  assert.equal(lead.statusLabel, "Unknown");
  assert.equal(lead.submittedAtLabel, "Not recorded");
  assert.equal(lead.isCallDue, false);
});
