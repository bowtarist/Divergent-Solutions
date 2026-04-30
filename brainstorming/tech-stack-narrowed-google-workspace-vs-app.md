# Brent Construction Tech Stack Narrowed Down

Prepared: April 19, 2026

Goal: reduce the longlist into a practical stack strategy using three rules:

1. If Google Workspace already covers a category well enough, treat that category as handled by Google Workspace.
2. If the current Brent Construction application can reasonably own a category, prefer building it into the app instead of adding another subscription.
3. Keep `n8n` external for automation and keep `Airtable` external for flexible database-style workflows.

## Executive Summary

### Categories handled by Google Workspace

- Cloud storage and file sharing
- Internal documents and knowledge base
- Lightweight scheduling and calendar coordination
- Lightweight forms and intake
- Lightweight project coordination for very small workflows

### Categories best built into the Brent Construction app

- Construction and field service management
- Quotes, proposals, and pricing workflow
- Invoicing and payment-status tracking
- CRM-lite for customers, jobs, leads, and communication history
- Job scheduling and crew planning
- Materials catalog and takeoff workflow
- Profit reporting and operational dashboards

### Categories that should stay external

- Automation and integrations: `n8n`
- No-code database and flexible operational workbench: `Airtable`
- Full accounting/bookkeeping: preferably `QuickBooks Online` or similar
- Advanced e-signature/compliance workflows: external if legally robust signatures are needed
- Email marketing at scale: external if recurring campaigns become important

## Decision Table

| Category | Google Workspace Coverage | Build Into Brent App? | Recommended Direction | Why |
|---|---|---:|---|---|
| CRM for small business | Partial | Yes | Build core CRM into app | The app already has customers, jobs, emails, quotes, and invoices. That is a strong base for a construction-specific CRM. |
| Automation and integration | Minimal | No | Use `n8n` externally | You already called this one. It is better outside the app for cross-tool automation and orchestration. |
| No-code databases and internal tools | Partial via Sheets/Forms/AppSheet | No | Use `Airtable` externally | You already called this one too. Airtable is better as the flexible ops layer than rebuilding that capability inside the app. |
| Project and work management | Partial via Tasks, Calendar, Spaces | Yes | Mostly build into app | The app already has jobs and schedule structure. Add task lists, checklists, reminders, and assignments there. |
| Accounting and bookkeeping | Very limited | Partial only | Keep full accounting external | The app should handle estimating, invoice status, and profitability. Do not try to replace real bookkeeping, tax, reconciliation, or payroll. |
| E-signature, proposals, and document workflow | Partial via Docs/PDF workflow | Partial | Build proposals/docs, externalize signatures if needed | Proposal generation fits the app well. Legally stronger or customer-friendly e-sign may still be better with a dedicated vendor. |
| Cloud storage and file sharing | Strong | No | Handle with Google Workspace | Google Drive, Shared Drives, Docs, Sheets, and Gmail already cover this well. No reason to rebuild. |
| Email marketing and lead nurturing | Weak | Not now | External later if needed | This is not core to the current app. Use a dedicated tool only if the business really starts campaigns and nurture flows. |
| Website builder and local lead generation site | Partial via Google Sites | Partial | Separate public site, app receives leads | The internal app should not become the marketing site. Better to keep a public site separate and feed leads into the app. |
| Construction and field service management | Weak | Yes | Make this the app core | This is where the app should win: jobs, measurements, pricing, schedule, materials, invoices, statuses, and reporting. |

## Google Workspace Mapping

These are the categories that can be fully or mostly covered by Google Workspace tools.

### 1. Cloud Storage and File Sharing

Handled by Google Workspace.

Use:

- Google Drive for file storage
- Shared Drives for company-owned folders
- Docs for proposals, SOPs, and notes
- Sheets for lightweight trackers
- Gmail for communication

Why this should stay in Workspace:

- Already part of the company’s chosen business backbone
- Great collaboration and permissions
- No need to rebuild document management in the Brent app

