import { NextResponse } from "next/server";
import { adminPassword, expectedToken } from "@/app/lib/auth";

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { body = {}; }
  const { password } = body || {};

  if (!password || password !== adminPassword()) {
    return NextResponse.json({ ok: false, error: "Wrong password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_auth", expectedToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}

// Logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_auth", "", { path: "/", maxAge: 0 });
  return res;
}
