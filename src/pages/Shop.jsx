// src/pages/Shop.jsx
import { useState, useEffect } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { productAPI } from '../utils/api'; // Import API untuk fetch detail
import { useLanguage } from '../context/LanguageContext';

import CategoryFilter from '../components/shop/CategoryFilter';
import ProductGrid from '../components/shop/ProductGrid';
import ProductDetailModal from '../components/shop/ProductDetailModal';
import ToastNotification from '../components/common/ToastNotification';

function Shop() {
  const { t } = useLanguage();
  const { products, categories, loading, error, activeCategory, setActiveCategory } = useProduct();
  const { wishlistIds, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart, isAdding } = useCart();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isLoadingProductDetail, setIsLoadingProductDetail] = useState(false);

  useEffect(() => {
    let timer;
    if (notification) {
      timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [notification]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  // Helper function untuk mendapatkan nama produk
  const getProductName = (product) => {
    return product?.name || product?.title || product?.productName || t('shop.page.defaultProductName');
  };

  // Handler konsisten untuk addToCart dari ProductGrid (quick add)
  const handleAddToCart = async (product, quantity = 1) => {
    try {
      await addToCart(product, quantity);
      const productName = getProductName(product);
      showNotification(`${productName} ${t('shop.page.addToCartSuccess')}`, 'success');
    } catch (error) {
      showNotification(error.message || t('shop.page.addToCartError'), 'error');
    }
  };

  // Handler konsisten untuk addToCart dari ProductDetailModal (detailed add)
  const handleDetailedAddToCart = async (payload) => {
    try {
      await addToCart(payload);
      // Notifikasi akan ditangani oleh ProductDetailModal
      return { success: true };
    } catch (error) {
      throw error; // Re-throw untuk ditangani oleh ProductDetailModal
    }
  };

  // Wrapper function untuk wishlist dengan notifikasi
  const handleAddToWishlist = async (product) => {
    try {
      await addToWishlist(product);
      const productName = getProductName(product);
      showNotification(`${productName} ${t('shop.page.wishlistAddSuccess')}`, 'success');
    } catch (error) {
      showNotification(error.message || t('shop.page.wishlistAddError'), 'error');
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
      showNotification(t('shop.page.wishlistRemoveSuccess'), 'success');
    } catch (error) {
      showNotification(error.message || t('shop.page.wishlistRemoveError'), 'error');
    }
  };

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => 
        product.categories && product.categories.some(cat => cat.slug === activeCategory)
      );

  // FIXED: Fetch product detail when opening modal
  const openProductDetail = async (product) => {
    try {
      setIsLoadingProductDetail(true);
      console.log('Opening product detail for:', product);
      
      // Fetch detailed product data with size_variants and images
      const response = await productAPI.getProduct(product.id);
      console.log('Fetched product detail:', response);
      
      const detailProduct = response.data || response;
      console.log('Setting selected product:', detailProduct);
      
      setSelectedProduct(detailProduct);
      
    } catch (error) {
      console.error('Error fetching product detail:', error);
      showNotification(t('shop.page.detailFetchError'), 'error');
      setSelectedProduct(null);
    } finally {
      setIsLoadingProductDetail(false);
    }
  };
  
  const closeProductDetail = () => { 
    setSelectedProduct(null); 
  };

  if (loading) {
    return <div className="text-center py-20 text-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">{t('shop.page.loading')} ⏳</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-xl bg-gray-50 dark:bg-gray-900 text-red-600 dark:text-red-400">{t('shop.page.errorPrefix')}: {error} 😥</div>;
  }

  return (
    <>
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('shop.page.title')} <span className="text-red-600 dark:text-red-400">{t('shop.page.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('shop.page.subtitle')}
            </p>
          </div>

          <CategoryFilter 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <ProductGrid 
            products={filteredProducts}
            onOpenDetail={openProductDetail}
            wishlistIds={wishlistIds}
            addToWishlist={handleAddToWishlist}
            removeFromWishlist={handleRemoveFromWishlist}
          />

          <div className="text-center mt-12">
            <button className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-8 py-4 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-red-600 dark:hover:border-red-600 dark:hover:text-white transition-colors duration-300 transform hover:scale-105 shadow-lg dark:shadow-black/30">
              {t('shop.page.viewAll')}
            </button>
          </div>
        </div>
      </section>

      {/* FIXED: Show loading state when fetching product detail */}
      {isLoadingProductDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 dark:border-red-400"></div>
            <span className="text-gray-700 dark:text-gray-200">{t('shop.page.loadingDetail')}</span>
          </div>
        </div>
      )}

      <ProductDetailModal 
        product={selectedProduct}
        onClose={closeProductDetail}
        addToCart={handleDetailedAddToCart} // Detailed add handler
        isAddingToCart={isAdding}
        showNotification={showNotification}
      />

      {notification && (
        <ToastNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
}

export default Shop;