import { motion } from "framer-motion";
import { FaStar, FaInfoCircle, FaImage } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { formatRupiah } from '../utils/formatUtils';
import MenuDetailModal from './MenuDetailModal';

interface MenuCardProps {
  title: string;
  description: string;
  imageUrl: string;
  price?: string;
  isBestSeller?: boolean;
  category?: string;
}

const MenuCard = ({ title, description, imageUrl, price, isBestSeller, category }: MenuCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Format harga dengan format Rupiah
  const formattedPrice = price ? formatRupiah(price) : '';

  // Gunakan gambar placeholder jika terjadi error
  const fallbackImageUrl = "https://via.placeholder.com/300x200?text=Menu+Image";
  
  // Reset image states when imageUrl changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [imageUrl]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error(`Failed to load image: ${imageUrl}`);
    setImageError(true);
  };

  // Preload gambar saat komponen dibuat
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
    }
  }, [imageUrl]);

  return (
    <>
      <motion.div
        className="glass-effect rounded-2xl overflow-hidden shadow-sm border border-gray-100
                   mb-4 relative group glow-on-hover"
        whileHover={{ 
          scale: 1.03,
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)" 
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-gray-100">
          {/* Loading Placeholder - hanya tampil sebelum gambar dimuat */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <FaImage className="text-gray-400 text-3xl animate-pulse" />
            </div>
          )}
          
          {/* Gambar utama - tetap gunakan foto asli */}
          <img 
            className="w-full h-full object-cover"
            src={imageError ? fallbackImageUrl : imageUrl}
            alt={title}
            fetchPriority="high"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ 
              opacity: imageLoaded || imageError ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
          
          {/* Price Tag - Positioned over image */}
          {price && (
            <motion.div 
              className="absolute bottom-3 left-3 z-10"
              initial={{ opacity: 0.9 }}
              whileHover={{ scale: 1.1, y: -3 }}
              animate={{ y: isHovered ? -5 : 0 }}
            >
              <span className="inline-block bg-white/90 backdrop-blur-sm text-[var(--primary-color)]
                             px-4 py-1.5 rounded-full text-sm font-bold shadow-lg price-tag-pulse">
                {formattedPrice}
              </span>
            </motion.div>
          )}

          {/* Best Seller Badge */}
          {isBestSeller && (
            <motion.div 
              className="absolute top-3 right-3 z-10 bg-[var(--primary-color)] px-3 py-1 
                         rounded-full text-xs font-medium flex items-center gap-1
                         shadow-lg backdrop-blur-sm"
              initial={{ opacity: 0, rotate: -5 }}
              animate={{ 
                opacity: 1, 
                rotate: isHovered ? 0 : -5,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ 
                delay: 0.2,
                duration: 0.3
              }}
            >
              <FaStar className="text-yellow-300" />
              <span className="text-white font-bold">BEST SELLER</span>
            </motion.div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-4">
          <motion.h3 
            className="font-bold text-lg mb-1 text-gray-800"
          >
            {title}
          </motion.h3>
          <div className="h-px w-12 bg-[var(--primary-color)] mb-3 opacity-50"></div>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>
          
          {/* Action Buttons */}
          <motion.div 
            className="flex justify-center mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className="flex items-center justify-center gap-1 py-2 px-5 border border-[var(--primary-color)] text-[var(--primary-color)] text-sm rounded-full w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openModal}
            >
              <FaInfoCircle size={14} />
              <span>Detail</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Modal Detail Menu */}
      <MenuDetailModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={title}
        description={description}
        imageUrl={imageError ? fallbackImageUrl : imageUrl}
        price={price}
        isBestSeller={isBestSeller}
        category={category}
      />
    </>
  );
};

export default MenuCard;
