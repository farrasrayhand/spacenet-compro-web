import { formatRupiah } from "@/lib/format";
import type { StoredRegistration } from "@/lib/registrations";
import type { Package } from "@/types";
import { company } from "@/data/company";

export type NotifyResult = { ok: boolean; channels: string[]; errors: string[] };

const TIMEOUT_MS = 6000;

function summary(reg: StoredRegistration, pkg: Package): string {
  const lines = [
    `Pendaftaran baru SpaceNet #${reg.id}`,
    `Nama: ${reg.nama}`,
    `WhatsApp: ${reg.whatsapp}`,
    `Alamat: ${reg.alamat}`,
    `Paket: ${pkg.name} ${pkg.speedMbps} Mbps (${formatRupiah(pkg.pricePerMonth)}/bulan)`,
  ];
  if (reg.tanggalPasang) lines.push(`Rencana pasang: ${reg.tanggalPasang}`);
  if (reg.catatan) lines.push(`Catatan: ${reg.catatan}`);
  lines.push(`Masuk: ${reg.createdAt}`, `Sumber: ${reg.source ?? "web"}`);
  return lines.join("\n");
}

function emailHtml(reg: StoredRegistration, pkg: Package): string {
  const rows: [string, string][] = [
    ["Nama", reg.nama],
    ["WhatsApp", reg.whatsapp],
    ["Alamat", reg.alamat],
    ["Paket", `${pkg.name} — ${pkg.speedMbps} Mbps`],
    ["Harga", `${formatRupiah(pkg.pricePerMonth)}/bulan`],
    ["Rencana pasang", reg.tanggalPasang ?? "-"],
    ["Catatan", reg.catatan ?? "-"],
    ["Waktu masuk", reg.createdAt],
  ];

  const body = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#555f6e">${label}</td><td style="padding:6px 0;font-weight:600">${value}</td></tr>`,
    )
    .join("");

  return `<div style="font-family:system-ui,sans-serif;max-width:560px">
    <h2 style="margin:0 0 4px">Pendaftaran baru #${reg.id}</h2>
    <p style="margin:0 0 16px;color:#555f6e">${company.brand} — ${company.legalName}</p>
    <table style="border-collapse:collapse">${body}</table>
    <p style="margin-top:20px;color:#555f6e;font-size:12px">Balas pelanggan lewat WhatsApp: ${company.phoneDisplay}</p>
  </div>`;
}

async function sendWebhook(text: string, reg: StoredRegistration, pkg: Package): Promise<void> {
  const url = process.env.NOTIFY_WEBHOOK_URL;
  if (!url) return;

  const isDiscord = url.includes("discord.com/api/webhooks");
  const payload = isDiscord
    ? { content: text.slice(0, 1900) }
    : {
        event: "registration.created",
        registration: reg,
        package: { id: pkg.id, name: pkg.name, speedMbps: pkg.speedMbps, pricePerMonth: pkg.pricePerMonth },
      };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) throw new Error(`Webhook membalas ${response.status}`);
}

async function sendEmail(reg: StoredRegistration, pkg: Package): Promise<void> {
  const host = process.env.SMTP_HOST;
  const to = process.env.NOTIFY_TO;
  if (!host || !to) return;

  const nodemailer = await import("nodemailer");
  const transport = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });

  await transport.sendMail({
    from: process.env.SMTP_FROM ?? `SpaceNet <no-reply@localhost>`,
    to,
    subject: `Pendaftaran baru #${reg.id} — ${reg.nama} (${reg.paketId})`,
    text: summary(reg, pkg),
    html: emailHtml(reg, pkg),
  });
}

/**
 * Kirim notifikasi pendaftaran baru. Tidak pernah melempar error: kegagalan
 * notifikasi hanya dicatat, karena pendaftaran sudah tersimpan lebih dulu.
 */
export async function notifyNewRegistration(
  reg: StoredRegistration,
  pkg: Package,
): Promise<NotifyResult> {
  const channels: string[] = [];
  const errors: string[] = [];
  const text = summary(reg, pkg);

  if (process.env.NOTIFY_WEBHOOK_URL) {
    try {
      await sendWebhook(text, reg, pkg);
      channels.push("webhook");
    } catch (error) {
      errors.push(`webhook: ${error instanceof Error ? error.message : "gagal"}`);
    }
  }

  if (process.env.SMTP_HOST && process.env.NOTIFY_TO) {
    try {
      await sendEmail(reg, pkg);
      channels.push("email");
    } catch (error) {
      errors.push(`email: ${error instanceof Error ? error.message : "gagal"}`);
    }
  }

  if (errors.length > 0) {
    console.warn("Notifikasi pendaftaran gagal:", errors.join(" | "));
  }

  return { ok: channels.length > 0, channels, errors };
}

export function isNotificationConfigured(): boolean {
  return Boolean(process.env.NOTIFY_WEBHOOK_URL || (process.env.SMTP_HOST && process.env.NOTIFY_TO));
}
