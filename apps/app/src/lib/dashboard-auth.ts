import { createHmac, timingSafeEqual } from "node:crypto";

export const dashboardSessionCookieName = "ds_lead_dashboard_session";

const sessionPayload = "divergent-solutions-lead-dashboard-v1";

export type DashboardAuthEnv = {
  PRIVATE_APP_DASHBOARD_USER?: string;
  PRIVATE_APP_DASHBOARD_PASSWORD?: string;
};

function getAuthEnv(env?: DashboardAuthEnv): DashboardAuthEnv {
  return (
    env ?? {
      PRIVATE_APP_DASHBOARD_USER: process.env.PRIVATE_APP_DASHBOARD_USER,
      PRIVATE_APP_DASHBOARD_PASSWORD: process.env.PRIVATE_APP_DASHBOARD_PASSWORD,
    }
  );
}

function isConfiguredValue(value: string | undefined) {
  return typeof value === "string" && value.length > 0;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function hasDashboardAuthConfig(env?: DashboardAuthEnv) {
  const authEnv = getAuthEnv(env);

  return (
    isConfiguredValue(authEnv.PRIVATE_APP_DASHBOARD_USER) &&
    isConfiguredValue(authEnv.PRIVATE_APP_DASHBOARD_PASSWORD)
  );
}

export function validateDashboardCredentials(
  username: string,
  password: string,
  env?: DashboardAuthEnv
) {
  const authEnv = getAuthEnv(env);

  if (!hasDashboardAuthConfig(authEnv)) {
    return false;
  }

  return (
    safeEqual(username.trim(), authEnv.PRIVATE_APP_DASHBOARD_USER ?? "") &&
    safeEqual(password, authEnv.PRIVATE_APP_DASHBOARD_PASSWORD ?? "")
  );
}

export function createDashboardSessionToken(env?: DashboardAuthEnv) {
  const authEnv = getAuthEnv(env);

  if (!hasDashboardAuthConfig(authEnv)) {
    return null;
  }

  return createHmac("sha256", authEnv.PRIVATE_APP_DASHBOARD_PASSWORD ?? "")
    .update(`${authEnv.PRIVATE_APP_DASHBOARD_USER}:${sessionPayload}`)
    .digest("hex");
}

export function isValidDashboardSessionToken(token: string | undefined, env?: DashboardAuthEnv) {
  if (!token) {
    return false;
  }

  const expectedToken = createDashboardSessionToken(env);

  return expectedToken ? safeEqual(token, expectedToken) : false;
}

export function getSafeDashboardNextPath(value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/leads";
  }

  return value;
}
