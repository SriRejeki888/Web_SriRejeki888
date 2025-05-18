import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AuthCheck from '../../../components/AuthCheck';
import { addMenu, uploadImage, getCategories } from '../../../firebase/config';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CategoryOption {
  key: string;
  name: string;
}

const AddMenu = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        console.log("Memulai pengambilan kategori...");
        
        const categoriesData = await getCategories();
        
        console.log("Kategori yang didapatkan:", categoriesData);
        console.log("Tipe kategoriesData:", typeof categoriesData);
        console.log("Keys dari kategoriesData:", Object.keys(categoriesData));
        
        if (categoriesData && typeof categoriesData === 'object') {
          setCategories(categoriesData);
          
          // Set default category if available
          const categoryKeys = Object.keys(categoriesData);
          console.log("Daftar key kategori:", categoryKeys);
          
          if (categoryKeys.length > 0) {
            setCategory(categoryKeys[0]);
            console.log("Kategori default dipilih:", categoryKeys[0]);
          } else {
            console.log("Tidak ada kategori tersedia");
          }
        } else {
          console.error("Format kategori tidak valid:", categoriesData);
          setError('Data kategori yang diterima tidak valid');
          setCategories({});
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Gagal mengambil data kategori');
        setCategories({});
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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
    
    if (!imageFile) {
      setError('Harap unggah gambar menu');
      return;
    }

    if (!category) {
      setError('Harap pilih kategori menu');
      return;
    }
    
    // Validasi harga - pastikan format harga valid
    if (!price.trim()) {
      setError('Harap masukkan harga menu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log("Menambahkan menu baru dengan kategori:", category);
      
      // 1. Upload image
      const imageResult = await uploadImage(imageFile);
      
      if (!imageResult.success || !imageResult.url) {
        throw new Error('Gagal mengunggah gambar');
      }

      // 2. Add menu data
      const result = await addMenu({
        title: title.trim(),
        description: description.trim(),
        price: price.trim(),
        category: category.trim(),
        imageUrl: imageResult.url,
        isBestSeller: false
      });

      if (!result.success) {
        throw new Error(result.error || 'Gagal menambahkan menu');
      }

      // 3. Redirect back to dashboard
      router.push('/admin');
    } catch (err) {
      console.error('Error adding menu:', err);
      setError('Gagal menambahkan menu. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-[#f5ebd8]">
        <Head>
          <title>Tambah Menu | Sri Rejeki</title>
          <meta name="description" content="Tambah menu baru Sri Rejeki" />
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
                Tambah Menu Baru
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
                {loadingCategories ? (
                  <div className="py-2 px-3 bg-gray-100 rounded-md text-gray-600">
                    <svg className="animate-spin inline-block mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memuat kategori...
                  </div>
                ) : (
                  <>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)] focus:border-transparent"
                      required
                    >
                      <option value="" disabled>Pilih kategori</option>
                      {Object.keys(categories).length > 0 ? (
                        Object.entries(categories).map(([key, name]) => (
                          <option key={key} value={key}>
                            {typeof name === 'string' ? name : key}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>Tidak ada kategori tersedia</option>
                      )}
                    </select>
                    {Object.keys(categories).length === 0 && !loadingCategories && (
                      <p className="mt-1 text-sm text-red-500">
                        Tidak ada kategori tersedia. Harap tambahkan kategori terlebih dahulu.
                      </p>
                    )}
                  </>
                )}
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
                  ) : 'Simpan Menu'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </AuthCheck>
  );
};

export default AddMenu; 