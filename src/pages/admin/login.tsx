import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { authenticateAdmin, checkAuthStatus } from '../../firebase/config';
import Head from 'next/head';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Cek apakah user sudah login
    try {
      const user = checkAuthStatus();
      if (user) {
        console.log("User sudah login, redirect ke dashboard");
        router.push('/admin').catch(err => {
          console.error("Error redirecting to admin dashboard:", err);
          // Gunakan window.location sebagai fallback
          setTimeout(() => {
            window.location.href = '/admin';
          }, 1000);
        });
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      // Tidak perlu redirect, biarkan user di halaman login
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Username dan password wajib diisi');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log("Login attempt with:", username, password);
      
      // Panggil fungsi autentikasi dari config
      const result = await authenticateAdmin(username, password);
      
      console.log("Authentication result:", result);
      
      if (result.success) {
        console.log("Login successful, redirecting to dashboard");
        try {
          await router.push('/admin');
          // Jika setelah 2 detik masih di halaman login, coba cara alternatif
          setTimeout(() => {
            if (window.location.pathname.includes('/admin/login')) {
              console.log('Redirect dengan router.push gagal, mencoba dengan window.location');
              window.location.href = '/admin';
            }
          }, 2000);
        } catch (error) {
          console.error('Error redirecting after login:', error);
          window.location.href = '/admin';
        }
      } else {
        console.log("Login failed:", result.error);
        setError(result.error || 'Login gagal. Periksa username dan password Anda.');
      }
    } catch (err) {
      console.error("Login exception:", err);
      setError('Terjadi kesalahan saat login. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5ebd8] px-4">
      <Head>
        <title>Login Admin | Sri Rejeki</title>
        <meta name="description" content="Login admin Sri Rejeki" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      
      <motion.div 
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <img 
            src="/images/logo.svg" 
            alt="Sri Rejeki Logo" 
            className="w-20 h-20 mx-auto"
          />
          <h1 className="mt-4 text-2xl font-bold text-gray-800">Login Admin</h1>
          <p className="text-gray-500 text-sm">Masuk untuk mengelola konten menu</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-colors text-base"
              placeholder="Masukkan username Anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-colors text-base"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          
          <motion.button
            type="submit"
            className="w-full bg-[var(--primary-color)] text-white py-3 rounded-lg font-medium text-base hover:bg-[#b71c1c] transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
            ) : 'Masuk'}
          </motion.button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Lupa password? Hubungi administrator sistem
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 