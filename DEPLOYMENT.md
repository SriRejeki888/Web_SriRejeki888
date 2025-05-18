# Panduan Deployment Aplikasi Menu Kafe "Sri Rejeki"

## Perubahan Konfigurasi

Beberapa perubahan konfigurasi telah dilakukan untuk memastikan aplikasi dapat digunakan dengan baik:

1. **Perbaikan Koneksi API**
   - Aplikasi sekarang menggunakan `X-Access-Key` sebagai header default untuk JSONBin.io
   - Master Key JSONBin.io tidak lagi digunakan karena mengalami masalah autentikasi (Error 401)
   - Semua API key dan konfigurasi sudah diuji dan bekerja dengan baik

2. **Keamanan**
   - Semua hardcoded API key telah dihapus dan diganti dengan variabel lingkungan
   - File `.env.local` harus dibuat dengan konfigurasi berikut untuk pengembangan lokal:
   ```
   # JSONBin.io credentials
   JSONBIN_MASTER_KEY=your_jsonbin_master_key
   JSONBIN_ACCESS_KEY=your_jsonbin_access_key
   JSONBIN_ACCESS_KEY_ID=your_jsonbin_access_key_id
   
   # JSONBin.io Bin IDs
   MENU_BIN_ID=your_menu_bin_id
   CATEGORIES_BIN_ID=your_categories_bin_id
   USERS_BIN_ID=your_users_bin_id
   
   # ImgBB API Key
   IMGBB_API_KEY=your_imgbb_api_key
   ```

## Langkah-langkah Deployment

### 1. Persiapan
- Pastikan semua kode telah di-commit ke Git repository
- Jalankan `npm run build` untuk memastikan aplikasi bisa di-build

### 2. Deployment ke Vercel
1. Buat akun di [Vercel](https://vercel.com/)
2. Hubungkan repository Git
3. Tambahkan variabel lingkungan di Vercel Dashboard:
   - Buka project di Vercel
   - Pergi ke tab "Settings" > "Environment Variables"
   - Tambahkan semua variabel lingkungan berikut:
     ```
     JSONBIN_MASTER_KEY=your_jsonbin_master_key
     JSONBIN_ACCESS_KEY=your_jsonbin_access_key
     JSONBIN_ACCESS_KEY_ID=your_jsonbin_access_key_id
     MENU_BIN_ID=your_menu_bin_id
     CATEGORIES_BIN_ID=your_categories_bin_id
     USERS_BIN_ID=your_users_bin_id
     IMGBB_API_KEY=your_imgbb_api_key
     ```
4. Klik "Deploy" untuk memulai deployment
5. Vercel secara otomatis akan menggunakan konfigurasi dari file `vercel.json` dan `next.config.js`

### 3. Deployment ke Netlify
1. Buat akun di [Netlify](https://netlify.com/)
2. Hubungkan repository Git
3. Tambahkan variabel lingkungan di Netlify Dashboard:
   - Buka project di Netlify
   - Pergi ke "Site settings" > "Build & deploy" > "Environment"
   - Tambahkan semua variabel lingkungan yang sama seperti di Vercel
4. Set build command: `npm run build`
5. Set publish directory: `out` atau sesuai dengan konfigurasi build
6. Deploy aplikasi

### 4. Deployment ke Server sendiri
1. Jalankan `npm run build`
2. Salin seluruh folder build ke server
3. Pastikan environment variables sudah dikonfigurasi melalui file `.env` atau variabel sistem
4. Gunakan nginx atau server lain untuk serve aplikasi static

## Troubleshooting

Jika terjadi masalah saat deployment:

1. **Error 401 Unauthorized pada JSONBin.io**
   - Periksa Access Key yang digunakan
   - Pastikan bin IDs masih valid

2. **Error "Cannot find module" atau "Reference Error" saat build**
   - Pastikan semua variabel lingkungan telah dikonfigurasi dengan benar
   - Jika di Vercel, periksa tab "Deployments" dan klik pada deployment terakhir untuk melihat log build

3. **Error saat upload gambar**
   - Periksa ImgBB API key
   - Pastikan format gambar didukung (JPEG, PNG, GIF)

4. **Data tidak tampil**
   - Periksa struktur data di JSONBin.io
   - Pastikan format response sesuai dengan yang diharapkan aplikasi

5. **Variabel lingkungan tidak terbaca**
   - Di Vercel, pastikan variabel lingkungan diatur di project settings
   - Restart build setelah menambahkan variabel lingkungan baru

## Support & Pemeliharaan

Jika perlu bantuan lebih lanjut atau ada pertanyaan, silakan hubungi:
- Email: support@srirejeki.cafe
- Telepon: +62-xxx-xxxx-xxxx 

## Pre-Deployment Checklist

### 1. API Key dan Credentials

- Pastikan semua API key sudah benar dan valid
- Tidak ada hardcoded API key di kode sumber
- Verifikasi JSONBin.io access key dapat mengakses semua bin

### 2. Database

- Pastikan format data di JSONBin sesuai dengan struktur aplikasi
- Verifikasi data kategori sudah diisi
- Cek apakah user admin sudah ditambahkan 