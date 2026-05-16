import { createClient } from "@supabase/supabase-js";
import type { LeadInsert } from "./lead-intake";
import type { RawLeadRecord } from "./lead-dashboard";

export type LeadStorageEnv = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

export class MissingLeadIntakeStorageConfigError extends Error {
  constructor() {
    super("Lead intake storage is not configured.");
    this.name = "MissingLeadIntakeStorageConfigError";
  }
}

export class LeadIntakeStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LeadIntakeStorageError";
  }
}

export class LeadDashboardStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LeadDashboardStorageError";
  }
}

function getStorageEnv(env?: LeadStorageEnv): LeadStorageEnv {
  return (
    env ?? {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    }
  );
}

export function createSupabaseLeadInserter(env?: LeadStorageEnv) {
  const storageEnv = getStorageEnv(env);
  const supabaseUrl = storageEnv.SUPABASE_URL;
  const serviceRoleKey = storageEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new MissingLeadIntakeStorageConfigError();
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return async function insertLead(lead: LeadInsert) {
    const { data, error } = await supabase.from("leads").insert(lead).select("id").single();

    if (error) {
      throw new LeadIntakeStorageError(error.message);
    }

    if (!data?.id) {
      throw new LeadIntakeStorageError("Lead intake storage did not return a lead id.");
    }

    return { id: String(data.id) };
  };
}

export function createSupabaseLeadReader(env?: LeadStorageEnv) {
  const storageEnv = getStorageEnv(env);
  const supabaseUrl = storageEnv.SUPABASE_URL;
  const serviceRoleKey = storageEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new MissingLeadIntakeStorageConfigError();
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return async function getLatestWebsiteLeads(limit = 50) {
    const { data, error } = await supabase
      .from("leads")
      .select(
        [
          "id",
          "status",
          "call_status",
          "source",
          "name",
          "contact_name",
          "phone",
          "email",
          "project_type",
          "project_description",
          "preferred_timing",
          "initial_service_address_text",
          "service_city",
          "customer_type",
          "property_type",
          "submitted_at",
          "call_reminder_due_at",
          "metadata",
        ].join(",")
      )
      .eq("source", "website")
      .order("submitted_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new LeadDashboardStorageError(error.message);
    }

    return (data ?? []) as unknown as RawLeadRecord[];
  };
}
