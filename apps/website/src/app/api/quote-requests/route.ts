import { NextResponse } from "next/server";

const requiredFields = [
  "name",
  "phone",
  "email",
  "projectAddress",
  "city",
  "customerType",
  "projectType",
  "projectNotes",
] as const;

type RequiredField = (typeof requiredFields)[number];

type QuoteRequestPayload = Record<RequiredField, string> & {
  bestTimeToCall?: string;
  propertyType?: string;
  timeline?: string;
  photoNames?: string[];
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validatePayload(input: unknown): { payload?: QuoteRequestPayload; errors: string[] } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { errors: ["Request body must be an object."] };
  }

  const body = input as Record<string, unknown>;
  const errors = requiredFields
    .filter((field) => !isNonEmptyString(body[field]))
    .map((field) => `${field} is required.`);

  if (errors.length > 0) {
    return { errors };
  }

  return {
    errors: [],
    payload: {
      name: String(body.name).trim(),
      phone: String(body.phone).trim(),
      email: String(body.email).trim(),
      projectAddress: String(body.projectAddress).trim(),
      city: String(body.city).trim(),
      customerType: String(body.customerType).trim(),
      projectType: String(body.projectType).trim(),
      projectNotes: String(body.projectNotes).trim(),
      bestTimeToCall: isNonEmptyString(body.bestTimeToCall) ? body.bestTimeToCall.trim() : undefined,
      propertyType: isNonEmptyString(body.propertyType) ? body.propertyType.trim() : undefined,
      timeline: isNonEmptyString(body.timeline) ? body.timeline.trim() : undefined,
      photoNames: Array.isArray(body.photoNames) ? body.photoNames.map(String) : [],
    },
  };
}

export async function POST(request: Request) {
  const parsed = validatePayload(await request.json().catch(() => null));

  if (parsed.errors.length > 0 || !parsed.payload) {
    return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 400 });
  }

  const endpoint = process.env.PRIVATE_APP_LEADS_ENDPOINT;
  const secret = process.env.PRIVATE_APP_LEADS_SECRET;

  if (!endpoint || !secret) {
    return NextResponse.json(
      {
        ok: false,
        error: "Lead forwarding is not configured.",
      },
      { status: 503 }
    );
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({
      source: "Website",
      status: "New Web Lead",
      callReminder: "Call new website lead",
      submittedAt: new Date().toISOString(),
      ...parsed.payload,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ ok: false, error: "Lead forwarding failed." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
