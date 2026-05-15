import assert from "node:assert/strict";
import test from "node:test";
import { LeadIntakeStorageError } from "../../../lib/supabase-server";
import type { LeadInsert } from "../../../lib/lead-intake";
import { handleWebsiteLeadRequest } from "./route";

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
  photoNames: ["front-before.jpg"],
};

function requestFor(body: unknown, token?: string) {
  return new Request("https://app.divergentsolutionsllc.com/api/website-leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

test("rejects website lead requests without a bearer token", async () => {
  let insertCalled = false;
  const response = await handleWebsiteLeadRequest(requestFor(validPayload), {
    env: { PRIVATE_APP_LEADS_SECRET: "secret" },
    insertLead: async () => {
      insertCalled = true;
      return { id: "should-not-insert" };
    },
  });

  assert.equal(response.status, 401);
  assert.equal(insertCalled, false);
  assert.deepEqual(await response.json(), { ok: false, error: "Missing bearer token." });
});

test("rejects website lead requests with the wrong bearer token", async () => {
  let insertCalled = false;
  const response = await handleWebsiteLeadRequest(requestFor(validPayload, "wrong"), {
    env: { PRIVATE_APP_LEADS_SECRET: "secret" },
    insertLead: async () => {
      insertCalled = true;
      return { id: "should-not-insert" };
    },
  });

  assert.equal(response.status, 403);
  assert.equal(insertCalled, false);
  assert.deepEqual(await response.json(), { ok: false, error: "Invalid bearer token." });
});

test("rejects invalid website lead payloads", async () => {
  const response = await handleWebsiteLeadRequest(requestFor({ ...validPayload, email: "" }, "secret"), {
    env: { PRIVATE_APP_LEADS_SECRET: "secret" },
    insertLead: async () => ({ id: "should-not-insert" }),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { ok: false, errors: ["email is required."] });
});

test("reports missing Supabase configuration before inserting", async () => {
  const response = await handleWebsiteLeadRequest(requestFor(validPayload, "secret"), {
    env: { PRIVATE_APP_LEADS_SECRET: "secret" },
  });

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: "Lead intake storage is not configured.",
  });
});

test("inserts a valid website lead and returns the lead id", async () => {
  let insertedLead: LeadInsert | null = null;
  const response = await handleWebsiteLeadRequest(requestFor(validPayload, "secret"), {
    env: { PRIVATE_APP_LEADS_SECRET: "secret" },
    now: new Date("2026-05-13T16:00:00.000-05:00"),
    insertLead: async (lead) => {
      insertedLead = lead;
      return { id: "lead-123" };
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    leadId: "lead-123",
    callReminderDueAt: "2026-05-14T22:00:00.000Z",
  });
  assert.equal(insertedLead?.source, "website");
  assert.equal(insertedLead?.status, "new");
  assert.equal(insertedLead?.call_status, "open");
  assert.equal(insertedLead?.contact_name, "Brent Wilbanks");
  assert.equal(insertedLead?.call_reminder_due_at, "2026-05-14T22:00:00.000Z");
});

test("reports authenticated storage errors for diagnostics", async () => {
  const response = await handleWebsiteLeadRequest(requestFor(validPayload, "secret"), {
    env: { PRIVATE_APP_LEADS_SECRET: "secret" },
    insertLead: async () => {
      throw new LeadIntakeStorageError("database rejected the lead");
    },
  });

  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: "Lead intake storage failed.",
    storageError: "database rejected the lead",
  });
});
