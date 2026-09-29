# Mapping an existing app

The user often can't list everything their own app does, and nobody enjoys
being asked about things the code could answer. Map first, then interview only
about change.

## What to read

In rough order, stopping when you have the picture:

1. README, docs folder, any existing spec, changelog, open issues or tickets.
2. Package manifests: framework, key dependencies (auth, payments, email, maps,
   analytics, CMS). Dependencies reveal integrations nobody mentions.
3. Routes and screens: the app router or pages directory, React Navigation or
   Expo Router files, native activity or screen lists. Each route is a screen.
4. Data: schema files, migrations, ORM models, API types, seed data. Entities,
   fields, relations, which records belong to whom.
5. Auth and permissions: middleware, role checks, row-level security policies.
6. Outside the app: webhooks, cron or scheduled jobs, queues, email templates,
   environment variable names (never their values).
7. Deploy config: vercel.json, CI pipelines, Dockerfiles, infra files.
8. Tests: they often state the intended behaviour more plainly than the code.

For a large repo, send one scout agent on a cheap model with a brief that asks
for exactly the map below, and read its summary instead of the files.

## The map

Write `docs/blueprint/CURRENT.md`:

```md
# What <app> does today
Mapped: YYYY-MM-DD from commit <sha>

## Roles
- <role>: <what they can do>, evidence: <file>

## Screens
| Screen | Route or file | Roles | Purpose |
|---|---|---|---|

## Main flows
1. <flow>: <steps across screens>

## Data
| Entity | Key fields | Relations | Owner and visibility |
|---|---|---|---|

## Integrations
| Service | Used for | Where |
|---|---|---|

## Stack and hosting
<framework, database, auth, host, environments, deploy>

## Looks unfinished or broken
<dead routes, TODOs, features half-built, tests skipped>

## Couldn't tell from the code
<questions for the user>
```

Cite a file for anything non-obvious so the user can check it. Mark guesses as
guesses.

## Then

Show the user a short version (roles, screens, main flows, integrations, the
"couldn't tell" list) and ask them to correct it. Their corrections go into
NOTES.md. The tracker starts with every topic the map answers marked covered
or partial, so the interview goes straight to the changes.

In the SOW, keep "current" and "planned" apart: each feature is tagged
existing, changing, new or removed.
