# Brent Construction Business Setup Roadmap

Prepared: April 19, 2026

Purpose: give us a complete, check-off-able roadmap from buying the domain through landing and running the first real job.

This roadmap assumes:

- Google Workspace will be the company backbone
- `n8n` will stay external for automation
- `Airtable` will stay external for flexible ops databases
- the Brent Construction app will become the operations hub
- Brent wants to work on the repo locally on his own computer

## Big Picture Stack

- Domain and DNS: buy and manage the business domain
- Google Workspace: email, Drive, Docs, Shared Drives, Calendar, Forms
- Brent Construction app: leads, customers, jobs, materials, quotes, invoices, schedule, profit reporting
- `n8n`: automation between systems
- `Airtable`: flexible side workflows and operational databases
- GitHub + Git: source control and collaboration
- QuickBooks Online: bookkeeping and accounting

## What To Bring To Brent’s House

Before you go, make sure you have:

- laptop charger
- Brent’s laptop and admin password
- a credit card for subscriptions and domain purchase
- Brent’s business legal name and DBA if different
- business address
- phone number to use publicly
- existing logo files, photos, and branding if available
- access to Brent’s current email accounts if any
- access to the GitHub repository or organization
- a phone available for two-factor authentication

## Information To Collect Before Signing Up For Anything

Have Brent answer these first:

- exact business name to use publicly
- preferred domain name, plus 2 backups
- preferred main business email address:
  `info@domain.com`, `office@domain.com`, or `brent@domain.com`
- who needs mailboxes on day 1
- what phone number goes on quotes and invoices
- business hours
- service area / cities served
- tax rate assumptions
- payment terms
- quote validity terms
- whether Brent wants to text customers from a business number later

## Recommended Install / Signup Order

Use this exact order at the house:

1. Buy domain and set up DNS
2. Sign up for Google Workspace
3. Verify domain and activate Gmail
4. Secure Google Workspace with 2FA and recovery settings
5. Install computer tools: Git, Homebrew, VS Code, Node, GitHub Desktop, Python
6. Set up GitHub login and SSH key
7. Clone and run the Brent Construction repo locally
8. Configure app business settings
9. Create `n8n` account and first credentials
10. Create Airtable workspace if still desired
11. Create QuickBooks Online account
12. Set up first automations
13. Create first customer, job, quote, and invoice
14. Run a full dry run
15. Launch first real job

## Phase 1: Buy the Domain and Set Up DNS

### Checklist

- [ ] Choose the primary domain name
- [ ] Choose a registrar / DNS provider
- [ ] Buy the domain
- [ ] Turn on domain auto-renew
- [ ] Store registrar login in the company password vault
- [ ] Confirm who manages DNS
- [ ] Record renewal date and annual cost

### Recommended direction

- Best simple choice: buy the domain where Brent is comfortable and keep clean DNS access
- Strong operational choice: use Cloudflare DNS once the domain is purchased or purchased there directly if available

### DNS records we will likely touch

- `TXT` for Google Workspace domain verification
- `MX` for Google Workspace email routing
- `TXT` for SPF
- `TXT` for DKIM
- `TXT` for DMARC
- `A` or `CNAME` for the public website
- `CNAME` for any subdomains like `n8n.domain.com`

### Decisions to make right away

- [ ] root domain for website: `domain.com`
- [ ] `www` subdomain behavior
- [ ] business email naming format
- [ ] whether `n8n.domain.com` will be used later
- [ ] whether a client portal subdomain may exist later

## Phase 2: Set Up Google Workspace

### Checklist

- [ ] Sign up for Google Workspace
- [ ] Connect the purchased domain
- [ ] verify domain ownership with Google
- [ ] add Google MX record(s)
- [ ] activate Gmail in Admin console
- [ ] create Brent’s mailbox
- [ ] create any shared inboxes needed:
  `info@`, `billing@`, `quotes@`
- [ ] enable 2-Step Verification for admins
- [ ] add recovery phone / recovery email
- [ ] create Shared Drives
- [ ] create Google Calendar(s)
- [ ] create baseline folder structure in Drive

