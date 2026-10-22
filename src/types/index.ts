export type PackageId = "hemat" | "mantap" | "ideal" | "gamers";

export type Package = {
  id: PackageId;
  name: string;
  speedMbps: number;
  pricePerMonth: number;
  highlight?: boolean;
  badge?: string;
  features: string[];
};

export type Promo = {
  active: boolean;
  label: string;
  note: string;
};

export type Company = {
  brand: string;
  legalName: string;
  whatsapp: string;
  phoneDisplay: string;
  address: string;
  addressLines: string[];
  hours: string;
  emergencySupport: string;
  email: string | null;
};

export type CoverageStatus = "aktif" | "perluasan" | "antrian";

export type CoverageArea = {
  kecamatan: string;
  kelurahan: string;
  status: CoverageStatus;
};

export type CoverageResult = {
  status: CoverageStatus;
  matchedArea: CoverageArea | null;
  title: string;
  message: string;
};

export type Registration = {
  nama: string;
  whatsapp: string;
  alamat: string;
  paketId: PackageId;
  tanggalPasang?: string;
  catatan?: string;
  /** Persetujuan pemrosesan data pribadi (UU PDP). */
  consent: boolean;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  isPlaceholder?: boolean;
};

export type ValuePoint = {
  id: string;
  title: string;
  description: string;
};

export type TrustPoint = {
  id: string;
  title: string;
  description: string;
  needsAsset?: boolean;
};
