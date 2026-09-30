import type { SlackMessage } from "@/utils/slack/client";

// Slack message templates. Each returns Block Kit `blocks` plus a plain-text
// `text` fallback for notifications.

/** Escape the characters Slack mrkdwn treats specially, so user text can't inject syntax. */
function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** `<@U…>` renders as a mention; a bare name is the fallback. */
function whoRef(slackUserId: string | null | undefined, name: string): string {
  return slackUserId ? `<@${slackUserId}>` : `*${esc(name)}*`;
}

interface ApplicationParams {
  taskTitle: string;
  taskUrl: string;
  adminUrl: string;
  applicantSlackId: string | null;
  applicantName: string;
  note: string;
  /** Non-null when the applicant couldn't be DMed, so organizers know
   * to reach out by hand. */
  dmFailure: string | null;
}

/** Posted to the organizer channel when someone applies. */
export function applicationNotification(p: ApplicationParams): SlackMessage {
  const applicant = whoRef(p.applicantSlackId, p.applicantName);

  const blocks: unknown[] = [
    {
      type: "header",
      text: { type: "plain_text", text: "🙌 New task application", emoji: true },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Task*\n<${p.taskUrl}|${esc(p.taskTitle)}>` },
        { type: "mrkdwn", text: `*From*\n${applicant}` },
      ],
    },
  ];

  if (p.note.trim()) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Their note*\n>${esc(p.note.trim()).replace(/\n/g, "\n>")}` },
    });
  }

  if (p.dmFailure) {
    blocks.push({
      type: "context",
      elements: [{ type: "mrkdwn", text: `⚠️ We couldn't DM them (${esc(p.dmFailure)}) — reach out by hand.` }],
    });
  }

  blocks.push({
    type: "actions",
    elements: [
      {
        type: "button",
        text: { type: "plain_text", text: "Open the task board", emoji: true },
        url: p.adminUrl,
      },
    ],
  });

  return {
    text: `New application for "${p.taskTitle}" from ${p.applicantName}`,
    blocks,
  };
}

interface ReceiptParams {
  taskTitle: string;
  taskUrl: string;
  browseUrl: string;
}

/** DMed to the applicant right after they apply. */
export function applicationReceiptDm(p: ReceiptParams): SlackMessage {
  return {
    text: `Thanks for applying to "${p.taskTitle}" — an organizer will be in touch.`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            `*Thanks for stepping up!* 🎉\n\n` +
            `You put your hand up for *<${p.taskUrl}|${esc(p.taskTitle)}>* on the TechTank task board.`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            `An organizer will review it and message you here to get you started, usually within a few days. ` +
            `Nothing starts until we confirm, so there's nothing you need to do right now.`,
        },
      },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: `Curious what else needs doing? <${p.browseUrl}|Browse tasks>` }],
      },
    ],
  };
}

interface AssignmentParams {
  taskTitle: string;
  taskUrl: string;
  assigneeSlackId: string | null;
  assigneeName: string;
  adminSlackId: string | null;
  /** True when this is a group DM that also includes the admin, so the
   * copy can say "you two" instead of naming them. */
  grouped: boolean;
}

/** Sent when an organizer assigns someone. */
export function assignmentMessage(p: AssignmentParams): SlackMessage {
  const assignee = whoRef(p.assigneeSlackId, p.assigneeName);
  const assigner = p.adminSlackId ? `<@${p.adminSlackId}>` : "An organizer";

  const closing = p.grouped
    ? `You two can sort out the details right here. Thanks for making TechTank happen! 🙌`
    : `${assigner} will be in touch. Thanks for making TechTank happen! 🙌`;

  return {
    text: `You've been assigned "${p.taskTitle}" on the TechTank task board.`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            `*You're on it!* 🎉\n\n` +
            `${assigner} assigned ${assignee} the task *<${p.taskUrl}|${esc(p.taskTitle)}>* on the TechTank task board.`,
        },
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: closing },
      },
    ],
  };
}

/** Base for links in Slack messages; Slack needs absolute URLs. */
export const SITE_URL = process.env.PUBLIC_SITE_URL ?? "https://www.techtankto.com";
