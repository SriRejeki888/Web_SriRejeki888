import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import AuthCheck from '../../components/AuthCheck';
import { getMenus, deleteMenu, logoutAdmin } from '../../firebase/config';
import { FiEdit, FiTrash2, FiPlus, FiLogOut, FiList, FiGrid, FiHome, FiImage, FiChevronRight, FiBox, FiBarChart, FiUser, FiSettings } from 'react-icons/fi';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaUserEdit } from 'react-icons/fa';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
}

const AdminDashboard = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const items = await getMenus();
        setMenuItems(items);
      } catch (err) {
        setError('Gagal mengambil data menu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleDeleteMenu = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      try {
        const result = await deleteMenu(id);
        if (result.success) {
          setMenuItems(menuItems.filter(item => item.id !== id));
        } else {
          setError('Gagal menghapus menu: ' + (result.error || 'Terjadi kesalahan'));
        }
      } catch (err) {
        console.error('Error deleting menu: ', err);
        setError('Gagal menghapus menu');
      }
    }
  };

  const handleLogout = () => {
    try {
      logoutAdmin();
      router.push('/admin/login');
    } catch (err) {
      console.error('Error signing out: ', err);
    }
  };

  // Menghitung jumlah item per kategori
  const getMenuCountByCategory = () => {
    const counts: Record<string, number> = {};
    menuItems.forEach(item => {
      if (counts[item.category]) {
        counts[item.category]++;
      } else {
        counts[item.category] = 1;
      }
    });
    return counts;
  };

  const categoryCount = getMenuCountByCategory();
  const categoryData = Object.entries(categoryCount).map(([category, count]) => ({ category, count }));

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-100">
        <Head>
          <title>Dashboard Admin | Sri Rejeki</title>
          <meta name="description" content="Dashboard admin Sri Rejeki" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        </Head>

        {/* Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-0">
              <span className="font-bold text-red-600">SRI</span> REJEKI <span className="text-sm font-light">Admin</span>
            </h1>
            <div className="flex items-center space-x-4">
              <Link href="/" passHref legacyBehavior>
                <div className="text-gray-600 hover:text-gray-900 text-sm cursor-pointer">
                  <FiHome className="inline mr-1" /> Lihat Website
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors text-sm"
              >
                <FiLogOut className="mr-1" /> Logout
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          {/* Statistik Ringkas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-5 border border-gray-100"
              whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm text-gray-500 font-medium">Total Menu</span>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{menuItems.length}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FiBox className="text-blue-500 text-xl" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">Tersedia di website</div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg shadow-sm p-5 border border-gray-100"
              whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm text-gray-500 font-medium">Kategori Menu</span>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{Object.keys(categoryCount).length}</h3>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <FiList className="text-green-500 text-xl" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">Aktif digunakan</div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg shadow-sm p-5 border border-gray-100"
              whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm text-gray-500 font-medium">Kategori Terbanyak</span>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {categoryData.length > 0 
                      ? categoryData.sort((a, b) => b.count - a.count)[0].category
                      : '-'}
                  </h3>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <FiBarChart className="text-purple-500 text-xl" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {categoryData.length > 0 
                  ? `${categoryData.sort((a, b) => b.count - a.count)[0].count} menu`
                  : 'Belum ada data'}
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg shadow-sm p-5 border border-gray-100"
              whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm text-gray-500 font-medium">Terakhir Diperbarui</span>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                  </h3>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <FiSettings className="text-orange-500 text-xl" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">Hari ini</div>
            </motion.div>
          </div>

          {/* Tombol Kelola User */}
          <div className="mb-6">
            <Link href="/admin/users" passHref legacyBehavior>
              <motion.div 
                className="flex items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-lg shadow-sm hover:shadow-md cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaUserEdit className="mr-3 text-xl" /> 
                <div>
                  <div className="font-semibold">Kelola User Admin</div>
                  <div className="text-xs text-purple-200">Tambah, edit atau hapus akun admin</div>
                </div>
                <FiChevronRight className="ml-auto" />
              </motion.div>
            </Link>
          </div>
          
          {/* Menu Akses Cepat */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Manajemen Konten</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/categories" passHref legacyBehavior>
                <motion.div
                  className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500 flex items-center hover:shadow-md cursor-pointer"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-blue-50 p-3 rounded-full">
                    <FiList className="text-blue-500 text-xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800">Kelola Kategori</h3>
                    <p className="text-sm text-gray-500">Atur kategori menu</p>
                  </div>
                  <FiChevronRight className="ml-auto text-gray-400" />
                </motion.div>
              </Link>
              
              <Link href="/admin/gallery" passHref legacyBehavior>
                <motion.div
                  className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500 flex items-center hover:shadow-md cursor-pointer"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-green-50 p-3 rounded-full">
                    <FiImage className="text-green-500 text-xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800">Kelola Galeri</h3>
                    <p className="text-sm text-gray-500">Atur foto dan gambar</p>
                  </div>
                  <FiChevronRight className="ml-auto text-gray-400" />
                </motion.div>
              </Link>
              
              <Link href="/admin/menu/add" passHref legacyBehavior>
                <motion.div
                  className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500 flex items-center hover:shadow-md cursor-pointer"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-red-50 p-3 rounded-full">
                    <FiPlus className="text-red-500 text-xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800">Tambah Menu</h3>
                    <p className="text-sm text-gray-500">Buat menu baru</p>
                  </div>
                  <FiChevronRight className="ml-auto text-gray-400" />
                </motion.div>
              </Link>
            </div>
          </div>

          {/* Daftar Menu */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-0">Daftar Menu</h2>
                <div className="flex items-center">
                  <button 
                    onClick={() => setActiveTab('menu')}
                    className={`mr-2 px-3 py-1 rounded-md ${activeTab === 'menu' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <FiGrid className="inline mr-1" /> Grid
                  </button>
                  <button 
                    onClick={() => setActiveTab('table')}
                    className={`px-3 py-1 rounded-md ${activeTab === 'table' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <FiList className="inline mr-1" /> Tabel
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 m-6 rounded-md">
                {error}
              </div>
            )}

            {loading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex space-x-4">
                      <div className="h-16 w-16 bg-gray-200 rounded-md"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              menuItems.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                    <FiBox className="text-4xl text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">Belum ada menu. Silakan tambahkan menu baru.</p>
                  <Link href="/admin/menu/add" passHref legacyBehavior>
                    <motion.button
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors inline-flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiPlus className="mr-2" /> Tambah Menu Baru
                    </motion.button>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Tampilan Grid */}
                  {activeTab === 'menu' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                      {menuItems.map((item) => (
                        <motion.div 
                          key={item.id} 
                          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                          whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="h-40 overflow-hidden relative">
                            <img
                              className="w-full h-full object-cover"
                              src={item.imageUrl}
                              alt={item.title}
                            />
                            <div className="absolute top-0 right-0 m-2">
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                {item.category}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 text-lg">{item.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1 h-10">{item.description}</p>
                            <div className="mt-4 flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-900">{item.price}</span>
                              <div className="flex space-x-2">
                                <Link href={`/admin/menu/edit/${item.id}`} passHref legacyBehavior>
                                  <motion.div
                                    className="p-2 bg-indigo-50 text-indigo-600 rounded-md cursor-pointer"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Edit Menu"
                                  >
                                    <FiEdit />
                                  </motion.div>
                                </Link>
                                <motion.button
                                  onClick={() => handleDeleteMenu(item.id)}
                                  className="p-2 bg-red-50 text-red-600 rounded-md"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="Hapus Menu"
                                >
                                  <FiTrash2 />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  {/* Tampilan Tabel */}
                  {activeTab === 'table' && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Menu
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Kategori
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Harga
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {menuItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0">
                                    <img className="h-10 w-10 rounded-md object-cover" src={item.imageUrl} alt={item.title} />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                    <div className="text-sm text-gray-500 max-w-sm truncate">{item.description}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {item.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.price}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-3">
                                  <Link href={`/admin/menu/edit/${item.id}`} passHref legacyBehavior>
                                    <motion.div
                                      className="flex items-center text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <FiEdit className="mr-1" /> Edit
                                    </motion.div>
                                  </Link>
                                  <motion.button
                                    onClick={() => handleDeleteMenu(item.id)}
                                    className="flex items-center text-red-600 hover:text-red-900"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <FiTrash2 className="mr-1" /> Hapus
                                  </motion.button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-8 py-4">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Sri Rejeki. All rights reserved.
          </div>
        </footer>
      </div>
    </AuthCheck>
  );
};

export default AdminDashboard; 