// components/shop/ProductCard.jsx
import { useState } from 'react';
import { Heart, Eye, ArrowRight } from 'lucide-react';
import { formatPrice } from '../../components/shop/utils/Formatters';
import RatingStars from './RatingStars';
import { useLanguage } from '../../context/LanguageContext';

// Base URL API, diambil dari environment variable Vite.
// Fallback ke localhost untuk development kalau env var belum di-set.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // Backend sudah mengembalikan URL lengkap (dari Supabase Storage) untuk
    // sebagian data, jadi jangan digabung lagi dengan API_BASE_URL.
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    return `${API_BASE_URL}${imagePath}`;
};

const ProductCard = ({ product, onOpenDetail, wishlistIds, addToWishlist, removeFromWishlist }) => {
  const { t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);

  const isInWishlist = wishlistIds && wishlistIds.has(product.id);

  // Ambil gambar primary (is_primary: true), fallback ke gambar pertama kalau tidak ada yang primary
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const imageSrc = getImageUrl(primaryImage?.image_path)
    || 'https://via.placeholder.com/400x400.png/f3f4f6/9ca3af?text=Image';

  const hasDiscount = product.compare_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleDetailClick = () => {
    onOpenDetail(product);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-black/30 ring-1 ring-gray-900/5 dark:ring-white/10 overflow-hidden hover:shadow-xl dark:hover:shadow-black/50 transition-all duration-300 transform hover:-translate-y-1.5 group">
      <div className="relative overflow-hidden aspect-square bg-gray-100 dark:bg-gray-700">
        {/* Skeleton shimmer selagi gambar dimuat */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 transition-opacity duration-300 ${
            imageLoaded ? 'opacity-0' : 'opacity-100 animate-pulse'
          }`}
        />
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-110 transition-[transform,opacity] duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Badge kiri atas: bestseller + diskon */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_featured && (
            <span className="bg-red-600 text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm">
              {t('shop.productCard.bestseller')}
            </span>
          )}
          {hasDiscount && (
            <span className="bg-gray-900/85 dark:bg-white/90 text-white dark:text-gray-900 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
              -{discountPercent}% {t('shop.productCard.off')}
            </span>
          )}
        </div>

        {/* Wishlist — selalu terlihat (kanan atas), bukan cuma saat hover, biar mudah dipakai di mobile */}
        <button
          onClick={handleWishlistClick}
          aria-label={isInWishlist ? t('shop.productCard.removeFromWishlist') : t('shop.productCard.addToWishlist')}
          aria-pressed={isInWishlist}
          className="absolute top-3 right-3 z-10 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm text-red-600 dark:text-red-400 p-2 rounded-full shadow-sm hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-colors duration-200 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          <Heart className="w-4 h-4" fill={isInWishlist ? 'currentColor' : 'none'} strokeWidth={2} />
        </button>

        {/* Quick view — overlay saat hover (desktop), aksi sekunder */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <button
            onClick={() => onOpenDetail(product)}
            aria-label={t('shop.productCard.quickView')}
            className="translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5 bg-white text-gray-900 px-4 py-2 rounded-full text-xs font-semibold shadow-lg hover:bg-red-600 hover:text-white outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Eye className="w-4 h-4" strokeWidth={2} />
            {t('shop.productCard.quickView')}
          </button>
        </div>
      </div>

      <div className="p-5">
        <h3
          title={product.name}
          className="text-base font-semibold text-gray-900 dark:text-white mb-1.5 line-clamp-2 min-h-[2.75rem] group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          <RatingStars rating={product.rating_average || 0} />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {product.rating_average || 0} ({product.rating_count || 0} {t('shop.productCard.reviews')})
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-red-600 dark:text-red-400 tabular-nums">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 dark:text-gray-500 line-through tabular-nums">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>

        <button
          onClick={handleDetailClick}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm hover:bg-red-700 active:bg-red-800 transition-all duration-200 shadow-md shadow-red-600/20 hover:shadow-lg hover:shadow-red-600/30 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          {t('shop.productCard.viewDetail')}
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;