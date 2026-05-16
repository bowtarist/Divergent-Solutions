import { NextResponse } from "next/server";
import {
  createDashboardSessionToken,
  dashboardSessionCookieName,
  getSafeDashboardNextPath,
  hasDashboardAuthConfig,
  validateDashboardCredentials,
} from "../../../lib/dashboard-auth";

const sessionMaxAgeSeconds = 60 * 60 * 12;

function redirectToLogin(request: Request, error: string, nextPath: string) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("error", error);
  loginUrl.searchParams.set("next", nextPath);

  return NextResponse.redirect(loginUrl, { status: 303 });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const nextPath = getSafeDashboardNextPath(formData.get("next"));

  if (!hasDashboardAuthConfig()) {
    return redirectToLogin(request, "config", nextPath);
  }

  if (!validateDashboardCredentials(username, password)) {
    return redirectToLogin(request, "invalid", nextPath);
  }

  const token = createDashboardSessionToken();

  if (!token) {
    return redirectToLogin(request, "config", nextPath);
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url), { status: 303 });

  response.cookies.set(dashboardSessionCookieName, token, {
    httpOnly: true,
    maxAge: sessionMaxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
