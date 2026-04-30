# Brent Construction Setup Roadmap V2

Prepared: April 19, 2026

This version updates the roadmap with the current decisions:

- public marketing site on `www.domain.com`
- private operations app on `app.domain.com`
- both deployed on `Vercel`
- one repo containing two apps
- `Supabase` for Postgres + auth + storage
- `Stripe` for payments
- `Google Workspace` for company backbone
- `Google Voice` for one shared business number
- `n8n` for automation
- leads created directly in the app CRM
- quote request form supports 1-3 optional photos
- Brent and his partner both need access
- simplest app auth path: magic link email sign-in

## Final Stack

### Core services

- Domain and DNS provider
- Google Workspace
- Google Voice
- Vercel
- Supabase
- Stripe
- n8n
- GitHub

### What each one owns

- Domain/DNS: domain purchase, DNS, subdomains
- Google Workspace: email, Drive, Docs, Calendar, admin identity backbone
- Google Voice: shared business calling and texting
- Vercel: public website and private app hosting
- Supabase: Postgres database, auth, storage
- Stripe: online payments and payment records
- n8n: automations and cross-system workflows
- GitHub: source control and deployment integration

## Architecture

### Public site

- `www.domain.com`
- polished marketing site
- hosted on Vercel
- custom design in repo
- includes quote request form

### Private app

- `app.domain.com`
- private Brent operations app
- hosted on Vercel
- used by Brent and partner
- requires login

### App data

- relational data in Supabase Postgres
- photos and attachments in Supabase Storage
- payment events from Stripe stored in app database

### Repo strategy

- one repo
- two apps
- shared types/components only if useful later

Recommended structure:

- `apps/website`
- `apps/app`

## Most Important Change From V1

The current local `sql.js` file-based setup is not the right production model for Vercel. We need to migrate the app to a hosted database and hosted file storage before launch.

The best fit now is:

- move operational data to Supabase Postgres
- move uploads/photos to Supabase Storage
- deploy UI and API routes via Vercel

## Product Direction Decisions

### CRM / lead flow

- source of truth: Brent app
- not Airtable
- website form creates a lead record directly in the app
- optional automation can mirror new leads to Airtable later if wanted

### Auth

- day-1 auth should exist
- simplest path: magic link sign-in via email
- users:
  - Brent
  - Brent's partner
- both should have full admin access for now

### Payments

- payment processor: Stripe
- phase 1:
  - invoice includes `Pay Now`
  - use Stripe-hosted checkout or payment link
- phase 2:
  - full in-app payment timeline/history
  - webhook-driven status updates
  - receipts and payment reconciliation views

### Photos / uploads

- website quote request form:
  - optional 1-3 photos
- private app team uploads:
  - leads
  - quotes
  - jobs
  - before/after pictures
- invoices can reference attachments later, but invoice photo handling is lower priority than lead/job media

### Business phone

- one shared Google Voice main number
- should ring Brent and partner
- used for calls and texting

## Final Day-1 Goals

By the end of the setup visit, the target state should be:

- domain purchased and configured
- Google Workspace live
- Google Voice shared number live
- repo running locally on Brent's machine
- Vercel connected to repo
- Supabase project created
- app deployed to production skeleton
- public site deployed
- app login working for Brent + partner
- quote request form creates a lead
- Stripe account connected
- at least one invoice can generate a payment link

## Updated Setup Order

1. Buy domain and configure DNS
2. Set up Google Workspace
3. Set up Google Voice
4. Secure accounts and password manager
5. Install dev tools on Brent's machine
6. Set up GitHub and repo access
7. Restructure repo for website + app if needed
8. Create Vercel project(s)
9. Create Supabase project
10. Plan and run database migration
11. Add app auth
12. Add file/photo storage
13. Set up Stripe
14. Deploy public site
15. Deploy app
16. Test lead intake
17. Test quote/invoice/payment flow
18. Launch first live job

## Phase 1: Domain, DNS, and Subdomains

### Checklist

- [ ] buy primary domain
- [ ] enable auto-renew
- [ ] secure registrar account
- [ ] decide authoritative DNS provider
- [ ] create `www`
- [ ] create `app`
- [ ] reserve future subdomains if useful:
  `n8n`, `files`, `mail`

### DNS records we likely need

- [ ] Google Workspace verification TXT
- [ ] Google MX
- [ ] SPF TXT
- [ ] DKIM TXT
- [ ] DMARC TXT
- [ ] Vercel records for `www`
- [ ] Vercel records for `app`

## Phase 2: Google Workspace

### Checklist

- [ ] sign up for Google Workspace
- [ ] verify domain
- [ ] activate Gmail
- [ ] create mailboxes:
  - Brent
  - partner
