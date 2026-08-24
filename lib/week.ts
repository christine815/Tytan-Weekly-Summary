/**
 * Returns the current work week as "Aug. 18–22, 2025"-style label,
 * always Monday through Friday of the current week.
 */
export function currentWorkWeekLabel(): string {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const monday = new Date(now);
  const diffToMonday = day === 0 ? -6 : 1 - day;
  monday.setDate(now.getDate() + diffToMonday);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const year = friday.getFullYear();
  return `${fmt(monday)}–${fmt(friday)}, ${year}`;
}
