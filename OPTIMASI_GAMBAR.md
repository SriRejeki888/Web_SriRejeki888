# Panduan Optimasi Gambar untuk Sri Rejeki 888

## Masalah yang Diperbaiki

Sebelumnya, terdapat perbedaan kecepatan loading gambar antara halaman detail (yang lebih cepat) dengan halaman utama (yang lebih lambat). Beberapa masalah yang teridentifikasi:

1. **Penggunaan loading="lazy"** yang menunda loading gambar sampai user scroll ke area tersebut
2. **Tidak adanya prioritas loading** untuk gambar-gambar yang penting 
3. **Tidak adanya preload strategi** untuk memuat gambar lebih awal
4. **Tidak adanya preconnect/dns-prefetch** untuk domain tempat gambar disimpan

## Solusi yang Diterapkan

Beberapa optimasi yang telah dilakukan untuk mempercepat loading gambar:

### 1. Prioritas Loading Gambar

- Menambahkan `fetchPriority="high"` pada gambar di komponen MenuCard dan MenuDetailModal
- Menghilangkan atribut `loading="lazy"` yang menyebabkan penundaan loading

### 2. Preloading Gambar

- Menambahkan preloading gambar di komponen MenuList untuk 12 gambar pertama
- Menggunakan teknik preload dengan objek `new Image()` untuk memuat gambar sebelum dirender
- Menambahkan preloading gambar saat komponen MenuCard dibuat

### 3. DNS Prefetch dan Preconnect

- Menambahkan `dns-prefetch` dan `preconnect` untuk domain gambar di _document.tsx
- Domain yang di-preload: i.ibb.co (ImgBB) dan api.jsonbin.io (JSONBin)

### 4. Preload Logo

- Menambahkan preload untuk logo pada halaman utama

## Cara Kerja

1. Saat aplikasi dimuat, browser akan melakukan preconnect dan dns-prefetch ke domain gambar
2. Logo utama akan di-preload terlebih dahulu
3. Saat MenuList dimuat, 12 gambar pertama akan di-preload
4. Setiap MenuCard secara individual akan melakukan preload gambarnya
5. Semua gambar menggunakan `fetchPriority="high"` untuk diprioritaskan oleh browser

## Kelebihan Implementasi

1. **Feedback Visual yang Jelas** - Tetap menampilkan placeholder saat loading
2. **Prioritas yang Tepat** - Gambar menu mendapatkan prioritas tinggi
3. **Loading yang Lebih Cepat** - Dengan preload dan prefetch
4. **Transisi yang Halus** - Dengan opacity transition
5. **Fallback yang Baik** - Dengan placeholder jika gambar gagal dimuat

## Tips Tambahan untuk Pengembangan

1. Optimalkan ukuran gambar menu sebelum di-upload (disarankan 640x480 atau lebih kecil)
2. Gunakan format WebP untuk gambar (lebih kecil namun kualitas tetap baik)
3. Jika menggunakan ImgBB, manfaatkan URL thumbnail yang disediakan untuk preview
4. Pertimbangkan untuk implementasi lazy loading hanya untuk gambar yang berada jauh di bawah (tidak terlihat pada viewport awal) 