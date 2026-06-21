# Production Environment Variables

Gunakan file ini sebagai checklist saat deploy ke Vercel. Jangan commit nilai rahasia.

```env
AUTH_SECRET=isi-random-secret-panjang

NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=publishable-key
SUPABASE_SECRET_KEY=secret-key-atau-service-role-key

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=cloud-name
CLOUDINARY_CLOUD_NAME=cloud-name
CLOUDINARY_API_KEY=api-key
CLOUDINARY_API_SECRET=api-secret

MIDTRANS_SERVER_KEY=server-key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=client-key
MIDTRANS_IS_PRODUCTION=false

<!-- Removed: checkout default amount is no longer used. -->
```

Catatan:

- `NEXT_PUBLIC_*` boleh dibaca browser.
- `SUPABASE_SECRET_KEY`, `CLOUDINARY_API_SECRET`, `MIDTRANS_SERVER_KEY`, dan `AUTH_SECRET` hanya boleh ada di server/Vercel env.
- Login admin memakai email + password dari tabel `admin_users` di Supabase, bukan dari env runtime.
- `ADMIN_EMAIL` dan `ADMIN_PASSWORD` hanya boleh dipakai untuk fallback development atau proses seed/reset admin lokal, bukan sebagai auth production.
- `ADMIN_SESSION_SECRET` masih diterima sebagai fallback legacy, tetapi konfigurasi baru sebaiknya memakai `AUTH_SECRET`.
- Untuk multi-admin, tambahkan data ke tabel `admin_users`. Password di tabel disimpan sebagai hash, bukan plain text.
- Jika REST Supabase mengembalikan 401 untuk `sb_secret_*`, gunakan key dari tab **Legacy anon, service_role API keys** bagian `service_role` untuk `SUPABASE_SECRET_KEY`.
- Saat payment sudah production, ubah `MIDTRANS_IS_PRODUCTION=true`.
- Harga layanan harus tersedia lewat CMS. Aplikasi akan menolak proses checkout jika harga layanan belum dikonfigurasi.

## Membuat / Reset Admin

Akun admin production dibuat ke tabel `admin_users`, mirip pola `create-admin` di project landingpage-ads.

PowerShell:

```powershell
$env:ADMIN_CREATE_EMAIL="admin@domain.com"
$env:ADMIN_CREATE_PASSWORD="password-kuat"
$env:ADMIN_CREATE_NAME="Admin Sebisa Project"
$env:ADMIN_CREATE_ROLE="super_admin"
npm run create-admin
```

Setelah command berhasil, login `/admin/login` memakai email dan password tersebut.
