// src/pages/About.jsx 
import { useState } from 'react';
import video from '../../src/assets/video/produk-cinematic.mp4'

function About() {
  const [activeTab, setActiveTab] = useState('story');

  const stats = [
    { number: '10+', label: 'Tahun Pengalaman' },
    { number: '50K+', label: 'Pelanggan Puas' },
    { number: '1000+', label: 'Produk Berkualitas' },
    { number: '25+', label: 'Brand Partner' }
  ];

  const team = [
    {
      name: 'Sarah Williams',
      position: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Visioner di balik La-Primera dengan passion untuk fashion berkelanjutan.'
    },
    {
      name: 'Michael Chen',
      position: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Mengawasi semua aspek kreatif dan tren fashion terkini.'
    },
    {
      name: 'Anna Rodriguez',
      position: 'Head of Quality',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Memastikan setiap produk memenuhi standar kualitas tertinggi.'
    }
  ];

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Kualitas Premium',
      description: 'Setiap produk dipilih dengan teliti untuk memastikan kualitas terbaik dan kepuasan pelanggan.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Customer First',
      description: 'Kepuasan pelanggan adalah prioritas utama kami dalam setiap layanan dan produk.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Inovasi Berkelanjutan',
      description: 'Selalu menghadirkan tren terbaru dan inovasi dalam dunia fashion modern.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      ),
      title: 'Ramah Lingkungan',
      description: 'Berkomitmen pada praktik bisnis yang berkelanjutan dan ramah lingkungan.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Video */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Video */}
        <video
          src={video}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Tentang La-Primera
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-8 drop-shadow-lg">
              Lebih dari sekadar fashion, La-Primera adalah tentang mengekspresikan 
              kepribadian unik Anda dengan gaya yang berkelas dan berkualitas premium.
            </p>
            <p className="text-lg md:text-xl max-w-4xl mx-auto leading-relaxed opacity-90">
              Dari proses pemilihan bahan berkualitas hingga detail finishing yang sempurna, 
              setiap produk La-Primera dibuat dengan standar kualitas tertinggi untuk 
              memberikan pengalaman fashion terbaik bagi Anda.
            </p>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content with Tabs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg shadow-md p-2 flex space-x-2">
              <button
                onClick={() => setActiveTab('story')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  activeTab === 'story'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                Cerita Kami
              </button>
              <button
                onClick={() => setActiveTab('mission')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  activeTab === 'mission'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                Misi & Visi
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  activeTab === 'team'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                Tim Kami
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {activeTab === 'story' && (
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Perjalanan La-Primera
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Dimulai pada tahun 2015, La-Primera lahir dari visi untuk menghadirkan 
                    fashion berkualitas tinggi yang terjangkau untuk semua kalangan. Kami 
                    percaya bahwa setiap orang berhak tampil percaya diri dengan gaya yang 
                    mencerminkan kepribadian mereka.
                  </p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Dari toko kecil di pusat kota hingga platform e-commerce yang melayani 
                    ribuan pelanggan, perjalanan kami didorong oleh komitmen untuk memberikan 
                    pengalaman berbelanja yang luar biasa dan produk berkualitas premium.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Hari ini, La-Primera dikenal sebagai destinasi fashion yang mengutamakan 
                    kualitas, style, dan kepuasan pelanggan. Kami terus berinovasi untuk 
                    menghadirkan koleksi terbaru yang sesuai dengan perkembangan zaman.
                  </p>
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="La-Primera Store"
                    className="rounded-xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent rounded-xl"></div>
                </div>
              </div>
            )}

            {activeTab === 'mission' && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Misi & Visi Kami</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Komitmen kami untuk memberikan yang terbaik bagi pelanggan dan industri fashion
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mb-16">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl">
                    <h3 className="text-2xl font-bold text-red-800 mb-4">Visi Kami</h3>
                    <p className="text-red-700 leading-relaxed">
                      Menjadi brand fashion terdepan yang menginspirasi setiap individu untuk 
                      mengekspresikan kepribadian unik mereka melalui style yang berkelas, 
                      dengan tetap mengutamakan kualitas dan kepuasan pelanggan.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Misi Kami</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Menyediakan produk fashion berkualitas premium dengan harga terjangkau, 
                      memberikan pengalaman berbelanja yang luar biasa, dan membangun komunitas 
                      fashion yang positif dan inklusif.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {values.map((value, index) => (
                    <div key={index} className="text-center group">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                        {value.icon}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {value.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {value.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Tim La-Primera</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Bertemu dengan orang-orang hebat di balik kesuksesan La-Primera
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  {team.map((member, index) => (
                    <div key={index} className="text-center group">
                      <div className="relative mb-6 overflow-hidden rounded-xl">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {member.name}
                      </h3>
                      <p className="text-red-600 font-medium mb-3">
                        {member.position}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {member.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-8 text-center">
                  <h3 className="text-2xl font-bold text-red-800 mb-4">
                    Bergabung dengan Tim Kami
                  </h3>
                  <p className="text-red-700 mb-6 max-w-2xl mx-auto">
                    Kami selalu mencari talenta-talenta terbaik untuk bergabung dengan keluarga 
                    La-Primera. Jika Anda passionate tentang fashion dan customer service, 
                    kami ingin mendengar dari Anda!
                  </p>
                  <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25">
                    Lihat Lowongan Kerja
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Bergabung dengan La-Primera?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Mulai perjalanan fashion Anda bersama kami dan temukan style yang sempurna 
            untuk mengekspresikan kepribadian unik Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl">
              Mulai Berbelanja
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
              Hubungi Kami
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;