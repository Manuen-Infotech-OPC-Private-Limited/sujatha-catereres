import React, { useState, } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logos/logo-nobg.png';
import './Header.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, loading } = useAuth(); // ⬅ using the shared hook

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/logout`,
        {},
        { withCredentials: true }
      );
      toast.success('Logged out successfully');
      window.location.href = '/';
    } catch (err) {
      console.log(`error while logout is: ${err}`);
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="header-nav">
      <img
        src={logo}
        alt="Logo"
        className="header-logo"
        onClick={() => handleNavigate('/')}
        style={{ cursor: 'pointer' }}
      />

      <div
        className={`hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div className={`nav-links ${menuOpen ? 'show' : ''}`}>
        <button className={isActive('/')} onClick={() => handleNavigate('/')}>
          Home
        </button>
        <button className={isActive('/services')} onClick={() => handleNavigate('/services')}>
          Services
        </button>
        <button className={isActive('/about')} onClick={() => handleNavigate('/about')}>
          About Us
        </button>
        <button className={isActive('/contact')} onClick={() => handleNavigate('/contact')}>
          Contact Us
        </button>

        {/* Wait for auth to finish loading before showing buttons */}
        {!loading && (
          <>
            {user ? (
              <>
                <button
                  className={isActive('/profile')}
                  onClick={() => handleNavigate('/profile')}
                >
                  Profile
                </button>

                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <button
                className={isActive('/login')}
                onClick={() => handleNavigate('/login')}
              >
                Login
              </button>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
