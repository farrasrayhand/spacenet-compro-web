import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { isAdminSession } from "@/lib/auth";
import {
  REGISTRATION_STATUSES,
  countByStatus,
  countRegistrations,
  listRegistrations,
  type RegistrationStatus,
} from "@/lib/registrations";
import { formatTanggalIndonesia } from "@/lib/format";
import { isNotificationConfigured } from "@/lib/notify";

export const metadata: Metadata = {
  title: "Pendaftaran",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const PER_PAGE = 20;

const statusLabels: Record<RegistrationStatus, string> = {
  baru: "Baru",
  dihubungi: "Dihubungi",
  terpasang: "Terpasang",
  batal: "Batal",
};

type PageProps = {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
};

export default async function AdminPage({ searchParams }: PageProps) {
  if (!(await isAdminSession())) redirect("/admin/login");

  const params = await searchParams;
  const status = (REGISTRATION_STATUSES as readonly string[]).includes(params.status ?? "")
    ? (params.status as RegistrationStatus)
    : "semua";
  const q = params.q ?? "";
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const total = countRegistrations({ status, q });
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const rows = listRegistrations({
    status,
    q,
    limit: PER_PAGE,
    offset: (currentPage - 1) * PER_PAGE,
  });
  const counts = countByStatus();
  const notificationsOn = isNotificationConfigured();

  const buildQuery = (overrides: { status?: string; page?: number } = {}) => {
    const search = new URLSearchParams();
    const nextStatus = overrides.status ?? status;
    if (nextStatus && nextStatus !== "semua") search.set("status", nextStatus);
    if (q) search.set("q", q);
    if (overrides.page && overrides.page > 1) search.set("page", String(overrides.page));
    const query = search.toString();
    return query ? `?${query}` : "";
  };

  const from = total === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
  const to = Math.min(currentPage * PER_PAGE, total);

  return (
    <div className="wrap py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-bluetext">Panel admin</p>
          <h1 className="mt-2 text-2xl">Pendaftaran pelanggan</h1>
          <p className="mt-2 text-sm text-muted">
            Total {counts.total} pendaftaran. Data ini tidak tampil di halaman publik.
          </p>
          {!notificationsOn ? (
            <p className="mt-2 max-w-xl rounded border border-dashed border-line px-3 py-2 text-xs text-muted">
              Notifikasi otomatis belum aktif. Isi <code>NOTIFY_WEBHOOK_URL</code> atau kredensial
              SMTP di <code>.env.local</code> supaya admin dapat kabar saat ada pendaftaran baru.
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/export${buildQuery()}`}
            className="inline-flex min-h-11 items-center gap-2 rounded border border-line bg-surface px-4 text-sm font-semibold text-ink hover:border-blue hover:text-blue"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Export CSV
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {(["semua", ...REGISTRATION_STATUSES] as const).map((value) => {
          const active = status === value;
          const label = value === "semua" ? "Semua" : statusLabels[value];
          const count = value === "semua" ? counts.total : counts[value];
          return (
            <Link
              key={value}
              href={`/admin${buildQuery({ status: value, page: 1 })}`}
              aria-current={active ? "page" : undefined}
              className={`inline-flex min-h-9 items-center gap-2 rounded border px-3 text-sm font-medium ${
                active
                  ? "border-blue bg-blue text-onblue"
                  : "border-line bg-surface text-muted hover:text-ink"
              }`}
            >
              {label}
              <span className="text-xs opacity-80">{count}</span>
            </Link>
          );
        })}
      </div>

      <form action="/admin" method="get" className="mt-4 flex flex-wrap gap-2">
        {status !== "semua" ? <input type="hidden" name="status" value={status} /> : null}
        <label htmlFor="q" className="sr-only">
          Cari nama, nomor WhatsApp, atau alamat
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="Cari nama, WhatsApp, atau alamat"
          className="min-h-11 w-full max-w-sm rounded border border-line bg-surface px-3 text-sm"
        />
        <button
          type="submit"
          className="inline-flex min-h-11 items-center gap-2 rounded border border-line bg-surface px-4 text-sm font-semibold text-ink hover:border-blue hover:text-blue"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Cari
        </button>
      </form>

      {rows.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-line p-6 text-sm text-muted">
          Belum ada pendaftaran yang cocok. Kalau form baru dipakai, data akan muncul di sini setelah
          ada yang mengirim.
        </p>
      ) : (
        <>
          <div className="mt-6 overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[960px] border-collapse text-sm">
              <caption className="sr-only">Daftar pendaftaran pelanggan SpaceNet</caption>
              <thead>
                <tr className="bg-mist text-left">
                  <th scope="col" className="px-3 py-3 font-semibold text-ink">Tanggal</th>
                  <th scope="col" className="px-3 py-3 font-semibold text-ink">Nama</th>
                  <th scope="col" className="px-3 py-3 font-semibold text-ink">WhatsApp</th>
                  <th scope="col" className="px-3 py-3 font-semibold text-ink">Paket</th>
                  <th scope="col" className="px-3 py-3 font-semibold text-ink">Alamat</th>
                  <th scope="col" className="px-3 py-3 font-semibold text-ink">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row) => (
                  <tr key={row.id} className="align-top">
                    <td className="px-3 py-3 text-xs text-muted">
                      {formatTanggalIndonesia(row.createdAt.slice(0, 10))}
                      <span className="mt-0.5 block tabular-nums">
                        {row.createdAt.slice(11, 16)}
                      </span>
                      <span
                        className="mt-1 block text-[11px]"
                        title={row.notifiedChannel ? `Notifikasi: ${row.notifiedChannel}` : undefined}
                      >
                        {row.notifiedAt ? (
                          <span className="text-blue">notif terkirim</span>
                        ) : (
                          <span className="text-muted">notif belum</span>
                        )}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-medium text-ink">{row.nama}</span>
                      {row.catatan ? (
                        <span className="mt-1 block max-w-[22ch] text-xs text-muted">{row.catatan}</span>
                      ) : null}
                    </td>
                    <td className="px-3 py-3">
                      <a
                        href={`https://wa.me/${row.whatsapp.replace(/[^0-9]/g, "").replace(/^0/, "62")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tabular-nums text-blue underline underline-offset-2"
                      >
                        {row.whatsapp}
                      </a>
                    </td>
                    <td className="px-3 py-3 text-muted">{row.paketId}</td>
                    <td className="px-3 py-3 text-xs text-muted">
                      <span className="block max-w-[34ch]">{row.alamat}</span>
                    </td>
                    <td className="px-3 py-3">
                      <StatusSelect id={row.id} status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
            <p>
              Menampilkan {from}–{to} dari {total} pendaftaran
            </p>
            <nav aria-label="Navigasi halaman" className="flex items-center gap-2">
              {currentPage > 1 ? (
                <Link
                  href={`/admin${buildQuery({ page: currentPage - 1 })}`}
                  className="inline-flex min-h-9 items-center gap-1 rounded border border-line bg-surface px-3 font-medium text-ink hover:border-blue hover:text-blue"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  Sebelumnya
                </Link>
              ) : null}
              <span className="px-1">
                Halaman {currentPage} dari {totalPages}
              </span>
              {currentPage < totalPages ? (
                <Link
                  href={`/admin${buildQuery({ page: currentPage + 1 })}`}
                  className="inline-flex min-h-9 items-center gap-1 rounded border border-line bg-surface px-3 font-medium text-ink hover:border-blue hover:text-blue"
                >
                  Berikutnya
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : null}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
