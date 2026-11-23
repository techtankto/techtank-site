import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStaticClient } from "@/utils/supabase/static";
import { GET } from "./route";

vi.mock("@/utils/supabase/static", () => ({
  createStaticClient: vi.fn(),
}));

const mockedCreateStaticClient = vi.mocked(createStaticClient);

function mockQueryResult(result: { error: { message: string } | null }) {
  const limit = vi.fn().mockResolvedValue(result);
  const select = vi.fn().mockReturnValue({ limit });
  const from = vi.fn().mockReturnValue({ select });
  mockedCreateStaticClient.mockReturnValue({ from } as unknown as ReturnType<typeof createStaticClient>);
  return { from, select, limit };
}

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns 200 with ok:true and no-store when the database read succeeds", async () => {
    const { from, select, limit } = mockQueryResult({ error: null });

    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({ ok: true });
    expect(from).toHaveBeenCalledWith("contribution_tasks");
    expect(select).toHaveBeenCalledWith("id");
    expect(limit).toHaveBeenCalledWith(1);
  });

  it("returns 503 with ok:false and hides internal details when Supabase returns an error", async () => {
    mockQueryResult({ error: { message: "connection refused" } });

    const response = await GET();

    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({ ok: false });
  });

  it("returns 503 with ok:false when client initialization throws", async () => {
    mockedCreateStaticClient.mockImplementation(() => {
      throw new Error("supabaseUrl is required");
    });

    const response = await GET();

    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({ ok: false });
  });
});
