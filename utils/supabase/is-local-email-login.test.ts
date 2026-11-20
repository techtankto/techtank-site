import { describe, expect, it } from "vitest";
import { isLocalEmailLogin } from "./is-local-email-login";

describe("isLocalEmailLogin", () => {
  it.each([
    ["development", undefined, true],
    ["development", "", true],
    ["development", "T0123", false],
    ["production", undefined, false], // password login must never reach a deployment
    ["production", "", false],
    ["test", undefined, false],
    [undefined, undefined, false],
  ])("nodeEnv=%s slackTeamId=%s -> %s", (nodeEnv, slackTeamId, expected) => {
    expect(isLocalEmailLogin({ nodeEnv, slackTeamId })).toBe(expected);
  });
});
