import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';

const Login = () => {
  const router = useRouter();
  const [redirectFailed, setRedirectFailed] = useState(false);
  
  useEffect(() => {
    // Mencoba redirect dengan router.push
    const redirectWithRouter = async () => {
      try {
        await router.push('/admin/login');
        
        // Jika setelah 2 detik masih di halaman ini, coba cara alternatif
        setTimeout(() => {
          if (window.location.pathname === '/login') {
            console.log('Redirect dengan router.push gagal, mencoba dengan window.location');
            setRedirectFailed(true);
            window.location.href = '/admin/login';
          }
        }, 2000);
      } catch (error) {
        console.error('Error redirecting:', error);
        setRedirectFailed(true);
        window.location.href = '/admin/login';
      }
    };
    
    redirectWithRouter();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5ebd8] px-4">
      <Head>
        <title>Login | Sri Rejeki</title>
        <meta name="description" content="Redirecting to login page" />
      </Head>
      
      <div className="text-center">
        <p className="text-gray-700 mb-4">Mengarahkan ke halaman login admin...</p>
        {redirectFailed && (
          <p className="text-red-600 mb-4">Pengalihan otomatis gagal.</p>
        )}
        <Link href="/admin/login" legacyBehavior>
          <a className="text-blue-600 hover:underline">Klik di sini jika tidak dialihkan</a>
        </Link>
      </div>
    </div>
  );
};

export default Login; 