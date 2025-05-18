// Konfigurasi JSONBin.io sebagai alternatif untuk Firebase
// File ini menggantikan konfigurasi Firebase sebelumnya

// Definisi tipe untuk data
interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  isBestSeller?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  username?: string;
}

interface Photo {
  id: string;
  src: string;
  alt: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  error?: any;
}

interface UploadResult {
  success: boolean;
  url?: string;
  thumb?: string;
  error?: any;
}

// Constants
// Gunakan variabel lingkungan dan nilai kosong sebagai fallback untuk mencegah error
const JSONBIN_ACCESS_KEY = process.env.JSONBIN_ACCESS_KEY || '';
const JSONBIN_MASTER_KEY = process.env.JSONBIN_MASTER_KEY || '';
const MENU_BIN_ID = process.env.MENU_BIN_ID || '';
const USERS_BIN_ID = process.env.USERS_BIN_ID || ''; // Bin khusus untuk menyimpan data user
const CATEGORIES_BIN_ID = process.env.CATEGORIES_BIN_ID || '';
const IMGBB_API_KEY = process.env.IMGBB_API_KEY || '';
const JSONBIN_ACCESS_KEY_ID = process.env.JSONBIN_ACCESS_KEY_ID || '';

// Nilai default untuk penggunaan lokal development (tidak akan digunakan di production)
const DEFAULT_JSONBIN_ACCESS_KEY = process.env.NODE_ENV === 'development' ? 'DEVELOPMENT_KEY_ONLY' : '';
const DEFAULT_JSONBIN_MASTER_KEY = process.env.NODE_ENV === 'development' ? 'DEVELOPMENT_KEY_ONLY' : '';
const DEFAULT_CATEGORIES_BIN_ID = process.env.NODE_ENV === 'development' ? 'DEVELOPMENT_BIN_ID' : '';
const DEFAULT_MENU_BIN_ID = process.env.NODE_ENV === 'development' ? 'DEVELOPMENT_BIN_ID' : '';
const DEFAULT_IMGBB_API_KEY = process.env.NODE_ENV === 'development' ? 'DEVELOPMENT_KEY_ONLY' : '';

// Debug info - hanya menampilkan ketersediaan, tidak menampilkan nilai sebenarnya
if (process.env.NODE_ENV === 'development') {
  console.log('Config loaded with keys:');
  console.log('- MENU_BIN_ID available:', !!MENU_BIN_ID);
  console.log('- CATEGORIES_BIN_ID available:', !!CATEGORIES_BIN_ID);
  console.log('- USERS_BIN_ID available:', !!USERS_BIN_ID);
  console.log('- JSONBIN_ACCESS_KEY available:', !!JSONBIN_ACCESS_KEY);
  console.log('- JSONBIN_MASTER_KEY available:', !!JSONBIN_MASTER_KEY);
  console.log('- IMGBB_API_KEY available:', !!IMGBB_API_KEY);
  console.log('- JSONBIN_ACCESS_KEY_ID available:', !!JSONBIN_ACCESS_KEY_ID);
}

