import { NextResponse } from "next/server";
import site from "@/content/site.json";

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

const customerTypes = ["Homeowner", "Builder / GC", "Property manager", "Other"] as const;
const propertyTypes = ["Existing home", "New construction", "Commercial / light commercial"] as const;
const timelines = ["ASAP", "Within 30 days", "1-3 months", "Planning ahead"] as const;
const serviceCities = site.serviceArea.cities;
const projectTypes = [...site.services.map((service) => service.title), "Other"];

const maxLengths = {
  name: 100,
  phone: 40,
  email: 254,
  projectAddress: 200,
  city: 80,
  customerType: 50,
  projectType: 100,
  projectNotes: 3000,
  bestTimeToCall: 100,
  propertyType: 80,
  timeline: 80,
  photoName: 180,
} as const;

const maxPhotoNames = 10;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[\d\s().-]{7,25}$/;

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

function isAllowedValue(value: string, allowedValues: readonly string[]) {
  return allowedValues.includes(value);
}

function validateStringLength(
  body: Record<string, unknown>,
  field: string,
  maxLength: number,
  errors: string[]
) {
  if (typeof body[field] === "string" && body[field].length > maxLength) {
    errors.push(`${field} must be ${maxLength} characters or fewer.`);
  }
}

function validatePayload(input: unknown): { payload?: QuoteRequestPayload; errors: string[] } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { errors: ["Request body must be an object."] };
  }

  const body = input as Record<string, unknown>;
  const errors = requiredFields
    .filter((field) => !isNonEmptyString(body[field]))
    .map((field) => `${field} is required.`);

  if (isNonEmptyString(body.companyWebsite)) {
    errors.push("Request body is invalid.");
  }

  for (const field of requiredFields) {
    validateStringLength(body, field, maxLengths[field], errors);
  }

  validateStringLength(body, "bestTimeToCall", maxLengths.bestTimeToCall, errors);
  validateStringLength(body, "propertyType", maxLengths.propertyType, errors);
  validateStringLength(body, "timeline", maxLengths.timeline, errors);

  if (errors.length > 0) {
    return { errors };
  }

  const phone = String(body.phone).trim();
  const email = String(body.email).trim();
  const city = String(body.city).trim();
  const customerType = String(body.customerType).trim();
  const projectType = String(body.projectType).trim();
  const propertyType = isNonEmptyString(body.propertyType) ? body.propertyType.trim() : undefined;
  const timeline = isNonEmptyString(body.timeline) ? body.timeline.trim() : undefined;
  const phoneDigits = phone.replace(/\D/g, "").length;
  const photoNames = Array.isArray(body.photoNames) ? body.photoNames.map(String) : [];

  if (body.photoNames !== undefined && !Array.isArray(body.photoNames)) {
    errors.push("photoNames must be an array.");
  }

  if (!emailPattern.test(email)) {
    errors.push("email must be a valid email address.");
  }

  if (!phonePattern.test(phone) || phoneDigits < 7 || phoneDigits > 15) {
    errors.push("phone must be a valid phone number.");
  }

  if (!isAllowedValue(city, serviceCities)) {
    errors.push("city must be in the service area.");
  }

  if (!isAllowedValue(customerType, customerTypes)) {
    errors.push("customerType is invalid.");
  }

  if (!isAllowedValue(projectType, projectTypes)) {
    errors.push("projectType is invalid.");
  }

  if (propertyType && !isAllowedValue(propertyType, propertyTypes)) {
    errors.push("propertyType is invalid.");
  }

  if (timeline && !isAllowedValue(timeline, timelines)) {
    errors.push("timeline is invalid.");
  }

  if (photoNames.length > maxPhotoNames) {
    errors.push(`photoNames must include ${maxPhotoNames} files or fewer.`);
  }

  if (Array.isArray(body.photoNames) && body.photoNames.some((photoName) => typeof photoName !== "string")) {
    errors.push("photoNames items must be strings.");
  }

  if (photoNames.some((photoName) => photoName.length > maxLengths.photoName)) {
    errors.push(`photoNames items must be ${maxLengths.photoName} characters or fewer.`);
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    errors: [],
    payload: {
      name: String(body.name).trim(),
      phone,
      email,
      projectAddress: String(body.projectAddress).trim(),
      city,
      customerType,
      projectType,
      projectNotes: String(body.projectNotes).trim(),
      bestTimeToCall: isNonEmptyString(body.bestTimeToCall) ? body.bestTimeToCall.trim() : undefined,
      propertyType,
      timeline,
      photoNames: photoNames.map((photoName) => photoName.trim()).filter(Boolean),
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

  let response: Response;

  try {
    response = await fetch(endpoint, {
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
  } catch {
    return NextResponse.json({ ok: false, error: "Lead forwarding failed." }, { status: 502 });
  }

  if (!response.ok) {
    return NextResponse.json({ ok: false, error: "Lead forwarding failed." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
