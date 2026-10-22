import { z } from "zod";

const namaRegex = /^[A-Za-zÀ-ÿ.'\- ]+$/;

export const registrationSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(3, { message: "Nama minimal 3 karakter." })
    .max(80, { message: "Nama maksimal 80 karakter." })
    .regex(namaRegex, { message: "Nama hanya boleh berisi huruf, spasi, titik, atau tanda hubung." }),
  whatsapp: z
    .string()
    .trim()
    .min(9, { message: "Nomor WhatsApp minimal 9 digit." })
    .max(18, { message: "Nomor WhatsApp maksimal 18 karakter." })
    .refine((value) => /^[0-9+\- ]+$/.test(value), {
      message: "Nomor WhatsApp hanya boleh berisi angka, spasi, tanda hubung, atau +.",
    })
    .refine((value) => {
      const digits = value.replace(/[^0-9]/g, "");
      return digits.startsWith("08") || digits.startsWith("628") || digits.startsWith("8");
    }, { message: "Gunakan nomor Indonesia, misalnya 0811-585-255." }),
  alamat: z
    .string()
    .trim()
    .min(10, { message: "Alamat minimal 10 karakter agar teknisi mudah menemukan lokasi." })
    .max(240, { message: "Alamat maksimal 240 karakter." }),
  paketId: z.enum(["hemat", "mantap", "ideal", "gamers"], {
    message: "Pilih paket yang diinginkan.",
  }),
  tanggalPasang: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || !Number.isNaN(new Date(`${value}T00:00:00`).getTime()), {
      message: "Tanggal pasang tidak valid.",
    }),
  catatan: z
    .string()
    .trim()
    .max(240, { message: "Catatan maksimal 240 karakter." })
    .optional(),
  consent: z.boolean().refine((value) => value === true, {
    message: "Centang persetujuan pemrosesan data sebelum mengirim.",
  }),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

export const coverageSchema = z.object({
  kelurahan: z
    .string()
    .trim()
    .min(3, { message: "Nama kelurahan minimal 3 karakter." })
    .max(80, { message: "Nama kelurahan maksimal 80 karakter." }),
  kecamatan: z
    .string()
    .trim()
    .min(3, { message: "Nama kecamatan minimal 3 karakter." })
    .max(80, { message: "Nama kecamatan maksimal 80 karakter." }),
  alamat: z
    .string()
    .trim()
    .max(240, { message: "Alamat maksimal 240 karakter." })
    .optional(),
});

export type CoverageFormValues = z.infer<typeof coverageSchema>;
