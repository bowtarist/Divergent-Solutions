# Day-Of Setup Checklist for Brent's House

Use this in order. The goal is to leave Brent's house with the business foundation live and the system moving.

## What To Bring

- [ ] laptop + charger
- [ ] Brent's laptop + charger
- [ ] credit card for subscriptions/domain
- [ ] Brent's phone
- [ ] partner's phone if available
- [ ] existing business logo/files/photos
- [ ] business legal name and address
- [ ] business phone number if already in use
- [ ] access to GitHub/repo

## First 10 Minutes

- [ ] confirm business name
- [ ] confirm preferred domain and 2 backups
- [ ] confirm primary email naming
- [ ] confirm partner's full name and email
- [ ] confirm preferred public phone number
- [ ] confirm service area

## Buy and Secure the Domain

- [ ] buy domain
- [ ] enable auto-renew
- [ ] save registrar login in password manager
- [ ] note renewal date

## Set Up Google Workspace

- [ ] create Google Workspace account
- [ ] verify domain
- [ ] activate Gmail
- [ ] create Brent mailbox
- [ ] create partner mailbox
- [ ] set up `info@`
- [ ] set up `quotes@`
- [ ] set up `billing@`
- [ ] enable 2-Step Verification for admins

## Set Up Mail Security

- [ ] add MX record(s)
- [ ] add SPF
- [ ] generate and add DKIM
- [ ] add DMARC
- [ ] send test email
- [ ] receive test email

## Set Up Google Voice

- [ ] add Google Voice to Workspace
- [ ] choose one shared main number
- [ ] assign Brent
- [ ] assign partner
- [ ] make sure both phones ring
- [ ] test inbound call
- [ ] test outbound call
- [ ] test text message
- [ ] record voicemail greeting

## Install Brent's Computer Tools

- [ ] Xcode Command Line Tools
- [ ] Homebrew
- [ ] Git
- [ ] VS Code
- [ ] Node.js LTS
- [ ] GitHub Desktop
- [ ] Python 3

## Verify Local Tools

- [ ] `git --version`
- [ ] `node --version`
- [ ] `npm --version`
- [ ] `python3 --version`
- [ ] VS Code opens from Finder

## Set Up GitHub

- [ ] create GitHub account if needed
- [ ] enable GitHub 2FA
- [ ] generate SSH key
- [ ] add SSH key to GitHub
- [ ] test GitHub SSH access
- [ ] sign into GitHub Desktop

## Get the Repo Ready

- [ ] clone repo locally
- [ ] confirm brainstorming docs are present
- [ ] open repo in VS Code
- [ ] install dependencies if needed

## Create Cloud Services

- [ ] create Vercel account/team
- [ ] connect GitHub to Vercel
- [ ] create Vercel website project
- [ ] create Vercel app project
- [ ] create Supabase project
- [ ] create Stripe account
- [ ] create n8n account

## Configure Domains

- [ ] point `www.domain.com` to Vercel
- [ ] point `app.domain.com` to Vercel
- [ ] verify both resolve

## Configure Supabase

- [ ] save project URL
- [ ] save anon key
- [ ] save service role key
- [ ] enable auth
- [ ] set magic-link login
- [ ] invite Brent
- [ ] invite partner
- [ ] create storage buckets:
  - [ ] `lead-photos`
  - [ ] `quote-attachments`
  - [ ] `job-photos`
  - [ ] `documents`

## Configure Stripe

- [ ] complete Stripe business profile
- [ ] save publishable key
- [ ] save secret key
- [ ] configure webhook endpoint
- [ ] save webhook secret

## Configure Vercel Environment Variables

- [ ] website env vars
- [ ] app env vars
- [ ] Supabase vars
- [ ] Stripe vars
- [ ] app URL vars

## Public Website Minimum Launch

- [ ] home page
- [ ] services
- [ ] about
- [ ] gallery
- [ ] contact
- [ ] quote request form
- [ ] privacy policy

## Quote Request Flow

- [ ] form creates lead in app
- [ ] 1-3 optional photo uploads work
- [ ] confirmation message displays
- [ ] Brent notified
- [ ] partner notified

## Private App Minimum Launch

- [ ] Brent can sign in
- [ ] partner can sign in
- [ ] lead list works
- [ ] customer/job creation works
- [ ] quote creation works
- [ ] invoice creation works
- [ ] payment link works

## First Dry Run

- [ ] submit fake website lead
- [ ] upload test photos
- [ ] verify lead appears in app
- [ ] convert lead to customer/job
- [ ] create quote
- [ ] create invoice
- [ ] generate Stripe pay-now link
- [ ] complete test payment if ready

## Before Leaving the House

- [ ] both admins can log in to Workspace
- [ ] both admins can log in to app
- [ ] both phones ring on Google Voice
- [ ] domain works
- [ ] website works
- [ ] app works
- [ ] password manager has all logins/keys
- [ ] Brent knows where docs live in repo

## Critical Credentials To Save Before Leaving

- [ ] registrar login
- [ ] Google Workspace admin login
- [ ] Google Voice admin access
- [ ] GitHub login
- [ ] Vercel login
- [ ] Supabase URL / keys
- [ ] Stripe keys / webhook secret
- [ ] n8n login

## If Time Runs Short

Do these first:

- [ ] domain
- [ ] Google Workspace
- [ ] Google Voice
- [ ] GitHub + repo access
- [ ] Vercel
- [ ] Supabase
- [ ] Stripe
- [ ] website quote form to lead creation
- [ ] app login for Brent + partner