// Helper function untuk fetch API dengan error handling dan mencoba Access Key jika Master Key gagal
const fetchWithRetry = async (url: string, options: RequestInit, retries = 3) => {
  try {
    // Default headers
    const headers = { ...options.headers } as Record<string, string>;
    
    // Gunakan Access Key sebagai default, karena terbukti bekerja
    if (!headers['X-Access-Key'] && !headers['X-Master-Key']) {
      // Periksa apakah access key tersedia
      if (!JSONBIN_ACCESS_KEY) {
        console.error('Error: JSONBIN_ACCESS_KEY tidak tersedia!');
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Menggunakan development key karena berada di lingkungan development...');
          headers['X-Access-Key'] = '';
        } else {
          throw new Error('API key tidak tersedia! Harap periksa variabel lingkungan JSONBIN_ACCESS_KEY');
        }
      } else {
        headers['X-Access-Key'] = JSONBIN_ACCESS_KEY;
      }
    }
    
    const updatedOptions = {
      ...options,
      headers: headers
    };
    
    // Log URL yang diakses tanpa menampilkan bin ID lengkap
    const urlObj = new URL(url);
    // Hanya tampilkan endpoint tanpa bin ID
    if (urlObj.pathname.includes('/b/')) {
      const pathParts = urlObj.pathname.split('/');
      if (pathParts.length >= 3) {
        // Sembunyikan bin ID, hanya tampilkan endpoint
        const sanitizedPath = `${pathParts[0]}/${pathParts[1]}/[bin-id]`;
        console.log(`Fetching: ${urlObj.origin}${sanitizedPath}`);
      } else {
        console.log('Fetching JSONBin data...');
      }
    } else {
      console.log('Fetching data...');
    }
    
    // Coba dengan fetch standar
    const response = await fetch(url, updatedOptions);
    
    // Cek respons terlebih dahulu
    if (!response.ok) {
      const status = response.status;
      let responseText = '';
      
      try {
        responseText = await response.text();
      } catch (e) {
        responseText = 'Tidak bisa membaca response text';
      }
      
      // Log error tanpa menampilkan respons lengkap
      console.error(`HTTP error! Status: ${status}`);
      
      // Khusus untuk error 401 - Unauthorized
      if (status === 401) {
        console.error('Error 401: Unauthorized - API key tidak valid atau kedaluwarsa');
        throw new Error('API key tidak valid, kedaluwarsa, atau tidak memiliki akses');
      }
      
      // Error 403 - Forbidden
      if (status === 403) {
        console.error('Error 403: Forbidden - API key tidak memiliki akses ke bin ini');
        throw new Error('API key tidak memiliki akses ke bin yang diminta');
      }
      
      // Khusus untuk status 404 pada JSONBin, cek apakah perlu membuat bin baru
      if (status === 404 && url.includes('api.jsonbin.io')) {
        console.log('Bin tidak ditemukan, mencoba membuat bin baru...');
        
        // Coba buat bin baru untuk gallery
        const createResponse = await fetch('https://api.jsonbin.io/v3/b', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Access-Key': JSONBIN_ACCESS_KEY
          },
          body: JSON.stringify({ photos: [] })
        });
        
        if (createResponse.ok) {
          const createData = await createResponse.json();
          console.log('New bin created successfully');
          
          // Return struktur data kosong yang valid
          return { record: { photos: [] } };
        }
      }
      
      throw new Error(`HTTP error! Status: ${status}`);
    }
    
    // Baca response text
    const responseText = await response.text();
    
    // Parse response text menjadi JSON
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing JSON');
      throw new Error('Failed to parse JSON response');
    }
  } catch (error) {
    console.error(`Fetch error: ${error}`);
    
    // Coba retry jika masih ada kesempatan
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      return fetchWithRetry(url, options, retries - 1);
    }
    
    throw error;
  }
};

// Fungsi untuk mengambil data menu
export const getMenus = async (): Promise<MenuItem[]> => {
  try {
    // Cek MENU_BIN_ID
    if (!MENU_BIN_ID) {
      console.error("MENU_BIN_ID tidak tersedia!");
      return []; // Kembalikan array kosong jika BIN ID tidak ada
    }
    
    // Cek API KEY
    if (!JSONBIN_ACCESS_KEY) {
      console.error("JSONBIN_ACCESS_KEY tidak tersedia!");
      return []; // Kembalikan array kosong jika API KEY tidak ada
    }
    
    console.log('Fetching menu data...');
    
    // Ambil dari JSONBin
    const data = await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${MENU_BIN_ID}`, 
      {
        headers: {
          'X-Access-Key': JSONBIN_ACCESS_KEY
        }
      }
    );
    
    console.log('Menu data received');
    
    // Validasi data
    if (!data || !data.record) {
      console.error('Data menu tidak valid');
      return [];
    }
    
    // Pastikan array items ada
    if (!data.record.items || !Array.isArray(data.record.items)) {
      console.error('Format data menu tidak valid (items bukan array)');
      return [];
    }
    
    // Log jumlah item yang ditemukan, bukan data lengkap
    const menuItems = data.record.items || [];
    console.log(`Menu items received: ${menuItems.length} items`);
    
    // Hapus Object.prototype dari log dengan menggunakan array biasa
    // Ini mencegah browser/node menampilkan struktur lengkap array
    return Array.from(menuItems);
  } catch (error) {
    console.error('Error fetching menus:', error);
    // Tambahkan pesan spesifik untuk error akses
    if (error instanceof Error && error.message.includes('API key')) {
      console.error('API key tidak valid atau tidak memiliki akses! Harap periksa kembali JSONBIN_ACCESS_KEY');
    }
    return [];
  }
};

// Fungsi untuk menambah data menu
export const addMenu = async (menuData: Omit<MenuItem, 'id' | 'createdAt'>): Promise<{ id?: string; success: boolean; error?: any }> => {
  try {
    // Ambil data menu saat ini
    const current = await getMenus();
    
    // Buat ID unik untuk menu baru (UUID format)
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 10);
    const newId = `menu_${timestamp}_${randomStr}`;
    
    console.log('Membuat menu baru dengan ID:', newId);
    
    // Pastikan ID tidak kosong
    if (!newId) {
      console.error('Gagal membuat ID untuk menu baru');
      return { success: false, error: 'Gagal membuat ID untuk menu baru' };
    }
    
    const newMenu = {
      ...menuData,
      id: newId,
      createdAt: new Date().toISOString()
    };
    
    // Gabungkan dengan data lama
    const updated = [...current, newMenu];
    
    console.log(`Menyimpan menu baru, total menu: ${updated.length}`);
    
    // Update bin dengan data baru
    await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${MENU_BIN_ID}`, 
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': JSONBIN_ACCESS_KEY
        },
        body: JSON.stringify({ items: updated })
      }
    );
    
    console.log('Menu berhasil ditambahkan dengan ID:', newId);
    return { id: newId, success: true };
  } catch (error) {
    console.error('Error adding menu:', error);
    return { success: false, error };
  }
};

