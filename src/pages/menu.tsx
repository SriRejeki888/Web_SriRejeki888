import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getMenus, getCategories } from '../firebase/config';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  isBestSeller?: boolean;
}

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Ambil data menu dari JSONBin
        const menus = await getMenus();
        setMenuItems(menus);
        
        // Ambil data kategori
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Gagal memuat data menu. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter menu berdasarkan kategori
  const filteredItems = selectedCategory 
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Katalog Menu - Sri Rejeki 888</title>
        <meta name="description" content="Katalog menu makanan dan minuman Sri Rejeki 888" />
      </Head>

      <main>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--primary-color)] mb-2">Katalog Menu</h1>
          <p className="text-gray-600">Temukan berbagai menu lezat Sri Rejeki 888</p>
        </div>
        
        <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
          <Link href="/" className="text-[var(--primary-color)] hover:underline flex items-center">
            &larr; Kembali ke Beranda
          </Link>

          {/* Filter kategori */}
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === null 
                  ? 'bg-[var(--primary-color)] text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              Semua
            </button>
            {Object.entries(categories).map(([key, value]) => (
              <button 
                key={key}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === key 
                    ? 'bg-[var(--primary-color)] text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(key)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary-color)] mb-4"></div>
            <p className="text-gray-600">Memuat menu...</p>
          </div>
        ) : error ? (
          <div className="py-10 max-w-md mx-auto text-center">
            <div className="bg-red-50 p-6 rounded-xl">
              <h3 className="text-red-500 font-bold mb-2">Gagal memuat menu</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-md"
                onClick={() => window.location.reload()}
              >
                Coba Lagi
              </button>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-10 max-w-md mx-auto text-center">
            <div className="bg-yellow-50 p-6 rounded-xl">
              <h3 className="text-yellow-600 font-bold mb-2">Tidak ada menu</h3>
              <p className="text-gray-600">
                {selectedCategory 
                  ? `Tidak ada menu dalam kategori ${categories[selectedCategory]}`
                  : 'Tidak ada menu yang tersedia saat ini'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <motion.div 
                key={item.id} 
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-48 bg-gray-100 relative">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/default.jpg';
                    }}
                  />
                  {item.isBestSeller && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs flex items-center">
                      <FaStar className="mr-1" />
                      Best Seller
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <span className="text-[var(--primary-color)] font-bold">{item.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {categories[item.category] || item.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MenuPage; 