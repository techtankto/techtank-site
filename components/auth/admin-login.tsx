import { EmailLogin } from "./email-login";
import { SlackLogin } from "./slack-login";

const SLACK_TEAM_ID = process.env.NEXT_PUBLIC_SLACK_TEAM_ID;

/** Organizer sign-in — Slack is the only route in (no password, no email). */
export function AdminLogin() {
  if (process.env.NODE_ENV === "development" && !SLACK_TEAM_ID) {
    return <EmailLogin />;
  }
  return <SlackLogin />;
}
