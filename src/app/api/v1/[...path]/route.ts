import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

async function proxyHandler(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const pathString = path ? path.join("/") : "";
  const searchParams = req.nextUrl.search;

  const backendBaseUrl = (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080"
  ).replace(/\/$/, "");

  const destinationUrl = `${backendBaseUrl}/api/v1/${pathString}${searchParams}`;

  const headers = new Headers();
  const allowedHeaders = [
    "authorization",
    "content-type",
    "accept",
    "accept-language",
    "x-requested-with",
  ];

  req.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (allowedHeaders.includes(lowerKey)) {
      headers.set(key, value);
    }
  });

  // ngrok's free-tier interstitial ("You are about to visit...") intercepts
  // any request that looks like a browser navigation and would otherwise
  // return its warning HTML instead of the backend's real JSON — this header
  // tells ngrok to skip it. Harmless outside of ngrok (the real backend just
  // ignores an extra header it doesn't recognise).
  headers.set("ngrok-skip-browser-warning", "true");

  // Every browser call reaches the backend through this proxy, so without this
  // the backend sees one address — this function's — for every shopper on the
  // site, and anything it counts per caller (rate limits) would count the whole
  // marketplace as a single visitor. Vercel puts the real client address on the
  // incoming request; pass it along so the backend can count people rather than
  // proxies.
  const clientIp =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  if (clientIp) {
    headers.set("x-client-ip", clientIp);
  }

  if (!headers.has("authorization")) {
    const rawToken = req.cookies.get("kc_at")?.value;
    if (rawToken && rawToken.trim()) {
      try {
        const decoded = decodeURIComponent(rawToken.trim());
        headers.set("authorization", `Bearer ${decoded}`);
      } catch {
        headers.set("authorization", `Bearer ${rawToken.trim()}`);
      }
    }
  }

  try {
    const isGetOrHead = req.method === "GET" || req.method === "HEAD";
    const reqContentType = req.headers.get("content-type") || "";

    let body: any = undefined;

    if (!isGetOrHead) {
      if (reqContentType.includes("multipart/form-data")) {
        body = await req.formData();
        headers.delete("content-type");
      } else {
        const buffer = await req.arrayBuffer();
        if (buffer && buffer.byteLength > 0) {
          body = buffer;
        }
      }
    }

    const response = await fetch(destinationUrl, {
      method: req.method,
      headers,
      body,
      redirect: "manual",
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("transfer-encoding");
    responseHeaders.delete("content-length");

    const responseText = await response.text();
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      try {
        const jsonData = JSON.parse(responseText);
        return NextResponse.json(jsonData, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        });
      } catch {
        // Fallthrough if JSON parse fails
      }
    }

    if (responseText.trim().startsWith("<")) {
      return NextResponse.json(
        {
          status: response.status,
          error: response.statusText || "Bad Request",
          message:
            response.status === 400
              ? "Invalid request parameters or payload."
              : "Backend API request failed.",
        },
        {
          status: response.status,
          headers: responseHeaders,
        }
      );
    }

    return new NextResponse(responseText, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error(`Proxy Error for ${req.method} -> ${destinationUrl}:`, err);
    return NextResponse.json(
      { error: "Backend API service unavailable" },
      { status: 502 }
    );
  }
}

export {
  proxyHandler as GET,
  proxyHandler as POST,
  proxyHandler as PUT,
  proxyHandler as PATCH,
  proxyHandler as DELETE,
  proxyHandler as OPTIONS,
};
