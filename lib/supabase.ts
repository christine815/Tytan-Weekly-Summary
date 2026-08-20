import { createClient } from "@supabase/supabase-js";

// This client uses the SERVICE ROLE key and must only ever be imported
// from server-side code (API routes). Never import this from a client
// component, and never expose SUPABASE_SERVICE_ROLE_KEY with a NEXT_PUBLIC_ prefix.
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export interface Submission {
  id: string;
  member_name: string;
  member_email: string;
  position: string;
  shift_schedule: string;
  week_range: string;
  key_projects: string;
  ai_tools: string;
  efficiency_learnings: string;
  future_automations: string;
  human_impact: string;
  challenges: string;
  submitted_at: string;
}

export type NewSubmission = Omit<Submission, "id" | "submitted_at">;
