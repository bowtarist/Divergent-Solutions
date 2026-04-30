# Divergent Solutions Private App Workflow Design

Prepared: 2026-04-30

## Purpose

Define the day-1 business workflow, core system objects, status pipelines, and schema implications for the private Divergent Solutions app before database schema implementation.

This document is intentionally focused on operations and system behavior, not visual design.

## Context

- Company: Divergent Solutions
- Private app URL: `app.divergentsolutionsllc.com`
- Public website URL: `www.divergentsolutionsllc.com`
- Day-1 internal users: Brent and Seth
- Hosting and backend already chosen:
  - Vercel
  - Supabase
- Auth approach:
  - Supabase magic-link email sign-in
- Existing storage buckets:
  - `lead-photos`
  - `quote-attachments`
  - `job-photos`
  - `documents`
- Stripe should be included on day 1 for payment collection
- Visual design is explicitly out of scope for this stage

## Design Goals

- Keep the app as the operational source of truth
- Support the real workflow from website lead to paid job
- Avoid overbuilding CRM, accounting, inventory, and scheduling features
- Preserve clean upgrade paths for Stripe expansion, supplier ordering, and inventory later
- Make the app practical for two owner-operators, not a generic enterprise platform

## High-Level Product Direction

Recommended approach: `lead-first CRM`

Core workflow spine:

`lead -> qualified customer/address -> draft job -> quote -> accepted -> scheduled -> completed -> invoiced -> paid`

Why this approach:

- It cleanly separates intake, relationship, and operational work
- It prevents every raw inbound inquiry from becoming a fake customer or fake job
- It gives Brent and Seth a practical way to work opportunities before they are sold
- It preserves history for lost leads, accepted quotes, completed jobs, and paid invoices

Rejected alternatives:

- `job-first operations`
  - Too likely to blur sales and production
- `customer-first account model`
  - Heavier than needed for day 1

## Key Decisions Confirmed

- Some leads can be quoted remotely, while others require a site visit first
- A `job` can exist before quote acceptance once Brent or Seth starts real estimating or field prep
- A `customer` should be created at qualification time, not for every inbound lead
- Quotes should support revisions; one job can have many quote versions
- Quote acceptance should support:
  - customer acceptance by link
  - manual internal acceptance entry
- Google Calendar should be used for scheduling, but the app and Google Calendar should be loosely linked rather than fully synchronized
- Stripe should be included on day 1
- A customer can have multiple service addresses over time
- Leads and jobs should support assignment to Brent or Seth
- Materials should support:
  - estimating
  - creation of a supplier-ready material list from quote data
- Inventory management is deferred to a later phase

## End-to-End Day-1 Workflow

### 1. Lead intake

A website quote request or manual intake creates a `lead`.

The lead should store:

- contact details
- service address text
- project description
- source
- uploaded lead photos
- assignee

At this stage, the lead is raw intake, not yet a real customer relationship or operational job.

### 2. Lead review and qualification

Brent or Seth reviews the lead and decides whether it is a real opportunity.

If qualified:

- create or link a `customer`
- create a `service_address`
- create a draft `job`

If not qualified:

- mark the lead lost with a reason

### 3. Estimating and site work prep

The draft `job` becomes the working record for:

- measurements
- job notes
- site visit details
- attachments
- estimating prep
- internal material planning

The workflow must support both:

- remote estimate path
- site-visit-first path

### 4. Quote creation and revision

One `job` can have multiple quote versions.

Rules:

- only one quote version is current at a time
- only one quote can become the accepted quote for the job

The quote workflow should support:

- draft
- send
- revise
- supersede old versions
- accept via link
- manual acceptance entry

### 5. Acceptance and scheduling

Once a quote is accepted:

- the job moves into accepted state
- the lead becomes won
- the job becomes ready to schedule

The app should support creating a Google Calendar event from the accepted job and also store the scheduled date/time snapshot internally.

Important: Google Calendar is a linked scheduling surface, not the workflow engine.

### 6. Job execution

The scheduled job should support:

- start/in-progress status
- field notes
- job photos
- completion notes
- explicit completion marking

### 7. Invoicing

Invoice timing should be flexible.

Common path:

`accepted -> scheduled -> completed -> invoiced -> paid`

But Brent and Seth should also be able to invoice:

- after completion
- same day
- before formal completion if needed

### 8. Payment recording

Payments should be supported through:

- Stripe
- manual fallback entry

