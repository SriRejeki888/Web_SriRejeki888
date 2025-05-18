import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaUserPlus, FaTrash, FaArrowLeft, FaUserEdit, FaSignOutAlt } from 'react-icons/fa';
import { getUsers, addUser, deleteUser, logoutAdmin } from '../../firebase/config';
import AuthCheck from '../../components/AuthCheck';

interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState<Omit<UserData, 'id'>>({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  
  const router = useRouter();

  // Ambil data user saat halaman dimuat
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userData = await getUsers();
      setUsers(userData);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Gagal mengambil data user');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi
    if (!newUser.name || !newUser.username || !newUser.email || !newUser.password) {
      setError('Semua field harus diisi');
      return;
    }
    
    try {
      setLoading(true);
      const result = await addUser(newUser);
      
      if (result.success && result.id) {
        // Reset form
        setNewUser({
          name: '',
          username: '',
          email: '',
          password: ''
        });
        setIsAdding(false);
        setSuccess('User berhasil ditambahkan!');
        
        // Refresh data
        fetchUsers();
      } else {
        setError(`Gagal menambahkan user: ${result.error || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      console.error('Error adding user:', err);
      setError('Gagal menambahkan user');
    } finally {
      setLoading(false);
      // Hapus pesan success setelah 3 detik
      if (success) {
        setTimeout(() => setSuccess(null), 3000);
      }
    }
  };

  const handleDeleteUser = async (id: string, username: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus user ${username}?`)) {
      try {
        setLoading(true);
        const result = await deleteUser(id);
        
        if (result.success) {
          setSuccess('User berhasil dihapus!');
          // Update state
          setUsers(users.filter(user => user.id !== id));
        } else {
          setError(`Gagal menghapus user: ${result.error || 'Terjadi kesalahan'}`);
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Gagal menghapus user');
      } finally {
        setLoading(false);
        // Hapus pesan success setelah 3 detik
        if (success) {
          setTimeout(() => setSuccess(null), 3000);
        }
      }
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    router.push('/admin/login');
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-[#f5ebd8]">
        <Head>
          <title>Kelola User | Sri Rejeki</title>
          <meta name="description" content="Kelola user admin Sri Rejeki" />
        </Head>

        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/admin" passHref legacyBehavior>
                <button className="flex items-center text-gray-600 hover:text-red-600 mr-3">
                  <FaArrowLeft className="mr-2" /> Kembali
                </button>
              </Link>
              <h1 className="text-xl font-bold text-[var(--primary-color)]">
                Kelola User Admin
              </h1>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-red-600"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Daftar User</h2>
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700 transition-colors"
              disabled={isAdding}
            >
              <FaUserPlus className="mr-2" /> Tambah User
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4">
              {success}
            </div>
          )}

          {isAdding && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-md font-semibold mb-4">Tambah User Baru</h3>
              <form onSubmit={handleAddUser}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newUser.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={newUser.username}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={newUser.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)]"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-[#b71c1c] transition-colors"
                    disabled={loading}
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading && !users.length ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-600">Memuat data...</p>
            </div>
          ) : !users.length ? (
            <div className="bg-yellow-50 p-4 rounded-md text-yellow-700">
              Belum ada user. Klik "Tambah User" untuk membuat user baru.
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          className="text-red-600 hover:text-red-900 mr-4"
                        >
                          <FaTrash />
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </AuthCheck>
  );
};

export default AdminUsers; 