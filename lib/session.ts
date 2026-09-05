import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-only-secret-change-me"
);
const COOKIE_NAME = "cqp_session";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

export type SessionPayload =
  | { role: "admin"; id: string; username: string }
  | { role: "employee"; id: string; employeeId: string; name: string };

export async function createSessionCookie(payload: SessionPayload) {
  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(SECRET);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<SessionPayload & { role: "admin" }> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("UNAUTHORIZED");
  }
  return session as SessionPayload & { role: "admin" };
}

export async function requireEmployee(): Promise<SessionPayload & { role: "employee" }> {
  const session = await getSession();
  if (!session || session.role !== "employee") {
    throw new Error("UNAUTHORIZED");
  }
  return session as SessionPayload & { role: "employee" };
}