- [ ] create shared mailbox strategy for:
  - `info@`
  - `quotes@`
  - `billing@`
- [ ] enable 2-Step Verification
- [ ] create Shared Drives
- [ ] create calendars

### Shared drives

- [ ] Admin
- [ ] Customers and Jobs
- [ ] Quotes and Invoices
- [ ] Marketing
- [ ] Photos and Media

### Google mail security

- [ ] SPF
- [ ] DKIM
- [ ] DMARC

## Phase 3: Google Voice

### Checklist

- [ ] add Google Voice to Workspace
- [ ] choose one shared main number
- [ ] assign Brent and partner access
- [ ] configure ringing on both phones
- [ ] test inbound call
- [ ] test outbound call
- [ ] test inbound text
- [ ] test outbound text
- [ ] define voicemail greeting

### Questions already answered

- shared main number: yes
- should ring both people: yes

## Phase 4: Brent’s Computer Setup

### Required installs

- [ ] Xcode Command Line Tools
- [ ] Homebrew
- [ ] Git
- [ ] Visual Studio Code
- [ ] Node.js LTS
- [ ] GitHub Desktop
- [ ] Python 3

### Nice-to-have

- [ ] Chrome
- [ ] 1Password or chosen password manager app

### Verify

- [ ] `git --version`
- [ ] `node --version`
- [ ] `npm --version`
- [ ] `python3 --version`
- [ ] VS Code opens repo

## Phase 5: GitHub and Repo

### Checklist

- [ ] GitHub account for Brent
- [ ] GitHub 2FA
- [ ] Git identity configured
- [ ] SSH key created
- [ ] SSH key added to GitHub
- [ ] GitHub Desktop configured
- [ ] repo cloned locally

### Repo structure target

- [ ] website app folder exists
- [ ] private app folder exists
- [ ] deployment docs added
- [ ] environment variable docs added

## Phase 6: Vercel Setup

### Checklist

- [ ] create Vercel account/team
- [ ] connect GitHub to Vercel
- [ ] create project for website
- [ ] create project for app
- [ ] set production domains:
  - `www.domain.com`
  - `app.domain.com`
- [ ] configure preview deployments
- [ ] add environment variables

### Environment variables we will likely need

For website:

- [ ] public site URL
- [ ] lead form endpoint config
- [ ] CAPTCHA/site protection keys if used

For app:

- [ ] Supabase URL
- [ ] Supabase anon key
- [ ] Supabase service role key
- [ ] Stripe publishable key
- [ ] Stripe secret key
- [ ] Stripe webhook secret
- [ ] app base URL
- [ ] email config if needed

## Phase 7: Supabase Setup

### Checklist

- [ ] create Supabase project
- [ ] save project URL
- [ ] save anon key
- [ ] save service role key
- [ ] create production database
- [ ] create storage buckets
- [ ] enable auth
- [ ] configure magic link sign-in
- [ ] invite Brent
- [ ] invite partner

### Storage buckets to create

- [ ] `lead-photos`
- [ ] `quote-attachments`
- [ ] `job-photos`
- [ ] `documents`

### Why Supabase is the right fit

Supabase gives us:

- hosted Postgres
- auth
- storage
- easier early-stage app architecture than stitching separate vendors together

## Phase 8: Data Model and Migration

We need to move from the current local DB model to a cloud relational model.

### Core tables we should expect

- users
- customers
- leads
- jobs
- measurements
- materials
- job_materials
- quotes
- invoices
- payments
- notes
- attachments

### Migration checklist

- [ ] map current schema to Postgres
- [ ] create migrations
- [ ] seed settings
- [ ] seed materials catalog
- [ ] confirm quote numbering strategy
- [ ] confirm invoice numbering strategy

## Phase 9: App Auth

### Day-1 auth approach

- magic link email login
- no complex role system yet
- Brent and partner both admin

### Checklist

- [ ] auth enabled in Supabase
- [ ] allowed redirect URLs configured
- [ ] invite Brent
- [ ] invite partner
- [ ] login screen works
- [ ] logout works
- [ ] protected routes enabled

## Phase 10: Public Website

### Requirements

- polished custom design
- hosted on Vercel
- built in repo
- strong local-business trust signals

### Minimum pages

- [ ] home
- [ ] services
- [ ] about
- [ ] gallery
- [ ] contact
- [ ] quote request
- [ ] privacy policy
- [ ] terms if needed

### Quote request form

- [ ] create lead in app
- [ ] support 1-3 optional photos
- [ ] send confirmation message
- [ ] notify Brent/partner
- [ ] capture source as `website`

### Recommended fields

- name
- phone
- email
- service address
- city
- service needed
- notes
- preferred timing
- 1-3 photos

## Phase 11: Lead Flow and CRM

### Source of truth

