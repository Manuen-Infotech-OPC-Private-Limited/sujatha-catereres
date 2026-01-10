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
import { SocketProvider } from './utils/SocketContext';
import { MenuProvider } from './utils/MenuContext';
import { AuthProvider } from './utils/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';
import MealBox from './pages/MealBox';


function App() {
  return (

    <AuthProvider>
      <CartProvider>
        <MenuProvider>

          <SocketProvider>
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
                    path="/catering/order"
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
                  <Route
                    path="/mealbox"
                    element={
                      <ProtectedRoute>
                        <MealBox />
                      </ProtectedRoute>
                    }
                  />

                </Routes>

                <ToastContainer position="top-right" autoClose={2000} />
              </div>
            </Router>
          </SocketProvider>
        </MenuProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
