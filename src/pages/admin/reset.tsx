import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ResetPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleReset = async () => {
    if (!confirm('Yakin akan mereset galeri? Semua foto akan dihapus.')) {
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      setError(null);

      const response = await fetch('/api/reset-gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Berhasil mereset galeri! Semua foto telah dihapus.');
      } else {
        setError(`Gagal mereset galeri: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      setError('Terjadi kesalahan saat mereset galeri');
      console.error('Error resetting gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Head>
        <title>Reset Galeri - Admin Sri Rejeki 888</title>
        <meta name="description" content="Reset galeri foto Sri Rejeki 888" />
      </Head>

      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-[var(--primary-color)]">Reset Galeri</h1>
        
        {message && (
          <div className="bg-green-50 p-4 rounded-lg mb-6 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-lg mb-6 text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <p className="text-gray-600">
            Ini akan menghapus semua foto di galeri. Tindakan ini tidak dapat dibatalkan.
          </p>

          <button
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Reset Galeri'}
          </button>

          <div className="flex justify-between mt-6">
            <Link href="/admin/gallery" className="text-[var(--primary-color)] hover:underline">
              &larr; Kembali ke Galeri
            </Link>
            <Link href="/admin" className="text-[var(--primary-color)] hover:underline">
              Dashboard Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPage; 