- Brent app

### CRM day-1 requirements

- [ ] lead record creation
- [ ] lead source
- [ ] status
- [ ] customer conversion
- [ ] notes
- [ ] photo attachments
- [ ] follow-up reminder placeholder

### Initial lead statuses

- new
- contacted
- estimate scheduled
- quoted
- won
- lost

## Phase 12: Stripe Payments

### Checklist

- [ ] create Stripe account
- [ ] complete business onboarding
- [ ] connect bank account if ready
- [ ] create API keys
- [ ] set webhook endpoint
- [ ] save webhook secret
- [ ] choose payment experience

### Day-1 payment strategy

- invoice has `Pay Now`
- use Stripe-hosted checkout or payment link
- webhook updates invoice/payment status in app

### Day-2 / phase-2 enhancements

- partial payments
- deposits
- progress payments
- payment receipts view
- customer payment history

## Phase 13: Media and Attachment Strategy

### Team uploads

- definitely supported

### Customer uploads

- supported only on quote request form for now
- limit to 1-3 images
- keep UX simple

### Attach media to

- leads
- quotes
- jobs

## Phase 14: n8n Automations

### Initial workflows

- [ ] new website lead -> notify Brent + partner
- [ ] new website lead -> optional Google Sheet or Airtable mirror
- [ ] quote accepted -> create reminder or calendar event
- [ ] payment received -> notify team
- [ ] completed job -> follow-up reminder

### Important rule

`n8n` automates the system. It should not become the source of truth.

## Phase 15: Accounting Direction

You do not have bookkeeping finalized yet, so do not overbuild accounting.

### Recommendation

- app handles operational invoices and payment visibility
- defer full bookkeeping system decision slightly
- likely later choice: QuickBooks Online

## Phase 16: Security, Backups, and Monitoring

### Security

- [ ] 2FA everywhere
- [ ] password manager
- [ ] role review later if staff expands

### Backups

- [ ] confirm Supabase backup availability
- [ ] define export routine for critical data
- [ ] define restore owner

### Monitoring

- [ ] Vercel deployment alerts
- [ ] app error logging
- [ ] Stripe webhook failure alerts
- [ ] lead form failure alerts

## Phase 17: Keys and Secrets Register

### Google Workspace

- [ ] admin login
- [ ] SPF/DKIM/DMARC values

### Google Voice

- [ ] admin login
- [ ] number assignment details

### Vercel

- [ ] team/project access
- [ ] environment variables

### Supabase

- [ ] project URL
- [ ] anon key
- [ ] service role key

### Stripe

- [ ] publishable key
- [ ] secret key
- [ ] webhook secret

### GitHub

- [ ] SSH key
- [ ] PAT only if needed

### n8n

- [ ] n8n login
- [ ] API key if used

## Phase 18: Dry Run

### Public-side test

- [ ] submit quote request
- [ ] upload 1-3 photos
- [ ] confirm lead created
- [ ] confirm notifications sent

### App-side test

- [ ] Brent login works
- [ ] partner login works
- [ ] lead visible
- [ ] convert lead to customer/job
- [ ] create quote
- [ ] send quote
- [ ] accept quote
- [ ] create invoice
- [ ] generate pay-now link
- [ ] complete test payment
- [ ] confirm payment history updates

## Phase 19: First Live Job

- [ ] real lead enters system
- [ ] lead reviewed in app
- [ ] measurements captured
- [ ] quote issued
- [ ] customer pays deposit or invoice
- [ ] schedule set
- [ ] job photos uploaded
- [ ] job completed
- [ ] final payment recorded

## House-Visit Punch List

- [ ] buy domain
- [ ] set up Google Workspace
- [ ] set up Google Voice
- [ ] secure accounts and password storage
- [ ] install Git, VS Code, Node, Python, GitHub Desktop
- [ ] set up GitHub access
- [ ] connect repo
- [ ] create Vercel website project
- [ ] create Vercel app project
- [ ] create Supabase project
- [ ] create Stripe account
- [ ] configure subdomains
- [ ] deploy basic website
- [ ] deploy basic app shell
- [ ] enable magic link login
- [ ] run test lead and test invoice flow

## My Strongest Recommendations

1. Build lead intake directly into the app, not Airtable.
2. Use Supabase instead of trying to piece together separate Postgres, auth, and storage vendors right now.
3. Start Stripe with hosted checkout/payment link, but store the result in your own app records.
4. Add app auth now even if only two people use it.
5. Keep the public website and private app logically separate from day one.

## Final Open Questions

These are small enough that they can be answered during setup:

- exact domain name
- exact mailbox naming
- exact Google Voice greeting and routing behavior
- exact design direction for the public site
- whether quote request confirmations go to both Brent and partner by email, text, or both
