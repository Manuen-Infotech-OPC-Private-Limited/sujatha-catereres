import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import loginBg from '../assets/logos/loginbg.png';
import logonoBg from '../assets/logos/logo-nobg.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  // const API = import.meta.env.VITE_API_URL;

// const API = process.env.api_url;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/users/login`, formData);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success(`Welcome back, ${res.data.user.name}!`, {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: true,
      });

      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      toast.error('Invalid credentials. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${loginBg})` }}>
      <button className="go-back-button" onClick={() => navigate('/')}>← Go Back</button>

      <div className="login-box">
        <img src={logonoBg} alt="Logo" className="login-logo" />
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <button type="submit">Proceed to login</button>
        </form>
        <p className="register-text">
          Don’t have an account? <a href="/register">Register Here...</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
