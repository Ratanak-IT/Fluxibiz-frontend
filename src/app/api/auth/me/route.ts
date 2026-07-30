import { COOKIE, userFromAccessToken } from "@/lib/auth/keycloak";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE.access)?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = userFromAccessToken(token);
  return NextResponse.json({ user });
}