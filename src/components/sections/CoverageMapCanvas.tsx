"use client";

import L from "leaflet";
import { useMemo } from "react";
import { Marker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { CoverageArea, CoverageStatus } from "@/types";

type CoverageMapCanvasProps = {
  areas: CoverageArea[];
  points: Record<string, { lat: number; lng: number }>;
};

type AreaPoint = {
  area: CoverageArea;
  lat: number;
  lng: number;
};

type Group = {
  lat: number;
  lng: number;
  items: AreaPoint[];
};

const symbols: Record<CoverageStatus, string> = {
  aktif: "✓",
  perluasan: "→",
  antrian: "?",
};

const labels: Record<CoverageStatus, string> = {
  aktif: "Terjangkau",
  perluasan: "Dalam perluasan",
  antrian: "Belum tersedia",
};

/** Jarak pengelompokan dalam derajat (~550 m, skala zoom 13). */
const CLUSTER_THRESHOLD = 0.005;

function groupAreas(areas: CoverageArea[], points: CoverageMapCanvasProps["points"]): Group[] {
  const items: AreaPoint[] = [];

  for (const area of areas) {
    const point = points[`${area.kecamatan}|${area.kelurahan}`];
    if (point) items.push({ area, lat: point.lat, lng: point.lng });
  }

  const groups: Group[] = [];
  for (const item of items) {
    const existing = groups.find(
      (group) =>
        Math.abs(group.lat - item.lat) < CLUSTER_THRESHOLD &&
        Math.abs(group.lng - item.lng) < CLUSTER_THRESHOLD,
    );

    if (existing) {
      const count = existing.items.length;
      existing.lat = (existing.lat * count + item.lat) / (count + 1);
      existing.lng = (existing.lng * count + item.lng) / (count + 1);
      existing.items.push(item);
    } else {
      groups.push({ lat: item.lat, lng: item.lng, items: [item] });
    }
  }

  return groups;
}

/** Penanda bersimbol: status tidak hanya dibedakan lewat warna. */
function markerIcon(status: CoverageStatus) {
  return L.divIcon({
    className: "",
    html: `<span class="map-pin map-pin-${status}" aria-hidden="true">${symbols[status]}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16],
  });
}

function clusterIcon(count: number) {
  return L.divIcon({
    className: "",
    html: `<span class="map-pin map-pin-cluster" aria-hidden="true">${count}</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -17],
  });
}

function GroupMarker({ group }: { group: Group }) {
  const map = useMap();

  if (group.items.length > 1) {
    return (
      <Marker
        position={[group.lat, group.lng]}
        icon={clusterIcon(group.items.length)}
        title={`${group.items.length} area berdekatan — klik untuk memperbesar`}
        eventHandlers={{
          click: () =>
            map.flyTo([group.lat, group.lng], Math.min(map.getZoom() + 2, 17), { duration: 0.4 }),
        }}
      >
        <Popup>
          <strong>{group.items.length} area berdekatan</strong>
          <ul style={{ margin: "6px 0 0", paddingLeft: 16 }}>
            {group.items.map((item) => (
              <li key={`${item.area.kecamatan}-${item.area.kelurahan}`}>
                Kel. {item.area.kelurahan} ({labels[item.area.status]})
              </li>
            ))}
          </ul>
        </Popup>
      </Marker>
    );
  }

  const item = group.items[0];
  return (
    <Marker
      position={[item.lat, item.lng]}
      icon={markerIcon(item.area.status)}
      title={`Kel. ${item.area.kelurahan}, Kec. ${item.area.kecamatan} — ${labels[item.area.status]}`}
    >
      <Popup>
        <strong>
          Kel. {item.area.kelurahan}, Kec. {item.area.kecamatan}
        </strong>
        <br />
        Status contoh: {labels[item.area.status]}
      </Popup>
    </Marker>
  );
}

export default function CoverageMapCanvas({ areas, points }: CoverageMapCanvasProps) {
  const groups = useMemo(() => groupAreas(areas, points), [areas, points]);

  const center: [number, number] = groups.length
    ? [
        groups.reduce((sum, group) => sum + group.lat, 0) / groups.length,
        groups.reduce((sum, group) => sum + group.lng, 0) / groups.length,
      ]
    : [-0.502, 117.14];

  return (
    <div className="h-[360px] w-full overflow-hidden rounded-lg border border-line sm:h-[440px]">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {groups.map((group) => (
          <GroupMarker key={`${group.lat.toFixed(5)}-${group.lng.toFixed(5)}`} group={group} />
        ))}
      </MapContainer>
    </div>
  );
}
