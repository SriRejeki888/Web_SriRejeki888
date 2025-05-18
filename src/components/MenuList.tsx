import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import MenuCard from "./MenuCard";
import { getMenus, getCategories } from '../firebase/config';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  isBestSeller?: boolean;
}

interface MenuCategories {
  [key: string]: string;
}

interface MenuData {
  categories: MenuCategories;
  items: MenuItem[];
}

interface MenuListProps {
  activeCategory?: string;
  searchQuery?: string;
}

// Animasi untuk container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.08
    }
  }
};

// Animasi untuk item menu
const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 80 }
  }
};

// Animasi untuk item yang keluar
const exitVariants = {
  exit: {
    opacity: 0,
    y: 15,
    transition: { duration: 0.2 }
  }
};

const MenuList = ({ activeCategory = 'ALL', searchQuery = '' }: MenuListProps) => {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        
        console.log('Memuat data menu...');
        
        // Ambil data dari JSONBin
        const [menuItems, categories] = await Promise.all([
          getMenus(),
          getCategories()
        ]);
        
        // Log jumlah data yang diterima bukan data lengkap
        console.log(`Jumlah menu: ${menuItems.length}, Jumlah kategori: ${Object.keys(categories).length}`);
        
        // Cek jumlah data
        if (menuItems.length === 0) {
          console.warn('WARNING: Tidak ada menu yang ditemukan');
        }
        
        setMenuData({
          items: menuItems,
          categories: categories
        });

        // Pre-load gambar untuk mempercepat rendering
        preloadImages(menuItems);
      } catch (err) {
        console.error('Error loading menu data:', err);
        setError('Gagal memuat data menu');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Pre-load gambar menu
  const preloadImages = (items: MenuItem[]) => {
    const imagesToPreload = new Set<string>();
    
    // Ambil 12 gambar pertama untuk di-preload
    items.slice(0, 12).forEach(item => {
      if (item.imageUrl && !preloadedImages.has(item.imageUrl)) {
        imagesToPreload.add(item.imageUrl);
      }
    });
    
    // Preload gambar
    imagesToPreload.forEach(url => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, url]));
      };
    });
  };

  // Filter berdasarkan kategori dan pencarian
  useEffect(() => {
    if (menuData) {
      let items = [...menuData.items];
      
      // Filter berdasarkan kategori
      if (activeCategory !== 'ALL') {
        items = items.filter(item => item.category === activeCategory);
      }
      
      // Filter berdasarkan pencarian
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        items = items.filter(
          item => 
            item.title.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query)
        );
      }
      
      setFilteredItems(items);
      
      // Pre-load gambar untuk hasil filter
      if (items.length > 0 && items.length <= 12) {
        preloadImages(items);
      }
    }
  }, [menuData, activeCategory, searchQuery]);
  
  // Tampilan loading
  if (loading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((group) => (
          <div key={group} className="mb-8">
            <div className="h-6 bg-gray-200 w-32 rounded-full mb-4 animate-pulse mx-auto"></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[1, 2].map((item) => (
                <div key={item} className="bg-white rounded-2xl h-64 animate-pulse shadow-sm"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Tampilan error
  if (error || !menuData) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 p-6 rounded-xl shadow-sm">
          <h3 className="text-red-500 text-lg font-bold mb-2">Gagal memuat menu</h3>
          <p className="text-gray-600 mb-4">Terjadi kesalahan saat memuat data menu.</p>
          <button 
            className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-full"
            onClick={() => window.location.reload()}
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  // Tampilan tidak ada hasil
  if (filteredItems.length === 0) {
    return (
      <div className="p-8 text-center">
        <motion.div 
          className="bg-gray-50 p-6 rounded-xl shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-gray-700 text-lg font-bold mb-2">Menu Tidak Ditemukan</h3>
          <p className="text-gray-600 mb-4">
            Tidak ada menu yang sesuai dengan pencarian &quot;{searchQuery}&quot;.
            {activeCategory !== 'ALL' && ` dalam kategori ${menuData.categories[activeCategory]}`}
          </p>
          <button 
            className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-full"
            onClick={() => window.location.reload()}
          >
            Reset Pencarian
          </button>
        </motion.div>
      </div>
    );
  }
  
  // Mengelompokkan menu berdasarkan kategori
  const groupedItems: Record<string, MenuItem[]> = {};
  
  if (activeCategory === 'ALL') {
    // Jika menampilkan semua kategori, kelompokkan berdasarkan kategori
    filteredItems.forEach(item => {
      if (!groupedItems[item.category]) {
        groupedItems[item.category] = [];
      }
      groupedItems[item.category].push(item);
    });
  } else {
    // Jika hanya menampilkan satu kategori, tidak perlu pengelompokan
    groupedItems[activeCategory] = filteredItems;
  }
  
  // Daftar kategori yang ingin ditampilkan dengan urutan yang diinginkan
  const displayCategoryKeys = Object.keys(groupedItems).sort((a, b) => {
    const order = ['KOPI', 'NON_KOPI', 'MAKANAN'];
    return order.indexOf(a) - order.indexOf(b);
  });
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={`${activeCategory}-${searchQuery}`}
        className="space-y-8 px-3 sm:px-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {displayCategoryKeys.map(categoryKey => {
          const categoryItems = groupedItems[categoryKey];
          const categoryName = menuData.categories[categoryKey];
          
          if (categoryItems.length === 0) return null;
          
          return (
            <div key={categoryKey} className="mb-8">
              <motion.div 
                className="mb-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-[var(--primary-color)]">
                  {categoryName}
                </h2>
                <div className="mt-2 flex justify-center">
                  <div className="h-1 w-16 bg-[var(--secondary-color)] rounded-full"></div>
                </div>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {categoryItems.map((menu) => (
                    <motion.div 
                      key={menu.id} 
                      variants={itemVariants}
                      exit={exitVariants.exit}
                      layout
                      className="transform transition-all duration-300"
                    >
                      <MenuCard
                        title={menu.title}
                        description={menu.description}
                        imageUrl={menu.imageUrl}
                        price={menu.price}
                        isBestSeller={menu.isBestSeller}
                        category={menuData.categories[menu.category]}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};

export default MenuList;
