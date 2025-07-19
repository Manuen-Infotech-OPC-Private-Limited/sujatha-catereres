import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import loginBg from '../assets/logos/loginbg.png';
import logonoBg from '../assets/logos/logo-nobg.png';

const popularDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];

const isStrongPassword = (password) => {
  // At least 1 lowercase, 1 uppercase, 1 digit, 1 special char, min length 8
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
};

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[\W_]/.test(password)) score++;

  if (score <= 2) return 'Weak';
  if (score === 3 || score === 4) return 'Medium';
  if (score === 5) return 'Strong';
};

const isValidEmailDomain = (email) => {
  const domain = email.split('@')[1]?.toLowerCase();
  return popularDomains.includes(domain);
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

//   const API = process.env.REACT_APP_API_URL;
  const API = process.env.api_url;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (e.target.id === 'password') {
      setPasswordStrength(getPasswordStrength(e.target.value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agree) {
      setError('You must agree to the Terms and Conditions.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!isStrongPassword(formData.password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, digit, and special character.');
      return;
    }

    if (!isValidEmailDomain(formData.email)) {
      setError('Please use an email from a popular domain (gmail.com, yahoo.com, outlook.com, hotmail.com).');
      return;
    }

    try {
      const res = await axios.post(`${API}/api/users/register`, formData);
      console.log(`Result status and code of post request is: ${res.statusText}, ${res.status}`);
      toast.success('Registration successful!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${loginBg})` }}>
      <button className="go-back-button" onClick={() => navigate('/')}>← Go Back</button>
      <div className="login-box">
        <img src={logonoBg} alt="Logo" className="login-logo" />
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {formData.password && (
            <p style={{ fontWeight: 'bold', color: 
              passwordStrength === 'Strong' ? 'green' :
              passwordStrength === 'Medium' ? 'orange' : 'red' 
            }}>
              Password strength: {passwordStrength}
            </p>
          )}

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <div style={{ textAlign: 'left', marginTop: '10px' }}>
            <input
              type="checkbox"
              id="terms"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <label htmlFor="terms" style={{ marginLeft: '8px', fontSize: '14px' }}>
              I agree to the <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
            </label>
          </div>

          {error && <div style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>{error}</div>}

          <button type="submit">Register</button>
        </form>
        <p className="register-text">
          Already registered? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
