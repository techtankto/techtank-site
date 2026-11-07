import { EmailLogin } from "./email-login";
import { SlackLogin } from "./slack-login";

const SLACK_TEAM_ID = process.env.NEXT_PUBLIC_SLACK_TEAM_ID;

/**
 * Organizer sign-in. Slack is the only route in once a workspace is
 * configured, which is always the case in production. A dev server with
 * no Slack app gets an email form instead, so the back office is
 * reachable without registering one.
 */
export function AdminLogin() {
  if (process.env.NODE_ENV === "development" && !SLACK_TEAM_ID) {
    return <EmailLogin />;
  }
  return <SlackLogin />;
}