### Shared Drives to create

- [ ] `Operations`
- [ ] `Customers & Jobs`
- [ ] `Quotes & Invoices`
- [ ] `Marketing`
- [ ] `Admin`

### Google Calendars to create

- [ ] `Brent Construction Main`
- [ ] `Install Schedule`
- [ ] `Sales Appointments`

### Google Workspace setup details

We will likely do these DNS/security steps during or right after setup:

- [ ] domain verification TXT record
- [ ] MX record for Gmail
- [ ] SPF record
- [ ] DKIM key generation and DNS record
- [ ] DMARC record

### Notes on mail security

- SPF and DKIM should be set early
- DMARC should be added once mail is flowing correctly
- if the app sends mail directly through Gmail SMTP, Brent may need a Google App Password if Google OAuth is not implemented for that mail flow

## Phase 3: Secure the Business Accounts

This is easy to skip and annoying to fix later, so do it now.

### Checklist

- [ ] enable 2FA on Google Workspace admin account
- [ ] enable 2FA on GitHub account
- [ ] enable 2FA on registrar account
- [ ] enable 2FA on `n8n`
- [ ] enable 2FA on Airtable
- [ ] enable 2FA on QuickBooks
- [ ] choose a password manager strategy
- [ ] create and save recovery codes

### Recommended apps / setup

- [ ] install an authenticator app on Brent’s phone
- [ ] install a password manager or choose a secure existing one

### Minimum security rule

Every login, key, token, and app password should be stored in one secure place Brent can access later without guessing.

## Phase 4: Install Software on Brent’s Computer

These are the local tools I would install on day 1.

### Required installs

- [ ] Xcode Command Line Tools
- [ ] Homebrew
- [ ] Git
- [ ] Visual Studio Code
- [ ] Node.js LTS
- [ ] GitHub Desktop
- [ ] Python 3

### Recommended installs

- [ ] Google Chrome
- [ ] Docker Desktop only if you later want local container workflows
- [ ] a good text editor is already covered by VS Code
- [ ] terminal app is optional; macOS Terminal is fine

### Why each matters

- Xcode Command Line Tools: needed by many dev tools on macOS
- Homebrew: easiest package manager for Brent’s machine
- Git: version control
- VS Code: easiest editor for this app
- Node.js LTS: required to run the current app
- GitHub Desktop: easier visual Git workflow if Brent prefers GUI
- Python 3: not required by the current app, but useful for scripts, automations, exports, and future tooling

### Local development checklist

- [ ] confirm `git --version`
- [ ] confirm `node --version`
- [ ] confirm `npm --version`
- [ ] confirm `python3 --version`
- [ ] confirm `code` command works from terminal

## Phase 5: Set Up GitHub and Repo Access

### Checklist

- [ ] create Brent’s GitHub account if he does not already have one
- [ ] turn on GitHub 2FA
- [ ] set Git username
- [ ] set Git email
- [ ] generate SSH key on Brent’s computer
- [ ] add SSH public key to GitHub
- [ ] test GitHub SSH connection
- [ ] install GitHub Desktop and sign in
- [ ] clone repository locally
- [ ] open repo in VS Code

### Git config values to set

- [ ] `user.name`
- [ ] `user.email`
- [ ] default branch awareness
- [ ] preferred editor if needed

### Repository workflow decisions

- [ ] confirm where the repo lives
- [ ] confirm whether Brent pushes directly to `main` or uses feature branches
- [ ] confirm whether GitHub Desktop or terminal Git will be the main workflow

## Phase 6: Run the Brent Construction App Locally

The current app is a Vite frontend plus Express backend, so day 1 local setup should be simple.

### Checklist

- [ ] clone repo
- [ ] install dependencies with `npm install`
- [ ] run the app locally
- [ ] verify frontend loads
- [ ] verify backend starts
- [ ] verify database file initializes
- [ ] verify sample dashboard loads

### Local run checklist

