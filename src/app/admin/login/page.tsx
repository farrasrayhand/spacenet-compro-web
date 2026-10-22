import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAdminConfigured, isAdminSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Masuk admin",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdminSession()) redirect("/admin");

  const configured = isAdminConfigured();

  return (
    <div className="wrap flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-6">
        <p className="text-sm font-semibold text-bluetext">Panel admin</p>
        <h1 className="mt-2 text-2xl">Masuk</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Halaman ini hanya untuk admin SpaceNet. Data pendaftaran pelanggan tidak ditampilkan ke
          publik.
        </p>

        {configured ? (
          <div className="mt-6">
            <LoginForm />
          </div>
        ) : (
          <p className="mt-6 rounded border border-dashed border-line p-4 text-sm text-muted">
            ADMIN_PASSWORD belum diisi di <code>.env.local</code>. Buat file itu dari
            <code> .env.example</code>, isi kata sandi, lalu jalankan ulang server.
          </p>
        )}
      </div>
    </div>
  );
}
