/**
 * Galeri dokumentasi perusahaan.
 *
 * Cara menambah foto (tanpa mengubah komponen):
 * 1. Simpan file ke public/gallery/  (mis. pemasangan-1.jpg)
 * 2. Isi catatan di bawah: src, alt (wajib, deskriptif), caption, width, height.
 * 3. Sesuaikan width/height dengan ukuran file asli agar tidak ada layout shift.
 *
 * Selama daftar ini kosong, bagian galeri menampilkan catatan TODO dan tidak
 * menampilkan gambar placeholder palsu.
 */
export type GalleryItem = {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
};

export const galleryItems: GalleryItem[] = [];

export const galleryTodoNote =
  "TODO: foto dokumentasi perusahaan belum diterima. Setelah file tersedia, tambahkan ke public/gallery/ dan daftarkan di src/data/gallery.ts.";
