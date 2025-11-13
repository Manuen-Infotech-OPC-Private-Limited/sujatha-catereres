import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from "@vercel/analytics/react"
import Landing from './pages/Landing';
import MenuPage from './pages/MenuPage';
import Services from './pages/Services';
import About from './pages/AboutUs';
import ContactUs from './pages/ContacUs';
import LoginPage from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import Profile from './pages/Profile';
import OrderPage from './pages/OrderPage';
import { CartProvider } from './utils/cartContext';
import ReviewOrder from './pages/ReviewOrder';
import InvoicePage from "./pages/InvoicePage";

function App() {
  return (

    <CartProvider>
      <Router>
        <Analytics />
        <div className="App">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/review-order" element={<ReviewOrder />} />
            <Route path="/invoice/:orderId" element={<InvoicePage />} />

          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
