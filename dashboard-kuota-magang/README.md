# Dashboard Kuota Magang — Prototipe

Prototipe frontend untuk rancangan dashboard internal pengelolaan kuota magang.

## Cara menjalankan
1. Ekstrak ZIP.
2. Buka `index.html` di browser modern (Chrome, Edge, Firefox).
3. Koneksi internet diperlukan untuk memuat Bootstrap, Bootstrap Icons, dan Chart.js dari CDN.

Bisa juga menggunakan ekstensi Live Server di Visual Studio Code.

## Fitur yang tersedia
- Dashboard ringkasan kuota dan status peserta.
- Kelola periode dan kuota (tambah/edit/hapus periode yang belum dipakai).
- Kelola peserta (tambah/edit/hapus).
- Validasi agar peserta diterima/selesai tidak melampaui kuota.
- Cari dan filter peserta.
- Impor CSV dengan kolom Nama dan Perguruan Tinggi/Kampus wajib; kolom opsional Jurusan, Periode, Status.
- Ekspor data peserta dan laporan per periode ke CSV.
- Data disimpan di localStorage browser; reset ke data demo.
- Tampilan responsif untuk layar desktop dan mobile.

## Penting — batasan prototipe
- Data contoh adalah fiktif.
- Tidak ada autentikasi/login sungguhan.
- `localStorage` hanya menyimpan data pada browser/perangkat yang sama; belum ada sinkronisasi antaradmin.
- Jangan masukkan data pribadi peserta asli sebelum mendapatkan izin dan menyiapkan backend, autentikasi, kontrol akses, backup, dan kebijakan perlindungan data.
- Belum terintegrasi dengan website resmi dinas atau Google Sheets/Excel online.
- Ekspor laporan saat ini menggunakan CSV yang dapat dibuka di Excel; belum menghasilkan PDF atau file `.xlsx`.
- Sebelum integrasi, konfirmasikan kebutuhan dan teknologi website yang ada kepada pembimbing.

## Struktur file
- `index.html` — struktur halaman dan modal.
- `style.css` — tampilan dashboard responsif.
- `app.js` — data demo, CRUD, validasi kuota, grafik, impor/ekspor CSV.
