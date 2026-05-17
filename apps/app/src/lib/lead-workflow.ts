export const leadStatusOptions = [
  { value: "new", label: "New" },
  { value: "attempting_contact", label: "Called" },
  { value: "quoted", label: "Quoted" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
] as const;

export type LeadStatus = (typeof leadStatusOptions)[number]["value"];

export type LeadCallStatus = "open" | "completed" | "dismissed";

export type InternalNote = {
  text: string;
  createdAt: string;
};

const leadStatusValues = new Set<string>(leadStatusOptions.map((status) => status.value));

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function parseLeadStatus(value: unknown): LeadStatus | null {
  return typeof value === "string" && leadStatusValues.has(value) ? (value as LeadStatus) : null;
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
