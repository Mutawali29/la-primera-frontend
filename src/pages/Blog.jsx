import { useState } from 'react';
import BlogCard from '../components/blog/BlogCard';
import BlogList from '../components/blog/BlogList';

function Blog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const categories = [
    { id: 'all', name: 'Semua Artikel' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'trends', name: 'Trend Terbaru' },
    { id: 'tips', name: 'Tips & Tricks' },
    { id: 'lifestyle', name: 'Lifestyle' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: '10 Trend Fashion 2025 yang Wajib Kamu Ketahui',
      category: 'fashion',
      excerpt: 'Temukan trend fashion terbaru yang akan mendominasi tahun 2025. Dari warna-warna bold hingga siluet yang unik, pastikan style kamu selalu up to date.',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      author: 'Sarah Johnson',
      date: '28 Juni 2025',
      readTime: '5 min read',
      tags: ['Fashion', 'Trend', '2025'],
      isFeatured: true
    },
    {
      id: 2,
      title: 'Cara Mix and Match Outfit untuk Tampilan Profesional',
      category: 'tips',
      excerpt: 'Pelajari seni menggabungkan berbagai pieces dalam lemari pakaian untuk menciptakan look profesional yang tetap stylish dan nyaman.',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      author: 'Michael Chen',
      date: '26 Juni 2025',
      readTime: '7 min read',
      tags: ['Tips', 'Professional', 'Mix Match']
    },
    {
      id: 3,
      title: 'Sustainable Fashion: Investasi untuk Masa Depan',
      category: 'lifestyle',
      excerpt: 'Mengapa memilih fashion berkelanjutan bukan hanya baik untuk lingkungan, tetapi juga untuk gaya hidup dan keuangan jangka panjang.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      author: 'Emma Wilson',
      date: '24 Juni 2025',
      readTime: '6 min read',
      tags: ['Sustainable', 'Environment', 'Investment']
    },
    {
      id: 4,
      title: 'Aksesori yang Bisa Mengubah Total Look Kamu',
      category: 'fashion',
      excerpt: 'Discover how the right accessories can completely transform your outfit from basic to extraordinary with these simple styling tricks.',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      author: 'David Rodriguez',
      date: '22 Juni 2025',
      readTime: '4 min read',
      tags: ['Accessories', 'Styling', 'Transform']
    },
    {
      id: 5,
      title: 'Color Psychology dalam Fashion: Warna yang Tepat untuk Mood',
      category: 'trends',
      excerpt: 'Bagaimana warna pakaian dapat mempengaruhi mood dan persepsi orang lain terhadap kita. Panduan lengkap memilih warna yang tepat.',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      author: 'Jessica Lee',
      date: '20 Juni 2025',
      readTime: '8 min read',
      tags: ['Psychology', 'Color', 'Mood']
    },
    {
      id: 6,
      title: 'Essential Wardrobe: 20 Item yang Harus Ada di Lemari',
      category: 'tips',
      excerpt: 'Daftar lengkap essential items yang harus dimiliki setiap orang untuk membangun wardrobe yang versatile dan timeless.',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      author: 'Alex Thompson',
      date: '18 Juni 2025',
      readTime: '10 min read',
      tags: ['Essential', 'Wardrobe', 'Basics']
    },
    {
      id: 7,
      title: 'Street Style Inspiration dari Fashion Week Terbaru',
      category: 'trends',
      excerpt: 'Inspirasi street style terbaik dari berbagai fashion week dunia yang bisa kamu adaptasi untuk gaya sehari-hari.',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      author: 'Sophie Martin',
      date: '16 Juni 2025',
      readTime: '6 min read',
      tags: ['Street Style', 'Fashion Week', 'Inspiration']
    },
    {
      id: 8,
      title: 'Merawat Pakaian Agar Awet dan Tetap Terlihat Baru',
      category: 'tips',
      excerpt: 'Tips praktis merawat berbagai jenis kain dan pakaian agar investasi fashion kamu bisa bertahan lama dan selalu terlihat prima.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      author: 'Rachel Green',
      date: '14 Juni 2025',
      readTime: '5 min read',
      tags: ['Care', 'Maintenance', 'Tips']
    },
    {
      id: 9,
      title: 'Capsule Wardrobe: Minimalis tapi Maksimal',
      category: 'lifestyle',
      excerpt: 'Konsep capsule wardrobe untuk hidup yang lebih simple namun tetap stylish. Panduan membangun wardrobe minimalis yang efektif.',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      author: 'James Wilson',
      date: '12 Juni 2025',
      readTime: '7 min read',
      tags: ['Capsule', 'Minimalist', 'Efficient']
    }
  ];

  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const featuredPost = blogPosts.find(post => post.isFeatured);
  const regularPosts = filteredPosts.filter(post => !post.isFeatured);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = regularPosts.slice(indexOfFirstPost, indexOfFirstPost + postsPerPage);
  const totalPages = Math.ceil(regularPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Fashion <span className="text-red-200">Blog</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Temukan inspirasi fashion terbaru, tips styling, dan insight dari dunia mode untuk mengekspresikan kepribadian unik Anda
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Article */}
        {featuredPost && activeCategory === 'all' && (
          <section className="mb-16">
            <BlogCard post={featuredPost} isFeatured={true} />
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === category.id
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Blog List with Pagination */}
        <BlogList 
          posts={currentPosts}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Newsletter Subscription */}
        <section className="mt-20 bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-8 md:p-12 text-center text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Jangan Lewatkan Update Terbaru!
          </h3>
          <p className="text-xl mb-8 text-red-100">
            Subscribe newsletter kami untuk mendapatkan artikel fashion terbaru dan tips styling eksklusif
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-300"
            />
            <button className="bg-white text-red-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors duration-300 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Blog;