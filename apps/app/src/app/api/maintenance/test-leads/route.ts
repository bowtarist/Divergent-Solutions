import {
  createSupabaseTestLeadCleaner,
  MissingLeadIntakeStorageConfigError,
  type CleanedTestLead,
  type LeadStorageEnv,
} from "../../../../lib/supabase-server";

type TestLeadCleanupEnv = LeadStorageEnv & {
  PRIVATE_APP_LEADS_SECRET?: string;
};

type CleanupTestLeads = () => Promise<CleanedTestLead[]>;

type TestLeadCleanupDependencies = {
  env?: TestLeadCleanupEnv;
  cleanupTestLeads?: CleanupTestLeads;
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

function getEnv(dependencies: TestLeadCleanupDependencies): TestLeadCleanupEnv {
  return (
    dependencies.env ?? {
      PRIVATE_APP_LEADS_SECRET: process.env.PRIVATE_APP_LEADS_SECRET,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    }
  );
}

export async function handleTestLeadCleanupRequest(
  request: Request,
  dependencies: TestLeadCleanupDependencies = {}
) {
  const env = getEnv(dependencies);
  const expectedSecret = env.PRIVATE_APP_LEADS_SECRET;

  if (!expectedSecret) {
    return jsonResponse({ ok: false, error: "Maintenance endpoint is not configured." }, 503);
  }

  const bearerToken = getBearerToken(request);

  if (!bearerToken) {
    return jsonResponse({ ok: false, error: "Missing bearer token." }, 401);
  }

  if (bearerToken !== expectedSecret) {
    return jsonResponse({ ok: false, error: "Invalid bearer token." }, 403);
  }

  let cleanupTestLeads: CleanupTestLeads;

  try {
    cleanupTestLeads =
      dependencies.cleanupTestLeads ?? createSupabaseTestLeadCleaner(env);
  } catch (error) {
    if (error instanceof MissingLeadIntakeStorageConfigError) {
      return jsonResponse({ ok: false, error: error.message }, 503);
    }

    throw error;
  }

  const deleted = await cleanupTestLeads();

  return jsonResponse({ ok: true, deleted });
}

export async function DELETE(request: Request) {
  return handleTestLeadCleanupRequest(request);
}
