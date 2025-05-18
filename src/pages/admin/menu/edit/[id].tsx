import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AuthCheck from '../../../../components/AuthCheck';
import { getCategories, getMenus, updateMenu, uploadImage } from '../../../../firebase/config';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CategoryOption {
  key: string;
  name: string;
}

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

const EditMenu = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Gagal mengambil data kategori');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      if (id && typeof id === 'string' && id.trim() !== '') {
        try {
          setFetchLoading(true);
          const menus = await getMenus();
          
          // Cari menu berdasarkan ID
          const menuData = menus.find((menu: MenuItem) => menu.id === id);
          
          if (menuData) {
            setTitle(menuData.title || '');
            setDescription(menuData.description || '');
            setPrice(menuData.price || '');
            setCategory(menuData.category || '');
            setCurrentImageUrl(menuData.imageUrl || '');
            setImagePreview(menuData.imageUrl || null);
          } else {
            setError('Menu tidak ditemukan');
            router.push('/admin');
          }
        } catch (err) {
          console.error('Error fetching menu:', err);
          setError('Gagal mengambil data menu');
        } finally {
          setFetchLoading(false);
        }
      }
    };

    if (id) {
      fetchMenu();
    }
  }, [id, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || typeof id !== 'string') {
      setError('ID menu tidak valid');
      return;
    }

    if (!category) {
      setError('Harap pilih kategori menu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let imageUrl = currentImageUrl;
      
      // Upload gambar baru jika dipilih
      if (imageFile) {
        const imageResult = await uploadImage(imageFile);
        
        if (!imageResult.success || !imageResult.url) {
          throw new Error('Gagal mengunggah gambar');
        }
        
        imageUrl = imageResult.url;
      }

      // Update data menu
      const result = await updateMenu(id as string, {
        title,
        description,
        price,
        category,
        imageUrl
      });

      if (!result.success) {
        throw new Error(result.error || 'Gagal memperbarui menu');
      }

      // Redirect kembali ke dashboard
      router.push('/admin');
    } catch (err) {
      console.error('Error updating menu:', err);
      setError('Gagal memperbarui menu. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-[#f5ebd8]">
        <Head>
          <title>Edit Menu | Sri Rejeki</title>
          <meta name="description" content="Edit menu Sri Rejeki" />
        </Head>

        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/admin" passHref legacyBehavior>
                <motion.button
                  className="flex items-center text-gray-600 hover:text-[var(--primary-color)] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiArrowLeft className="mr-2" /> Kembali
                </motion.button>
              </Link>
              <h1 className="text-xl font-bold text-[var(--primary-color)] ml-4">
                Edit Menu
              </h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                {error}
              </div>
            )}

            {fetchLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Gambar Menu
                  </label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <div className="relative mx-auto w-48 h-48">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="rounded-md w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="py-10">
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          Klik untuk memilih gambar menu
                        </p>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      {imageFile ? 'Klik untuk mengganti gambar' : 'Klik untuk mengubah gambar'}
                    </p>
                    <input
                      type="file"
                      id="image"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Menu
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)] focus:border-transparent"
                    placeholder="Masukkan nama menu"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)] focus:border-transparent"
                    placeholder="Masukkan deskripsi menu"
                    rows={3}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Harga
                  </label>
                  <input
                    type="text"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)] focus:border-transparent"
                    placeholder="Contoh: Rp 15.000"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)] focus:border-transparent"
                    required
                    disabled={loadingCategories}
                  >
                    <option value="" disabled>Pilih kategori</option>
                    {Object.entries(categories).map(([key, name]) => (
                      <option key={key} value={key}>
                        {typeof name === 'string' ? name : key}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end">
                  <Link href="/admin" passHref legacyBehavior>
                    <button 
                      type="button"
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300 transition-colors"
                      disabled={loading}
                    >
                      Batal
                    </button>
                  </Link>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-[#b71c1c] transition-colors flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menyimpan...
                      </>
                    ) : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </AuthCheck>
  );
};

export default EditMenu; 