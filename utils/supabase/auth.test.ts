import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const signInWithPassword = vi.fn();
const signInWithOAuth = vi.fn();
const rpc = vi.fn();

vi.mock("./client", () => ({
  createClient: () => ({ auth: { signInWithPassword, signInWithOAuth }, rpc }),
}));

const destination = new URL("http://localhost:3000/admin/tasks");

// SLACK_TEAM_ID is read at module load, so each case re-imports with its own env.
async function load(env: { nodeEnv: string; slackTeamId?: string }) {
  vi.stubEnv("NODE_ENV", env.nodeEnv);
  vi.stubEnv("NEXT_PUBLIC_SLACK_TEAM_ID", env.slackTeamId ?? "");
  vi.resetModules();
  return import("./auth");
}

describe("auth", () => {
  const location = { href: "", origin: "http://localhost:3000" };

  beforeEach(() => {
    vi.stubGlobal("window", { location });
    location.href = "";
    signInWithPassword.mockReset().mockResolvedValue({ error: null });
    signInWithOAuth.mockReset().mockResolvedValue({ error: null });
    rpc.mockReset().mockResolvedValue({ error: null });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("signInWithEmail", () => {
    const options = { email: "a@b.c", password: "pw", destination };

    it.each([
      ["production", undefined],
      ["development", "T0123"],
    ])("refuses outside local dev without Slack (NODE_ENV=%s, team=%s)", async (nodeEnv, slackTeamId) => {
      const { signInWithEmail } = await load({ nodeEnv, slackTeamId });
      await expect(signInWithEmail(options)).rejects.toThrow(/local dev server only/);
      expect(signInWithPassword).not.toHaveBeenCalled();
    });

    it("throws on a sign-in error without claiming or navigating", async () => {
      const failure = new Error("Invalid login credentials");
      signInWithPassword.mockResolvedValue({ error: failure });
      const { signInWithEmail } = await load({ nodeEnv: "development" });
      await expect(signInWithEmail(options)).rejects.toBe(failure);
      expect(rpc).not.toHaveBeenCalled();
      expect(location.href).toBe("");
    });

    it("claims admin membership and navigates on success", async () => {
      const { signInWithEmail } = await load({ nodeEnv: "development" });
      await signInWithEmail(options);
      expect(signInWithPassword).toHaveBeenCalledWith({ email: "a@b.c", password: "pw" });
      expect(rpc).toHaveBeenCalledWith("claim_admin_membership");
      expect(location.href).toBe(destination.toString());
    });

    it("logs a failed claim instead of swallowing it, and still navigates", async () => {
      const claimError = new Error("claim failed");
      rpc.mockResolvedValue({ error: claimError });
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      const { signInWithEmail } = await load({ nodeEnv: "development" });
      await signInWithEmail(options);
      expect(consoleError).toHaveBeenCalledWith("claim_admin_membership failed", claimError);
      expect(location.href).toBe(destination.toString());
    });
  });

  describe("signInWithSlack", () => {
    it("throws when no Slack team ID is configured", async () => {
      const { signInWithSlack } = await load({ nodeEnv: "development" });
      await expect(signInWithSlack({ destination })).rejects.toThrow(/Slack team ID is required/);
      expect(signInWithOAuth).not.toHaveBeenCalled();
    });

    it("pre-selects the workspace and returns through the auth callback", async () => {
      const { signInWithSlack } = await load({ nodeEnv: "production", slackTeamId: "T0123" });
      await signInWithSlack({ destination: new URL("http://localhost:3000/admin/tasks/5?tab=applicants") });
      const { options } = signInWithOAuth.mock.calls[0][0];
      expect(options.queryParams).toEqual({ team: "T0123" });
      const redirect = new URL(options.redirectTo);
      expect(redirect.pathname).toBe("/auth/callback");
      // A full URL here would be dropped by the callback's same-origin check.
      expect(redirect.searchParams.get("next")).toBe("/admin/tasks/5?tab=applicants");
    });
  });
});
