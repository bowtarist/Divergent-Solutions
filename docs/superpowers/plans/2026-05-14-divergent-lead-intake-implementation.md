# Divergent Lead Intake Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first private-app lead intake slice so public quote requests create raw leads with next-business-day call reminders.

**Architecture:** Keep the website as the public validation/front-door and add a private app API endpoint as the trusted intake boundary. The private app maps the website payload into a Supabase `leads` row, calculates the call reminder, and returns only a minimal success payload.

**Tech Stack:** Next.js App Router, TypeScript, Node test runner with `tsx`, Supabase JavaScript client, Supabase SQL migration.

---

## File Structure

- Create: `apps/app/src/lib/lead-intake.ts`
- Create: `apps/app/src/lib/lead-intake.test.ts`
- Create: `apps/app/src/lib/supabase-server.ts`
- Create: `apps/app/src/app/api/website-leads/route.ts`
- Create: `apps/app/src/app/api/website-leads/route.test.ts`
- Create: `apps/app/.env.example`
- Create: `supabase/migrations/20260514000000_lead_intake.sql`
- Modify: `apps/app/package.json`
- Modify: `apps/website/.env.example`
- Modify: `README.md`

## Tasks

- [x] Add app test runner and Supabase dependency.
- [x] Write failing tests for website lead validation, mapping, and business-day reminder calculation.
- [x] Implement `lead-intake.ts`.
- [x] Write failing tests for private API authorization, validation, configuration, and insert behavior.
- [x] Implement `POST /api/website-leads`.
- [x] Add Supabase server insert helper.
- [x] Add `leads` migration with RLS enabled and no public anon/authenticated table grants.
- [x] Add env examples and README setup notes.
- [x] Verify app and website tests, lint, and builds.

## Remaining Deployment Work

- Apply `supabase/migrations/20260514000000_lead_intake.sql` to the live Supabase project.
- Set `PRIVATE_APP_LEADS_SECRET` on both Vercel apps.
- Set `PRIVATE_APP_LEADS_ENDPOINT` on the website app.
- Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` on the private app.
- Submit a real quote request after deployment and confirm a `leads` row is created.
