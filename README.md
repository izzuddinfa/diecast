# Panduan: Inventaris Diecast + Google Sheets

Tiga file dalam paket ini:
- `index.html`: aplikasinya (satu file).
- `Code.gs`: skrip Google Apps Script (server-nya).
- `PANDUAN.md`: panduan ini.

## 1. Siapkan Google Sheets dan Apps Script (±5 menit)
1. Buka https://sheets.google.com, buat spreadsheet kosong, beri nama "Inventaris Diecast".
2. Menu **Ekstensi → Apps Script**.
3. Hapus isi `Code.gs` bawaan, lalu tempel seluruh isi file `Code.gs` dari paket ini.
4. Ganti `GANTI_DENGAN_TOKEN_RAHASIA_ANDA` di baris paling atas dengan kata sandi buatan Anda (campuran huruf dan angka, misalnya `dc-7Hk29xQmP4`). Simpan (ikon disket).
5. Klik **Terapkan (Deploy) → Penerapan baru (New deployment)**.
   - Jenis: **Aplikasi web (Web app)**.
   - Jalankan sebagai: **Saya (Me)**.
   - Siapa yang memiliki akses: **Siapa saja (Anyone)**.
6. Klik **Terapkan**, lalu **Beri akses**. Pilih akun Anda. Kalau muncul "Google belum memverifikasi aplikasi ini", klik **Lanjutan → Buka (nama proyek) (tidak aman)**, lalu **Izinkan**. Ini normal karena skripnya milik Anda sendiri.
7. Salin **URL aplikasi web** (berakhiran `/exec`).

## 2. Taruh aplikasi di GitHub Pages (±5 menit)
1. Buat akun di https://github.com, lalu buat repository baru (misalnya `diecast`), set **Public**.
2. **Add file → Upload files**, unggah `index.html`, lalu **Commit**.
3. Buka **Settings → Pages**. Di bagian Branch pilih `main` dan folder `/ (root)`, lalu **Save**.
4. Tunggu 1 sampai 2 menit. Alamatnya: `https://NAMA-GITHUB-ANDA.github.io/diecast/`.

Alternatif: Netlify Drop (https://app.netlify.com/drop), cukup seret file `index.html`.

## 3. Hubungkan
1. Buka alamat aplikasi di HP, lalu **Tambahkan ke layar utama** dari menu browser.
2. Ketuk ikon **Pengaturan → Sinkron Google Sheets**.
3. Tempel **URL Web App** dan **Token** (sama persis dengan di `Code.gs`).
4. Ketuk **Simpan & sinkron sekarang**.

Data lama di aplikasi versi sebelumnya bisa dipindah lewat **Cadangan & ekspor** (ekspor di versi lama, impor di versi baru), lalu sinkron.

## Cara kerja
- Sinkron otomatis: saat aplikasi dibuka, beberapa detik setelah Anda menyimpan perubahan, dan saat kembali ke aplikasi.
- Satu item sama dengan satu baris di sheet `items`. Jangan ubah kolom `id`, `updated`, `deleted`, dan `json` secara manual. Perubahan harus lewat aplikasi.
- Foto diunggah ke folder **Diecast Foto** yang dibuat otomatis di folder yang sama dengan spreadsheet Anda (misalnya `/diecast/Diecast Foto`), dan bisa dilihat oleh siapa saja yang punya link-nya. Link-nya acak dan tidak mudah ditebak.
- Kalau dua perangkat mengubah item yang sama, perubahan terakhir yang tersinkron yang dipakai.
- Data tetap tersimpan di HP, jadi aplikasi bisa dipakai saat offline dan akan sinkron saat online lagi.
- Daftar pilihan tambahan yang belum dipakai item mana pun (merek, kemasan, kondisi, dan lainnya) tidak ikut disinkronkan.

## Keamanan
- Jangan bagikan URL Web App dan token. Siapa pun yang punya keduanya bisa membaca dan mengubah data Anda.
- Untuk mengganti token: ubah di `Code.gs`, lalu **Terapkan → Kelola penerapan → Edit → Versi baru → Terapkan**. Setelah itu perbarui token di aplikasi.

## Kalau ada masalah
- **"Token salah":** token di aplikasi berbeda dengan di `Code.gs`.
- **"Sinkron gagal" atau tidak ada respons:** pastikan akses penerapan "Siapa saja" dan URL berakhiran `/exec`.
- **Setelah mengubah `Code.gs`:** wajib membuat versi penerapan baru, kalau tidak perubahan tidak berlaku.
- **Foto tidak muncul:** pastikan folder Diecast Foto di Drive belum dihapus atau dibatasi aksesnya.

## Catatan pembaruan (foto per pcs dan unduh foto)
- `Code.gs` berubah: foto tiap pcs sekarang ikut diunggah ke Drive, dan ada perintah baru untuk mengambil foto saat fitur **Unduh foto** dipakai. Tempel ulang `Code.gs` (jangan lupa isi token lagi), lalu buat versi penerapan baru: **Terapkan → Kelola penerapan → ikon pensil → Versi baru → Terapkan**. Kalau Google meminta izin lagi, setujui.
- Foto lama yang sudah terunggah tetap berfungsi. Item lama otomatis diubah ke format per pcs saat aplikasi dibuka.
