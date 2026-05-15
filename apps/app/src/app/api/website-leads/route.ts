import {
  mapWebsiteLeadToInsert,
  validateWebsiteLeadPayload,
  type LeadInsert,
} from "../../../lib/lead-intake";
import {
  createSupabaseLeadInserter,
  LeadIntakeStorageError,
  MissingLeadIntakeStorageConfigError,
  type LeadStorageEnv,
} from "../../../lib/supabase-server";

export type WebsiteLeadEnv = LeadStorageEnv & {
  PRIVATE_APP_LEADS_SECRET?: string;
};

type LeadInserter = (lead: LeadInsert) => Promise<{ id: string }>;

type WebsiteLeadRequestDependencies = {
  env?: WebsiteLeadEnv;
  insertLead?: LeadInserter;
  now?: Date;
};

function jsonResponse(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

function getLeadInserter(dependencies: WebsiteLeadRequestDependencies, env: WebsiteLeadEnv) {
  return dependencies.insertLead ?? createSupabaseLeadInserter(env);
}

function getEnv(dependencies: WebsiteLeadRequestDependencies): WebsiteLeadEnv {
  return (
    dependencies.env ?? {
      PRIVATE_APP_LEADS_SECRET: process.env.PRIVATE_APP_LEADS_SECRET,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    }
  );
}

export async function handleWebsiteLeadRequest(
  request: Request,
  dependencies: WebsiteLeadRequestDependencies = {}
) {
  const env = getEnv(dependencies);
  const expectedSecret = env.PRIVATE_APP_LEADS_SECRET;

  if (!expectedSecret) {
    return jsonResponse({ ok: false, error: "Lead intake endpoint is not configured." }, 503);
  }

  const bearerToken = getBearerToken(request);

  if (!bearerToken) {
    return jsonResponse({ ok: false, error: "Missing bearer token." }, 401);
  }

  if (bearerToken !== expectedSecret) {
    return jsonResponse({ ok: false, error: "Invalid bearer token." }, 403);
  }

  const parsed = validateWebsiteLeadPayload(await request.json().catch(() => null));

  if (!parsed.ok) {
    return jsonResponse({ ok: false, errors: parsed.errors }, 400);
  }

  let insertLead: LeadInserter;

  try {
    insertLead = getLeadInserter(dependencies, env);
  } catch (error) {
    if (error instanceof MissingLeadIntakeStorageConfigError) {
      return jsonResponse({ ok: false, error: error.message }, 503);
    }

    throw error;
  }

  const lead = mapWebsiteLeadToInsert(parsed.payload, dependencies.now);

  try {
    const result = await insertLead(lead);

    return jsonResponse({
      ok: true,
      leadId: result.id,
      callReminderDueAt: lead.call_reminder_due_at,
    });
  } catch (error) {
    const storageError =
      error instanceof LeadIntakeStorageError && process.env.LEAD_INTAKE_DEBUG === "true"
        ? error.message
        : undefined;

    return jsonResponse(
      { ok: false, error: "Lead intake storage failed.", storageError },
      502
    );
  }
}

export async function POST(request: Request) {
  return handleWebsiteLeadRequest(request);
}
