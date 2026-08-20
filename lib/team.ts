export type Role = "Owner+CEO" | "Member+Leader" | "Member";

export interface TeamMember {
  name: string;
  email: string;
  role: Role;
  position: string;
}

// Single source of truth for the roster. Add/remove people here and the
// form dropdown, the roll call, and the notification list all update.
export const TEAM: TeamMember[] = [
  { name: "Britt Johnson", email: "britt@tytanteams.com", role: "Owner+CEO", position: "Owner / CEO" },
  { name: "Alida Mae Feliciano", email: "alida@tytanteams.com", role: "Member", position: "Team Member" },
  { name: "Aliza Divine Torres", email: "aliza@tytanteams.com", role: "Member", position: "Team Member" },
  { name: "Blando Baldomero Natividad", email: "blando@tytanteams.com", role: "Member+Leader", position: "Team Member / Leader" },
  { name: "Christine Go", email: "christine@tytanteams.com", role: "Member", position: "Team Member" },
  { name: "David Brown", email: "david@tytanteams.com", role: "Member", position: "Team Member" },
  { name: "Elijah Jake Sagpang", email: "elijah@tytanteams.com", role: "Member", position: "Team Member" },
  { name: "Geminiano Somera De Guzman", email: "bong@tytanteams.com", role: "Member", position: "Team Member" },
  { name: "Laarnie Ivy Pascua", email: "laarnie@tytanteams.com", role: "Member", position: "Team Member" },
  { name: "Lysan Camille Simbulan", email: "lysan@tytanteams.com", role: "Member", position: "Team Member" },
  { name: "Maria Marina Alayon", email: "maria@tytanteams.com", role: "Member", position: "Team Member" },
  { name: "Monique Sariego", email: "monique@tytanteams.com", role: "Member", position: "Team Member" },
  { name: "Richelle Manahan", email: "richelle@tytanteams.com", role: "Member+Leader", position: "Team Member / Leader" },
  { name: "Zenah Smalley", email: "zenah@tytanteams.com", role: "Member", position: "Team Member" },
  { name: "Johnnel Lamigo", email: "johnnel@tytanteams.com", role: "Member+Leader", position: "Team Member / Leader" },
  { name: "Aira Asuncion", email: "aira@tytanteams.com", role: "Member+Leader", position: "Team Member / Leader" },
];

// Everyone who should receive a notification email when a report comes in:
// the Owner/CEO plus anyone with Leader in their role.
export const LEADER_EMAILS: string[] = TEAM.filter(
  (m) => m.role === "Owner+CEO" || m.role === "Member+Leader"
).map((m) => m.email);

export function findMember(name: string): TeamMember | undefined {
  return TEAM.find((m) => m.name === name);
}
