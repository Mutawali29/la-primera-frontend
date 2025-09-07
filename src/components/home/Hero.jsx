import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import banner1 from '../../assets/img/banner/banner-1.jpg';
import banner2 from '../../assets/img/banner/banner-2.jpg';

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate(); // Inisialisasi useNavigate

  const slides = [
    {
      id: 1,
      title: "Selamat Datang di La-Primera",
      subtitle: "Your Premier Shopping Destination",
      description: "La-Primera menghadirkan pengalaman berbelanja online terdepan dengan koleksi lengkap dari brand-brand terpercaya. Belanja mudah, aman, dan terpercaya hanya di La-Primera.",
      buttonText: "Shop Now",
      image: banner1,
      bgColor: "from-red-600 to-red-800",
      linkTo: "/shop" // Tambahkan properti linkTo
    },
    {
      id: 2,
      title: "La-Primera Experience",
      subtitle: "Kualitas Terbaik, Kepercayaan Utama",
      description: "Bergabunglah dengan ribuan customer yang telah mempercayai La-Primera. Nikmati kemudahan berbelanja dengan layanan pelanggan 24/7 dan jaminan produk original.",
      buttonText: "Shop Now",
      image: banner2,
      bgColor: "from-red-600 to-red-800",
      linkTo: "/shop" // Tambahkan properti linkTo
    },
    {
      id: 3,
      title: "Koleksi Terbaru 2025",
      subtitle: "Fashion Terdepan untuk Gaya Hidup Modern",
      description: "Temukan koleksi fashion terbaru yang memadukan style contemporary dengan kenyamanan premium. Ekspresikan kepribadian unik Anda dengan pilihan outfit yang tak terbatas.",
      buttonText: "Shop Now",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      bgColor: "from-red-600 to-red-800",
      linkTo: "/shop" // Tambahkan properti linkTo
    },
    {
      id: 4,
      title: "Special Promo",
      subtitle: "Diskon Hingga 50% untuk Member Baru",
      description: "Dapatkan penawaran eksklusif untuk member baru! Belanja sekarang dan nikmati diskon fantastis untuk semua kategori produk pilihan.",
      buttonText: "Claim Promo",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      bgColor: "from-gray-800 to-gray-900",
      linkTo: "/shop" // Tambahkan properti linkTo (bisa juga ke halaman promo khusus jika ada)
    },
    {
      id: 5,
      title: "Premium Quality",
      subtitle: "Kualitas Terbaik, Harga Terjangkau",
      description: "Produk berkualitas premium dengan standar internasional. Setiap item telah melewati quality control ketat untuk memastikan kepuasan pelanggan.",
      buttonText: "Explore",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      bgColor: "from-blue-600 to-blue-800",
      linkTo: "/shop" // Tambahkan properti linkTo
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Handler untuk tombol di slide
  const handleButtonClick = (linkTo) => {
    if (linkTo) {
      navigate(linkTo); // Menggunakan useNavigate untuk navigasi
    }
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 
              index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} opacity-75`}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center text-white">
                  <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl md:text-2xl font-medium mb-6 animate-fade-in-delay-1">
                    {slide.subtitle}
                  </h2>
                  <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto animate-fade-in-delay-2 leading-relaxed">
                    {slide.description}
                  </p>
                  {/* Modifikasi tombol agar bisa dinavigasi */}
                  <button 
                    onClick={() => handleButtonClick(slide.linkTo)} // Panggil handler
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-delay-3 shadow-2xl hover:shadow-red-500/25"
                  >
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 z-20 group"
      >
        <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 z-20 group"
      >
        <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 right-8 text-white animate-bounce z-20">
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2">Scroll</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Inline Style for Animations (if not in a global CSS file) */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-delay-1 {
          animation: fade-in 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }
        
        .animate-fade-in-delay-3 {
          animation: fade-in 0.8s ease-out 0.6s both;
        }
      `}</style>
    </section>
  );
}

export default Hero;