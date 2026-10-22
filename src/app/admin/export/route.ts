import { isAdminSession } from "@/lib/auth";
import { listRegistrations, registrationsToCsv, type RegistrationStatus } from "@/lib/registrations";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAdminSession())) {
    return new Response("Tidak diizinkan", { status: 401 });
  }

  const url = new URL(request.url);
  const status = (url.searchParams.get("status") ?? "semua") as RegistrationStatus | "semua";
  const q = url.searchParams.get("q") ?? "";

  const rows = listRegistrations({ status, q, limit: 200, offset: 0 });
  const csv = registrationsToCsv(rows);
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pendaftaran-spacenet-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
