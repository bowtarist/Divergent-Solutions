const centralTimeZone = "America/Chicago";

export type RawLeadRecord = {
  id: string;
  status: string | null;
  call_status: string | null;
  source: string | null;
  name: string | null;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  project_type: string | null;
  project_description: string | null;
  preferred_timing: string | null;
  initial_service_address_text: string | null;
  service_city: string | null;
  customer_type: string | null;
  property_type: string | null;
  submitted_at: string | null;
  call_reminder_due_at: string | null;
  metadata: unknown;
};

export type DashboardLead = {
  id: string;
  name: string;
  phone: string | null;
  phoneHref: string | null;
  email: string | null;
  emailHref: string | null;
  statusLabel: string;
  callStatusLabel: string;
  sourceLabel: string;
  projectType: string;
  projectDescription: string;
  preferredTiming: string;
  address: string;
  serviceCity: string;
  customerType: string;
  propertyType: string;
  submittedAtLabel: string;
  callReminderLabel: string;
  isCallDue: boolean;
  photoNames: string[];
};

function valueOrFallback(value: string | null | undefined, fallback: string) {
  return value?.trim() || fallback;
}

function toTitleLabel(value: string | null | undefined, fallback = "Unknown") {
  const clean = value?.trim().replace(/[_-]+/g, " ");

  if (!clean) {
    return fallback;
  }

  return clean
    .split(/\s+/)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(" ");
}

function formatCentralDateTime(value: string | null | undefined) {
  if (!value) {
    return "Not recorded";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: centralTimeZone,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getPhoneHref(phone: string | null | undefined) {
  const digits = phone?.replace(/\D/g, "") ?? "";

  if (digits.length === 10) {
    return `tel:+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `tel:+${digits}`;
  }

  return null;
}

function getEmailHref(email: string | null | undefined) {
  const clean = email?.trim();

  return clean && clean.includes("@") ? `mailto:${clean}` : null;
}

function getPhotoNames(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return [];
  }

  const photoNames = (metadata as { photoNames?: unknown }).photoNames;

  if (!Array.isArray(photoNames)) {
    return [];
  }

  return photoNames.filter((photoName): photoName is string => typeof photoName === "string");
}

function isCallDue(callReminderDueAt: string | null | undefined, now: Date) {
  if (!callReminderDueAt) {
    return false;
  }

  const dueAt = new Date(callReminderDueAt);

  return !Number.isNaN(dueAt.getTime()) && dueAt.getTime() <= now.getTime();
}

export function normalizeLeadRecord(record: RawLeadRecord, now = new Date()): DashboardLead {
  const phone = record.phone?.trim() || null;
  const email = record.email?.trim() || null;

  return {
    id: record.id,
    name: valueOrFallback(record.name ?? record.contact_name, "Unnamed lead"),
    phone,
    phoneHref: getPhoneHref(phone),
    email,
    emailHref: getEmailHref(email),
    statusLabel: toTitleLabel(record.status),
    callStatusLabel: toTitleLabel(record.call_status),
    sourceLabel: toTitleLabel(record.source),
    projectType: valueOrFallback(record.project_type, "Project type not recorded"),
    projectDescription: valueOrFallback(record.project_description, "No project notes yet."),
    preferredTiming: valueOrFallback(record.preferred_timing, "No preferred timing recorded"),
    address: valueOrFallback(record.initial_service_address_text, "Address not recorded"),
    serviceCity: valueOrFallback(record.service_city, "City not recorded"),
    customerType: valueOrFallback(record.customer_type, "Customer type not recorded"),
    propertyType: valueOrFallback(record.property_type, "Property type not recorded"),
    submittedAtLabel: formatCentralDateTime(record.submitted_at),
    callReminderLabel: formatCentralDateTime(record.call_reminder_due_at),
    isCallDue: isCallDue(record.call_reminder_due_at, now),
    photoNames: getPhotoNames(record.metadata),
  };
}
