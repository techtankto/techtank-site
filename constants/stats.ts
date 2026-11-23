import { events } from "./events";

export const stats = {
  events: `${events.length}+`,
  avgAttendance: "40–120",
  cadence: "Monthly",
  since: 2023,
  /** Slack workspace members, rounded down; shown as "1,400+" */
  slackMembers: 1400,
} as const;
