export type Role = "Owner+CEO" | "Member+Leader" | "Member";

export interface TeamMember {
  name: string;
  email: string;
  role: Role;
  position: string;
  // Who receives this person's report notification email.
  // Members report to their leader; leaders report to the CEO.
  // The CEO has no reportsTo (nobody above her in this roster).
  reportsTo?: string;
}

export const CEO_EMAIL = "britt@tytanteams.com";

// Where test submissions get routed instead of the real recipient, so
// people can confirm email delivery works without pinging a real leader.
export const TEST_NOTIFY_EMAIL = "christine@tytanteams.com";

// Single source of truth for the roster. Add/remove people here and the
// form dropdown, the roll call, the notification routing, and the
// dashboard's "Viewing as" filter all update automatically.
export const TEAM: TeamMember[] = [
  { name: "Britt Johnson", email: CEO_EMAIL, role: "Owner+CEO", position: "Owner / CEO" },

  // Richelle's team — People & Culture
  { name: "Richelle Manahan", email: "richelle@tytanteams.com", role: "Member+Leader", position: "People & Culture Team Leader", reportsTo: CEO_EMAIL },
  { name: "Alida Mae Feliciano", email: "alida@tytanteams.com", role: "Member", position: "People & Culture", reportsTo: "richelle@tytanteams.com" },
  { name: "Monique Sariego", email: "monique@tytanteams.com", role: "Member", position: "People & Culture", reportsTo: "richelle@tytanteams.com" },
  { name: "Christine Go", email: "christine@tytanteams.com", role: "Member", position: "Business Development & Revenue", reportsTo: "richelle@tytanteams.com" },
  { name: "Lysan Camille Simbulan", email: "lysan@tytanteams.com", role: "Member", position: "Business Development & Revenue", reportsTo: "richelle@tytanteams.com" },
  { name: "Zenah Smalley", email: "zenah@tytanteams.com", role: "Member", position: "Business Development & Revenue", reportsTo: "richelle@tytanteams.com" },

  // Blando — Client Success & Strategic Accounts, no direct reports yet
  { name: "Blando Baldomero Natividad", email: "blando@tytanteams.com", role: "Member+Leader", position: "Client Success & Strategic Accounts Team Leader", reportsTo: CEO_EMAIL },

  // Aira's team — Marketing & Creative
  { name: "Aira Asuncion", email: "aira@tytanteams.com", role: "Member+Leader", position: "Marketing & Creative Team Leader", reportsTo: CEO_EMAIL },
  { name: "Geminiano Somera De Guzman", email: "bong@tytanteams.com", role: "Member", position: "Marketing & Creative", reportsTo: "aira@tytanteams.com" },
  { name: "Aliza Divine Torres", email: "aliza@tytanteams.com", role: "Member", position: "Marketing & Creative", reportsTo: "aira@tytanteams.com" },

  // Johnnel's team — Operations & Enablement
  { name: "Johnnel Lamigo", email: "johnnel@tytanteams.com", role: "Member+Leader", position: "Operations & Enablement Team Leader", reportsTo: CEO_EMAIL },
  { name: "Elijah Jake Sagpang", email: "elijah@tytanteams.com", role: "Member", position: "Operations & Enablement", reportsTo: "johnnel@tytanteams.com" },
  { name: "Laarnie Ivy Pascua", email: "laarnie@tytanteams.com", role: "Member", position: "Operations & Enablement", reportsTo: "johnnel@tytanteams.com" },
  { name: "Maria Marina Alayon", email: "maria@tytanteams.com", role: "Member", position: "Operations & Enablement", reportsTo: "johnnel@tytanteams.com" },

  // Not under any leader, and not a leader himself — no notification
  // recipient configured, so his reports simply save without an email.
  { name: "David Brown", email: "david@tytanteams.com", role: "Member", position: "Sales" },
];

export function findMember(name: string): TeamMember | undefined {
  return TEAM.find((m) => m.name === name);
}

// Dashboard "Viewing as" groups: who can log into the dashboard and which
// set of reports they're scoped to see. Each viewer has their own separate
// password (see DASHBOARD_PASSWORD_<ID> environment variables) — there is
// no shared password and no self-select, so someone can only see a team
// other than their own if they actually have that person's password.
export interface Viewer {
  id: string; // used to build the env var name: DASHBOARD_PASSWORD_<ID uppercased>
  label: string;
  email: string;
  visibleNames: string[]; // TEAM member names this viewer can see reports for
  seesAll?: boolean;
}

export const VIEWERS: Viewer[] = [
  { id: "britt", label: "Britt", email: CEO_EMAIL, visibleNames: [], seesAll: true },
  {
    id: "richelle",
    label: "Richelle Manahan",
    email: "richelle@tytanteams.com",
    visibleNames: ["Richelle Manahan", "Alida Mae Feliciano", "Monique Sariego", "Christine Go", "Lysan Camille Simbulan", "Zenah Smalley"],
  },
  { id: "blando", label: "Blando Baldomero Natividad", email: "blando@tytanteams.com", visibleNames: ["Blando Baldomero Natividad"] },
  {
    id: "aira",
    label: "Aira Asuncion",
    email: "aira@tytanteams.com",
    visibleNames: ["Aira Asuncion", "Geminiano Somera De Guzman", "Aliza Divine Torres"],
  },
  {
    id: "johnnel",
    label: "Johnnel Lamigo",
    email: "johnnel@tytanteams.com",
    visibleNames: ["Johnnel Lamigo", "Elijah Jake Sagpang", "Laarnie Ivy Pascua", "Maria Marina Alayon"],
  },
];