The app should remain usable even if a payment is received off-platform.

### 9. Paid job closeout

Once fully paid, the system should preserve the full historical record:

- lead
- customer
- address
- job
- quote history
- invoice history
- payment records
- notes
- photos
- attachments

## Core Objects

### `users`

Internal app users: Brent and Seth.

Purpose:

- auth linkage
- assignment
- activity attribution

### `leads`

Inbound opportunities and early sales handling.

Purpose:

- intake
- qualification
- assignee ownership
- early communication context

### `customers`

The person or business account the company works with.

Purpose:

- relationship continuity across multiple jobs
- repeat business support

### `service_addresses`

A separate property/address record linked to a customer.

Purpose:

- support multiple properties per customer
- avoid duplicating customer identity for each job site

This is a required addition even though it was not in the original object list, because multi-address customers were explicitly approved.

### `jobs`

The operational record for real work, including pre-sale draft jobs.

Purpose:

- estimating work
- measurements
- scheduling
- execution
- billing lifecycle context

### `measurements`

Structured estimating or field measurement data for a job.

Purpose:

- capture remote or onsite measurement data
- keep estimating inputs structured

### `materials`

Reusable materials catalog.

Purpose:

- estimating references
- supplier-facing material list generation

Important:

- this is not inventory management on day 1

### `quotes`

Versioned customer proposals for a job.

Purpose:

- pricing
- scope definition
- acceptance tracking

### `quote_line_items`

Customer-facing pricing rows for a quote.

Purpose:

- what the customer sees and pays for

### `quote_materials`

Internal or supplier-facing material requirements tied to a quote.

Purpose:

- generate supplier-ready material lists from the same estimating work

### `invoices`

Billing records for a job.

Purpose:

- send bills
- track balance due
- connect Stripe billing state

### `payments`

Money received against invoices.

Purpose:

- track successful and manual payments
- support Stripe and manual records

### `notes`

Shared internal notes that can attach to multiple record types.

Purpose:

- keep commentary and follow-up context in one reusable system

### `attachments`

Shared file records that can attach to multiple record types.

Purpose:

- connect Supabase storage files to leads, quotes, jobs, invoices, and documents

## Day-1 Fields

### `users`

- `id`
- `auth_user_id`
- `first_name`
- `last_name`
- `email`
- `phone`
- `is_active`
- `created_at`
- `updated_at`

### `leads`

- `id`
- `source`
- `status`
- `assigned_user_id`
- `first_name`
- `last_name`
- `email`
- `phone`
- `project_type`
- `project_description`
- `preferred_timing`
- `initial_service_address_text`
- `customer_id` nullable
- `job_id` nullable
- `qualified_at` nullable
- `lost_reason` nullable
- `created_at`
- `updated_at`

### `customers`

- `id`
- `customer_type`
- `display_name`
- `primary_first_name` nullable
- `primary_last_name` nullable
- `company_name` nullable
- `email`
- `phone`
- `secondary_phone` nullable
- `notes_summary` nullable
- `created_at`
- `updated_at`

### `service_addresses`

- `id`
- `customer_id`
- `label` nullable
- `address_1`
- `address_2` nullable
- `city`
- `state`
- `postal_code`
- `gate_code` nullable
- `property_notes` nullable
- `is_primary`
- `created_at`
- `updated_at`

### `jobs`

- `id`
- `customer_id`
- `service_address_id`
- `lead_id` nullable
- `assigned_user_id`
- `status`
- `job_type`
- `title`
- `description` nullable
- `quoted_remotely`
- `site_visit_required`
- `site_visit_scheduled_for` nullable
- `scheduled_start_at` nullable
- `scheduled_end_at` nullable
- `google_calendar_event_id` nullable
- `accepted_quote_id` nullable
- `completed_at` nullable
- `invoiced_at` nullable
- `paid_at` nullable
- `created_at`
- `updated_at`

### `measurements`

- `id`
- `job_id`
- `captured_by_user_id`
- `capture_method`
- `captured_at`
- `structure_type` nullable
- `measurement_data` jsonb
- `summary_notes` nullable

### `materials`

- `id`
- `sku` nullable
- `name`
- `category`
- `unit`
- `default_cost` nullable
- `default_price` nullable
- `supplier_name` nullable
- `supplier_code` nullable
- `is_active`
- `created_at`
- `updated_at`

### `quotes`

