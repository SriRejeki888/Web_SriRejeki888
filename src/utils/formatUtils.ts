// Fungsi untuk memformat harga dengan format Rupiah
export const formatRupiah = (price: string | number): string => {
  // Hapus semua karakter non-angka
  let numericValue = typeof price === 'string' 
    ? price.replace(/[^\d]/g, '') 
    : price.toString();
  
  // Jika kosong, kembalikan default
  if (!numericValue) return 'Rp 0';
  
  // Konversi ke angka
  const num = parseInt(numericValue, 10);
  
  // Format dengan pemisah ribuan
  return `Rp ${num.toLocaleString('id-ID')}`;
}; 