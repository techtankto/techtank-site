import { socialLinks } from "./social-links";
import { stats } from "./stats";
import { getAllTools } from "./tools";

export type SlackMessage =
  | {
      kind: "post";
      author: string;
      text: string;
      /** Bold lead-in before the text, e.g. "QOTW:" */
      label?: string;
      /** Small pill under the message, e.g. "10 replies" */
      badge?: string;
      /** Indent as a thread reply */
      reply?: boolean;
      /** Tinted box, for a message quoted from another channel */
      highlight?: boolean;
      /** Link text shown under the message, styled like a Slack link (not clickable) */
      link?: string;
      /** Label and value rows under the text, like a pinned post template */
      details?: { label: string; value: string }[];
    }
  | { kind: "event"; author: string; tag: "Free" | "Low cost" }
  | { kind: "yell"; text: string; accent?: boolean };

export interface SlackChannel {
  name: string;
  topic: string;
  /** "loud" renders the channel on the dark panel with shaking messages */
  tone: "light" | "loud";
  /** Shows a typing indicator after the messages */
  typing?: string;
  messages: SlackMessage[];
}

/**
 * Example messages for the homepage Slack preview. Member replies stay
 * anonymous ("techtanker") so no real member is quoted by name.
 */
export const slackChannels: SlackChannel[] = [
  {
    name: "general",
    topic: "question of the week, every Friday",
    tone: "light",
    typing: "techtanker is typing",
    messages: [
      {
        kind: "post",
        author: "TechTank host",
        label: "QOTW:",
        text: "how many tabs do you have open right now, and when's the last time you cleaned out your downloads folder?",
        badge: "10 replies",
      },
      { kind: "post", author: "techtanker", text: "6 tabs currently open. It's been months.", reply: true },
      { kind: "post", author: "techtanker", text: "tbh I think 30+, I stopped counting", reply: true },
      { kind: "post", author: "techtanker", text: "I have... 104 tabs open", reply: true },
    ],
  },
  {
    name: "introductions",
    topic: "say hi when you join",
    tone: "light",
    messages: [
      {
        kind: "post",
        author: "techtanker",
        text: "Hi everyone! Frontend dev, just moved to Toronto. Looking for meetups and people to cowork with.",
        badge: "12 replies",
      },
      { kind: "post", author: "techtanker", text: "Welcome!! Come to build night this week", reply: true },
      { kind: "post", author: "techtanker", text: "Welcome! Everything coming up is in #events", reply: true },
      { kind: "post", author: "techtanker", text: "Hey, frontend dev here too! Happy to cowork sometime", reply: true },
      { kind: "post", author: "techtanker", text: "welcome to the tank", reply: true },
    ],
  },
  {
    name: "events",
    topic: "what's on in Toronto tech",
    tone: "light",
    messages: [
      { kind: "event", author: "techtanker shared an event", tag: "Free" },
      { kind: "event", author: "techtanker shared an event", tag: "Low cost" },
      { kind: "event", author: "techtanker shared an event", tag: "Free" },
    ],
  },
  {
    name: "job-postings",
    topic: "share jobs in your network",
    tone: "light",
    messages: [
      {
        kind: "post",
        author: "techtanker",
        text: "My team is hiring a product designer, hybrid in Toronto. Happy to refer!",
        link: "jobs.example.com/product-designer",
      },
      {
        kind: "post",
        author: "techtanker",
        text: "Two frontend roles just opened at my startup, DM me",
        link: "example-startup.com/careers",
      },
      {
        kind: "post",
        author: "techtanker",
        text: "Our data team is hiring a junior analyst. New grads welcome!",
        link: "careers.example.org/data-analyst",
      },
      {
        kind: "post",
        author: "techtanker",
        text: "Part-time community coordinator at a Toronto nonprofit, remote friendly",
        link: "example.org/jobs/community-coordinator",
      },
    ],
  },
  {
    name: "job-seeking",
    topic: "referrals, resume feedback and interview prep",
    tone: "light",
    messages: [
      {
        kind: "post",
        author: "techtanker",
        text: "Any referrals would be greatly appreciated!",
        details: [
          { label: "Company", value: "a Toronto fintech" },
          { label: "Role", value: "Frontend Engineer" },
          { label: "Status", value: "Applied" },
          { label: "Looking for", value: "Referral" },
        ],
      },
      { kind: "post", author: "techtanker", text: "I know someone on that team, DMing you!", reply: true },
      {
        kind: "post",
        author: "techtanker",
        text: "Anyone up for a mock interview this week?",
      },
      {
        kind: "post",
        author: "techtanker",
        text: "I'm free Thursday evening, happy to do system design with you!",
        reply: true,
      },
    ],
  },
  {
    name: "yelling-anonymous",
    topic: "for when work gets to be too much",
    tone: "loud",
    messages: [
      { kind: "yell", text: "WHY DOES EVERY MEETING NEED A PRE-MEETING" },
      { kind: "yell", text: "THE JOB POST WANTS 5 YEARS OF EXPERIENCE IN A 2 YEAR OLD FRAMEWORK" },
      { kind: "yell", text: "IT WORKED ON MY MACHINE. IT WORKED ON MY MACHINE." },
      { kind: "yell", text: "MY 15 MINUTE STANDUP HAS BEEN GOING FOR 45 MINUTES" },
      { kind: "yell", text: "WHO PUSHED TO MAIN AT 4:59 ON A FRIDAY", accent: true },
    ],
  },
];

/** A handful of single posts for the phone layout, shown as an overlapping stack. */
export const slackHighlights: { channel: string; author: string; text: string; tone: "light" | "loud" }[] = [
  {
    channel: "general",
    author: "TechTank host",
    text: "QOTW: how many tabs do you have open right now?",
    tone: "light",
  },
  {
    channel: "job-postings",
    author: "techtanker",
    text: "My team is hiring a product designer. Happy to refer!",
    tone: "light",
  },
  { channel: "job-seeking", author: "techtanker", text: "Anyone up for a mock interview this week?", tone: "light" },
  { channel: "yelling-anonymous", author: "anonymous", text: "WHO PUSHED TO MAIN AT 4:59 ON A FRIDAY", tone: "loud" },
];

export const slackSection = {
  overline: "Join the Slack",
  title: "Toronto tech's group chat",
  description: "Events, job leads, a Friday question, and even a channel for yelling.",
  members: stats.slackMembers,
  membersLabel: "members",
  ctaLabel: "Join the Slack, it's free",
  ctaHref: socialLinks.slack.url,
  poweredByLabel: "Runs on",
  poweredBy: getAllTools().filter((tool) => tool.id === "slack" || tool.id === "tightknit"),
};
