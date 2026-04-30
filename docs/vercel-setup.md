# Vercel Setup Notes

This document tracks the repo-side setup needed before creating the Vercel projects.

## Repo Shape

The roadmap v2 target structure is:

- `apps/website`
- `apps/app`

Each of those directories should become its own Vercel project connected to the same GitHub repository.

## Vercel Project Plan

We expect two Vercel projects:

1. Website project
   Target directory: `apps/website`
   Planned production domain: `www.<domain>`

2. App project
   Target directory: `apps/app`
   Planned production domain: `app.<domain>`

## Notes from Vercel Docs

- Vercel supports multiple projects connected to one monorepo.
- Each app directory can be imported as a separate Vercel project.
- The framework choice should be settled before scaffolding so build settings stay simple.

## Before Creating Projects

- choose the framework for both apps
- scaffold the app directories
- add environment variable templates
- decide whether website and app share any common package(s)