// Fungsi untuk update menu
export const updateMenu = async (id: string, menuData: Partial<MenuItem>): Promise<{ success: boolean; error?: any }> => {
  try {
    // Ambil data menu saat ini
    const current = await getMenus();
    
    // Cari dan update menu yang diinginkan
    const updated = current.map(item => {
      if (item.id === id) {
        return { ...item, ...menuData, updatedAt: new Date().toISOString() };
      }
      return item;
    });
    
    // Update bin dengan data baru
    await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${MENU_BIN_ID}`, 
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': JSONBIN_ACCESS_KEY
        },
        body: JSON.stringify({ items: updated })
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating menu:', error);
    return { success: false, error };
  }
};

// Fungsi untuk menghapus menu
export const deleteMenu = async (id: string): Promise<{ success: boolean; error?: any }> => {
  try {
    if (!id) {
      console.error('ID menu tidak valid untuk dihapus');
      return { success: false, error: 'ID menu tidak valid' };
    }
    
    console.log(`Mencoba menghapus menu dengan ID: ${id}`);
    
    // Ambil seluruh record dari JSONBin
    const data = await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${MENU_BIN_ID}`,
      {
        headers: {
          'X-Access-Key': JSONBIN_ACCESS_KEY
        }
      }
    );
    
    // Pastikan record ada dan valid
    if (!data || !data.record) {
      console.error('Data tidak valid dari JSONBin');
      return { success: false, error: 'Data tidak valid' };
    }
    
    // Simpan semua bagian selain menu items
    const { items: currentItems, ...otherData } = data.record;
    
    // Pastikan items adalah array
    if (!Array.isArray(currentItems)) {
      console.error('Format data menu tidak valid (bukan array)');
      return { success: false, error: 'Format data menu tidak valid' };
    }
    
    console.log(`Total menu sebelum penghapusan: ${currentItems.length}`);
    
    // Filter data menu yang akan dihapus
    const updatedItems = currentItems.filter((item: MenuItem) => item.id !== id);
    
    console.log(`Total menu setelah penghapusan: ${updatedItems.length}`);
    
    // Jika tidak ada perubahan, mungkin ID tidak ditemukan
    if (updatedItems.length === currentItems.length) {
      console.warn(`Menu dengan ID ${id} tidak ditemukan`);
      return { success: true }; // Tidak error, karena hasilnya sama saja
    }
    
    // Update hanya field items, pertahankan field lain (users, photos, dll)
    const newRecord = {
      ...otherData,
      items: updatedItems
    };
    
    await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${MENU_BIN_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': JSONBIN_ACCESS_KEY
        },
        body: JSON.stringify(newRecord)
      }
    );
    
    console.log(`Menu dengan ID ${id} berhasil dihapus`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting menu:', error);
    return { success: false, error };
  }
};

