# Sri Rejeki 888 - Katalog Menu

Aplikasi katalog menu untuk Sri Rejeki 888 Kedai Kopi & Teh. Dibuat dengan Next.js, Tailwind CSS, dan JSONBin.io sebagai database.

## Fitur

- Katalog menu yang responsif untuk mobile dan desktop
- Pencarian dan filter menu
- Dashboard admin untuk mengelola menu
- Penyimpanan data di cloud tanpa server

## Konfigurasi API

Aplikasi ini menggunakan dua layanan API eksternal:

### 1. JSONBin.io

JSONBin.io digunakan sebagai database sederhana untuk menyimpan:
- Menu (makanan dan minuman)
- Kategori
- Data pengguna

**Credentials:**
- Access Key dan Master Key disimpan sebagai variabel lingkungan

**Bin IDs:**
- Menu, Kategori, dan Pengguna disimpan sebagai variabel lingkungan

### 2. ImgBB

ImgBB digunakan untuk menyimpan gambar menu.

**API Key disimpan sebagai variabel lingkungan**

## Deployment

Untuk melakukan deployment:

1. Clone repository ini
2. Salin file `env.example` menjadi `.env.local` dan isi dengan nilai yang sesuai:
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
3. Install dependensi: `npm install`
4. Build aplikasi: `npm run build`
5. Jalankan aplikasi: `npm start`

Untuk petunjuk deployment lebih detail, lihat file [DEPLOYMENT.md](DEPLOYMENT.md).

## Deployment ke Vercel

1. Push repository ke GitHub
2. Buat akun di [Vercel](https://vercel.com/)
3. Import repository dari GitHub
4. Tambahkan variabel lingkungan di Vercel Dashboard:
   - Settings > Environment Variables
   - Tambahkan semua variabel dari file `.env.local`
5. Deploy!

## Cara Setup

### 1. Setup JSONBin.io

1. Daftar akun di [JSONBin.io](https://jsonbin.io/)
2. Buat API Key baru dari dashboard
3. Buat 3 bin baru:
   - Menu bin: untuk menyimpan data menu 
   - Categories bin: untuk menyimpan data kategori
   - Users bin: untuk menyimpan data admin

Contoh struktur data untuk masing-masing bin:

**Menu bin**:
```json
{
  "items": [
    {
      "id": "menu_1",
      "title": "Kopi Hitam",
      "description": "Kopi murni tanpa campuran",
      "price": "Rp 8.000",
      "category": "KOPI",
      "imageUrl": "https://i.ibb.co/URL-GAMBAR",
      "isBestSeller": true
    }
  ]
}
```

**Categories bin**:
```json
{
  "categories": {
    "KOPI": "Menu Kopi",
    "NON_KOPI": "Menu Non Kopi", 
    "MAKANAN": "Menu Makanan"
  }
}
```

**Users bin**:
```json
{
  "users": [
    {
      "id": "user_id",
      "name": "Nama Admin",
      "email": "email@contoh.com",
      "password": "password_aman"
    }
  ]
}
```

### 2. Setup Variabel Lingkungan

1. Salin file `env.example` menjadi `.env.local`
2. Isi dengan nilai yang sesuai dari JSONBin.io dan ImgBB

### 3. Menjalankan Aplikasi

1. Install dependencies:
```
npm install
```

2. Jalankan development server:
```
npm run dev
```

3. Buka [http://localhost:3000](http://localhost:3000) untuk melihat hasilnya.

## Cara Menggunakan Dashboard Admin

1. Akses halaman admin di [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Login dengan email dan password yang sudah ditambahkan di JSONBin User bin
3. Setelah login, Anda akan diarahkan ke dashboard admin
4. Dari dashboard, Anda bisa:
   - Melihat daftar menu
   - Menambahkan menu baru
   - Mengedit menu yang sudah ada
   - Menghapus menu
   - Mengelola kategori menu

## Pengembangan Mobile

Aplikasi ini dioptimalkan untuk pengguna mobile. Fitur-fitur khusus mobile:

1. Tampilan responsif yang menyesuaikan dengan layar kecil
2. Tombol yang lebih besar untuk kemudahan interaksi touch
3. Kecepatan loading yang dioptimalkan

## Keamanan

1. Semua API key dan kredensial disimpan sebagai variabel lingkungan
2. Tidak ada hardcoded credential di kode sumber
3. Untuk produksi, gunakan HTTPS

## Troubleshooting

Jika mengalami masalah saat deployment:
1. Periksa variabel lingkungan telah diatur dengan benar
2. Cek log build untuk detail error
3. Pastikan bin ID JSONBin.io benar dan dapat diakses

## Dukungan

Jika memiliki pertanyaan atau mengalami masalah, silakan hubungi pengembang di:
[hubungi@srirejeki.com](mailto:hubungi@srirejeki.com)

## Catatan Penting:
Jangan pernah menaruh API key asli di README atau repo publik. Gunakan file `.env.local` untuk menyimpan API key secara aman dan pastikan `.env.local` telah ditambahkan ke `.gitignore`.