- [ ] app runs without errors
- [ ] local URL opens
- [ ] jobs page works
- [ ] quotes page works
- [ ] invoices page works
- [ ] schedule page works
- [ ] settings page works

### App settings to enter immediately

- [ ] company name
- [ ] company address
- [ ] city/state/zip
- [ ] company phone
- [ ] company email
- [ ] quote terms
- [ ] invoice terms
- [ ] invoice due days
- [ ] next quote number
- [ ] next invoice number
- [ ] default pricing tier

## Phase 7: Set Up App Email Delivery

The current app already supports email sending through Gmail SMTP-style credentials.

### Checklist

- [ ] decide whether to send from Brent’s mailbox or a shared mailbox
- [ ] turn on 2-Step Verification for that Google account
- [ ] generate App Password if the app continues using Gmail SMTP auth
- [ ] store Gmail address securely
- [ ] store App Password securely
- [ ] enter Gmail settings in the Brent app
- [ ] run the app’s test email
- [ ] send a test quote email
- [ ] send a test invoice email

### Important note

If you later switch the app to Google OAuth instead of Gmail app passwords, the credential set will change. For day 1, App Password is the simplest path if the current app remains unchanged.

## Phase 8: Create the Core Google Workspace Structure

### Google Drive folder checklist

- [ ] `Customers`
- [ ] `Active Jobs`
- [ ] `Completed Jobs`
- [ ] `Templates`
- [ ] `Brand Assets`
- [ ] `Vendors`
- [ ] `Photos`
- [ ] `Taxes & Accounting`

### Template docs to create

- [ ] company letterhead doc
- [ ] installation checklist
- [ ] measurement checklist
- [ ] customer intake form
- [ ] warranty / follow-up template

### Google Forms to consider

- [ ] website lead form
- [ ] supplier onboarding form
- [ ] internal issue report form

## Phase 9: Set Up `n8n`

### Checklist

- [ ] create `n8n` account
- [ ] decide cloud vs self-hosted
- [ ] create owner account
- [ ] enable 2FA
- [ ] create at least one API key if using the n8n API
- [ ] connect Google Workspace credentials
- [ ] connect Airtable credentials
- [ ] connect Brent app API if applicable
- [ ] connect GitHub if desired
- [ ] build first workflow

### My recommendation

- easiest day-1 route: `n8n Cloud`
- reason: less ops burden, faster start, managed OAuth support for several Google nodes

### First workflows to build

- [ ] website or intake form submission -> create lead in Brent app or Airtable
- [ ] accepted quote -> create/install calendar event
- [ ] invoice paid -> notify Brent and update records
- [ ] job completed -> create follow-up reminder

### If self-hosting later

You may also need:

- [ ] hosting account or VPS
- [ ] reverse proxy
- [ ] `WEBHOOK_URL`
- [ ] `N8N_HOST`
- [ ] `N8N_PROTOCOL`
- [ ] `N8N_PROXY_HOPS`
- [ ] subdomain like `n8n.domain.com`

## Phase 10: Set Up Airtable

Because you want Airtable external, set it up as a flexible side system, not as the main app database.

### Checklist

- [ ] create Airtable workspace
- [ ] create base for operations
- [ ] create personal access token if needed for automations
- [ ] store base ID and token securely

### Good Airtable uses

- [ ] vendor directory
- [ ] recruiting / hiring
- [ ] marketing ideas
- [ ] equipment list
- [ ] backlog / experimental workflows

### What not to do in Airtable

- do not let Airtable become the primary source of truth for live customer jobs if the Brent app is supposed to own operations

## Phase 11: Set Up Accounting

### Checklist

- [ ] create QuickBooks Online account
- [ ] set company profile
- [ ] connect business bank account later when Brent is ready
- [ ] configure invoices / taxes / chart of accounts with bookkeeper input if possible
- [ ] define what gets tracked only in app vs in QuickBooks

### Split of responsibilities

- Brent app: operational quoting, invoicing, job profitability
- QuickBooks: bookkeeping, reconciliation, tax reporting, accountant workflow

## Phase 12: Public Website and Lead Intake

