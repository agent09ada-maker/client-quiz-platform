import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-only-secret-change-me"
);
const COOKIE_NAME = "cqp_session";

async function readRole(req: NextRequest): Promise<"admin" | "employee" | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return (payload as { role?: "admin" | "employee" }).role || null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminArea = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isEmployeeArea = pathname.startsWith("/employee") && pathname !== "/employee/login";

  if (!isAdminArea && !isEmployeeArea) return NextResponse.next();

  const role = await readRole(req);

  if (isAdminArea && role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  if (isEmployeeArea && role !== "employee") {
    return NextResponse.redirect(new URL("/employee/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/employee/:path*"],
};
