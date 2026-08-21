# Tytan Weekly Summary

A small internal tool that replaces the manual "copy the template into an
email" workflow. Team members fill out a form (same six sections you
already use), it's saved, and everyone in a leadership role gets an email
the moment it's submitted. A dashboard shows a roll call of who has and
hasn't submitted for the current week, plus every report on file.

No login is required — anyone with the link can use it, per your setup.

## What's in here

- `app/page.tsx` — the submission form
- `app/dashboard/page.tsx` — leader dashboard (roll call + full report list)
- `app/api/submit/route.ts` — saves a report, then emails leaders
- `app/api/submissions/route.ts` — feeds the dashboard
- `lib/team.ts` — the roster. **Edit this file whenever someone joins,
  leaves, or changes role** — it drives the name dropdown, the roll call,
  and who gets notification emails.
- `supabase-schema.sql` — the one table this needs

## 1. Create the database (Supabase, free tier)

1. Go to [supabase.com](https://supabase.com) → New Project.
2. Once it's up, open **SQL Editor** → New query → paste the contents of
   `supabase-schema.sql` → Run.
3. Go to **Project Settings → API**. You'll need:
   - `Project URL` → this is `SUPABASE_URL`
   - `service_role` key (not the `anon` key) → this is `SUPABASE_SERVICE_ROLE_KEY`

   The service role key is powerful — it bypasses Row Level Security. That's
   fine here because it's only ever used server-side (inside the API
   routes), never sent to the browser. Don't put it in anything prefixed
   `NEXT_PUBLIC_`.

## 2. Set up email (Resend, free tier — 3,000 emails/month)

1. Go to [resend.com](https://resend.com) → sign up → **API Keys** → create one.
   That's `RESEND_API_KEY`.
2. For real delivery from your own address (e.g. `weekly-summary@tytanteams.com`),
   add and verify the `tytanteams.com` domain under **Domains** in Resend
   (a few DNS records). Until that's done, you can test with Resend's
   shared address `onboarding@resend.dev` as `NOTIFY_FROM_EMAIL`.

## 3. Deploy to Vercel

1. Push this folder to a new GitHub repo (same flow as Tytan Call Navigator).
2. In Vercel: **New Project** → import that repo.
3. Add these Environment Variables in the Vercel project settings:

   | Key | Value |
   |---|---|
   | `SUPABASE_URL` | from step 1 |
   | `SUPABASE_SERVICE_ROLE_KEY` | from step 1 |
   | `RESEND_API_KEY` | from step 2 |
   | `NOTIFY_FROM_EMAIL` | e.g. `weekly-summary@tytanteams.com` |
   | `NEXT_PUBLIC_APP_URL` | your Vercel URL, e.g. `https://tytan-weekly-summary.vercel.app` (set this after the first deploy, then redeploy) |

4. Deploy. Share the root URL with the team for submissions, and the
   `/dashboard` URL with leaders.

## Running it locally (optional, for testing before you deploy)

```bash
npm install
cp .env.example .env.local   # fill in the real values
npm run dev
```

Then open `http://localhost:3000` for the form and
`http://localhost:3000/dashboard` for the dashboard.

## What's new since the first version

- **7th section**: "Next Steps / Preparations."
- **Test mode**: a checkbox on the form ("This is a test submission — send
  the notification to me only"). It saves the report normally but routes
  the notification to `christine@tytanteams.com` (see `TEST_NOTIFY_EMAIL`
  in `lib/team.ts`) instead of the real leader, so anyone can confirm
  email delivery works without pinging someone else.
- **Leader-specific routing**: each member's report now emails only their
  direct leader (not a broadcast to everyone). Leaders' own reports go to
  the CEO. This is all defined in `lib/team.ts` via each person's
  `reportsTo` field.
- **David Brown**: back in the roster, reporting to no one — his reports
  save normally but don't trigger a notification (nobody configured to
  receive it).
- **Dashboard access, done properly**: only 5 people can log into
  `/dashboard` at all — Britt and the 4 leaders — each with **their own
  separate password** (see the 5 `DASHBOARD_PASSWORD_*` variables below).
  There's no dropdown to switch identities and no shared password: the
  server decides what each person can see based on which password they
  entered, and a leader only ever sees their own team's reports (Britt
  sees everyone). Regular team members have no path into the dashboard at
  all. This is enforced server-side in `app/api/submissions/route.ts`, not
  just hidden in the UI.
- **No logo — brand colors instead**: the header uses a small "TYTAN
  TEAMS" wordmark and the whole UI is now built on your brand palette
  (navy `#10125F`, yellow `#E4C423`) rather than a placeholder image.

### New environment variables to add in Vercel

| Key | Value |
|---|---|
| `DASHBOARD_PASSWORD_BRITT` | A password only Britt knows |
| `DASHBOARD_PASSWORD_RICHELLE` | A password only Richelle knows |
| `DASHBOARD_PASSWORD_BLANDO` | A password only Blando knows |
| `DASHBOARD_PASSWORD_AIRA` | A password only Aira knows |
| `DASHBOARD_PASSWORD_JOHNNEL` | A password only Johnnel knows |

Give each person their own password directly — don't share one password
among all of them, since that defeats the point of keeping teams separate.

### If you already have a live Supabase database

Run `supabase-migration-2.sql` in the Supabase SQL Editor (Project → SQL
Editor → New query → paste → Run) — it adds the two new columns
(`next_steps`, `is_test`) without touching any reports you've already
saved. If you're setting up Supabase fresh, `supabase-schema.sql` already
includes them.

## Updating the team roster

Open `lib/team.ts`:

- **Adding/removing a regular team member**: edit the `TEAM` array, set
  their `reportsTo` to their leader's email. No database change needed.
- **Adding/removing a leader**: they need a `TEAM` entry (with `reportsTo`
  set to `CEO_EMAIL`), *and* an entry in the `VIEWERS` array (with an `id`
  used to name their env var, and `visibleNames` listing themselves plus
  their direct reports) — plus a matching `DASHBOARD_PASSWORD_<ID>`
  variable in Vercel.

## Notes / things to know

- Dashboard access is a lightweight, password-per-person gate suited to
  an internal tool — not a full login system with accounts or audit logs.
  It's enforced server-side (the API itself refuses to return reports
  outside a viewer's team), which is the meaningful part; if you want
  something even stronger later (e.g. a magic link emailed to each
  leader), that's a doable follow-up.
- If Resend isn't configured yet, submissions still save fine — the email
  step just gets skipped with a log line, so you can test the form before
  finishing email setup.
- Week is free text (defaults to the current Mon–Fri) so it matches
  whatever format your team already uses, e.g. "Aug. 18–22, 2025".

