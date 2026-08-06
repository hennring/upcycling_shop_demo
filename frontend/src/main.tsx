import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './features/auth/AuthContext'
import { CartProvider } from './features/cart/CartContext'
import { CategoriesProvider } from './features/shop/CategoriesContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* inside AuthProvider: the cart is loaded per user and dropped on logout */}
        <CartProvider>
          <CategoriesProvider>
            <App />
          </CategoriesProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
