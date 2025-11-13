import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logos/logo-nobg.png';
import './Header.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user info from the server on mount or route change
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
          withCredentials: true,
        });
        setUser(response.data.user); // or just response.data, depending on your API structure
      } catch (error) {
        setUser(null); // Not logged in
      }
    };

    fetchUser();
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/logout`, {}, { withCredentials: true });
      toast.success('Logged out successfully');
      setUser(null);
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
        <button className={isActive('/') ? 'active' : ''} onClick={() => handleNavigate('/')}>Home</button>
        <button className={isActive('/services') ? 'active' : ''} onClick={() => handleNavigate('/services')}>Services</button>
        <button className={isActive('/about') ? 'active' : ''} onClick={() => handleNavigate('/about')}>About Us</button>
        <button className={isActive('/contact') ? 'active' : ''} onClick={() => handleNavigate('/contact')}>Contact Us</button>

        {user ? (
          <>
            <button className={isActive('/profile') ? 'active' : ''} onClick={() => handleNavigate('/profile')}>Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button className={isActive('/login') ? 'active' : ''} onClick={() => handleNavigate('/login')}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Header;
