import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { FaUtensils, FaMapMarkerAlt, FaPhoneAlt, FaClock, FaEnvelope, FaWifi, FaParking, FaUmbrellaBeach, FaCalendarCheck, FaShoppingBag } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getGallery } from '../firebase/config';

interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  isActive: boolean;
}

const LocationPage = () => {
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const lokasi = {
    name: "Kedai Sri Rejeki 888",
    position: { lat: -7.459039, lng: 112.708293 }, 
    address: "Jl. Kutuk Barat No.110, Cangkring, Sidokare, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61214",
    phone: "0812-2864-4062",
    hours: "Buka · Tutup pukul 02:00",
    price: "Rp 1-25.000 per orang",
    visitors: "Dilaporkan oleh 16 orang",
    instagram: "instagram.com",
    location: "GPR5+7W Sidokare, Kabupaten Sidoarjo, Jawa Timur",
    features: ["Makan di tempat", "Drive-through", "Antar tanpa bertemu"]
  };

  // Ulasan Google Maps
  const reviews = [
    {
      name: "Andi Pratama",
      stars: 5,
      text: "Makanan sangat enak, pelayanan ramah, dan tempatnya nyaman. Harga juga terjangkau untuk kualitas yang ditawarkan.",
      date: "2 bulan yang lalu",
      avatar: "/images/logo.png"
    },
    {
      name: "Siti Nurhaliza",
      stars: 4,
      text: "Menu yang beragam dan citarasa yang autentik. Lokasi strategis dan mudah ditemukan.",
      date: "3 bulan yang lalu",
      avatar: "/images/logo.png"
    },
    {
      name: "Budi Santoso",
      stars: 5,
      text: "Tempat favorit untuk makan bersama keluarga. Suasananya sangat nyaman dan makanannya selalu konsisten enak.",
      date: "1 bulan yang lalu",
      avatar: "/images/logo.png"
    }
  ];

  // Fetch data galeri dari JSONBin
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        console.log('Memuat data galeri untuk halaman lokasi...');
        // Ambil data galeri dari JSONBin
        const photos = await getGallery();
        console.log('Data galeri diterima:', photos);
        
        // Filter hanya foto yang aktif
        const activePhotos = photos.filter(photo => photo.isActive === true);
        console.log(`Total foto: ${photos.length}, Foto aktif: ${activePhotos.length}`);
        
        if (activePhotos.length > 0) {
          setGalleryPhotos(activePhotos);
          console.log('Foto aktif berhasil diset ke state');
        } else {
          console.log('Tidak ada foto aktif yang ditemukan');
          setGalleryPhotos([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading gallery data:', error);
        setLoading(false);
        setGalleryPhotos([]);
      }
    };

    fetchGallery();

    // Check scroll position untuk navbar
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <Head>
        <title>Lokasi Kedai Sri Rejeki 888</title>
        <meta name="description" content="Informasi lokasi Kedai Sri Rejeki 888" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>

      {/* Header */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm' : 'bg-white border-b border-gray-200'}`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex justify-between items-center py-2 px-2 sm:px-4">
          <div className="flex items-center">
            <Link href="/" passHref>
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
                <Link href="/" passHref>
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
                <Link href="/location" passHref>
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

      <main className="container mx-auto px-4 py-6 pt-24">
        <div className="mx-auto max-w-5xl">
          <motion.h1 
            className="text-3xl font-bold mb-6 text-center text-[var(--primary-color)] menu-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Lokasi Kami
          </motion.h1>
          
          <motion.div 
            className="glass-effect rounded-lg shadow-md overflow-hidden mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="aspect-video w-full relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1287.8730171087861!2d112.70829277854196!3d-7.459039471198427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e1af083c3977%3A0xe59f06831f0afbe6!2sKedai%20Sri%20Rejeki%20888!5e1!3m2!1sid!2sid!4v1745596230711!5m2!1sid!2sid" 
                className="w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:space-x-8">
                <div className="flex-1 mb-6 md:mb-0">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">{lokasi.name}</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="text-[var(--primary-color)] mt-1 mr-3 flex-shrink-0 h-5 w-5" />
                      <p className="text-gray-700">{lokasi.address}</p>
                    </div>
                    
                    <div className="flex items-start">
                      <FaClock className="text-[var(--primary-color)] mt-1 mr-3 flex-shrink-0 h-5 w-5" />
                      <p className="text-gray-700">{lokasi.hours}</p>
                    </div>
                    
                    <div className="flex items-start">
                      <FaPhoneAlt className="text-[var(--primary-color)] mt-1 mr-3 flex-shrink-0 h-5 w-5" />
                      <p className="text-gray-700">{lokasi.phone}</p>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="text-[var(--primary-color)] mt-1 mr-3 flex-shrink-0 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                      </svg>
                      <a href={`https://${lokasi.instagram}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[var(--primary-color)]">{lokasi.instagram}</a>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="text-[var(--primary-color)] mt-1 mr-3 flex-shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-gray-700">{lokasi.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Fasilitas</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {lokasi.features.map((feature, idx) => {
                      let icon = null;
                      if (feature === "Makan di tempat") icon = <FaUtensils className="mr-1" />;
                      else if (feature === "Drive-through") icon = <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
                      else if (feature === "Antar tanpa bertemu") icon = <FaShoppingBag className="mr-1" />;
                      
                      return (
                        <span key={idx} className="bg-[#e6f5f3] text-[var(--primary-color)] text-sm px-3 py-1 rounded-full flex items-center">
                          {icon}
                          {feature}
                        </span>
                      );
                    })}
                  </div>
                  
                  <motion.a 
                    href={`https://maps.app.goo.gl/AJYiFn1BSqgh2K2FA`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full py-3 px-4 bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-white font-medium rounded-lg text-center transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Buka di Google Maps
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Galeri Foto */}
          <motion.div 
            className="glass-effect rounded-lg shadow-md p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Galeri Foto</h2>
            
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary-color)]"></div>
              </div>
            ) : galleryPhotos.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                Belum ada foto dalam galeri.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryPhotos.map((photo, index) => (
                  <motion.div 
                    key={photo.id} 
                    className="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition duration-300 transform hover:scale-[1.02] card-hover-effect"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="aspect-square bg-gray-100 relative">
                      <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url('${photo.src}')`
                        }}
                      />
                    </div>
                    <div className="p-3 bg-white">
                      <p className="text-sm text-gray-700 truncate">{photo.alt}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Ulasan Pengunjung */}
          <motion.div 
            className="glass-effect rounded-lg shadow-md p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Ulasan Pengunjung</h2>
            
            <div className="space-y-5">
              {reviews.map((review, index) => (
                <motion.div 
                  key={index} 
                  className="border-b border-gray-100 pb-5 last:border-b-0 hover:bg-gray-50 rounded-lg p-4 transition duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
                >
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 mr-4 overflow-hidden shadow-sm">
                      <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url('https://ui-avatars.com/api/?name=${review.name.charAt(0)}&background=00897b&color=ffffff&size=128')`
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{review.name}</h3>
                      <div className="flex items-center mt-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg 
                            key={i} 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-4 w-4 ${i < review.stars ? 'text-[var(--primary-color)]' : 'text-gray-300'}`} 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-gray-500 text-xs ml-2">{review.date}</span>
                      </div>
                      <p className="text-gray-700">{review.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <motion.a 
                href={`https://maps.app.goo.gl/Ze48rQhrg9KAbnfX6`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2 bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-white rounded-lg transition-colors text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Lihat Lebih Banyak Ulasan
              </motion.a>
            </div>
          </motion.div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-[var(--primary-color)] text-white py-8">
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
      </footer>
    </div>
  );
};

export default LocationPage; 