- `id`
- `job_id`
- `version_number`
- `status`
- `is_current`
- `sent_at` nullable
- `accepted_at` nullable
- `accepted_via` nullable
- `accepted_by_name` nullable
- `subtotal`
- `tax_amount`
- `total`
- `scope_of_work`
- `internal_notes` nullable
- `public_message` nullable
- `created_by_user_id`
- `created_at`
- `updated_at`

### `quote_line_items`

- `id`
- `quote_id`
- `sort_order`
- `name`
- `description` nullable
- `quantity`
- `unit`
- `unit_price`
- `line_total`

### `quote_materials`

- `id`
- `quote_id`
- `material_id` nullable
- `sort_order`
- `item_name`
- `quantity`
- `unit`
- `supplier_notes` nullable

### `invoices`

- `id`
- `job_id`
- `quote_id` nullable
- `invoice_number`
- `status`
- `issued_at` nullable
- `due_at` nullable
- `paid_at` nullable
- `subtotal`
- `tax_amount`
- `total`
- `balance_due`
- `stripe_payment_link_url` nullable
- `stripe_checkout_session_id` nullable
- `notes` nullable
- `created_by_user_id`
- `created_at`
- `updated_at`

### `payments`

- `id`
- `invoice_id`
- `status`
- `payment_method`
- `amount`
- `received_at` nullable
- `reference_number` nullable
- `stripe_payment_intent_id` nullable
- `stripe_checkout_session_id` nullable
- `recorded_by_user_id` nullable
- `notes` nullable
- `created_at`
- `updated_at`

### `notes`

- `id`
- `entity_type`
- `entity_id`
- `body`
- `is_internal`
- `created_by_user_id`
- `created_at`

### `attachments`

- `id`
- `entity_type`
- `entity_id`
- `bucket_name`
- `storage_path`
- `file_name`
- `mime_type`
- `file_size`
- `attachment_kind`
- `uploaded_by_user_id` nullable
- `created_at`

## Status Pipelines

### `lead.status`

- `new`
- `attempting_contact`
- `qualified`
- `quoted`
- `won`
- `lost`

Expected transitions:

- `new -> attempting_contact`
- `new -> qualified`
- `attempting_contact -> qualified`
- `qualified -> quoted`
- `quoted -> won`
- `quoted -> lost`
- `qualified -> lost`

### `job.status`

- `draft`
- `measuring`
- `quoting`
- `quoted`
- `accepted`
- `scheduled`
- `in_progress`
- `completed`
- `invoiced`
- `paid`
- `cancelled`

Expected transitions:

- `draft -> measuring`
- `draft -> quoting`
- `measuring -> quoting`
- `quoting -> quoted`
- `quoted -> accepted`
- `accepted -> scheduled`
- `scheduled -> in_progress`
- `in_progress -> completed`
- `completed -> invoiced`
- `invoiced -> paid`

### `quote.status`

- `draft`
- `sent`
- `accepted`
- `declined`
- `superseded`

Expected transitions:

- `draft -> sent`
- `sent -> accepted`
- `sent -> declined`
- `draft -> superseded`
- `sent -> superseded`

### `invoice.status`

- `draft`
- `sent`
- `partially_paid`
- `paid`
- `void`

Expected transitions:

- `draft -> sent`
- `sent -> partially_paid`
- `sent -> paid`
- `partially_paid -> paid`

### `payment.status`

- `pending`
- `succeeded`
- `failed`
- `refunded`

## System Behavior Rules

- A lead can exist without a customer or job
- Qualifying a lead creates or links a customer, creates or links a service address, and creates a draft job
- A job can have many quotes, but only one quote can be current
- A job can have only one accepted quote
- Accepting a quote should:
  - mark the lead won
  - mark the job accepted
- Creating a Google Calendar event should move the job to scheduled and save the app-side schedule snapshot
- A job should support multiple invoices structurally, even if phase 1 commonly uses one
- Payments belong to invoices, not directly to jobs
- The app should store operational milestones even when an external system like Google Calendar or Stripe is involved

## What Brent and Seth Need to See and Do

### New lead

They should see:

- lead queue
- source
- project description
- contact info
- uploaded photos
- assignee

They should be able to:

- assign ownership
- add notes
- mark contact attempt
- qualify
- close lost

### Qualified opportunity

They should see:

- whether it is a repeat customer
- address status
- whether a site visit is required

They should be able to:

