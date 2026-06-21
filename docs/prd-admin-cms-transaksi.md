# PRD Admin CMS, Client Logo, dan Transaksi Sebisa Project

## Ringkasan

Sebisa Project membutuhkan website production yang tidak hanya menampilkan company profile, tetapi juga memiliki CMS admin untuk mengelola konten utama dan flow transaksi berbasis payment gateway. Sistem harus tetap cepat untuk pengunjung, mudah dikelola oleh admin non-teknis, dan siap dihubungkan ke Supabase, Cloudinary, serta Midtrans.

## Tujuan

- Admin dapat mengelola konten website tanpa mengubah kode.
- Logo client/kerjasama hanya punya satu sumber data dan tampil di Home serta halaman Kerjasama.
- Pengunjung dapat memilih layanan, mengisi form project, lalu diarahkan ke pembayaran.
- Admin dapat melihat order, status pembayaran, dan pesan masuk.
- Website tetap ringan dengan gambar disimpan di Cloudinary dan metadata di Supabase.

## Non-Tujuan Tahap Awal

- Multi-role kompleks seperti finance/editor/super admin.
- Invoice akuntansi penuh.
- CRM lengkap.
- Chat real-time.
- Upload video besar ke storage.

## Pengguna

- Pengunjung website: melihat layanan, portfolio, testimoni, tim, client, dan melakukan checkout.
- Admin Sebisa Project: mengelola konten, melihat transaksi, dan menindaklanjuti prospek.

## Modul CMS

### Dashboard

Menampilkan ringkasan:

- Total layanan aktif.
- Total portfolio published.
- Total testimoni published.
- Total anggota tim.
- Total logo client/kerjasama.
- Total transaksi.
- Estimasi revenue.
- Grafik ringkas transaksi/prospek.
- Transaksi terbaru.

### Layanan

Admin dapat mengelola:

- Nama layanan.
- Deskripsi.
- Kategori.
- Harga dasar opsional.
- Status published.
- Urutan tampil.
- CTA transaksi/konsultasi.

### Portofolio

Admin dapat mengelola:

- Nama project.
- Kategori.
- Deskripsi.
- Gambar Cloudinary.
- Link project opsional.
- Status featured.
- Status published.
- Urutan tampil.

### Testimoni

Admin dapat mengelola:

- Nama client.
- Jabatan/brand.
- Isi testimoni.
- Rating natural opsional.
- Status published.
- Urutan tampil.

### Tim

Admin dapat mengelola:

- Nama anggota.
- Divisi.
- Posisi.
- Deskripsi pekerjaan.
- Foto Cloudinary.
- Status published.
- Urutan tampil.

### Client / Kerjasama

Satu data dipakai untuk:

- Home section: `Dipercaya Oleh 100+ Client Dari Berbagai Industri`.
- Halaman Kerjasama.

Admin dapat mengelola:

- Nama client.
- Logo Cloudinary.
- Industri/kategori opsional.
- Link website/social opsional.
- Status published.
- Urutan tampil.

### Transaksi

Admin dapat melihat:

- Nomor order.
- Nama customer.
- Brand.
- WhatsApp.
- Email.
- Layanan/produk.
- Catatan kebutuhan.
- Total pembayaran.
- Status order.
- Status payment.
- Metode payment.
- Waktu order dan waktu pembayaran.

Status utama:

- `draft`
- `pending_payment`
- `paid`
- `expired`
- `failed`
- `cancelled`
- `follow_up`

### Pesan Masuk

Admin dapat melihat submission dari form konsultasi/contact:

- Nama.
- Brand.
- Produk/layanan.
- WhatsApp.
- Email opsional.
- Pesan.
- Status follow-up.

## Flow Transaksi Public

1. Pengunjung memilih layanan dari section Layanan atau halaman checkout.
2. Pengunjung mengisi form:
   - Nama
   - Brand
   - Produk/Layanan
   - WhatsApp
   - Email
   - Catatan kebutuhan
3. Sistem membuat data order di Supabase.
4. Sistem membuat transaksi payment gateway Midtrans Snap.
5. Pengunjung diarahkan ke halaman pembayaran Midtrans.
6. Midtrans mengirim webhook ke route handler.
7. Sistem memverifikasi signature webhook.
8. Status order/payment diperbarui di Supabase.
9. Admin melihat transaksi dari dashboard.

## Arsitektur

- Frontend: Next.js App Router.
- Backend: Next.js Route Handler dan Server Action.
- Database: Supabase PostgreSQL.
- Auth admin tahap awal: cookie admin password dari environment variable.
- Media: Cloudinary signed upload.
- Payment: Midtrans Snap.
- Hosting: Vercel.

## Strategi Performa

- Halaman public tetap static/cached selama memungkinkan.
- Data public hanya mengambil item `published`.
- Admin memakai server rendering agar secret tidak masuk ke client.
- Gambar memakai Cloudinary CDN, WebP/AVIF, ukuran terkontrol.
- Dashboard chart dibuat ringan dengan SVG/CSS dan framer-motion yang sudah ada.
- Query admin memakai pagination saat data mulai banyak.

## Environment Variables

```env
ADMIN_PASSWORD=
AUTH_SECRET=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

MIDTRANS_SERVER_KEY=
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_NOTIFICATION_SECRET=
<!-- Removed: CHECKOUT_DEFAULT_AMOUNT is no longer used. Harga layanan harus tersedia di CMS. -->
```

## Risiko dan Mitigasi

- Supabase Free dapat pause: admin perlu backup rutin dan upgrade saat transaksi sudah rutin.
- Webhook payment gagal: simpan order sebagai pending dan siapkan endpoint cek ulang status.
- Gambar terlalu besar: wajib kompres dan gunakan Cloudinary transform.
- Secret bocor: semua secret hanya dibaca di server.
- Admin password sederhana: cukup untuk MVP, naikkan ke Supabase Auth saat mulai banyak user admin.

## Kriteria Sukses MVP

- `/admin` bisa diakses setelah login.
- Dashboard admin tampil profesional dan informatif.
- Admin melihat menu Layanan, Portofolio, Testimoni, Tim, Client/Kerjasama, Transaksi, dan Pesan Masuk.
- Logo client punya satu sumber data untuk Home dan Kerjasama.
- `/checkout` memiliki form order sesuai kebutuhan project digital.
- API checkout siap membuat transaksi Midtrans saat env tersedia.
- API webhook Midtrans siap memverifikasi dan memperbarui status payment.
- API signature Cloudinary siap untuk upload gambar dari admin.
