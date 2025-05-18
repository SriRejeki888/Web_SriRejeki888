# Panduan Deployment ke Vercel

## Persiapan

1. **Buat akun di Vercel**
   - Kunjungi [Vercel](https://vercel.com/) dan buat akun baru
   - Disarankan untuk login dengan GitHub agar repository bisa langsung terhubung

2. **Hubungkan Repository GitHub**
   - Pastikan repository sudah di-push ke GitHub
   - Di dashboard Vercel, klik "Import Project"
   - Pilih "Import Git Repository"
   - Pilih repository Sri Rejeki

## Konfigurasi Deployment

1. **Framework Preset**
   - Vercel akan secara otomatis mendeteksi aplikasi ini sebagai Next.js
   - Pastikan preset yang dipilih adalah "Next.js"

2. **Environment Variables**
   - Setelah mengimpor project, ke bagian "Settings" > "Environment Variables"
   - Tambahkan variabel lingkungan berikut:

   ```
   JSONBIN_MASTER_KEY=your_jsonbin_master_key
   JSONBIN_ACCESS_KEY=your_jsonbin_access_key
   JSONBIN_ACCESS_KEY_ID=your_jsonbin_access_key_id
   MENU_BIN_ID=your_menu_bin_id
   CATEGORIES_BIN_ID=your_categories_bin_id
   USERS_BIN_ID=your_users_bin_id
   IMGBB_API_KEY=your_imgbb_api_key
   ```

   - Pastikan untuk mengganti nilai-nilai di atas dengan API key dan Bin ID yang sebenarnya

## Keamanan Variabel Lingkungan

1. **Perlindungan API Key**
   - Semua API key HARUS disimpan sebagai variabel lingkungan di Vercel
   - JANGAN pernah menyimpan API key di repositori kode (seperti di next.config.js)
   - JANGAN menggunakan console.log untuk menampilkan API key, bahkan di lingkungan development

2. **Pengaturan Log**
   - Untuk mencegah API key terekspos di log:
     - Di Vercel, buka "Settings" > "General" > "Build & Development Settings"
     - Nonaktifkan "Build and Development Logs" untuk lingkungan Production
     - Atau pilih "Only show errors in logs"

3. **Enkripsi Variabel Lingkungan**
   - Di Vercel, semua variabel lingkungan dienkripsi secara default
   - Vercel TIDAK menampilkan nilai variabel lingkungan di UI setelah disimpan
   - Untuk memperbarui nilai, Anda harus menimpa nilai lama

4. **Pencegahan Eksposur Client-Side**
   - Variabel sensitif TIDAK boleh diakses dari sisi klien (browser)
   - Hanya gunakan variabel lingkungan di API routes atau server-side components
   - Untuk variabel yang perlu diakses client-side, gunakan prefix `NEXT_PUBLIC_` dan pastikan tidak berisi data sensitif

## Proses Deployment

1. **Deploy**
   - Klik tombol "Deploy" untuk memulai proses build dan deployment
   - Proses build akan berlangsung 1-3 menit
   - Setelah selesai, Vercel akan menampilkan link ke aplikasi yang telah di-deploy

2. **Verifikasi**
   - Buka link aplikasi yang telah di-deploy
   - Periksa apakah semua fitur berfungsi dengan baik:
     - Menu ditampilkan dengan benar
     - Kategori bisa difilter
     - Dashboard admin bisa diakses

## Pemeliharaan

1. **Automatic Deployment**
   - Vercel secara otomatis akan men-deploy ulang aplikasi setiap kali ada perubahan di branch utama (biasanya `main` atau `master`)
   - Tidak perlu melakukan deployment manual setelah push ke GitHub

2. **Branch Preview**
   - Vercel memberikan preview URL untuk setiap branch dan pull request
   - Ini memudahkan Anda untuk mengetes perubahan sebelum di-merge ke branch utama

3. **Monitoring**
   - Vercel menyediakan analytics dan log untuk memonitor aplikasi
   - Kunjungi dashboard Vercel dan pilih project untuk melihat statistik

## Troubleshooting

1. **API Key Terekspos**
   - Jika API key terekspos di log atau response, segera ganti API key tersebut
   - Periksa kembali kode untuk menghapus console.log yang menampilkan informasi sensitif
   - Jangan menyimpan API key di file yang bisa diakses publik (seperti .js, .html)

2. **Log Error Terkait API Key**
   - Jika muncul error "API key invalid", periksa kembali nilai di Vercel dashboard
   - Pastikan variabel lingkungan sudah diatur dengan benar di semua environment (Production, Preview, Development)

## Keamanan

1. **API Key**
   - Semua API key disimpan sebagai variabel lingkungan yang aman di Vercel
   - Vercel mengenkripsi semua variabel lingkungan dan tidak akan terekspos ke client-side kecuali diawali dengan `NEXT_PUBLIC_`

2. **HTTPS**
   - Vercel secara otomatis menyediakan HTTPS untuk semua deployment
   - Ini meningkatkan keamanan aplikasi dan melindungi data yang dikirim

3. **Domain**
   - Jika Anda memiliki domain kustom, Anda dapat mengaturnya di Vercel
   - Pergi ke "Settings" > "Domains" dan ikuti petunjuk

## Support

Jika Anda mengalami kesulitan dengan deployment, silakan hubungi:
- Email: support@srirejeki.cafe
- Telepon: +62-xxx-xxxx-xxxx 