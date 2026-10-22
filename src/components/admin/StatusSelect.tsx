"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RegistrationStatus } from "@/lib/registrations";

const labels: Record<RegistrationStatus, string> = {
  baru: "Baru",
  dihubungi: "Dihubungi",
  terpasang: "Terpasang",
  batal: "Batal",
};

type StatusSelectProps = {
  id: number;
  status: RegistrationStatus;
};

export function StatusSelect({ id, status }: StatusSelectProps) {
  const router = useRouter();
  const [value, setValue] = useState<RegistrationStatus>(status);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function onChange(next: RegistrationStatus) {
    const previous = value;
    setValue(next);
    setPending(true);
    setError(false);

    try {
      const response = await fetch(`/api/registrations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });

      if (!response.ok) throw new Error("gagal");
      router.refresh();
    } catch {
      setValue(previous);
      setError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <label htmlFor={`status-${id}`} className="sr-only">
        Status pendaftaran {id}
      </label>
      <select
        id={`status-${id}`}
        value={value}
        disabled={pending}
        onChange={(event) => onChange(event.target.value as RegistrationStatus)}
        className="min-h-9 rounded border border-line bg-surface px-2 py-1 text-xs text-ink focus:border-blue"
      >
        {(Object.keys(labels) as RegistrationStatus[]).map((key) => (
          <option key={key} value={key}>
            {labels[key]}
          </option>
        ))}
      </select>
      {error ? (
        <span role="alert" className="text-xs text-red-600 dark:text-red-400">
          Gagal menyimpan
        </span>
      ) : null}
    </span>
  );
}
