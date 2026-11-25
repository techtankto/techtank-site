/**
 * Email/password sign-in exists only for a dev server with no Slack app.
 * `next build` always sets NODE_ENV=production, so it is off in every deployment.
 * Callers pass `process.env.*` literally so Next can inline them.
 */
export function isLocalEmailLogin(env: { nodeEnv?: string; slackTeamId?: string }): boolean {
  return env.nodeEnv === "development" && !env.slackTeamId;
}
