/**
 * Slack helpers: a webhook post for the organizer channel, and bot
 * messaging (1:1 or group DMs) for reaching people directly.
 *
 * Messages carry Block Kit `blocks` for layout plus a plain-text
 * `text` fallback (shown in notifications and by clients that don't
 * render blocks). Nothing here throws: by the time these run the
 * database change is already committed, and a Slack hiccup must never
 * turn a success into a 500.
 */

export interface SlackMessage {
  /** Notification / fallback text. Always provide something readable. */
  text: string;
  blocks?: unknown[];
}

/** Why a Slack send failed, or null when it landed. */
export type SlackFailure = string | null;

// ── organizer channel (incoming webhook) ─────────────────────

export async function notifySlack(message: SlackMessage): Promise<void> {
  const webhookUrl = Deno.env.get("SLACK_WEBHOOK_URL");
  if (!webhookUrl) {
    console.log("[slack] SLACK_WEBHOOK_URL unset — skipping notification:\n" + message.text);
    return;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    if (!res.ok) {
      console.error(`[slack] webhook responded ${res.status}: ${await res.text()}`);
    }
  } catch (err) {
    console.error("[slack] webhook request failed:", err);
  }
}

// ── bot DMs (1:1 and group) ──────────────────────────────────

interface SlackApiResult {
  ok: boolean;
  error?: string;
  channel?: { id: string };
}

/** POST to a Slack Web API method as the bot. Slack replies HTTP 200
 * with `ok:false` on failure, so callers must check `ok`, not the
 * status code. */
function slackApiPost(method: string, token: string, body: unknown): Promise<SlackApiResult> {
  return fetch(`https://slack.com/api/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  }).then((res) => res.json() as Promise<SlackApiResult>);
}

/** Turn Slack's `error` code into something an organizer can act on. */
function explainSlackError(error?: string): string {
  if (error === "missing_scope") {
    return "the bot is missing a scope (needs chat:write, im:write, mpim:write)";
  }
  return error ?? "unknown Slack error";
}

/**
 * Open a conversation with one or more users and post to it as the bot.
 * One user opens a DM (`im:write`); several open a group DM / mpim
 * (`mpim:write`). Returns null on success or a short reason on failure.
 */
export async function messageSlackUsers(userIds: string[], message: SlackMessage): Promise<SlackFailure> {
  const ids = userIds.filter(Boolean);
  if (ids.length === 0) return "no Slack user id";

  const token = Deno.env.get("SLACK_BOT_TOKEN");
  if (!token) {
    console.log(`[slack] SLACK_BOT_TOKEN unset — would message ${ids.join(", ")}`);
    return "no bot token configured";
  }

  try {
    // Open a real channel first: posting to a raw `U…` id would land in
    // the user's own Slackbot DM.
    const opened = await slackApiPost("conversations.open", token, { users: ids.join(",") });
    if (!opened.ok || !opened.channel) {
      const why = explainSlackError(opened.error);
      console.error(`[slack] conversations.open failed: ${why}`);
      return why;
    }

    const posted = await slackApiPost("chat.postMessage", token, {
      channel: opened.channel.id,
      text: message.text,
      blocks: message.blocks,
    });
    if (!posted.ok) {
      const why = explainSlackError(posted.error);
      console.error(`[slack] chat.postMessage failed: ${why}`);
      return why;
    }
    return null;
  } catch (err) {
    console.error("[slack] message failed:", err);
    return "the Slack request failed";
  }
}

/** DM a single user. */
export function dmSlackUser(slackUserId: string, message: SlackMessage): Promise<SlackFailure> {
  return messageSlackUsers([slackUserId], message);
}
