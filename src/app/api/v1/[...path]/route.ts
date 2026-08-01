import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * OWASP A01 & A10: Path Traversal and SSRF Protection
 * Sanitizes path segments to prevent directory traversal (e.g. ../) and protocol injection.
 */
function sanitizePath(pathSegments: string[]): string | null {
  if (!pathSegments || pathSegments.length === 0) return "";

  for (const segment of pathSegments) {
    const decoded = decodeURIComponent(segment);
    // Block Path Traversal (../ or ..\) and Protocol Injection (http://, file://, etc.)
    if (
      decoded.includes("..") ||
      decoded.includes(":\\") ||
      decoded.includes("://") ||
      decoded.startsWith("/")
    ) {
      return null;
    }
  }

  return pathSegments.join("/");
}

async function proxyHandler(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const sanitizedPath = sanitizePath(path);

  // OWASP A01 & A10: Fail-closed if path contains suspicious directory traversal or SSRF patterns
  if (sanitizedPath === null) {
    console.warn(`[OWASP Security Guard] Blocked malformed or suspicious API path:`, path);
    return NextResponse.json(
      { error: "Access Denied: Malformed API path request." },
      { status: 400 }
    );
  }

  const searchParams = req.nextUrl.search;

  // OWASP A05: Secure Backend URL Resolution
  const backendBaseUrl = (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080"
  ).replace(/\/$/, "");

  const destinationUrl = `${backendBaseUrl}/api/v1/${sanitizedPath}${searchParams}`;

  // OWASP A03 & A05: Header Hygiene & Protection against Header Injection
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    // Do NOT forward untrusted host headers or system connection headers
    if (
      lowerKey !== "host" &&
      lowerKey !== "connection" &&
      lowerKey !== "transfer-encoding"
    ) {
      headers.set(key, value);
    }
  });

  try {
    const isGetOrHead = req.method === "GET" || req.method === "HEAD";
    const body = isGetOrHead ? undefined : await req.blob();

    const response = await fetch(destinationUrl, {
      method: req.method,
      headers,
      body,
      redirect: "manual",
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("transfer-encoding");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    // OWASP A09: Security Audit Logging without exposing internal stack traces to client
    console.error(`[OWASP Security Logger] Proxy Error for ${req.method} -> ${destinationUrl}:`, err);
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
