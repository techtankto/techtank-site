import { CORS_HEADERS, corsResponse } from "./cors.ts";

/** JSON response, always with the CORS headers a browser call needs. */
export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

/**
 * Throw from a handler to return a specific status with a client-safe
 * message. Anything else that escapes becomes a generic 500, so raw
 * errors never reach the caller.
 */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

/**
 * The shell every function shares: answer the CORS preflight, allow only
 * POST, and turn the handler's outcome into JSON — a returned value into
 * a 200, a thrown `HttpError` into its status, anything else into a 500.
 * Handlers are left to do just their own work.
 */
export function servePost(name: string, handler: (req: Request) => Promise<unknown>): void {
  Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return corsResponse();
    if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

    try {
      return jsonResponse(await handler(req));
    } catch (err) {
      if (err instanceof HttpError) return jsonResponse({ error: err.message }, err.status);
      console.error(`[${name}] unhandled error:`, err);
      return jsonResponse({ error: "Something went wrong. Please try again." }, 500);
    }
  });
}