// Ambil semua kategori dari bin
export const getCategories = async (): Promise<Record<string, string>> => {
  try {
    console.log('Mengambil kategori dari bin ID' + (CATEGORIES_BIN_ID ? ' (tersedia)' : ' (tidak tersedia)'));
    if (!CATEGORIES_BIN_ID) {
      console.error("CATEGORIES_BIN_ID tidak tersedia!");
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Menggunakan data kategori default untuk development");
        return getDummyCategories();
      }
      
      throw new Error("CATEGORIES_BIN_ID tidak ditemukan. Harap tambahkan variabel lingkungan CATEGORIES_BIN_ID.");
    }
    
    const data = await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${CATEGORIES_BIN_ID}`,
      {
        headers: {
          'X-Access-Key': JSONBIN_ACCESS_KEY
        }
      }
    );
    
    console.log('Response getCategories: Data diterima');
    
    // Pastikan data.record adalah objek yang valid
    if (!data || !data.record || typeof data.record !== 'object') {
      console.error('Format data kategori tidak valid');
      
      if (process.env.NODE_ENV === 'development') {
        return getDummyCategories();
      }
      
      throw new Error('Format data kategori tidak valid');
    }
    
    // Cek jika kategoriesnya ada di dalam properti 'categories'
    if (data.record.categories && typeof data.record.categories === 'object') {
      console.log('Menggunakan data.record.categories');
      
      // Validasi semua nilai kategori untuk memastikan semua adalah string
      const validCategories: Record<string, string> = {};
      Object.entries(data.record.categories).forEach(([key, value]) => {
        validCategories[key] = typeof value === 'string' ? value : key;
      });
      
      // Log jumlah kategori, bukan data lengkap
      console.log(`Categories received: ${Object.keys(validCategories).length} items`);
      
      // Log kategori yang ditemukan secara aman (hanya nama kategori)
      if (process.env.NODE_ENV === 'development') {
        console.log('Kategori tersedia:', Object.keys(validCategories).join(', '));
      }
      
      return validCategories;
    }
    
    // Fallback jika tidak ada properti categories tapi data.record adalah objek
    if (typeof data.record === 'object') {
      console.log('Fallback: menggunakan data.record langsung');
      
      // Validasi semua nilai kategori
      const validCategories: Record<string, string> = {};
      Object.entries(data.record).forEach(([key, value]) => {
        // Skip jika bukan string (mungkin properti lain dalam record)
        if (typeof value === 'string') {
          validCategories[key] = value;
        }
      });
      
      // Jika ada kategori yang valid, kembalikan
      if (Object.keys(validCategories).length > 0) {
        console.log(`Categories received: ${Object.keys(validCategories).length} items`);
        
        // Log kategori yang ditemukan secara aman (hanya nama kategori)
        if (process.env.NODE_ENV === 'development') {
          console.log('Kategori tersedia:', Object.keys(validCategories).join(', '));
        }
        
        return validCategories;
      }
    }
    
    console.error('Tidak ada format kategori yang valid ditemukan');
    
    if (process.env.NODE_ENV === 'development') {
      return getDummyCategories();
    }
    
    throw new Error('Tidak ada format kategori yang valid ditemukan');
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    if (process.env.NODE_ENV === 'development') {
      return getDummyCategories();
    }
    
    throw error;
  }
};

// Data dummy untuk development
const getDummyCategories = (): Record<string, string> => {
  return { 
    "KOPI": "Kopi", 
    "NON_KOPI": "Non-Kopi", 
    "MAKANAN": "Makanan" 
  };
};

// Tambah kategori baru
export const addCategory = async (key: string, name: string): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log(`Menambah kategori ke bin: ${CATEGORIES_BIN_ID}`);
    // Ambil data kategori yang sudah ada
    const data = await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${CATEGORIES_BIN_ID}`,
      {
        headers: {
          'X-Access-Key': JSONBIN_ACCESS_KEY
        }
      }
    );
    
    console.log('Data kategori yang ada:', data);
    
    let updatedData;
    
    // Cek jika data valid dan sudah memiliki struktur categories
    if (data && data.record && data.record.categories) {
      // Update kategori dalam struktur yang sudah ada
      updatedData = {
        ...data.record,
        categories: {
          ...data.record.categories,
          [key]: name
        }
      };
    } else if (data && data.record) {
      // Buat struktur categories baru
      updatedData = {
        ...data.record,
        categories: {
          [key]: name
        }
      };
    } else {
      // Jika tidak ada data sama sekali, buat baru
      updatedData = {
        categories: {
          [key]: name
        }
      };
    }
    
    // Update ke JSONBin
    const response = await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${CATEGORIES_BIN_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': JSONBIN_ACCESS_KEY
        },
        body: JSON.stringify(updatedData)
      }
    );
    
    console.log('Response addCategory:', response);
    return { success: true };
  } catch (error) {
    console.error('Error adding category:', error);
    return { success: false, error };
  }
};

