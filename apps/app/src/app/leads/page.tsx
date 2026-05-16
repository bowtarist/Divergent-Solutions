import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  dashboardSessionCookieName,
  isValidDashboardSessionToken,
} from "../../lib/dashboard-auth";
import { normalizeLeadRecord, type DashboardLead } from "../../lib/lead-dashboard";
import {
  createSupabaseLeadReader,
  LeadDashboardStorageError,
  MissingLeadIntakeStorageConfigError,
} from "../../lib/supabase-server";

export const dynamic = "force-dynamic";

async function requireDashboardSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(dashboardSessionCookieName)?.value;

  if (!isValidDashboardSessionToken(sessionToken)) {
    redirect("/login?next=/leads");
  }
}

async function getDashboardLeads() {
  const readLeads = createSupabaseLeadReader();
  const records = await readLeads(50);

  return records.map((record) => normalizeLeadRecord(record));
}

function ContactAction({
  href,
  children,
}: {
  href: string | null;
  children: ReactNode;
}) {
  if (!href) {
    return <span className="contact-action contact-action-disabled">{children}</span>;
  }

  return (
    <a className="contact-action" href={href}>
      {children}
    </a>
  );
}

function LeadCard({ lead }: { lead: DashboardLead }) {
  return (
    <article className="lead-card">
      <div className="lead-card-topline">
        <div>
          <p className="eyebrow">{lead.sourceLabel}</p>
          <h2>{lead.name}</h2>
        </div>
        <span className={lead.isCallDue ? "badge badge-hot" : "badge"}>{lead.statusLabel}</span>
      </div>

      <div className="lead-actions">
        <ContactAction href={lead.phoneHref}>Call {lead.phone ?? "No phone"}</ContactAction>
        <ContactAction href={lead.emailHref}>Email {lead.email ?? "No email"}</ContactAction>
      </div>

      <dl className="lead-details">
        <div>
          <dt>Project</dt>
          <dd>{lead.projectType}</dd>
        </div>
        <div>
          <dt>Address</dt>
          <dd>{lead.address}</dd>
        </div>
        <div>
          <dt>City</dt>
          <dd>{lead.serviceCity}</dd>
        </div>
        <div>
          <dt>Customer</dt>
          <dd>
            {lead.customerType} · {lead.propertyType}
          </dd>
        </div>
        <div>
          <dt>Submitted</dt>
          <dd>{lead.submittedAtLabel}</dd>
        </div>
        <div>
          <dt>Call reminder</dt>
          <dd>
            {lead.callReminderLabel} · {lead.callStatusLabel}
          </dd>
        </div>
      </dl>

      <div className="lead-notes">
        <h3>Project notes</h3>
        <p>{lead.projectDescription}</p>
        <p className="muted">{lead.preferredTiming}</p>
      </div>

      {lead.photoNames.length > 0 ? (
        <div className="photo-tags">
          {lead.photoNames.map((photoName) => (
            <span key={photoName}>{photoName}</span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <section className="panel">
      <p className="eyebrow">Needs Attention</p>
      <h2>Lead dashboard could not load.</h2>
      <p>{message}</p>
    </section>
  );
}

export default async function LeadsPage() {
  await requireDashboardSession();

  let leads: DashboardLead[] = [];
  let errorMessage: string | null = null;

  try {
    leads = await getDashboardLeads();
  } catch (error) {
    if (error instanceof MissingLeadIntakeStorageConfigError) {
      errorMessage = "Supabase is not configured for this private app deployment.";
    } else if (error instanceof LeadDashboardStorageError) {
      errorMessage = "Supabase returned an error while reading website leads.";
    } else {
      throw error;
    }
  }

  const dueCount = leads.filter((lead) => lead.isCallDue).length;

  return (
    <main className="shell dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Website Leads</p>
          <h1>Lead dashboard</h1>
          <p>
            New quote requests from divergentsolutionsllc.com, ready for a follow-up call within
            one business day.
          </p>
        </div>
        <form action="/api/logout" method="post">
          <button className="secondary-button" type="submit">
            Log out
          </button>
        </form>
      </header>

      <section className="dashboard-stats">
        <div className="stat-card">
          <span>{leads.length}</span>
          <p>Website leads loaded</p>
        </div>
        <div className="stat-card">
          <span>{dueCount}</span>
          <p>Call reminders due</p>
        </div>
      </section>

      {errorMessage ? <ErrorPanel message={errorMessage} /> : null}

      {!errorMessage && leads.length === 0 ? (
        <section className="panel empty-state">
          <p className="eyebrow">All Clear</p>
          <h2>No website leads yet.</h2>
          <p>When someone submits the Request a Quote form, their lead will show up here.</p>
        </section>
      ) : null}

      {!errorMessage && leads.length > 0 ? (
        <section className="lead-list" aria-label="Website leads">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </section>
      ) : null}
    </main>
  );
}
