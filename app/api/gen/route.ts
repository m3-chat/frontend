import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const model = url.searchParams.get("model");
  const content = url.searchParams.get("content");

  if (!model || !content) {
    return new Response("Missing params", { status: 400 });
  }

  const backendUrl = `${process.env.TUNNEL}/api/gen?model=${encodeURIComponent(
    model
  )}&content=${encodeURIComponent(content)}`;

  try {
    const backendResponse = await fetch(backendUrl);

    if (!backendResponse.body) {
      return new Response("No response body from backend", { status: 502 });
    }

    return new Response(backendResponse.body, {
      status: backendResponse.status,
      headers: {
        "User-Agent": "curl/7.79.1", // bypasses LocalXpose warning page
        "Content-Type":
          backendResponse.headers.get("Content-Type") || "text/plain",
      },
    });
  } catch (err) {
    return new Response(`Error: ${(err as Error).message}`, { status: 500 });
  }
}
