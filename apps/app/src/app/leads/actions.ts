"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  dashboardSessionCookieName,
  isValidDashboardSessionToken,
} from "../../lib/dashboard-auth";
import { parseLeadQualification, parseLeadStatus } from "../../lib/lead-workflow";
import { createSupabaseLeadWorkflowUpdater } from "../../lib/supabase-server";

async function requireDashboardSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(dashboardSessionCookieName)?.value;

  if (!isValidDashboardSessionToken(sessionToken)) {
    redirect("/login?next=/leads");
  }
}

function getLeadId(formData: FormData) {
  const leadId = String(formData.get("leadId") ?? "").trim();

  return leadId || null;
}

export async function updateLeadStatusAction(formData: FormData) {
  await requireDashboardSession();

  const leadId = getLeadId(formData);
  const status = parseLeadStatus(formData.get("status"));

  if (!leadId || !status) {
    return;
  }

  await createSupabaseLeadWorkflowUpdater().updateLeadStatus(leadId, status);
  revalidatePath("/leads");
}

export async function addInternalNoteAction(formData: FormData) {
  await requireDashboardSession();

  const leadId = getLeadId(formData);
  const note = String(formData.get("note") ?? "").trim();

  if (!leadId || !note) {
    return;
  }

  await createSupabaseLeadWorkflowUpdater().addInternalNote(leadId, note);
  revalidatePath("/leads");
}

export async function updateLeadQualificationAction(formData: FormData) {
  await requireDashboardSession();

  const leadId = getLeadId(formData);
  const qualification = parseLeadQualification(formData.get("qualification"));

  if (!leadId || !qualification) {
    return;
  }

  await createSupabaseLeadWorkflowUpdater().updateLeadQualification(leadId, qualification);
  revalidatePath("/leads");
}