### 2. Internal Documents and Knowledge Base

Handled by Google Workspace.

Use:

- Google Docs for SOPs, scripts, pricing notes, and office procedures
- Google Sites for a simple internal wiki if needed
- Shared Drives for organizing operations docs

This was not a standalone category in the original longlist, but it naturally falls under your Workspace decision and should be treated as solved by Google.

### 3. Lightweight Scheduling and Coordination

Mostly handled by Google Workspace for company calendars.

Use:

- Google Calendar for office schedule, appointments, and reminders
- Google Meet for meetings
- Google Chat or Spaces for internal updates if needed

Important distinction:

- Company-wide calendar coordination belongs in Google Workspace.
- Job-by-job production scheduling belongs in the Brent app.

### 4. Lightweight Forms and Intake

Mostly handled by Google Workspace.

Use:

- Google Forms for quick intake forms, vendor info collection, recruiting, or simple internal requests
- Google Sheets as the destination for responses when needed

Important distinction:

- Temporary or admin forms can stay in Google.
- Real customer leads, job requests, and quote intake should eventually feed into the Brent app.

## What the Brent App Should Own

Based on the current codebase, the application already has a strong foundation in these areas:

- customer and job records
- gutter takeoff workflow
- materials catalog and pricing tiers
- quote generation
- invoice generation
- schedule management
- profitability reporting
- PDF generation
- email sending

That means the best product direction is not “buy more tools first.” It is “let the Brent app become the operating system for the actual construction workflow.”

### 1. CRM for Small Business

Recommendation: build this into the Brent app.

Why:

- Jobs already connect to customers.
- Quotes and invoices already connect to jobs.
- The app already stores customer contact details and job history.

What to add:

- lead status before a job exists
- lead source
- follow-up reminders
- customer activity timeline
- notes log
- outbound call/email history
- customer tags like `builder`, `homeowner`, `commercial`, `repeat`

Bottom line:

You likely do not need a separate CRM right away if the app becomes a stronger construction-specific CRM.

### 2. Project and Work Management

Recommendation: build into the Brent app, not Airtable.

Why:

- For this company, “project management” is really job execution.
- The app already understands jobs, status, materials, and schedule.

What to add:

- per-job task lists
- install checklists
- office checklists
- assign jobs or tasks to team members
- due dates
- change-log / activity feed
- blocked / waiting states

Bottom line:

This is more valuable inside the app than in a general-purpose PM tool because it stays tied to real jobs and customers.

### 3. Construction and Field Service Management

Recommendation: make this the app’s main ownership category.

Why:

- This is already the strongest part of the product.
- Generic field-service tools will be broader, but not necessarily better for Brent’s exact gutter workflow.

What to add:

- crew assignments
- route/day view
- job photos
- change orders
- production notes from the field
- completion checklist
- warranty/service callbacks
- material order tracking

Bottom line:

This is the category where custom software has the highest payoff.

### 4. Quotes, Proposals, and Document Workflow

Recommendation: mostly build into the Brent app.

Why:

- The app already generates quotes and PDFs.
- Proposal logic is directly tied to Brent’s pricing model and materials workflow.

What to add:

- better branded templates
- customer approval workflow
- revision history
- alternate options
- upsell packages
- internal approval notes

What not to overbuild immediately:

- enterprise-grade e-signature compliance

Bottom line:

The app should own proposal generation. If signature capture becomes important, bolt on a dedicated e-sign tool later rather than making that the first problem to solve.

### 5. Invoicing and Payment-Status Tracking

Recommendation: keep in the Brent app, but stop short of full accounting.

Why:

- The app already creates invoices and tracks status.
- Operational invoice visibility belongs close to jobs.

What to add:

- deposit invoices
- progress billing
- final invoice flow
- partial payment tracking
- outstanding balance view
- aging view

What should stay outside:

- bank reconciliation
- chart of accounts
- taxes
- payroll
- accountant-grade reporting

