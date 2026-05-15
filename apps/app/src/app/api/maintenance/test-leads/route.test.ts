import assert from "node:assert/strict";
import test from "node:test";
import { handleTestLeadCleanupRequest } from "./route";

function requestFor(token?: string) {
  return new Request("https://app.divergentsolutionsllc.com/api/maintenance/test-leads", {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

test("rejects test lead cleanup without a bearer token", async () => {
  let cleanupCalled = false;
  const response = await handleTestLeadCleanupRequest(requestFor(), {
    env: { PRIVATE_APP_LEADS_SECRET: "secret" },
    cleanupTestLeads: async () => {
      cleanupCalled = true;
      return [];
    },
  });

  assert.equal(response.status, 401);
  assert.equal(cleanupCalled, false);
  assert.deepEqual(await response.json(), { ok: false, error: "Missing bearer token." });
});

test("rejects test lead cleanup with the wrong bearer token", async () => {
  let cleanupCalled = false;
  const response = await handleTestLeadCleanupRequest(requestFor("wrong"), {
    env: { PRIVATE_APP_LEADS_SECRET: "secret" },
    cleanupTestLeads: async () => {
      cleanupCalled = true;
      return [];
    },
  });

  assert.equal(response.status, 403);
  assert.equal(cleanupCalled, false);
  assert.deepEqual(await response.json(), { ok: false, error: "Invalid bearer token." });
});

test("deletes only known test leads with a valid token", async () => {
  const response = await handleTestLeadCleanupRequest(requestFor("secret"), {
    env: { PRIVATE_APP_LEADS_SECRET: "secret" },
    cleanupTestLeads: async () => [
      { id: "lead-1", name: "Connection Test", email: "test@example.com" },
      { id: "lead-2", name: "Post Cleanup Website Test", email: "test@example.com" },
    ],
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    deleted: [
      { id: "lead-1", name: "Connection Test", email: "test@example.com" },
      { id: "lead-2", name: "Post Cleanup Website Test", email: "test@example.com" },
    ],
  });
});