// Update kategori
export const updateCategory = async (oldKey: string, newKey: string, newName: string): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log(`Mengupdate kategori di bin: ${CATEGORIES_BIN_ID}`);
    // Ambil data lengkap dari JSONBin
    const data = await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${CATEGORIES_BIN_ID}`,
      {
        headers: {
          'X-Access-Key': JSONBIN_ACCESS_KEY
        }
      }
    );
    
    let updatedData;
    
    // Cek jika kategoriesnya ada di dalam properti 'categories'
    if (data && data.record && data.record.categories) {
      // Buat salinan dari kategori
      const categories = { ...data.record.categories };
      
      // Hapus kategori lama
      delete categories[oldKey];
      
      // Tambahkan kategori baru
      categories[newKey] = newName;
      
      // Buat data terupdate
      updatedData = {
        ...data.record,
        categories
      };
    } else if (data && data.record) {
      // Fallback jika tidak ada properti categories tapi data.record ada
      // Hapus langsung dari record
      const recordCopy = { ...data.record };
      delete recordCopy[oldKey];
      recordCopy[newKey] = newName;
      
      updatedData = recordCopy;
    } else {
      // Jika tidak ada data, buat baru
      updatedData = {
        categories: {
          [newKey]: newName
        }
      };
    }
    
    // Update ke JSONBin
    const response = await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${CATEGORIES_BIN_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': JSONBIN_ACCESS_KEY
        },
        body: JSON.stringify(updatedData)
      }
    );
    
    console.log('Response updateCategory:', response);
    return { success: true };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error };
  }
};

// Hapus kategori
export const deleteCategory = async (key: string): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log(`Menghapus kategori dari bin: ${CATEGORIES_BIN_ID}`);
    // Ambil data lengkap dari JSONBin
    const data = await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${CATEGORIES_BIN_ID}`,
      {
        headers: {
          'X-Access-Key': JSONBIN_ACCESS_KEY
        }
      }
    );
    
    let updatedData;
    
    // Cek jika kategoriesnya ada di dalam properti 'categories'
    if (data && data.record && data.record.categories) {
      // Buat salinan dari kategori
      const categories = { ...data.record.categories };
      
      // Hapus kategori
      delete categories[key];
      
      // Buat data terupdate
      updatedData = {
        ...data.record,
        categories
      };
    } else if (data && data.record) {
      // Fallback jika tidak ada properti categories
      const recordCopy = { ...data.record };
      delete recordCopy[key];
      
      updatedData = recordCopy;
    } else {
      // Jika tidak ada data, kembalikan objek kosong
      updatedData = { categories: {} };
    }
    
    // Update ke JSONBin
    const response = await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${CATEGORIES_BIN_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': JSONBIN_ACCESS_KEY
        },
        body: JSON.stringify(updatedData)
      }
    );
    
    console.log('Response deleteCategory:', response);
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error };
  }
};

// Fungsi untuk mengambil data galeri
export const getGallery = async (): Promise<Photo[]> => {
  try {
    console.log('Fetching gallery data...');
    
    // Gunakan fungsi fetchWithRetry untuk menangani error dengan lebih baik
    const data = await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${MENU_BIN_ID}`,
      {
        headers: {
          'X-Access-Key': JSONBIN_ACCESS_KEY
        }
      }
    );
    
    console.log('Gallery data received');
    
    // Validasi struktur data
    if (!data.record) {
      console.warn('Invalid data structure');
      return [];
    }
    
    // Jika photos belum ada, inisialisasi sebagai array kosong
    if (!data.record.photos || !Array.isArray(data.record.photos)) {
      console.log('Photos array not found, initializing...');
      
      // Tambahkan properti photos kosong sambil mempertahankan data lainnya
      await fetchWithRetry(
        `https://api.jsonbin.io/v3/b/${MENU_BIN_ID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Access-Key': JSONBIN_ACCESS_KEY
          },
          body: JSON.stringify({
            ...data.record,
            photos: []
          })
        }
      );
      
      return [];
    }
    
    // Log jumlah foto yang ditemukan, bukan data lengkap
    console.log(`Photos received: ${data.record.photos.length} items`);
    
    return data.record.photos || [];
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }
};

