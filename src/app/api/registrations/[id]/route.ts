import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import {
  REGISTRATION_STATUSES,
  updateRegistrationStatus,
  type RegistrationStatus,
} from "@/lib/registrations";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const { id } = await context.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Format tidak valid." }, { status: 400 });
  }

  const status = (payload as { status?: unknown })?.status;
  if (typeof status !== "string" || !REGISTRATION_STATUSES.includes(status as RegistrationStatus)) {
    return NextResponse.json({ error: "Status tidak dikenal." }, { status: 400 });
  }

  const updated = updateRegistrationStatus(numericId, status as RegistrationStatus);
  if (!updated) {
    return NextResponse.json({ error: "Pendaftaran tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, item: updated });
}