Even if this is simple at first, define the path.

### Checklist

- [ ] decide where public website will live
- [ ] connect domain to website
- [ ] create business email addresses on the site
- [ ] create lead capture form
- [ ] send leads into Brent app or Airtable
- [ ] publish contact info and service area

### Minimum pages to launch

- [ ] home
- [ ] services
- [ ] about
- [ ] contact
- [ ] quote request

### Recommended rule

Keep the public marketing website separate from the internal Brent app. The site should feed leads into the app, not replace it.

## Phase 13: Keys, Secrets, APIs, and Credentials Register

This is the part people forget. Use this checklist while setting everything up.

### Domain / DNS

- [ ] registrar login
- [ ] DNS provider login

### Google Workspace

- [ ] Google Workspace admin login
- [ ] domain verification TXT value
- [ ] MX record values
- [ ] SPF record
- [ ] DKIM selector and public key
- [ ] DMARC record
- [ ] App Password for Gmail SMTP if used by app

### GitHub / Development

- [ ] GitHub login
- [ ] SSH private key stored locally
- [ ] SSH public key added to GitHub
- [ ] GitHub Personal Access Token only if needed for scripts or APIs

### Brent App

- [ ] app `.env` file if introduced later
- [ ] database backup location
- [ ] any future session secret or JWT secret if auth is added

### `n8n`

- [ ] `n8n` login
- [ ] `n8n` API key if using the API
- [ ] Google OAuth credential in `n8n`
- [ ] Airtable token in `n8n`
- [ ] Brent app API credential if/when the app exposes one
- [ ] webhook base URL if self-hosted

### Airtable

- [ ] Airtable personal access token
- [ ] base ID(s)

### QuickBooks

- [ ] Intuit / QuickBooks login
- [ ] any integration keys only if you later automate against QuickBooks APIs

## Phase 14: Future API / OAuth Credentials To Expect

Not all of these are needed on day 1, but these are the realistic ones to plan for.

### Likely needed soon

- Google App Password for app email sending
- `n8n` API key
- Airtable personal access token
- GitHub SSH key

### Needed if we automate Brent app with other tools

- Brent app API token or API key
- webhook secret
- `n8n` webhook URLs

### Needed if we use Google APIs beyond basic Workspace login

- Google Cloud project
- OAuth consent screen
- OAuth client ID / client secret
- redirect URIs for `n8n` or the app
- enabled APIs such as:
  Gmail API, Drive API, Sheets API, Calendar API

### Needed if Brent app eventually adds login/auth

- session secret
- password reset email config
- OAuth keys if login with Google is added

## Phase 15: Brent App Roadmap Phases

This is the product roadmap portion, aligned to setup work.

### Phase 1: Business Foundation

Goal: get Brent operational fast.

- [ ] business settings completed
- [ ] materials pricing confirmed
- [ ] Gmail sending working
- [ ] first quote generated
- [ ] first invoice generated
- [ ] local backups defined

### Phase 2: CRM and Lead Flow

Goal: stop losing leads and follow-ups.

- [ ] lead status before job creation
- [ ] lead source tracking
- [ ] follow-up reminders
- [ ] customer timeline
- [ ] notes / activity log

### Phase 3: Job Operations

Goal: run active work cleanly.

- [ ] task lists
- [ ] crew assignments
- [ ] better schedule views
- [ ] job photos and attachments
- [ ] change orders
- [ ] completion checklist

### Phase 4: Reporting and Automation

Goal: make the system smarter.

- [ ] profit dashboards
- [ ] conversion dashboards
- [ ] `n8n` workflows
- [ ] Airtable side-system sync where useful
- [ ] accounting handoff process

## Phase 16: Dry Run Before Real Customers

Before going live, do a full dress rehearsal.

### Checklist

- [ ] create a fake customer
- [ ] create a fake job
- [ ] enter measurements
- [ ] build materials list
- [ ] generate quote
- [ ] email quote
- [ ] mark quote accepted
- [ ] convert to invoice
- [ ] email invoice
- [ ] mark invoice paid
- [ ] schedule the job
- [ ] verify profit report
- [ ] verify folders/docs land in the right places
- [ ] verify any `n8n` automations fire correctly