// Upload gambar (gunakan imgbb.com API gratis)
export const uploadImage = async (imageFile: File): Promise<UploadResult> => {
  try {
    console.log('Uploading image to ImgBB...');
    
    // Validasi ukuran file
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB (ImgBB free tier limit)
    if (imageFile.size > MAX_FILE_SIZE) {
      console.warn('Ukuran gambar melebihi 2MB, akan dicoba kompresi otomatis');
    }
    
    // Konversi file gambar ke base64 untuk ImgBB
    const base64Image = await convertFileToBase64(imageFile);
    
    // Ambil ImgBB API key
    const imgbbApiKey = IMGBB_API_KEY;
    if (!imgbbApiKey) {
      console.error('ImgBB API key tidak ditemukan');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Menggunakan development ImgBB key...');
        return mockImageUpload(imageFile.name);
      } else {
        return { 
          success: false, 
          error: 'Konfigurasi ImgBB API key tidak ditemukan. Harap tambahkan variabel lingkungan IMGBB_API_KEY.'
        };
      }
    }
    
    // Kirim data dengan format application/x-www-form-urlencoded yang lebih kompatibel
    const requestBody = new URLSearchParams();
    requestBody.append('key', imgbbApiKey);
    requestBody.append('image', base64Image);
    
    console.log('Sending image to ImgBB API...');
    
    // Implementasi retry mechanism
    const MAX_RETRIES = 3;
    let retries = 0;
    let response;
    
    while (retries < MAX_RETRIES) {
      try {
        response = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: requestBody
        });
        
        if (response.ok) {
          break;
        }
        
        console.warn(`Attempt ${retries + 1} failed, retrying...`);
        retries++;
        // Exponential backoff
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, retries)));
      } catch (err) {
        console.error(`Network error on attempt ${retries + 1}:`, err);
        retries++;
        if (retries >= MAX_RETRIES) throw err;
        // Exponential backoff
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, retries)));
      }
    }
    
    if (!response || !response.ok) {
      const errorText = response ? await response.text() : 'Network error';
      console.error('ImgBB API error:', response?.status);
      throw new Error(`ImgBB API error: ${response?.status || 'Network'} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('ImgBB response success:', data.success);
    
    if (data.success) {
      console.log('Image uploaded successfully to ImgBB');
      return { 
        success: true, 
        url: data.data.url,
        thumb: data.data.thumb?.url || data.data.url
      };
    } else {
      console.error('ImgBB upload failed:', data.error);
      return { success: false, error: data.error?.message || 'Upload gagal' };
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Menggunakan mock image URL untuk development');
      return mockImageUpload(imageFile.name);
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Terjadi kesalahan saat upload gambar' 
    };
  }
};

// Function untuk mock image upload dalam development
const mockImageUpload = (filename: string): UploadResult => {
  const mockUrl = `https://loremflickr.com/640/480/food?filename=${encodeURIComponent(filename)}`;
  console.log('Using mock image URL for development:', mockUrl);
  return {
    success: true,
    url: mockUrl,
    thumb: mockUrl
  };
};

// Helper function untuk konversi File ke base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result?.toString() || '';
      // Hapus prefix "data:image/jpeg;base64," dari hasil
      const base64 = result.substring(result.indexOf(',') + 1);
      resolve(base64);
    };
    reader.onerror = () => {
      reject(new Error('Failed to convert file to base64'));
    };
    reader.readAsDataURL(file);
  });
};

