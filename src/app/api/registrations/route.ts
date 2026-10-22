import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import { getPackageById } from "@/lib/data";
import { createRegistration, listRegistrations, markNotified, type RegistrationStatus } from "@/lib/registrations";
import { notifyNewRegistration } from "@/lib/notify";
import { registrationSchema } from "@/lib/validation";
import { buildRegistrationMessage, buildWhatsAppUrl, sanitizeForMessage } from "@/lib/whatsapp";

export const runtime = "nodejs";

/** Rate limit sederhana di memori: 5 pendaftaran / 10 menit / IP. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  if (hits.size > 5000) {
    for (const [key, value] of hits) if (value.resetAt < now) hits.delete(key);
  }
  return entry.count > MAX_PER_WINDOW;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Asal permintaan tidak dikenali." }, { status: 403 });
  }

  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { error: "Terlalu banyak pendaftaran dari jaringan ini. Coba lagi beberapa menit lagi." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;

  // Honeypot: kolom tersembunyi yang hanya diisi bot.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Data pendaftaran belum valid.",
        issues: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  const pkg = await getPackageById(parsed.data.paketId);
  if (!pkg) {
    return NextResponse.json({ error: "Paket tidak ditemukan." }, { status: 400 });
  }

  const source =
    typeof body.source === "string" ? sanitizeForMessage(body.source, 40) : "web";

  let saved;
  try {
    saved = createRegistration(parsed.data, { source });
  } catch (error) {
    console.error("Gagal menyimpan pendaftaran", error);
    return NextResponse.json(
      { error: "Pendaftaran belum bisa disimpan. Silakan kirim lewat WhatsApp." },
      { status: 500 },
    );
  }

  const notification = await notifyNewRegistration(saved, pkg);
  if (notification.ok) {
    markNotified(saved.id, notification.channels.join(","));
  }

  const whatsappUrl = buildWhatsAppUrl({
    text: buildRegistrationMessage({
      nama: parsed.data.nama,
      whatsapp: parsed.data.whatsapp,
      alamat: parsed.data.alamat,
      paketNama: pkg.name,
      paketSpeed: pkg.speedMbps,
      paketHarga: pkg.pricePerMonth,
      tanggalPasang: parsed.data.tanggalPasang,
      catatan: parsed.data.catatan,
    }),
  });

  return NextResponse.json({ ok: true, id: saved.id, whatsappUrl }, { status: 201 });
}

export async function GET(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const url = new URL(request.url);
  const status = (url.searchParams.get("status") ?? "semua") as RegistrationStatus | "semua";
  const q = url.searchParams.get("q") ?? "";

  return NextResponse.json({ items: listRegistrations({ status, q }) });
}
