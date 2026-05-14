# Divergent Solutions Lead Intake Spec

Prepared: 2026-05-14

## Purpose

Connect the public quote request form to the private operations app so every website inquiry becomes a private lead with a clear call follow-up target.

This spec covers the first intake slice only. It does not create customers, jobs, quotes, invoices, or calendar events.

## Confirmed Business Rule

Website quote request -> private lead + call reminder only -> Brent/Seth qualify later into customer/job.

Why:

- raw inquiries should not pollute customer or job records
- Brent and Seth need a fast call workflow first
- the app remains the source of truth once the lead is received
- the process stays aligned with the lead-first CRM direction already approved

## Required Lead Data

The private app should preserve the fields currently collected by the public form:

- contact name
- phone
- email
- project address
- service city
- customer type
- project type
- property type
- timeline
- best time to call
- project notes
- uploaded photo file names
- source
- submitted timestamp

The website currently captures photo file names only. Full photo upload/storage can become a later phase once the private app storage upload path is ready.

## Lead Status

New website leads should start with:

- `status`: `new`
- `source`: `website`
- `call_status`: `open`

The first manual status change after a call attempt should be handled in a later private-app UI task.

## Call Reminder

Every website lead should receive a call reminder due within one business day.

Day-one implementation:

- calculate the due date in the private app API
- skip Saturday and Sunday when calculating the next business day
- default the due time to 5:00 PM Central
- store both the due timestamp and open/closed reminder status

This creates a visible operational promise without requiring a separate automation engine on day one.

## API Boundary

The private app should expose a server-only endpoint:

- `POST /api/website-leads`

The public website forwards validated quote requests to that endpoint.

Security expectations:

- require `Authorization: Bearer <secret>`
- keep Supabase secret/service credentials server-side only
- do not expose lead data through unauthenticated public pages

## Non-Goals

Do not build these in this slice:

- customer creation
- job creation
- quote creation
- reminder notification sending
- lead list UI with customer PII
- Supabase Auth UI
- full photo upload storage

## Success Criteria

- a valid website lead request inserts one Supabase `leads` row
- invalid or unauthorized requests are rejected
- the inserted row contains the full quote request context
- the inserted row has an open call reminder due within one business day
- the public website can keep using its existing forwarding endpoint configuration
