import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import loginBg from '../assets/logos/loginbg.png';
import logonoBg from '../assets/logos/logo-nobg.png';
import './Login.css';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const API = process.env.REACT_APP_API_URL;

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
      console.log(`error while sending otp is: ${err}`)
      toast.error(  err || 'Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        `${API}/api/users/verify-otp`,
        { phone, code: otp },
        { withCredentials: true } // Important to receive httpOnly cookie
      );
      const user = res.data.user;

      toast.success('OTP verified!');

      if (!user.name || !user.email) {
        toast.info('Looks like you are new! Complete registration to proceed!');
        navigate('/register', { state: { phone } });
      } else {
        navigate('/');
      }
    } catch (err) {
      console.log(`error while verifying otp is: ${err}`);
      toast.error(err.response?.data?.error || 'Invalid OTP');
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${loginBg})` }}>
      <button className="go-back-button" onClick={() => navigate('/')}>
        ← Go Back
      </button>
      <div className="login-box">
        <img src={logonoBg} alt="Logo" className="login-logo" />
        {step === 1 ? (
          <form
            className="login-form"
            onSubmit={e => {
              e.preventDefault();
              sendOtp();
            }}
          >
            <label htmlFor="phone">Enter phone number to login</label>
            <input
              type="tel"
              id="phone"
              placeholder="+91XXXXXXXXXX"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
            <button type="submit">Send OTP</button>
          </form>
        ) : (
          <form
            className="login-form"
            onSubmit={e => {
              e.preventDefault();
              verifyOtp();
            }}
          >
            <label htmlFor="otp">Enter OTP</label>
            <input
              type="text"
              id="otp"
              placeholder="Enter the OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
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

            <button type="submit">Verify & Login</button>
          </form>
        )}
        <p className="register-text">
          Don’t have an account? <a href="/register">Register here...</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

