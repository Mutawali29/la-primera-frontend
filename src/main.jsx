import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProductProvider } from './hooks/useProduct';
import { WishlistProvider } from './hooks/useWishlist';
import { OrdersProvider } from './hooks/useOrders';
import { CartProvider } from './hooks/useCart';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import App from './App.jsx';
import './index.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <ProductProvider>
              <WishlistProvider>
                <OrdersProvider>
                  <CartProvider>
                    <App />
                  </CartProvider>
                </OrdersProvider>
              </WishlistProvider>
            </ProductProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);