// Fungsi untuk menambah foto ke galeri
export const addPhoto = async (photoData: Omit<Photo, 'id' | 'createdAt'>): Promise<{ id?: string; success: boolean; error?: any }> => {
  try {
    console.log('Adding new photo with data:', photoData);
    
    // Pastikan URL gambar sudah ada (seharusnya sudah di-upload ke ImgBB terlebih dahulu)
    if (!photoData.src) {
      console.error('Error: No image URL provided');
      return { 
        success: false, 
        error: 'URL gambar tidak ditemukan. Pastikan gambar sudah diupload ke ImgBB terlebih dahulu.' 
      };
    }
    
    // Buat ID unik untuk foto baru
    const newId = `photo_${Date.now()}`;
    const newPhoto = {
      id: newId,
      ...photoData,
      createdAt: new Date().toISOString()
    };
    
    // Ambil data dari bin menu
    console.log('Fetching existing data from menu bin...');
    const data = await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${MENU_BIN_ID}`,
      {
        headers: {
          'X-Access-Key': JSONBIN_ACCESS_KEY
        }
      }
    );
    
    // Validasi struktur dan tambahkan photo baru
    if (!data.record) {
      throw new Error('Data tidak valid');
    }
    
    // Siapkan data baru dengan mempertahankan data lainnya
    const updatedData = {
      ...data.record,
      photos: Array.isArray(data.record.photos) ? [...data.record.photos, newPhoto] : [newPhoto]
    };
    
    console.log(`Updating menu bin with new photo, total photos: ${updatedData.photos.length}`);
    
    // Update bin dengan data baru
    const result = await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${MENU_BIN_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': JSONBIN_ACCESS_KEY
        },
        body: JSON.stringify(updatedData)
      }
    );
    
    console.log('Photo metadata successfully added with ID:', newId);
    
    return { id: newId, success: true };
  } catch (error) {
    console.error('Error adding photo:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Terjadi kesalahan saat menambahkan foto'
    };
  }
};

// Fungsi untuk update foto di galeri
export const updatePhoto = async (id: string, photoData: Partial<Photo>): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log(`Updating photo with id: ${id}`, photoData);
    
    // Ambil data dari bin menu
    const data = await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${MENU_BIN_ID}`,
      {
        headers: {
          'X-Access-Key': JSONBIN_ACCESS_KEY
        }
      }
    );
    
    // Validasi struktur
    if (!data.record || !Array.isArray(data.record.photos)) {
      console.error('Invalid data structure or photos array not found');
      return { success: false, error: 'Data tidak valid' };
    }
    
    // Cari foto yang akan diupdate
    const photoIndex = data.record.photos.findIndex((photo: Photo) => photo.id === id);
    if (photoIndex === -1) {
      console.error(`Photo with id ${id} not found`);
      return { success: false, error: 'Foto tidak ditemukan' };
    }
    
    // Update foto
    const updatedPhotos = [...data.record.photos];
    updatedPhotos[photoIndex] = { 
      ...updatedPhotos[photoIndex], 
      ...photoData, 
      updatedAt: new Date().toISOString() 
    };
    
    // Siapkan data baru dengan mempertahankan data lainnya
    const updatedData = {
      ...data.record,
      photos: updatedPhotos
    };
    
    // Simpan kembali ke JSONBin
    console.log(`Saving updated data with ${updatedPhotos.length} photos`);
    
    await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${MENU_BIN_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': JSONBIN_ACCESS_KEY
        },
        body: JSON.stringify(updatedData)
      }
    );
    
    console.log(`Photo ${id} successfully updated`);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating photo:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui foto'
    };
  }
};

