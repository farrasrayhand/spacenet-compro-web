"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type { CoverageArea, CoverageStatus } from "@/types";

const CoverageMapCanvas = dynamic(() => import("@/components/sections/CoverageMapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] items-center justify-center rounded-lg border border-line bg-mist text-sm text-muted sm:h-[440px]">
      Memuat peta...
    </div>
  ),
});

type CoverageMapProps = {
  areas: CoverageArea[];
  points: Record<string, { lat: number; lng: number }>;
};

const legend: { status: CoverageStatus; label: string; symbol: string; className: string }[] = [
  { status: "aktif", label: "Terjangkau", symbol: "✓", className: "bg-blue" },
  { status: "perluasan", label: "Dalam perluasan", symbol: "→", className: "bg-amber-700" },
  { status: "antrian", label: "Belum tersedia", symbol: "?", className: "bg-muted" },
];

export function CoverageMap({ areas, points }: CoverageMapProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue" aria-hidden="true" />
            Peta area contoh
          </span>
        </h2>
        <ul className="flex flex-wrap gap-4 text-xs text-muted">
          {legend.map((item) => (
            <li key={item.status} className="flex items-center gap-1.5">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold leading-none text-white ${item.className}`}
                aria-hidden="true"
              >
                {item.symbol}
              </span>
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-2 text-xs text-muted">
        Penanda memakai titik kelurahan dari OpenStreetMap (perkiraan, bukan batas resmi). Status
        area masih data contoh. Penanda bertanda angka berarti beberapa area berdekatan digabung —
        klik untuk memperbesar. Klik penanda biasa untuk melihat nama area.
      </p>

      <div className="mt-4">
        <CoverageMapCanvas areas={areas} points={points} />
      </div>
    </div>
  );
}
