import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logos/logo-nobg.png';
import '../css/Header.css';
import { toast } from 'react-toastify';
import { useAuthContext } from '../utils/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuthContext();

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      window.location.href = '/';
    } catch {
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
        <button
          className={isActive('/services')}
          onClick={() => handleNavigate('/services')}
        >
          Services
        </button>
        <button
          className={isActive('/about')}
          onClick={() => handleNavigate('/about')}
        >
          About Us
        </button>
        <button
          className={isActive('/contact')}
          onClick={() => handleNavigate('/contact')}
        >
          Contact Us
        </button>

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
      </div>
    </nav>
  );
};

export default Header;
