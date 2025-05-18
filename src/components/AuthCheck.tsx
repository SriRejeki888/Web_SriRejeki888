import { useRouter } from 'next/router';
import { useEffect, ReactNode, useState } from 'react';
import { checkAuthStatus } from '../firebase/config';

interface AuthCheckProps {
  children: ReactNode;
}

// Interface untuk user
interface UserData {
  id: string;
  name: string;
  email: string;
  loginTime?: string;
  [key: string]: any; // Untuk properti tambahan yang mungkin ada
}

const AuthCheck = ({ children }: AuthCheckProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const userData = checkAuthStatus();
      setUser(userData);
      setLoading(false);
      
      if (!userData) {
        console.log('Tidak ada data user, redirect ke halaman login admin');
        router.push('/admin/login').catch(err => {
          console.error('Router push error:', err);
          // Gunakan window.location sebagai fallback
          setTimeout(() => {
            window.location.href = '/admin/login';
          }, 500);
        });
      }
    };
    
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5ebd8]">
        <div className="animate-pulse">
          <div className="h-6 w-24 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-36 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default AuthCheck; 