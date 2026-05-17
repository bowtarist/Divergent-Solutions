import assert from "node:assert/strict";
import test from "node:test";
import {
  addInternalNoteToMetadata,
  createLeadStatusUpdate,
  getLeadQualification,
  getInternalNotes,
  parseLeadQualification,
  parseLeadStatus,
  setLeadQualificationInMetadata,
} from "./lead-workflow";

test("accepts only supported lead status values", () => {
  assert.equal(parseLeadStatus("new"), "new");
  assert.equal(parseLeadStatus("attempting_contact"), "attempting_contact");
  assert.equal(parseLeadStatus("quoted"), "quoted");
  assert.equal(parseLeadStatus("won"), "won");
  assert.equal(parseLeadStatus("lost"), "lost");
  assert.equal(parseLeadStatus("not-real"), null);
  assert.equal(parseLeadStatus(null), null);
});

test("maps status changes to the correct call status", () => {
  assert.deepEqual(createLeadStatusUpdate("new"), {
    status: "new",
    call_status: "open",
  });
  assert.deepEqual(createLeadStatusUpdate("attempting_contact"), {
    status: "attempting_contact",
    call_status: "completed",
  });
  assert.deepEqual(createLeadStatusUpdate("quoted"), {
    status: "quoted",
    call_status: "completed",
  });
  assert.deepEqual(createLeadStatusUpdate("lost"), {
    status: "lost",
    call_status: "dismissed",
  });
});

test("adds internal notes to existing lead metadata without removing existing fields", () => {
  const metadata = addInternalNoteToMetadata(
    {
      photoNames: ["front.jpg"],
      internalNotes: [{ text: "Called once", createdAt: "2026-05-15T12:00:00.000Z" }],
    },
    "Left voicemail",
    new Date("2026-05-16T14:30:00.000Z")
  );

  assert.deepEqual((metadata as { photoNames: string[] }).photoNames, ["front.jpg"]);
  assert.deepEqual(getInternalNotes(metadata), [
    { text: "Left voicemail", createdAt: "2026-05-16T14:30:00.000Z" },
    { text: "Called once", createdAt: "2026-05-15T12:00:00.000Z" },
  ]);
});

test("ignores blank internal notes", () => {
  const metadata = addInternalNoteToMetadata({ photoNames: ["front.jpg"] }, "   ");

  assert.deepEqual(metadata, { photoNames: ["front.jpg"] });
});

test("accepts only supported lead qualification values", () => {
  assert.equal(parseLeadQualification("needs_site_visit"), "needs_site_visit");
  assert.equal(parseLeadQualification("quote_remotely"), "quote_remotely");
  assert.equal(parseLeadQualification("ready_to_estimate"), "ready_to_estimate");
  assert.equal(parseLeadQualification("not-real"), null);
  assert.equal(parseLeadQualification(null), null);
});

test("sets lead qualification metadata without removing photos or notes", () => {
  const metadata = setLeadQualificationInMetadata(
    {
      photoNames: ["front.jpg"],
      internalNotes: [{ text: "Called once", createdAt: "2026-05-15T12:00:00.000Z" }],
    },
    "needs_site_visit",
    new Date("2026-05-16T15:45:00.000Z")
  );

  assert.deepEqual((metadata as { photoNames: string[] }).photoNames, ["front.jpg"]);
  assert.deepEqual(getInternalNotes(metadata), [
    { text: "Called once", createdAt: "2026-05-15T12:00:00.000Z" },
  ]);
  assert.deepEqual(getLeadQualification(metadata), {
    value: "needs_site_visit",
    updatedAt: "2026-05-16T15:45:00.000Z",
  });
});
