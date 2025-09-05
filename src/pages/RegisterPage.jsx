import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import loginBg from '../assets/logos/loginbg.png';
import logonoBg from '../assets/logos/logo-nobg.png';
import './Login.css';

const RegisterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const API = process.env.REACT_APP_API_URL;

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (location.state?.phone) {
      setPhone(location.state.phone);
      setStep(3); // skip OTP if phone verified in login
    }
  }, [location.state]);

  const sendOtp = async () => {
    try {
      await axios.post(`${API}/api/users/send-otp`, { phone });
      toast.success('OTP sent!');
      setStep(2);
      setCanResend(false);
      setTimer(30);

      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev === 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post(`${API}/api/users/verify-otp`, { phone, code: otp });
      toast.success('Phone verified! Continue registration.');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP');
    }
  };

  const completeRegistration = async () => {
    try {
      const res = await axios.put(
        `${API}/api/users/update-profile`,
        { phone, ...userData },
        { withCredentials: true } // to send cookie
      );
      const user = res.data.user;
      console.log(`User is: ${user}`);
      toast.success('Registration complete!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to complete registration');
    }
  };

  const handleInputChange = e => {
    setUserData({ ...userData, [e.target.id]: e.target.value });
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${loginBg})` }}>
      <button className="go-back-button" onClick={() => navigate('/')}>
        ← Go Back
      </button>
      <div className="login-box">
        <img src={logonoBg} alt="Logo" className="login-logo" />

        {step === 1 && (
          <form
            className="login-form"
            onSubmit={e => {
              e.preventDefault();
              sendOtp();
            }}
          >
            <label htmlFor="phone">Enter phone number to start registration</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91XXXXXXXXXX"
              required
            />
            <button type="submit">Send OTP</button>
          </form>
        )}

        {step === 2 && (
          <form
            className="login-form"
            onSubmit={e => {
              e.preventDefault();
              verifyOtp();
            }}
          >
            <label htmlFor="otp">OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
            <button
              type="button"
              onClick={sendOtp}
              disabled={!canResend}
              className="resend-otp-button"
            >
              {canResend ? 'Resend OTP' : `Resend in ${timer}s`}
            </button>

            <button type="submit">Verify OTP</button>
          </form>
        )}

        {step === 3 && (
          <form
            className="login-form"
            onSubmit={e => {
              e.preventDefault();
              completeRegistration();
            }}
          >
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={userData.name}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={userData.email}
              onChange={handleInputChange}
              required
            />

            <button type="submit">Complete Registration</button>
          </form>
        )}

        <p className="register-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
