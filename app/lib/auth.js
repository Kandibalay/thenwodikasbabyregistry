import { cookies } from "next/headers";
import crypto from "crypto";

// Your password comes from the ADMIN_PASSWORD environment variable.
// Falls back to "changeme" only so local dev works before you set one.
export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "changeme";
}

// The cookie stores a hash of the password, not the password itself.
export function expectedToken() {
  return crypto.createHash("sha256").update(adminPassword()).digest("hex");
}

export async function isAuthed() {
  const jar = await cookies();
  const token = jar.get("admin_auth")?.value;
  if (!token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expectedToken());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