// Fungsi untuk menghapus foto dari galeri
export const deletePhoto = async (id: string): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log(`Deleting photo with id: ${id}`);
    
    // Ambil data dari bin menu
    const data = await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${MENU_BIN_ID}`,
      {
        headers: {
          'X-Access-Key': JSONBIN_ACCESS_KEY
        }
      }
    );
    
    // Validasi struktur
    if (!data.record || !Array.isArray(data.record.photos)) {
      console.error('Invalid data structure or photos array not found');
      return { success: false, error: 'Data tidak valid' };
    }
    
    // Filter foto yang akan dihapus
    const updatedPhotos = data.record.photos.filter((photo: Photo) => photo.id !== id);
    
    // Jika tidak ada perubahan, foto tidak ditemukan
    if (updatedPhotos.length === data.record.photos.length) {
      console.log(`Photo with id ${id} not found`);
      return { success: true }; // Tidak error, karena hasilnya sama
    }
    
    // Siapkan data baru dengan mempertahankan data lainnya
    const updatedData = {
      ...data.record,
      photos: updatedPhotos
    };
    
    // Simpan kembali ke JSONBin
    console.log(`Saving data after photo deletion, remaining photos: ${updatedPhotos.length}`);
    
    await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${MENU_BIN_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': JSONBIN_ACCESS_KEY
        },
        body: JSON.stringify(updatedData)
      }
    );
    
    console.log(`Photo ${id} successfully deleted`);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting photo:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus foto'
    };
  }
};

// Autentikasi sederhana untuk admin
export const authenticateAdmin = async (username: string, password: string): Promise<AuthResult> => {
  try {
    console.log("Memulai proses autentikasi...");
    
    // Validasi input
    if (!username || !password) {
      console.log("Username atau password kosong");
      return {
        success: false,
        error: 'Username dan password harus diisi'
      };
    }

    console.log(`Mengambil data user...`);
    const data = await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${USERS_BIN_ID}`,
      {
        headers: {
          'X-Access-Key': JSONBIN_ACCESS_KEY
        }
      }
    );
    
    console.log("Data user diterima");
    
    if (!data || !data.record) {
      console.log("Format data tidak valid");
      return {
        success: false,
        error: 'Data tidak valid'
      };
    }

    // Periksa apakah 'users' ada di record
    if (!Array.isArray(data.record.users)) {
      console.log("Users array tidak ditemukan atau kosong");
      return {
        success: false,
        error: 'Tidak ada user yang terdaftar'
      };
    }

    const users = data.record.users;
    console.log(`Jumlah user: ${users.length}`);
    
    // Cari user dengan username dan password yang sesuai
    const user = users.find((u: User) => 
      u.username === username && u.password === password
    );
    
    if (!user) {
      console.log("User tidak ditemukan");
      return {
        success: false,
        error: 'Username atau password salah'
      };
    }

    console.log("User ditemukan, membuat token...");
    // Buat token sederhana (dalam aplikasi nyata, gunakan JWT)
    const token = btoa(`${user.id}:${Date.now()}`);
    
    // Simpan data user dan token di localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_user', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        loginTime: new Date().toISOString()
      }));
      
      // Set cookie untuk autentikasi
      document.cookie = `admin_token=${token}; path=/; max-age=86400`; // 24 jam
    }
    
    console.log("Autentikasi berhasil");
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  } catch (error) {
    console.error('Error autentikasi:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan saat autentikasi'
    };
  }
};

// Cek status login
export const checkAuthStatus = (): any => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('admin_user');
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    // Validasi waktu login (maksimal 12 jam)
    const loginTime = new Date(user.loginTime).getTime();
    const currentTime = new Date().getTime();
    const twelveHours = 12 * 60 * 60 * 1000;
    
    if (currentTime - loginTime > twelveHours) {
      // Login expired
      localStorage.removeItem('admin_user');
      return null;
    }
    
    return user;
  } catch (e) {
    console.error('Error checking auth status:', e);
    localStorage.removeItem('admin_user');
    return null;
  }
};

// Fungsi untuk logout admin
export const logoutAdmin = (): void => {
  // Hapus data dari localStorage
  localStorage.removeItem('admin_user');
  
  // Hapus cookie
  document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
  // Redirect ke halaman login
  window.location.href = '/admin/login';
};

// Ambil semua user
export const getUsers = async (): Promise<User[]> => {
  try {
    console.log(`Mengambil data user...`);
    const data = await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${USERS_BIN_ID}`,
      {
        headers: {
          'X-Access-Key': JSONBIN_ACCESS_KEY
        }
      }
    );
    console.log('Data user diterima');
    
    // Log jumlah user tanpa menampilkan data lengkap
    const users = data.record.users || [];
    console.log(`Jumlah user: ${users.length}`);
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Tambah user baru
export const addUser = async (userData: Omit<User, 'id'>): Promise<{ id?: string; success: boolean; error?: any }> => {
  try {
    console.log(`Mencoba menambah user baru...`);
    const current = await getUsers();
    const newId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const newUser = { ...userData, id: newId };
    const updated = [...current, newUser];
    
    console.log(`Menyimpan data user...`);
    await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${USERS_BIN_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': JSONBIN_ACCESS_KEY
        },
        body: JSON.stringify({ users: updated })
      }
    );
    console.log('User berhasil ditambahkan');
    return { id: newId, success: true };
  } catch (error) {
    console.error('Error adding user:', error);
    return { success: false, error };
  }
};

// Hapus user
export const deleteUser = async (id: string): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log(`Mencoba menghapus user dengan ID: ${id}`);
    const current = await getUsers();
    const updated = current.filter(user => user.id !== id);
    console.log(`Total user sebelum: ${current.length}, setelah: ${updated.length}`);
    
    console.log(`Menyimpan data user yang diperbarui...`);
    await fetchWithRetry(
      `https://api.jsonbin.io/v3/b/${USERS_BIN_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': JSONBIN_ACCESS_KEY
        },
        body: JSON.stringify({ users: updated })
      }
    );
    console.log(`User berhasil dihapus`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error };
  }
}; 