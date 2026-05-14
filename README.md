# Divergent Solutions

This repository is the home for the Divergent Solutions public website and private operations app.

## Current Scope

- `brainstorming/`: planning documents, roadmap notes, and business thinking
- `apps/website/`: public marketing site for `www.divergentsolutionsllc.com`
- `apps/app/`: private operations app for `app.divergentsolutionsllc.com`
- `docs/`: deployment and environment setup notes
- `supabase/`: database migration files

## Phase Status

- Public website launch build is in progress.
- First private-app lead intake slice is in progress.

## Planned Architecture

- one GitHub repository
- one public website app
- one private operations app
- Vercel for hosting
- Supabase for database, auth, and storage
- Stripe for payments

## Lead Intake

The public website posts validated quote requests to the private app endpoint:

`POST https://app.divergentsolutionsllc.com/api/website-leads`

The private app creates a raw `leads` row in Supabase with:

- `source = website`
- `status = new`
- `call_status = open`
- a next-business-day call reminder due by 5:00 PM Central

Day-one intake intentionally does not create customers or jobs. Brent or Seth qualifies a lead later before it becomes real customer/job workflow data.

Required environment variables:

- Website: `PRIVATE_APP_LEADS_ENDPOINT`
- Website: `PRIVATE_APP_LEADS_SECRET`
- Private app: `PRIVATE_APP_LEADS_SECRET`
- Private app: `SUPABASE_URL`
- Private app: `SUPABASE_SERVICE_ROLE_KEY`

The same `PRIVATE_APP_LEADS_SECRET` value must be configured on both apps.
