import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import AuthCheck from '../../components/AuthCheck';
import { getCategories, logoutAdmin, addCategory, updateCategory, deleteCategory } from '../../firebase/config';
import { FiEdit, FiTrash2, FiPlus, FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface CategoryItem {
  key: string;
  name: string;
  menuCount?: number;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryKey, setCategoryKey] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const router = useRouter();

  // Fungsi untuk mendapatkan kategori dari JSONBin
  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log("Mengambil kategori...");
      // Mendapatkan kategori dari JSONBin
      const categoriesData = await getCategories();
      
      console.log("Data kategori yang diterima:", categoriesData);
      
      // Transformasi data JSONBin menjadi array yang bisa digunakan komponen
      const formattedCategories: CategoryItem[] = [];
      Object.entries(categoriesData).forEach(([key, name]) => {
        formattedCategories.push({
          key,
          name: typeof name === 'string' ? name : key
        });
      });
      
      console.log("Data kategori setelah diformat:", formattedCategories);
      setCategories(formattedCategories);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Gagal memuat data kategori');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Format nama kategori menjadi key (uppercase, spasi diganti underscore)
  const formatCategoryKey = (name: string) => {
    return name.toUpperCase().replace(/\s+/g, '_');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'categoryName') {
      setCategoryName(e.target.value);
      // Otomatis update key jika tidak sedang mengedit
      if (!editingId) {
        setCategoryKey(formatCategoryKey(e.target.value));
      }
    } else if (e.target.name === 'categoryKey') {
      setCategoryKey(e.target.value.toUpperCase());
    }
  };

  // Tambah kategori baru
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim() || !categoryKey.trim()) {
      setError('Nama dan key kategori harus diisi');
      return;
    }
    
    // Format key: uppercase dan ganti spasi dengan underscore
    const formattedKey = formatCategoryKey(categoryKey);
    
    try {
      setLoading(true);
      // Cek apakah key sudah ada
      if (categories.some(cat => cat.key === formattedKey)) {
        setError(`Kategori dengan key ${formattedKey} sudah ada`);
        setLoading(false);
        return;
      }
      
      console.log(`Menambahkan kategori baru: ${formattedKey} - ${categoryName}`);
      
      // Simpan kategori ke JSONBin
      const result = await addCategory(formattedKey, categoryName);
      
      if (result.success) {
        // Reload kategori dari server
        await fetchCategories();
        
        // Reset form
        setCategoryKey('');
        setCategoryName('');
        setIsAdding(false);
        setError(null);
      } else {
        throw new Error(result.error || 'Gagal menambahkan kategori');
      }
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Gagal menambahkan kategori: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Update kategori
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim() || !editingId) {
      setError('Nama kategori harus diisi');
      return;
    }
    
    try {
      setLoading(true);
      
      console.log(`Mengupdate kategori ${editingId} dengan nama ${categoryName}`);
      
      // Update kategori di JSONBin - hanya mengubah nama, ID tetap sama
      const result = await updateCategory(editingId, editingId, categoryName);
      
      if (result.success) {
        // Reload kategori dari server
        await fetchCategories();
        
        // Reset form
        setCategoryName('');
        setEditingId(null);
        setError(null);
      } else {
        throw new Error(result.error || 'Gagal memperbarui kategori');
      }
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Gagal memperbarui kategori: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Edit kategori
  const handleEditCategory = (category: CategoryItem) => {
    setEditingId(category.key);
    setCategoryName(category.name);
    setIsAdding(false);
  };

  // Hapus kategori
  const handleDeleteCategory = async (key: string, categoryName: string, menuCount: number = 0) => {
    if (menuCount > 0) {
      if (!window.confirm(`Kategori ${categoryName} memiliki ${menuCount} menu. Jika dihapus, menu-menu tersebut mungkin tidak tampil dengan benar di halaman utama. Tetap hapus?`)) {
        return;
      }
    } else {
      if (!window.confirm(`Apakah Anda yakin ingin menghapus kategori ${categoryName}?`)) {
        return;
      }
    }
    
    try {
      setLoading(true);
      console.log(`Menghapus kategori: ${key}`);
      
      // Hapus kategori dari JSONBin
      const result = await deleteCategory(key);
      
      if (result.success) {
        // Reload kategori dari server
        await fetchCategories();
      } else {
        throw new Error(result.error || 'Gagal menghapus kategori');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Gagal menghapus kategori: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setCategoryKey('');
    setCategoryName('');
    setEditingId(null);
    setIsAdding(false);
    setError(null);
  };
  
  const startAddCategory = () => {
    setIsAdding(true);
    setEditingId(null);
    setCategoryKey('');
    setCategoryName('');
  };

  const handleLogout = () => {
    logoutAdmin();
    router.push('/login');
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-[#f5ebd8]">
        <Head>
          <title>Kelola Kategori | Sri Rejeki</title>
          <meta name="description" content="Kelola kategori menu Sri Rejeki" />
        </Head>

        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/admin" passHref legacyBehavior>
                <button className="flex items-center text-gray-600 hover:text-[var(--primary-color)] mr-4">
                  <FiArrowLeft className="mr-2" /> Kembali
                </button>
              </Link>
              <h1 className="text-xl font-bold text-[var(--primary-color)]">
                Kelola Kategori
              </h1>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-red-600"
            >
              <FiX className="mr-2" /> Logout
            </button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Daftar Kategori</h2>
              <button
                onClick={startAddCategory}
                className="flex items-center px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[#b71c1c] transition-colors"
              >
                <FiPlus className="mr-2" /> Tambah Kategori
              </button>
            </div>
            
            {isAdding && (
              <form onSubmit={handleAddCategory} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Tambah Kategori Baru</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="addCategoryName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Kategori
                    </label>
                    <input
                      type="text"
                      id="addCategoryName"
                      name="categoryName"
                      value={categoryName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                      placeholder="Contoh: Minuman Panas"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="addCategoryKey" className="block text-sm font-medium text-gray-700 mb-2">
                      ID Kategori (Otomatis)
                    </label>
                    <input
                      type="text"
                      id="addCategoryKey"
                      name="categoryKey"
                      value={categoryKey}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                      placeholder="Contoh: MINUMAN_PANAS"
                      disabled
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[#b71c1c] transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            )}
            
            {editingId && (
              <form onSubmit={handleUpdateCategory} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Edit Kategori</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="editCategoryName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Kategori
                    </label>
                    <input
                      type="text"
                      id="editCategoryName"
                      name="categoryName"
                      value={categoryName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                      placeholder="Contoh: Minuman Panas"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[#b71c1c] transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            )}
            
            {loading && !isAdding && !editingId ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <svg className="animate-spin mx-auto h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-3 text-gray-600">Memuat data kategori...</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {categories.length === 0 && !loading ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>Belum ada kategori. Silakan tambahkan kategori baru.</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama Kategori
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jumlah Menu
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categories.map((category) => (
                        <tr key={category.key} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{category.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{category.menuCount || 0}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEditCategory(category)}
                                className="text-blue-600 hover:text-blue-800"
                                disabled={loading}
                              >
                                <FiEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.key, category.name, category.menuCount)}
                                className="text-red-600 hover:text-red-800"
                                disabled={loading}
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthCheck>
  );
};

export default AdminCategories; 