Bottom line:

Operational invoicing in-app makes sense. Full bookkeeping does not.

### 6. Profit Reporting and Dashboards

Recommendation: build and keep in the Brent app.

Why:

- Profit reporting is only useful if it is connected to Brent’s actual materials, labor assumptions, quotes, and invoices.

What to add:

- profit by crew
- profit by material type
- win rate by lead source
- quote-to-close conversion
- monthly revenue trend
- average ticket size

Bottom line:

This is custom and business-specific enough that the app should own it.

## What Should Stay External

### 1. Automation and Integrations

Keep external: `n8n`

Why:

- Better for app-to-app orchestration
- Better for Gmail/Drive/Airtable integrations
- Better for webhooks and background workflows
- Keeps the Brent app focused on product logic rather than becoming an automation engine

Suggested role for `n8n`:

- new website lead -> create lead in Brent app
- quote accepted -> notify team in Google Chat or email
- invoice paid -> update status and archive docs
- Google Form submission -> create customer/job draft

### 2. No-Code Database and Internal Tooling

Keep external: `Airtable`

Why:

- Better for flexible lists, experiments, admin trackers, vendor tables, hiring trackers, and ad hoc operations
- Lets you change structure without deploying app code
- Good home for “messy but useful” business data that should not go straight into the production app

Suggested role for `Airtable`:

- vendor directory
- marketing content calendar
- recruiting pipeline
- equipment list
- long-range planning
- miscellaneous ops database

### 3. Full Accounting and Bookkeeping

Keep external.

Best direction: `QuickBooks Online`

Why:

- This category becomes expensive and risky to custom-build
- CPA support, tax prep, and standard accounting workflows matter more than software purity here

Good split:

- Brent app = job economics and invoice operations
- QuickBooks = actual books

### 4. Advanced E-Signature

Keep external if needed.

Best direction later: `PandaDoc`, `Dropbox Sign`, or `DocuSign`

Why:

- Legal/document-signing workflows are a specialized problem
- Not worth making this a core engineering priority until the business proves the need

## Recommended Narrowed Stack

### Core backbone

- Google Workspace
- Brent Construction app
- `n8n`
- `Airtable`
- `QuickBooks Online`

### What each one owns

- Google Workspace: email, docs, storage, calendar, lightweight forms
- Brent app: leads, customers, jobs, takeoffs, materials, quotes, invoices, scheduling, profit reporting
- `n8n`: automation and integrations
- `Airtable`: flexible operational databases and side workflows
- `QuickBooks Online`: accounting and bookkeeping

## Final Category-by-Category Call

### Handled by Google Workspace

- Cloud storage and file sharing
- Internal docs / knowledge base
- Company calendar coordination
- Lightweight forms and intake

### Handled by the Brent app

- CRM-lite
- Project and work management
- Construction and field service management
- Quotes and proposal workflow
- Invoice operations
- Profit reporting

### External by choice

- Automation: `n8n`
- No-code ops database: `Airtable`
- Accounting: `QuickBooks Online`
- Advanced e-sign: later, if needed
- Email marketing: later, if needed
- Public website: separate marketing layer, feeding the app

## Best Next Build Priorities for the App

If we are steering the app to own more of the stack, these are the best next additions:

1. Lead pipeline before job creation
2. Follow-up reminders and customer timeline
3. Job task lists and production checklists
4. Crew assignment and better schedule views
5. Deposit/progress/final invoice workflow
6. Change orders
7. Job photos and attachments
8. More advanced profitability dashboards

## Conclusion

The cleanest stack is not “ten software subscriptions.”

The cleanest stack is:

- Google Workspace for company-wide collaboration
- the Brent app for Brent-specific operations
- `n8n` for automation
- `Airtable` for flexible side-system data
- one real accounting product for the books

That gives you a much tighter, more intentional stack and avoids paying for generic tools in areas where the current application can become the better fit.
