import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import BookingModal from './components/BookingModal';

import ExplorePage from './pages/ExplorePage';
import ItineraryPage from './pages/ItineraryPage';
import GuidesPage from './pages/GuidesPage';
import MarketplacePage from './pages/MarketplacePage';
import AdminPage from './pages/AdminPage';
import TouristDashboard from './pages/TouristDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('explore');
  const [lang, setLang] = useState('EN');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [bookingModal, setBookingModal] = useState({ isOpen: false, item: null, type: 'destination' });

  const handleUserLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    if (userData && (userData.role === 'Admin' || userData.role === 'admin')) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('isAdminLoggedIn', 'true');
    }
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userToken');
    localStorage.removeItem('isAdminLoggedIn');
    setIsAdminLoggedIn(false);
    setActiveTab('explore');
  };

  const handleAdminLogout = () => {
    handleUserLogout();
  };

  const handleAdminLoginSuccess = () => {
    const adminUser = { name: 'System Admin', email: 'admin@kanyakumari.com', role: 'Admin' };
    handleUserLoginSuccess(adminUser);
  };

  // Cart operations
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const openBookingModal = (item, type) => {
    setBookingModal({ isOpen: true, item, type });
  };

  const closeBookingModal = () => {
    setBookingModal({ isOpen: false, item: null, type: 'destination' });
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // If Admin is logged in, show the complete dedicated Admin Dashboard Application
  if (isAdminLoggedIn) {
    return (
      <AdminPage onLogout={handleAdminLogout} />
    );
  }

  // If a Tourist / User is logged in, show the Tourist Dashboard Application matching screenshots 1–5
  if (currentUser) {
    return (
      <>
        <TouristDashboard 
          user={currentUser} 
          onLogout={handleUserLogout} 
          onBookItem={openBookingModal} 
          onUpdateUser={handleUserLoginSuccess}
        />

        <BookingModal 
          isOpen={bookingModal.isOpen}
          onClose={closeBookingModal}
          item={bookingModal.item}
          type={bookingModal.type}
        />
      </>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        cartCount={cartCount}
        openCart={() => setIsCartOpen(true)}
        openAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onUserLogout={handleUserLogout}
      />

      {/* Main Content Render */}
      <main style={{ flex: 1 }}>
        {activeTab === 'explore' && (
          <ExplorePage 
            onBookItem={openBookingModal} 
            setActiveTab={setActiveTab}
            lang={lang}
          />
        )}

        {activeTab === 'itinerary' && (
          <ItineraryPage 
            onBookItem={openBookingModal}
          />
        )}

        {activeTab === 'guides' && (
          <GuidesPage 
            onBookItem={openBookingModal}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplacePage 
            addToCart={addToCart}
            openCart={() => setIsCartOpen(true)}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Modals & Drawers */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        onCheckout={() => {
          alert('Redirecting to Payment Gateway (Razorpay/Govt UPI Portal)...');
          setCart([]);
          setIsCartOpen(false);
        }}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAdminLoginSuccess={handleAdminLoginSuccess}
        onUserLoginSuccess={handleUserLoginSuccess}
      />

      <BookingModal 
        isOpen={bookingModal.isOpen}
        onClose={closeBookingModal}
        item={bookingModal.item}
        type={bookingModal.type}
      />

    </div>
  );
}
