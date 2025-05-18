import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaTimes, FaImage } from 'react-icons/fa';
import { useState } from 'react';
import { formatRupiah } from '../utils/formatUtils';

interface MenuDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  imageUrl: string;
  price?: string;
  isBestSeller?: boolean;
  category?: string;
}

const MenuDetailModal = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  imageUrl, 
  price, 
  isBestSeller,
  category 
}: MenuDetailModalProps) => {
  if (!isOpen) return null;
  
  // Format harga dengan format Rupiah
  const formattedPrice = price ? formatRupiah(price) : '';
  
  // State untuk loading dan error gambar
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Fallback image jika terjadi error
  const fallbackImageUrl = "https://via.placeholder.com/500x300?text=Menu+Image";
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const handleImageError = () => {
    console.error(`Failed to load modal image: ${imageUrl}`);
    setImageError(true);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md
                       bg-white rounded-xl overflow-hidden z-50 shadow-xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            {/* Close button */}
            <button 
              className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-2 shadow-md"
              onClick={onClose}
            >
              <FaTimes className="text-gray-800" />
            </button>
            
            {/* Image Section */}
            <div className="relative w-full h-48 sm:h-64 bg-gray-100">
              {/* Loading Placeholder - hanya tampil sebelum gambar dimuat */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <div className="flex flex-col items-center">
                    <FaImage className="text-gray-400 text-4xl mb-2 animate-pulse" />
                    <span className="text-gray-500 text-sm">Memuat gambar...</span>
                  </div>
                </div>
              )}
              
              <img 
                src={imageError ? fallbackImageUrl : imageUrl} 
                alt={title}
                // Hapus atribut loading="lazy" untuk menghindari penundaan loading
                fetchPriority="high"
                onLoad={handleImageLoad}
                onError={handleImageError}
                className="w-full h-full object-cover"
                style={{ 
                  opacity: imageLoaded || imageError ? 1 : 0,
                  transition: 'opacity 0.3s ease'
                }}
              />
              
              {/* Price */}
              {price && (
                <div className="absolute bottom-4 left-4">
                  <span className="bg-white/90 px-4 py-2 rounded-full text-[var(--primary-color)] 
                                 font-bold shadow-lg">
                    {formattedPrice}
                  </span>
                </div>
              )}
              
              {/* Best Seller Badge */}
              {isBestSeller && (
                <div className="absolute top-4 right-4 bg-[var(--primary-color)] px-3 py-1 
                               rounded-full text-white text-xs font-medium flex items-center gap-1
                               shadow-lg">
                  <FaStar className="text-yellow-300" />
                  <span>BEST SELLER</span>
                </div>
              )}
            </div>
            
            {/* Content Section */}
            <div className="p-5">
              {/* Title */}
              <h2 className="text-xl font-bold text-gray-800 mb-1">{title}</h2>
              
              {/* Category Badge */}
              {category && (
                <div className="mb-3">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {category}
                  </span>
                </div>
              )}
              
              <div className="h-px w-16 bg-[var(--primary-color)] my-3"></div>
              
              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {description || "Tidak ada deskripsi tersedia untuk menu ini."}
              </p>
              
              {/* Additional info could go here */}
              <div className="bg-gray-50 -mx-5 -mb-5 p-5 mt-4 border-t">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Informasi Tambahan</h3>
                <p className="text-gray-500 text-sm">
                  Menu ini tersedia setiap hari. Untuk informasi lebih lanjut, silakan hubungi 
                  kami di nomor yang tertera.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MenuDetailModal; 