## Phase 17: Launch the First Real Job

This is the operational go-live sequence.

### First live customer flow

- [ ] capture the lead
- [ ] create customer in Brent app
- [ ] create job record
- [ ] confirm job address and contact details
- [ ] enter measurements / takeoff
- [ ] review pricing tier
- [ ] generate quote PDF
- [ ] send quote to customer
- [ ] mark accepted when approved
- [ ] convert to invoice or deposit invoice as needed
- [ ] schedule install date
- [ ] notify Brent via calendar / automation
- [ ] complete the job
- [ ] mark invoice paid
- [ ] verify profit
- [ ] store all related docs in Drive

## Day-1 At-The-House Checklist

If you want the shortest practical version, this is the order I would actually follow live:

- [ ] pick and buy domain
- [ ] sign up for Google Workspace
- [ ] verify domain and activate Gmail
- [ ] create Brent’s mailbox and shared inboxes
- [ ] set up SPF, DKIM, and DMARC
- [ ] enable 2FA everywhere
- [ ] install Xcode CLT
- [ ] install Homebrew
- [ ] install Git
- [ ] install VS Code
- [ ] install Node.js LTS
- [ ] install GitHub Desktop
- [ ] install Python 3
- [ ] create or secure GitHub account
- [ ] generate SSH key and connect GitHub
- [ ] clone repo and run app locally
- [ ] fill app business settings
- [ ] create Gmail App Password if app email uses it
- [ ] test sending quote/invoice email
- [ ] create `n8n` account
- [ ] connect Google + `n8n`
- [ ] create Airtable workspace
- [ ] create QuickBooks Online account
- [ ] run a fake job through the app
- [ ] create first real lead/customer if available

## First-Week Checklist

These are the follow-up items after the house visit.

- [ ] decide final public website platform
- [ ] publish website
- [ ] connect lead form into Brent app or Airtable
- [ ] build first 2-3 `n8n` automations
- [ ] tighten app CRM features
- [ ] define backup routine
- [ ] define bookkeeping handoff to QuickBooks
- [ ] create SOPs in Google Docs
- [ ] build out job task/checklist features in the app

## Best Guess at the Minimal Final Stack

- Domain + DNS
- Google Workspace
- Brent Construction app
- `n8n`
- `Airtable`
- QuickBooks Online
- GitHub
- Git / VS Code / Node on Brent’s computer

## Source Links

Official references I used for the setup logic and current tooling:

- [Google Workspace: Verify your domain](https://support.google.com/a/answer/60216?hl=en)
- [Google Workspace: Verify with TXT record](https://support.google.com/a/answer/6160254?hl=en)
- [Google Workspace: Set up MX records](https://support.google.com/a/answer/9174449?hl=en)
- [Google Workspace: Set up DKIM](https://support.google.com/a/answer/174124?hl=en)
- [Google Account: App passwords](https://support.google.com/accounts/answer/185833?hl=en)
- [n8n Cloud overview](https://docs.n8n.io/choose-n8n/cloud/)
- [n8n API authentication](https://docs.n8n.io/api/authentication/)
- [n8n Google credentials](https://docs.n8n.io/integrations/builtin/credentials/google/)
- [n8n webhook URL config](https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/)
- [GitHub: Set up Git](https://docs.github.com/en/get-started/git-basics/set-up-git)
- [GitHub: Connecting with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [GitHub: Personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Homebrew install](https://brew.sh/)
- [Homebrew installation docs](https://docs.brew.sh/Installation.html)
- [Node.js downloads](https://nodejs.org/en/download)
- [Python macOS downloads](https://www.python.org/downloads/macos/)
- [VS Code on macOS](https://code.visualstudio.com/docs/setup/osx)
- [GitHub Desktop install](https://docs.github.com/desktop/installing-and-configuring-github-desktop/installing-and-authenticating-to-github-desktop/installing-github-desktop)