- create or link customer
- create service address
- create draft job
- choose remote estimate or site visit path

### Draft job / estimating

They should see:

- measurements
- notes
- photos
- material planning
- assignment

They should be able to:

- add measurements
- upload job context photos
- add internal notes
- build supplier-facing material requirements
- schedule a site visit if needed

### Quote workflow

They should see:

- current quote version
- older quote versions
- quote line items
- material list
- send/acceptance state

They should be able to:

- draft quote
- revise quote
- supersede old version
- send quote
- share acceptance link
- record manual acceptance

### Scheduling

They should see:

- accepted quote
- ready-to-schedule state
- scheduled date/time snapshot
- linked Google Calendar reference

They should be able to:

- create calendar event
- update scheduled time
- move the job to scheduled

### Execution

They should see:

- schedule details
- accepted scope
- notes
- photos

They should be able to:

- mark in progress
- upload job photos
- add completion notes
- mark complete

### Invoicing and payment

They should see:

- invoice status
- amount due
- Stripe state
- payment history
- outstanding balance

They should be able to:

- create/send invoice
- attach Stripe payment path
- record manual payments
- reconcile invoice as paid

## Phase 1 Scope

- website lead intake
- lead queue and assignment
- lead qualification
- customer creation/linking
- service address records
- draft jobs before sale
- measurements and job notes
- quote versioning
- customer acceptance link
- manual acceptance fallback
- loose Google Calendar linkage
- invoice creation and status tracking
- Stripe-aware payment recording
- manual payment fallback
- notes and attachments across records
- supplier-ready material list generated from quote data

## Phase 2 Scope

- inventory quantities and stock movement
- supplier ordering workflow / purchase orders
- richer Google Calendar sync behavior
- change orders
- deeper reporting and dashboards
- richer permissions beyond Brent and Seth
- advanced CRM activity automation
- accounting integration
- broader automation via `n8n`

## Clean Schema Implications

### 1. Keep `lead`, `customer`, and `job` separate

This is the most important data-modeling decision in the whole design.

Why:

- not every lead becomes real work
- not every real work record should begin as a customer record
- this keeps sales intake cleaner and avoids fake jobs

### 2. Add `service_addresses` as a first-class table

This is required because customers may have multiple properties.

Why:

- repeat jobs stay linked to the same customer
- property-specific history stays intact
- future service/warranty callbacks become easier

### 3. Keep customer-facing pricing separate from supplier-facing materials

Use:

- `quote_line_items` for customer pricing
- `quote_materials` for internal/supplier needs

Why:

- the customer quote and supplier material list are related but not the same artifact
- this allows one estimate to produce two useful outputs

### 4. Keep `materials` simple on day 1

Use the `materials` table as a catalog, not as an inventory ledger.

Why:

- estimating and supplier lists matter now
- inventory counts do not
- future inventory can be layered on later

Expected phase-2 extensions later:

- `purchase_orders`
- `supplier_orders`
- `inventory_items`
- `stock_locations`
- `inventory_receipts`
- `inventory_adjustments`

### 5. Allow multiple quotes and multiple invoices per job

Even if the common day-1 path is simple, the schema should not hardcode:

- one quote forever
- one invoice forever

Why:

- quote revision is already required
- later invoice flexibility is low-cost to preserve now

### 6. Make payments belong to invoices

Why:

- Stripe and manual payments both reconcile more cleanly at the invoice level
- this keeps billing behavior cleaner for future accounting integration

### 7. Use shared `notes` and `attachments`

Why:

- less duplication
- simpler implementation
- easier cross-record behavior

This should be a reusable shared pattern rather than separate note/file systems per module.

### 8. Prefer statuses and milestone timestamps over a workflow engine

Why:

- Brent and Seth do not need a heavy BPM system
- statuses plus timestamps are enough for day 1
- this is easier to query, build, and maintain

## Explicit Anti-Goals

Do not build these into phase 1:

- full accounting
- full inventory management
- complex calendar synchronization
- enterprise e-signature
- generic CRM automation suite
- deep field-service dispatching

## Final Recommendation

Build the private Divergent Solutions app as a lean operations system with clear boundaries:

- the app is the operational source of truth
- Google Calendar is a linked scheduling surface
- Stripe is a payment mechanism, not the system's central model
- material planning supports both estimating and supplier output
- inventory remains a later layer

This design is intentionally conservative: useful on day 1, structured enough for growth, and resistant to overbuilding.
