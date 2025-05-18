import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaUpload, FaSignOutAlt, FaTrash, FaEdit, FaArrowLeft, FaImage, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { logoutAdmin, uploadImage, getGallery, addPhoto, updatePhoto, deletePhoto } from '../../firebase/config';
import { FiArrowLeft, FiHome, FiAlertTriangle } from 'react-icons/fi';

interface Photo {
  id: string;
  src: string;
  alt: string;
  isActive: boolean;
}

const AdminGalleryPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [newPhotoAlt, setNewPhotoAlt] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Cek status login
  useEffect(() => {
    try {
      const userData = localStorage.getItem('admin_user');
      
      if (!userData) {
        router.push('/admin/login');
      } else {
        const user = JSON.parse(userData);
        setIsLoggedIn(true);
        setUsername(user.name || 'Admin');
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      setIsLoggedIn(false);
      router.push('/admin/login');
    }
  }, [router]);

  // Fetch gallery data
  useEffect(() => {
    if (isLoggedIn) {
      const fetchGallery = async () => {
        try {
          setLoading(true);
          console.log('Mencoba fetch gallery data...');
          const galleryData = await getGallery();
          console.log('Gallery data berhasil diambil:', galleryData);
          
          if (galleryData && Array.isArray(galleryData)) {
            setPhotos(galleryData);
            console.log(`${galleryData.length} foto berhasil dimuat`);
            
            // Log jumlah foto yang aktif
            const activePhotos = galleryData.filter(p => p.isActive);
            console.log(`${activePhotos.length} foto aktif, ${galleryData.length - activePhotos.length} foto tidak aktif`);
          } else {
            console.warn('Gallery data kosong atau bukan array:', galleryData);
            setPhotos([]);
          }
          
          setError(null);
        } catch (err) {
          console.error('Error loading gallery:', err);
          setError('Gagal memuat data galeri');
        } finally {
          setLoading(false);
        }
      };

      fetchGallery();
    }
  }, [isLoggedIn]);

  // Fungsi refresh gallery untuk digunakan setelah operasi CRUD
  const refreshGallery = async () => {
    try {
      console.log('Memuat ulang data gallery...');
      const galleryData = await getGallery();
      
      if (galleryData && Array.isArray(galleryData)) {
        setPhotos(galleryData);
        console.log(`Data gallery dimuat ulang: ${galleryData.length} foto`);
      } else {
        console.warn('Refresh gallery: data kosong atau bukan array', galleryData);
        setPhotos([]);
      }
    } catch (err) {
      console.error('Error refreshing gallery:', err);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    // Preview gambar
    if (window.FileReader) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Browser Anda tidak mendukung preview gambar');
    }
  };

  const handleAddPhoto = async () => {
    if (!imageFile) {
      setMessage({
        type: 'error',
        text: 'Silakan pilih gambar terlebih dahulu'
      });
      return;
    }

    if (!newPhotoAlt) {
      setMessage({
        type: 'error',
        text: 'Silakan masukkan deskripsi gambar'
      });
      return;
    }

    // Validasi ukuran file (maks 2MB untuk ImgBB gratisan)
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    if (imageFile.size > MAX_FILE_SIZE) {
      setMessage({
        type: 'error',
        text: 'Ukuran gambar terlalu besar. Maksimal 2MB.'
      });
      return;
    }

    try {
      setUploading(true);
      
      console.log('Mulai proses upload gambar ke ImgBB...');
      
      // STEP 1: Upload gambar ke ImgBB
      const uploadResult = await uploadImage(imageFile);
      
      console.log('Hasil upload ImgBB:', uploadResult);
      
      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(uploadResult.error || 'Gagal mengupload gambar ke ImgBB');
      }
      
      console.log('Upload ke ImgBB berhasil, URL gambar:', uploadResult.url);
      console.log('Menyimpan data foto (URL dan metadata) ke JSONBin...');
      
      // STEP 2: Simpan URL dan metadata ke JSONBin
      const photoData = {
        src: uploadResult.url,
        alt: newPhotoAlt,
        isActive: true // Pastikan foto baru selalu aktif
      };
      
      console.log('Data foto yang akan disimpan ke JSONBin:', photoData);
      
      // Tambahkan foto ke JSONBin (hanya URL dan metadata)
      const result = await addPhoto(photoData);

      console.log('Hasil penyimpanan metadata foto di JSONBin:', result);

      if (result.success && result.id) {
        // Update state
        const newPhoto: Photo = {
          id: result.id,
          ...photoData
        };
        
        console.log('Menambahkan foto baru ke state:', newPhoto);
        setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
        
        // Reset form
        setImagePreview(null);
        setImageFile(null);
        setNewPhotoAlt('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        setMessage({
          type: 'success',
          text: 'Foto berhasil diupload dan disimpan!'
        });
        
        // Refresh data gallery untuk memastikan synchronisasi dengan server
        console.log('Memuat ulang data gallery untuk memastikan sinkronisasi...');
        refreshGallery();
      } else {
        // Menampilkan pesan error yang lebih deskriptif
        const errorMsg = result.error ? 
          (typeof result.error === 'string' ? result.error : 'Terjadi kesalahan saat menyimpan metadata foto') 
          : 'Gagal menyimpan metadata foto ke JSONBin';
        
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Error adding photo:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Terjadi kesalahan saat menambahkan foto'
      });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(null), 5000); // Tampilkan pesan selama 5 detik
    }
  };

  const handleEditPhoto = (photo: Photo) => {
    setEditingPhoto(photo);
    setNewPhotoAlt(photo.alt);
  };

  const handleSaveEdit = async () => {
    if (!editingPhoto) return;
    
    try {
      setUploading(true);
      
      const result = await updatePhoto(editingPhoto.id, {
        alt: newPhotoAlt
      });

      if (result.success) {
        // Update state
        setPhotos(prev => prev.map(photo => {
          if (photo.id === editingPhoto.id) {
            return {
              ...photo,
              alt: newPhotoAlt
            };
          }
          return photo;
        }));
        
        setEditingPhoto(null);
        setNewPhotoAlt('');

        setMessage({
          type: 'success',
          text: 'Foto berhasil diperbarui!'
        });
      } else {
        throw new Error('Gagal memperbarui foto');
      }
    } catch (error) {
      console.error('Error updating photo:', error);
      setMessage({
        type: 'error',
        text: 'Terjadi kesalahan saat memperbarui foto'
      });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditingPhoto(null);
    setNewPhotoAlt('');
  };

  const handleDeletePhoto = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
      try {
        setUploading(true);
        
        // Hapus foto
        const result = await deletePhoto(id);

        if (result.success) {
          // Update state
          setPhotos(prev => prev.filter(photo => photo.id !== id));

          setMessage({
            type: 'success',
            text: 'Foto berhasil dihapus!'
          });
          
          // Refresh untuk memastikan sinkronisasi
          refreshGallery();
        } else {
          throw new Error('Gagal menghapus foto');
        }
      } catch (error) {
        console.error('Error deleting photo:', error);
        setMessage({
          type: 'error',
          text: 'Terjadi kesalahan saat menghapus foto'
        });
      } finally {
        setUploading(false);
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      setUploading(true);
      
      // Cari foto yang akan diupdate
      const photoToToggle = photos.find(photo => photo.id === id);
      
      if (!photoToToggle) {
        throw new Error('Foto tidak ditemukan');
      }
      
      // Toggle status
      const result = await updatePhoto(id, {
        isActive: !photoToToggle.isActive
      });

      if (result.success) {
        // Update state
        setPhotos(prev => prev.map(photo => {
          if (photo.id === id) {
            return {
              ...photo,
              isActive: !photo.isActive
            };
          }
          return photo;
        }));

        setMessage({
          type: 'success',
          text: 'Status foto berhasil diubah!'
        });
        
        // Refresh untuk memastikan sinkronisasi
        refreshGallery();
      } else {
        throw new Error('Gagal mengubah status foto');
      }
    } catch (error) {
      console.error('Error updating photo status:', error);
      setMessage({
        type: 'error',
        text: 'Terjadi kesalahan saat mengubah status foto'
      });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (!isLoggedIn) {
    return null; // Akan redirect ke halaman login
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary-color)] mb-4"></div>
          <p className="text-gray-600">Memuat data galeri...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Head>
        <title>Galeri Admin - Sri Rejeki 888</title>
        <meta name="description" content="Kelola galeri foto Sri Rejeki 888" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="container mx-auto p-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-3 sm:mb-0">
            <Link href="/admin" passHref legacyBehavior>
              <a className="flex items-center text-gray-600 hover:text-[var(--primary-color)]">
                <FiArrowLeft className="mr-2" /> Kembali ke Dashboard
              </a>
            </Link>
            <h1 className="text-2xl font-bold text-[var(--primary-color)]">Kelola Galeri</h1>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-gray-600 mr-2">
              Halo, <span className="font-medium">{username}</span>
            </span>
            <Link href="/" passHref legacyBehavior>
              <a className="text-sm text-gray-500 hover:text-gray-700 ml-2">
                <FiHome className="inline mr-1" /> Lihat Website
              </a>
            </Link>
            <motion.button 
              className="px-4 py-1.5 bg-red-500 text-white rounded-full text-sm flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-1" />
              Logout
            </motion.button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 pb-20">
        {message && (
          <motion.div 
            className={`mb-4 p-3 rounded-lg text-white ${
              message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message.text}
          </motion.div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[var(--primary-color)]">Kelola Galeri</h2>
          <div className="flex gap-3">
            <Link href="/admin/reset" passHref legacyBehavior>
              <button
                className="flex items-center text-red-500 hover:text-red-700 text-sm ml-4"
              >
                <FiAlertTriangle className="mr-1" />
                Reset
              </button>
            </Link>
          </div>
        </div>

        {/* Form tambah foto baru */}
        {!editingPhoto && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Tambah Foto Baru</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div 
                  className="h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 mb-2"
                  onClick={triggerImageUpload}
                >
                  {imagePreview ? (
                    <img 
                      src={imagePreview}
                      alt="Preview" 
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <FaImage className="text-gray-400 text-3xl mb-2" />
                      <p className="text-sm text-gray-500">Klik untuk upload gambar</p>
                    </>
                  )}
                </div>
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  className="w-full py-2 flex items-center justify-center text-sm text-[var(--primary-color)] border border-[var(--primary-color)] rounded-md"
                  onClick={triggerImageUpload}
                >
                  <FaUpload className="mr-1" />
                  {imagePreview ? 'Ganti Gambar' : 'Upload Gambar'}
                </button>
              </div>
              
              <div className="flex flex-col">
                <div className="mb-4">
                  <label htmlFor="photoAlt" className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi Foto *
                  </label>
                  <input
                    type="text"
                    id="photoAlt"
                    value={newPhotoAlt}
                    onChange={(e) => setNewPhotoAlt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                    placeholder="Contoh: Interior restoran"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Deskripsi singkat tentang foto (akan digunakan sebagai teks alternatif untuk aksesbilitas)
                  </p>
                </div>
                
                <div className="mt-auto">
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    disabled={uploading || !imagePreview || !newPhotoAlt}
                    className={`w-full py-2 rounded-md ${
                      uploading || !imagePreview || !newPhotoAlt
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)]'
                    }`}
                  >
                    {uploading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengunggah...
                      </span>
                    ) : 'Tambahkan Foto'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form edit foto */}
        {editingPhoto && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Foto</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-48 bg-gray-100 rounded-lg overflow-hidden mb-2">
                  <img 
                    src={editingPhoto.src}
                    alt={editingPhoto.alt} 
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="mb-4">
                  <label htmlFor="editPhotoAlt" className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi Foto *
                  </label>
                  <input
                    type="text"
                    id="editPhotoAlt"
                    value={newPhotoAlt}
                    onChange={(e) => setNewPhotoAlt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="mt-auto flex space-x-3">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    disabled={uploading}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={uploading || !newPhotoAlt}
                    className={`flex-1 py-2 rounded-md ${
                      uploading || !newPhotoAlt
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)]'
                    }`}
                  >
                    {uploading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menyimpan...
                      </span>
                    ) : 'Simpan Perubahan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Daftar foto */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Galeri Foto ({photos.length})</h2>
          
          {error ? (
            <div className="bg-red-50 p-6 rounded-xl text-center">
              <h3 className="text-red-500 font-bold mb-2">Gagal memuat data</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-md"
                onClick={() => window.location.reload()}
              >
                Coba Lagi
              </button>
            </div>
          ) : photos.length === 0 ? (
            <div className="bg-yellow-50 p-6 rounded-xl text-center">
              <h3 className="text-yellow-600 font-bold mb-2">Galeri kosong</h3>
              <p className="text-gray-600 mb-4">Belum ada foto dalam galeri. Tambahkan foto baru menggunakan form di atas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <div key={photo.id} className="bg-white border rounded-xl shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-100 relative">
                    <img 
                      src={photo.src} 
                      alt={photo.alt} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/default.jpg';
                      }}
                    />
                    {!photo.isActive && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="px-3 py-1 bg-red-500 text-white text-xs rounded-full">Tidak Aktif</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-3">{photo.alt}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        photo.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {photo.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                      <div className="flex space-x-2">
                        <button 
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                          onClick={() => handleEditPhoto(photo)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="p-2 text-purple-500 hover:bg-purple-50 rounded-full transition-colors"
                          onClick={() => handleToggleStatus(photo.id)}
                          title={photo.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {photo.isActive ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                        <button 
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          onClick={() => handleDeletePhoto(photo.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminGalleryPage; 