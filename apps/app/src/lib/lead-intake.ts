const centralTimeZone = "America/Chicago";

const requiredWebsiteLeadFields = [
  "name",
  "phone",
  "email",
  "projectAddress",
  "city",
  "customerType",
  "projectType",
  "projectNotes",
] as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RequiredWebsiteLeadField = (typeof requiredWebsiteLeadFields)[number];

export type WebsiteLeadPayload = Record<RequiredWebsiteLeadField, string> & {
  source?: string;
  status?: string;
  callReminder?: string;
  submittedAt?: string;
  propertyType?: string;
  timeline?: string;
  bestTimeToCall?: string;
  photoNames?: string[];
};

export type LeadInsert = {
  source: "website";
  status: "new";
  call_status: "open";
  contact_name: string;
  first_name: string;
  last_name: string | null;
  phone: string;
  email: string;
  project_type: string;
  project_description: string;
  preferred_timing: string | null;
  initial_service_address_text: string;
  service_city: string;
  customer_type: string;
  property_type: string | null;
  submitted_at: string;
  call_reminder_due_at: string;
  metadata: {
    bestTimeToCall: string | null;
    timeline: string | null;
    photoNames: string[];
    websiteStatus: string | null;
    websiteCallReminder: string | null;
    rawSource: string | null;
  };
};

export type ValidationResult =
  | { ok: true; payload: WebsiteLeadPayload }
  | { ok: false; errors: string[] };

function isRecord(input: unknown): input is Record<string, unknown> {
  return Boolean(input) && typeof input === "object" && !Array.isArray(input);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function optionalTrimmedString(value: unknown): string | undefined {
  return isNonEmptyString(value) ? value.trim() : undefined;
}

function requiredTrimmedString(body: Record<string, unknown>, field: RequiredWebsiteLeadField) {
  return String(body[field]).trim();
}

function splitContactName(contactName: string) {
  const parts = contactName.trim().split(/\s+/);
  const [firstName, ...lastNameParts] = parts;

  return {
    firstName,
    lastName: lastNameParts.length > 0 ? lastNameParts.join(" ") : null,
  };
}

function getCentralCalendarDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: centralTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
}

function addCalendarDays(
  date: { year: number; month: number; day: number },
  daysToAdd: number
) {
  const next = new Date(Date.UTC(date.year, date.month - 1, date.day + daysToAdd));

  return {
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
    day: next.getUTCDate(),
  };
}

function isWeekend(date: { year: number; month: number; day: number }) {
  const dayOfWeek = new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();

  return dayOfWeek === 0 || dayOfWeek === 6;
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const zonedAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );

  return zonedAsUtc - date.getTime();
}

function centralDateTimeToUtcIso(date: { year: number; month: number; day: number }, hour: number) {
  const utcGuess = new Date(Date.UTC(date.year, date.month - 1, date.day, hour));
  const firstOffset = getTimeZoneOffsetMs(utcGuess, centralTimeZone);
  const firstResult = new Date(utcGuess.getTime() - firstOffset);
  const finalOffset = getTimeZoneOffsetMs(firstResult, centralTimeZone);

  return new Date(utcGuess.getTime() - finalOffset).toISOString();
}

export function validateWebsiteLeadPayload(input: unknown): ValidationResult {
  if (!isRecord(input)) {
    return { ok: false, errors: ["Request body must be an object."] };
  }

  const errors = requiredWebsiteLeadFields
    .filter((field) => !isNonEmptyString(input[field]))
    .map((field) => `${field} is required.`);

  if (isNonEmptyString(input.email) && !emailPattern.test(input.email.trim())) {
    errors.push("email must be a valid email address.");
  }

  if (input.photoNames !== undefined) {
    if (!Array.isArray(input.photoNames)) {
      errors.push("photoNames must be an array.");
    } else if (input.photoNames.some((photoName) => typeof photoName !== "string")) {
      errors.push("photoNames items must be strings.");
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const photoNames = Array.isArray(input.photoNames)
    ? input.photoNames.map((photoName) => photoName.trim()).filter(Boolean)
    : [];

  return {
    ok: true,
    payload: {
      name: requiredTrimmedString(input, "name"),
      phone: requiredTrimmedString(input, "phone"),
      email: requiredTrimmedString(input, "email"),
      projectAddress: requiredTrimmedString(input, "projectAddress"),
      city: requiredTrimmedString(input, "city"),
      customerType: requiredTrimmedString(input, "customerType"),
      projectType: requiredTrimmedString(input, "projectType"),
      projectNotes: requiredTrimmedString(input, "projectNotes"),
      source: optionalTrimmedString(input.source),
      status: optionalTrimmedString(input.status),
      callReminder: optionalTrimmedString(input.callReminder),
      submittedAt: optionalTrimmedString(input.submittedAt),
      propertyType: optionalTrimmedString(input.propertyType),
      timeline: optionalTrimmedString(input.timeline),
      bestTimeToCall: optionalTrimmedString(input.bestTimeToCall),
      photoNames,
    },
  };
}

export function calculateNextBusinessDayCallDueAt(now: Date) {
  let candidate = getCentralCalendarDate(now);

  do {
    candidate = addCalendarDays(candidate, 1);
  } while (isWeekend(candidate));

  return centralDateTimeToUtcIso(candidate, 17);
}

export function mapWebsiteLeadToInsert(payload: WebsiteLeadPayload, now = new Date()): LeadInsert {
  const { firstName, lastName } = splitContactName(payload.name);
  const preferredTiming = [
    payload.timeline,
    payload.bestTimeToCall ? `Best time to call: ${payload.bestTimeToCall}` : undefined,
  ]
    .filter(Boolean)
    .join("; ");

  return {
    source: "website",
    status: "new",
    call_status: "open",
    contact_name: payload.name,
    first_name: firstName,
    last_name: lastName,
    phone: payload.phone,
    email: payload.email,
    project_type: payload.projectType,
    project_description: payload.projectNotes,
    preferred_timing: preferredTiming || null,
    initial_service_address_text: `${payload.projectAddress}, ${payload.city}`,
    service_city: payload.city,
    customer_type: payload.customerType,
    property_type: payload.propertyType ?? null,
    submitted_at: payload.submittedAt ?? now.toISOString(),
    call_reminder_due_at: calculateNextBusinessDayCallDueAt(now),
    metadata: {
      bestTimeToCall: payload.bestTimeToCall ?? null,
      timeline: payload.timeline ?? null,
      photoNames: payload.photoNames ?? [],
      websiteStatus: payload.status ?? null,
      websiteCallReminder: payload.callReminder ?? null,
      rawSource: payload.source ?? null,
    },
  };
}
