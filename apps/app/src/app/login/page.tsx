import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  dashboardSessionCookieName,
  getSafeDashboardNextPath,
  hasDashboardAuthConfig,
  isValidDashboardSessionToken,
} from "../../lib/dashboard-auth";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  config: "Dashboard login is not configured yet. Add the username and password in Vercel first.",
  invalid: "That username or password did not match.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = getSafeDashboardNextPath(params.next);
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(dashboardSessionCookieName)?.value;

  if (!params.error && isValidDashboardSessionToken(sessionToken)) {
    redirect(nextPath);
  }

  const isConfigured = hasDashboardAuthConfig();
  const message = params.error ? errorMessages[params.error] : null;

  return (
    <main className="shell login-shell">
      <section className="login-panel">
        <p className="eyebrow">Private Lead Dashboard</p>
        <h1>Sign in to view website leads.</h1>
        <p>
          This keeps customer names, phone numbers, email addresses, and project details inside the
          private operations app.
        </p>

        {message ? <div className="alert">{message}</div> : null}

        <form className="login-form" action="/api/login" method="post">
          <input type="hidden" name="next" value={nextPath} />
          <label>
            Username
            <input name="username" type="text" autoComplete="username" required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <button type="submit" disabled={!isConfigured}>
            Open lead dashboard
          </button>
        </form>
      </section>
    </main>
  );
}
