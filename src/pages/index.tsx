import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useMotionValueEvent, useTransform } from 'framer-motion';
import { FaUtensils, FaCoffee, FaPizzaSlice, FaMapMarkerAlt, FaSearch, FaGlassWhiskey } from 'react-icons/fa';
import MenuList from "../components/MenuList";
import styles from '../styles/Logo.module.css';

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const { scrollY } = useScroll();
  const menuSectionRef = useRef<HTMLDivElement>(null);
  
  const logoY = useTransform(scrollY, [0, 300], [0, 50]);
  const bannerOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);
  const bannerScale = useTransform(scrollY, [0, 300], [1, 0.95]);
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  const scrollToMenu = () => {
    menuSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Head>
        <title>Katalog Menu Sri Rejeki 888</title>
        <meta name="description" content="Katalog menu makanan dan minuman lezat dari Sri Rejeki 888" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        
        {/* Image loading optimization */}
        <link rel="preload" as="image" href="/images/logo.svg" />
      </Head>
      
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm' : 'bg-white border-b border-gray-200'}`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex justify-between items-center py-2 px-2 sm:px-4">
          <div className="flex items-center">
            <Link href="/" passHref legacyBehavior>
              <motion.div 
                className="flex items-center cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12">
                  <img 
                    src="/images/logo.svg"
                    alt="Sri Rejeki 888 Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
            </Link>
            <div className="ml-2 text-gray-800">
              <h1 className="text-xl font-bold">SRI REJEKI</h1>
              <div className="h-px w-full bg-gray-200 my-1"></div>
              <p className="text-[10px] text-gray-500">Kedai Kopi & Teh</p>
            </div>
          </div>
          
          <nav className="flex">
            <ul className="flex space-x-7">
              <li>
                <Link href="/" passHref legacyBehavior>
                  <motion.div
                    className="flex flex-col items-center text-gray-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaUtensils className="text-[var(--primary-color)] text-xl mb-1" />
                    <span className="text-sm">Menu</span>
                  </motion.div>
                </Link>
              </li>
              <li>
                <Link href="/location" passHref legacyBehavior>
                  <motion.div
                    className="flex flex-col items-center text-gray-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaMapMarkerAlt className="text-[var(--primary-color)] text-xl mb-1" />
                    <span className="text-sm">Lokasi</span>
                  </motion.div>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </motion.header>

      <div className="pt-16 sm:pt-20">
        <motion.div 
          style={{ 
            opacity: bannerOpacity,
            scale: bannerScale
          }}
          className="hero-banner mb-6 glass-effect sm:bg-white/80 overflow-hidden shine-effect"
        >
          {/* Decorative elements */}
          <motion.div 
            className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1.5 }}
          >
            {/* Lingkaran hijau dihapus */}
          </motion.div>

          <div className="container mx-auto py-8 px-4 sm:py-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div 
                className="mb-6 text-center md:text-left md:mb-0 md:w-1/2 relative z-10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="menu-title mb-3 text-3xl sm:text-4xl font-extrabold text-[var(--primary-color)]">
                  Nikmati Menu Pilihan Terbaik
                </h1>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Rasakan kelezatan hidangan kami yang dibuat dengan bahan berkualitas 
                  dan dimasak dengan penuh cinta untuk memanjakan selera Anda
                </p>
                <motion.div className="flex flex-row gap-3 mt-6 justify-center md:justify-start">
                  <Link href="/location" passHref legacyBehavior>
                    <motion.div 
                      className="px-4 py-2 sm:px-6 bg-[var(--primary-color)] text-white rounded-full 
                            hover:opacity-80 transition-all duration-300
                              flex items-center gap-2 justify-center shadow-md cursor-pointer
                              text-sm sm:text-base w-36 sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaMapMarkerAlt className="text-white" />
                    <span>Kunjungi Kami</span>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="md:w-1/2 flex justify-center relative z-10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ y: logoY }}
              >
                <div className="w-full max-w-[220px] max-h-[220px] relative transform transition-transform duration-300 flex items-center justify-center"> 
                  <motion.img 
                    src="/images/logo.svg"
                    alt="Sri Rejeki 888 Logo"
                    className="w-full h-full object-contain drop-shadow-xl"
                    whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div ref={menuSectionRef}>
        <motion.main 
          className="container mx-auto py-4 px-2 sm:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Search and Filter */}
          <div className="glass-effect mb-6 p-4 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Cari menu favorit Anda..."
                  className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 w-full sm:w-auto">
                <CategoryButton 
                  icon={<FaUtensils className="text-white" />}
                  label="Semua"
                  isActive={activeCategory === 'ALL'}
                  onClick={() => setActiveCategory('ALL')}
                />
                <CategoryButton 
                  icon={<FaCoffee className="text-inherit" />}
                  label="Kopi"
                  isActive={activeCategory === 'KOPI'}
                  onClick={() => setActiveCategory('KOPI')}
                />
                  <CategoryButton 
                    icon={<FaGlassWhiskey className="text-inherit" />}
                    label="Non Kopi"
                    isActive={activeCategory === 'NON_KOPI'}
                    onClick={() => setActiveCategory('NON_KOPI')}
                  />
                <CategoryButton 
                  icon={<FaPizzaSlice className="text-inherit" />}
                  label="Makanan"
                  isActive={activeCategory === 'MAKANAN'}
                  onClick={() => setActiveCategory('MAKANAN')}
                />
              </div>
            </div>
          </div>
          
            {/* Menu items */}
            <MenuList 
              activeCategory={activeCategory}
              searchQuery={searchQuery}
            />
          </motion.main>
          </div>
      </div>
      
      <motion.footer 
        className="bg-[var(--primary-color)] text-white p-5 mt-10 border-t border-white/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left flex items-center">
            <div className="w-10 h-10 mr-2">
              <img 
                src="/images/logo.svg"
                alt="Sri Rejeki 888 Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">SRI REJEKI 888</h3>
              <p className="text-xs text-white/80">Berdiri sejak tadi pagi</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm font-semibold">0812-2864-4062</p>
            <p className="text-xs text-white/80 mt-1">Sidoarjo, Jawa Timur</p>
          </div>
        </div>
        <div className="border-t border-white/20 mt-4 pt-4 text-center text-white/80 text-xs">
          <p>© {new Date().getFullYear()} Kedai Sri Rejeki 888. Semua hak dilindungi.</p>
        </div>
      </motion.footer>
    </div>
  );
};

interface CategoryButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const CategoryButton = ({ icon, label, isActive, onClick }: CategoryButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`py-2 px-4 rounded-full flex items-center gap-2 transition-all ${
        isActive 
          ? 'bg-[var(--primary-color)] text-white' 
          : 'bg-white text-gray-700 border border-gray-200 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)]'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className={isActive ? 'text-white' : 'text-[var(--primary-color)]'}>
        {icon}
      </span>
      <span className="text-sm font-medium whitespace-nowrap">{label}</span>
    </motion.button>
  );
};

export default Home;
