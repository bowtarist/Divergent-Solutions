import { createClient } from "@supabase/supabase-js";
import type { LeadInsert } from "./lead-intake";

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
