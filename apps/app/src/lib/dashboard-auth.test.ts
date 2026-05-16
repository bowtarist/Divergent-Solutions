import assert from "node:assert/strict";
import test from "node:test";
import {
  createDashboardSessionToken,
  getSafeDashboardNextPath,
  hasDashboardAuthConfig,
  isValidDashboardSessionToken,
  validateDashboardCredentials,
} from "./dashboard-auth";

const authEnv = {
  PRIVATE_APP_DASHBOARD_USER: "brent",
  PRIVATE_APP_DASHBOARD_PASSWORD: "correct-horse-battery",
};

test("reports missing dashboard auth config when either credential is absent", () => {
  assert.equal(hasDashboardAuthConfig({}), false);
  assert.equal(hasDashboardAuthConfig({ PRIVATE_APP_DASHBOARD_USER: "brent" }), false);
  assert.equal(hasDashboardAuthConfig(authEnv), true);
});

test("validates the configured dashboard username and password", () => {
  assert.equal(validateDashboardCredentials("brent", "correct-horse-battery", authEnv), true);
  assert.equal(validateDashboardCredentials("BRENT", "correct-horse-battery", authEnv), false);
  assert.equal(validateDashboardCredentials("brent", "wrong", authEnv), false);
});

test("creates a dashboard session token that only validates for the same credentials", () => {
  const token = createDashboardSessionToken(authEnv);

  assert.equal(isValidDashboardSessionToken(token, authEnv), true);
  assert.equal(isValidDashboardSessionToken("not-the-token", authEnv), false);
  assert.equal(
    isValidDashboardSessionToken(token, {
      ...authEnv,
      PRIVATE_APP_DASHBOARD_PASSWORD: "new-password",
    }),
    false
  );
});

test("keeps dashboard login redirects inside the private app", () => {
  assert.equal(getSafeDashboardNextPath("/leads"), "/leads");
  assert.equal(getSafeDashboardNextPath("/leads?status=new"), "/leads?status=new");
  assert.equal(getSafeDashboardNextPath("https://example.com"), "/leads");
  assert.equal(getSafeDashboardNextPath("//example.com"), "/leads");
  assert.equal(getSafeDashboardNextPath(""), "/leads");
});
