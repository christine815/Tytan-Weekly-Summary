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

## Updating the team roster

Open `lib/team.ts` and edit the `TEAM` array — add a person, change a
name's role to include "Leader" to have them start receiving notification
emails, or remove someone. No database change needed; this list is the
single source of truth for the dropdown, the roll call, and the
notification recipients.

## Notes / things to know

- There's no login. The dashboard link is not linked from the public form
  page, but it isn't access-controlled — anyone with the URL can view all
  reports. If that becomes a concern later, adding a simple shared
  password gate is a small follow-up.
- If Resend isn't configured yet, submissions still save fine — the email
  step just gets skipped with a log line, so you can test the form before
  finishing email setup.
- Week is free text (defaults to the current Mon–Fri) so it matches
  whatever format your team already uses, e.g. "Aug. 18–22, 2025".
