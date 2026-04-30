# Brent Construction Software Plan

This document explains what each service is, why Brent Construction needs it, and the main ways it will help the business.

The goal is not to create a giant complicated system. The goal is to give Brent Construction a simple, modern business setup that helps the team:

- respond to leads faster
- stay organized
- send quotes and invoices professionally
- get paid online
- keep job information in one place
- avoid losing important customer details

## 1. Domain Name

What it is:

- the business web address, like `brentconstruction.com`

Why we need it:

- looks professional
- gives the company branded email addresses
- gives the website and app a permanent home

Top use cases:

- website address for customers
- email addresses like `info@yourdomain.com`
- subdomains like `www.yourdomain.com` and `app.yourdomain.com`

## 2. Google Workspace

What it is:

- Google's business tools: Gmail, Drive, Docs, Calendar, and admin controls

Why we need it:

- gives the business professional email
- keeps company files organized
- makes scheduling and collaboration easier

Top use cases:

- business email
- shared documents and folders
- calendars for appointments and jobs
- shared business records instead of scattered personal accounts

## 3. Google Voice

What it is:

- a shared business phone number for calling and texting

Why we need it:

- keeps the business phone separate from personal numbers
- lets Brent and his partner both receive calls/texts
- makes the business look more professional

Top use cases:

- one main company number
- shared inbound calls
- shared texting with customers
- voicemail and missed-call handling

## 4. Public Website

What it is:

- the customer-facing website for Brent Construction

Why we need it:

- gives customers a place to learn about services
- builds trust and credibility
- collects leads directly from the internet

Top use cases:

- show services and before/after work
- explain service area
- provide contact details
- collect quote requests

## 5. Private Brent App

What it is:

- the internal company dashboard for managing the business

Why we need it:

- becomes the central place to manage customers, jobs, quotes, invoices, and schedules
- replaces scattered spreadsheets and memory-based tracking

Top use cases:

- track leads and customers
- create jobs
- build quotes
- send invoices
- track payments
- store job notes and photos

## 6. Vercel

What it is:

- the cloud service that hosts the website and app

Why we need it:

- makes the website and app available from anywhere
- works across multiple devices
- allows updates to go live quickly

Top use cases:

- host the marketing site
- host the private app
- deploy updates from GitHub

## 7. Supabase

What it is:

- the cloud system that provides the app's database, sign-in, and file storage

Why we need it:

- stores the important business data safely in the cloud
- allows Brent and his partner to use the app from different devices
- stores things like customer info, jobs, and photos

Top use cases:

- database for leads, customers, jobs, quotes, invoices
- sign-in for the app
- storage for lead photos and job photos

## 8. Stripe

What it is:

- the payment system for online invoice payments

Why we need it:

- lets customers pay online
- makes getting paid easier and faster
- gives payment records that can show in the app

Top use cases:

- `Pay Now` links on invoices
- card payments from customers
- payment history tracking

## 9. n8n

What it is:

- an automation tool that connects services together

Why we need it:

- saves time by automating repetitive tasks
- reduces missed follow-ups and manual data copying

Top use cases:

- when a website lead comes in, notify Brent automatically
- when a quote is accepted, create reminders
- when a payment is received, notify the team
- move information between systems without hand entry

## 10. GitHub

What it is:

- the code repository where the website and app live

Why we need it:

- keeps the code backed up
- makes it possible to update the website and app safely
- lets changes be tracked over time

Top use cases:

- store the project files
- deploy to Vercel
- keep a history of changes

## 11. VS Code, Git, Node, and Python on Brent's Computer

What they are:

- development tools used to work on the project locally

Why we need them:

- they make it possible to open, edit, run, and update the website/app from Brent's computer

Top use cases:

- open the project
- run the app locally if needed
- make updates
- troubleshoot problems

## 12. Airtable

What it is:

- a flexible spreadsheet/database tool

Why we might use it:

- useful for side workflows that do not belong in the core app

Top use cases:

- vendor lists
- recruiting
- marketing ideas
- operational trackers that are separate from live customer jobs

Important note:

- Airtable is not planned to be the main CRM
- the main customer and job records should live in the app

## How Everything Works Together

Here is the simple version:

1. A customer visits the website.
2. They request a quote and optionally upload 1-3 photos.
3. That creates a lead in the private app.
4. Brent or his partner reviews the lead and creates a quote.
5. The customer receives the quote and later an invoice.
6. The customer can pay online through Stripe.
7. The payment status shows in the app.
8. n8n can automate notifications and reminders around that process.

## Why This Is Better Than Piecing Things Together Randomly

- one professional domain
- one business email system
- one shared business phone number
- one website for customers
- one app for operations
- one payment system
- one automation system

That means less confusion, less duplication, and a better chance of the business staying organized as it grows.

## Main Benefits Brent Should Expect

- faster response to leads
- more professional appearance
- easier teamwork between Brent and his partner
- cleaner quotes and invoices
- easier payment collection
- better job tracking
- less information lost in texts, calls, and notes

## What This Does Not Mean

This does not mean the business is becoming overly complicated.

It means we are setting up a simple foundation now so Brent Construction does not have to rebuild everything later after leads, customers, and jobs are already piling up.
