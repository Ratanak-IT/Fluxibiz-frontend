import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";


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

  if (sanitizedPath === null) {
    console.warn(`[OWASP Security Guard] Blocked malformed or suspicious API path:`, path);
    return NextResponse.json(
      { error: "Access Denied: Malformed API path request." },
      { status: 400 }
    );
  }

  const searchParams = req.nextUrl.search;

  const backendBaseUrl = (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080"
  ).replace(/\/$/, "");

  const destinationUrl = `${backendBaseUrl}/api/v1/${sanitizedPath}${searchParams}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
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
