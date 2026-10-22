import { NextResponse } from "next/server";
import { ADMIN_COOKIE, checkPassword, createSessionToken, isAdminConfigured, sessionCookieOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Panel admin belum dikonfigurasi. Isi ADMIN_PASSWORD di .env.local." },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Format tidak valid." }, { status: 400 });
  }

  const password = (payload as { password?: unknown })?.password;
  if (typeof password !== "string" || !checkPassword(password)) {
    return NextResponse.json({ error: "Kata sandi salah." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createSessionToken(), sessionCookieOptions);
  return response;
}
