import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Landing from './pages/Landing';
import MenuPage from './pages/MenuPage';
import Services from './pages/Services';
import About from './pages/AboutUs';
import ContactUs from './pages/ContacUs';
import LoginPage from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import Profile from './pages/Profile';
import OrderPage from './pages/OrderPage';
import ReviewOrder from './pages/ReviewOrder';
import InvoicePage from "./pages/InvoicePage";

import { CartProvider } from './utils/cartContext';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/order"
              element={
                <ProtectedRoute>
                  <OrderPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/review-order"
              element={
                <ProtectedRoute>
                  <ReviewOrder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/invoice/:orderId"
              element={
                <ProtectedRoute>
                  <InvoicePage />
                </ProtectedRoute>
              }
            />
          </Routes>

          <ToastContainer position="top-right" autoClose={2000} />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
