export const leadStatusOptions = [
  { value: "new", label: "New" },
  { value: "attempting_contact", label: "Called" },
  { value: "quoted", label: "Quoted" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
] as const;

export type LeadStatus = (typeof leadStatusOptions)[number]["value"];

export type LeadCallStatus = "open" | "completed" | "dismissed";

export const leadQualificationOptions = [
  { value: "needs_site_visit", label: "Needs site visit" },
  { value: "quote_remotely", label: "Quote remotely" },
  { value: "ready_to_estimate", label: "Ready to estimate" },
] as const;

export type LeadQualification = (typeof leadQualificationOptions)[number]["value"];

export type InternalNote = {
  text: string;
  createdAt: string;
};

export type LeadQualificationSnapshot = {
  value: LeadQualification;
  updatedAt: string;
};

const leadStatusValues = new Set<string>(leadStatusOptions.map((status) => status.value));
const leadQualificationValues = new Set<string>(
  leadQualificationOptions.map((qualification) => qualification.value)
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function parseLeadStatus(value: unknown): LeadStatus | null {
  return typeof value === "string" && leadStatusValues.has(value) ? (value as LeadStatus) : null;
}

export function parseLeadQualification(value: unknown): LeadQualification | null {
  return typeof value === "string" && leadQualificationValues.has(value)
    ? (value as LeadQualification)
    : null;
}

export function createLeadStatusUpdate(status: LeadStatus): {
  status: LeadStatus;
  call_status: LeadCallStatus;
} {
  if (status === "new") {
    return { status, call_status: "open" };
  }

  if (status === "lost") {
    return { status, call_status: "dismissed" };
  }

  return { status, call_status: "completed" };
}

export function getInternalNotes(metadata: unknown): InternalNote[] {
  if (!isRecord(metadata) || !Array.isArray(metadata.internalNotes)) {
    return [];
  }

  return metadata.internalNotes
    .filter((note): note is InternalNote => {
      return (
        isRecord(note) &&
        typeof note.text === "string" &&
        note.text.trim().length > 0 &&
        typeof note.createdAt === "string"
      );
    })
    .map((note) => ({
      text: note.text.trim(),
      createdAt: note.createdAt,
    }));
}

export function getLeadQualification(metadata: unknown): LeadQualificationSnapshot | null {
  if (!isRecord(metadata) || !isRecord(metadata.leadQualification)) {
    return null;
  }

  const value = parseLeadQualification(metadata.leadQualification.value);
  const updatedAt = metadata.leadQualification.updatedAt;

  if (!value || typeof updatedAt !== "string") {
    return null;
  }

  return { value, updatedAt };
}

export function addInternalNoteToMetadata(
  metadata: unknown,
  noteText: string,
  now = new Date()
) {
  const cleanNoteText = noteText.trim();
  const baseMetadata = isRecord(metadata) ? metadata : {};

  if (!cleanNoteText) {
    return baseMetadata;
  }

  return {
    ...baseMetadata,
    internalNotes: [
      {
        text: cleanNoteText,
        createdAt: now.toISOString(),
      },
      ...getInternalNotes(metadata),
    ],
  };
}

export function setLeadQualificationInMetadata(
  metadata: unknown,
  qualification: LeadQualification,
  now = new Date()
) {
  const baseMetadata = isRecord(metadata) ? metadata : {};

  return {
    ...baseMetadata,
    leadQualification: {
      value: qualification,
      updatedAt: now.toISOString(),
    },
  };
}
