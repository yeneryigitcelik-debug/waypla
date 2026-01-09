import { handlers } from "@/lib/auth";

// Wrap handlers to catch any errors and return proper JSON
async function handleRequest(
  handler: (req: Request) => Promise<Response>,
  req: Request
): Promise<Response> {
  try {
    return await handler(req);
  } catch (error) {
    console.error("NextAuth route error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET(req: Request) {
  return handleRequest(handlers.GET, req);
}

export async function POST(req: Request) {
  return handleRequest(handlers.POST, req);
}
