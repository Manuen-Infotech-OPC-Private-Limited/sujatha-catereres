// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import loginBg from '../assets/logos/loginbg.png';
// import logonoBg from '../assets/logos/logo-nobg.png';
// import './Login.css';

// const RegisterPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const API = process.env.REACT_APP_API_URL;

//   const [step, setStep] = useState(1);
//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState('');
//   const [userData, setUserData] = useState({ name: '', email: '' });
//   const [timer, setTimer] = useState(30);
//   const [canResend, setCanResend] = useState(false);

//   useEffect(() => {
//     if (location.state?.phone) {
//       setPhone(location.state.phone);
//       setStep(3); // skip OTP if phone verified in login
//     }
//   }, [location.state]);

//   const normalizePhone = (inputPhone) => {
//     const trimmed = inputPhone.trim().replace(/\s|-/g, '');
//     return trimmed.startsWith('+91') ? trimmed : `+91${trimmed}`;
//   };

//   const isValidIndianPhone = (phone) => {
//     return /^\+91\d{10}$/.test(phone);
//   };

//   const sendOtp = async () => {
//     const normalizedPhone = normalizePhone(phone);

//     if (!isValidIndianPhone(normalizedPhone)) {
//       toast.error('Please enter a valid 10-digit Indian phone number.');
//       return;
//     }

//     try {
//       await axios.post(`${API}/api/users/send-otp`, { phone: normalizedPhone });
//       toast.success('OTP sent!');
//       setStep(2);
//       setCanResend(false);
//       setTimer(30);

//       const interval = setInterval(() => {
//         setTimer(prev => {
//           if (prev === 1) {
//             clearInterval(interval);
//             setCanResend(true);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Failed to send OTP');
//     }
//   };

//   const verifyOtp = async () => {
//     const normalizedPhone = normalizePhone(phone);

//     if (!isValidIndianPhone(normalizedPhone)) {
//       toast.error('Invalid phone number format.');
//       return;
//     }

//     try {
//       await axios.post(`${API}/api/users/verify-otp`, { phone: normalizedPhone, code: otp });
//       toast.success('Phone verified! Continue registration.');
//       setStep(3);
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Invalid OTP');
//     }
//   };

//   const completeRegistration = async () => {
//     const normalizedPhone = normalizePhone(phone);

//     if (!isValidIndianPhone(normalizedPhone)) {
//       toast.error('Invalid phone number format.');
//       return;
//     }

//     try {
//       const res = await axios.put(
//         `${API}/api/users/update-profile`,
//         { phone: normalizedPhone, ...userData },
//         { withCredentials: true }
//       );
//       const user = res.data.user;
//       toast.success('Registration complete!');
//       navigate('/');
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Failed to complete registration');
//     }
//   };

//   const handleInputChange = e => {
//     setUserData({ ...userData, [e.target.id]: e.target.value });
//   };

//   return (
//     <div className="login-container" style={{ backgroundImage: `url(${loginBg})` }}>
//       <button className="go-back-button" onClick={() => navigate('/')}>
//         ← Go Back
//       </button>
//       <div className="login-box">
//         <img src={logonoBg} alt="Logo" className="login-logo" />

//         {step === 1 && (
//           <form
//             className="login-form"
//             onSubmit={e => {
//               e.preventDefault();
//               sendOtp();
//             }}
//           >
//             <label htmlFor="phone">Enter phone number to start registration</label>
//             <input
//               type="tel"
//               id="phone"
//               value={phone}
//               onChange={e => setPhone(e.target.value)}
//               placeholder="Enter 10-digit phone number"
//               required
//             />
//             <button type="submit">Send OTP</button>
//           </form>
//         )}

//         {step === 2 && (
//           <form
//             className="login-form"
//             onSubmit={e => {
//               e.preventDefault();
//               verifyOtp();
//             }}
//           >
//             <label htmlFor="otp">OTP</label>
//             <input
//               type="text"
//               id="otp"
//               value={otp}
//               onChange={e => setOtp(e.target.value)}
//               placeholder="Enter OTP"
//               required
//             />
//             <button
//               type="button"
//               onClick={sendOtp}
//               disabled={!canResend}
//               className="resend-otp-button"
//             >
//               {canResend ? 'Resend OTP' : `Resend in ${timer}s`}
//             </button>

//             <button type="submit">Verify OTP</button>
//           </form>
//         )}

//         {step === 3 && (
//           <form
//             className="login-form"
//             onSubmit={e => {
//               e.preventDefault();
//               completeRegistration();
//             }}
//           >
//             <label htmlFor="name">Full Name</label>
//             <input
//               type="text"
//               id="name"
//               value={userData.name}
//               onChange={handleInputChange}
//               required
//             />

//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               value={userData.email}
//               onChange={handleInputChange}
//               required
//             />

//             <button type="submit">Complete Registration</button>
//           </form>
//         )}

//         <p className="register-text">
//           Already have an account? <a href="/login">Login</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;


// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase';
// import loginBg from '../assets/logos/loginbg.png';
// import logonoBg from '../assets/logos/logo-nobg.png';
// import './Login.css';

// const RegisterPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const API = process.env.REACT_APP_API_URL;

//   const [step, setStep] = useState(1);
//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState('');
//   const [userData, setUserData] = useState({ name: '', email: '' });
//   const [timer, setTimer] = useState(30);
//   const [canResend, setCanResend] = useState(false);
//   const [confirmationResult, setConfirmationResult] = useState(null);

//   // If the phone was already verified during login
//   useEffect(() => {
//     if (location.state?.phone) {
//       setPhone(location.state.phone);
//       setStep(3); // skip OTP if already verified
//     }
//   }, [location.state]);

//   const normalizePhone = (inputPhone) => {
//     const trimmed = inputPhone.trim().replace(/\s|-/g, '');
//     return trimmed.startsWith('+91') ? trimmed : `+91${trimmed}`;
//   };

//   const isValidIndianPhone = (p) => /^\+91\d{10}$/.test(p);

//   const setupRecaptcha = () => {
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
//         size: 'invisible',
//         callback: () => console.log('reCAPTCHA verified'),
//       });
//     }
//   };

//   const sendOtp = async () => {
//     const normalizedPhone = normalizePhone(phone);
//     if (!isValidIndianPhone(normalizedPhone)) {
//       toast.error('Please enter a valid 10-digit Indian phone number.');
//       return;
//     }

//     try {
//       setupRecaptcha();
//       const appVerifier = window.recaptchaVerifier;
//       const result = await signInWithPhoneNumber(auth, normalizedPhone, appVerifier);
//       setConfirmationResult(result);
//       setStep(2);
//       toast.success('OTP sent!');
//       setCanResend(false);
//       setTimer(30);

//       const interval = setInterval(() => {
//         setTimer((prev) => {
//           if (prev === 1) {
//             clearInterval(interval);
//             setCanResend(true);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     } catch (err) {
//       console.error('Error sending OTP:', err);
//       toast.error('Failed to send OTP');
//     }
//   };

//   const verifyOtp = async () => {
//     if (!confirmationResult) {
//       toast.error('No OTP request found.');
//       return;
//     }

//     try {
//       const res = await confirmationResult.confirm(otp);
//       const user = res.user;
//       toast.success('Phone verified! Continue registration.');
//       console.log('Firebase user:', user);
//       setStep(3);
//     } catch (err) {
//       console.error('OTP verification failed:', err);
//       toast.error('Invalid OTP');
//     }
//   };

//   const completeRegistration = async () => {
//     const normalizedPhone = normalizePhone(phone);
//     if (!isValidIndianPhone(normalizedPhone)) {
//       toast.error('Invalid phone number format.');
//       return;
//     }

//     try {
//       const currentUser = auth.currentUser;
//       const idToken = currentUser ? await currentUser.getIdToken() : null;

//       // You can now send the Firebase ID token for verification to your backend
//       const res = await axios.put(
//         `${API}/api/users/update-profile`,
//         { phone: normalizedPhone, ...userData },
//         {
//           withCredentials: true,
//           headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
//         }
//       );

//       toast.success('Registration complete!');
//       navigate('/');
//     } catch (err) {
//       console.error('Registration error:', err);
//       toast.error(err.response?.data?.error || 'Failed to complete registration');
//     }
//   };

//   const handleInputChange = (e) => {
//     setUserData({ ...userData, [e.target.id]: e.target.value });
//   };

//   return (
//     <div className="login-container" style={{ backgroundImage: `url(${loginBg})` }}>
//       <button className="go-back-button" onClick={() => navigate('/')}>
//         ← Go Back
//       </button>

//       <div className="login-box">
//         <img src={logonoBg} alt="Logo" className="login-logo" />

//         {/* Hidden reCAPTCHA container */}
//         <div id="recaptcha-container"></div>

//         {step === 1 && (
//           <form
//             className="login-form"
//             onSubmit={(e) => {
//               e.preventDefault();
//               sendOtp();
//             }}
//           >
//             <label htmlFor="phone">Enter phone number to start registration</label>
//             <input
//               type="tel"
//               id="phone"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               placeholder="Enter 10-digit phone number"
//               required
//             />
//             <button type="submit">Send OTP</button>
//           </form>
//         )}

//         {step === 2 && (
//           <form
//             className="login-form"
//             onSubmit={(e) => {
//               e.preventDefault();
//               verifyOtp();
//             }}
//           >
//             <label htmlFor="otp">OTP</label>
//             <input
//               type="text"
//               id="otp"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="Enter OTP"
//               required
//             />
//             <button
//               type="button"
//               onClick={sendOtp}
//               disabled={!canResend}
//               className="resend-otp-button"
//             >
//               {canResend ? 'Resend OTP' : `Resend in ${timer}s`}
//             </button>

//             <button type="submit">Verify OTP</button>
//           </form>
//         )}

//         {step === 3 && (
//           <form
//             className="login-form"
//             onSubmit={(e) => {
//               e.preventDefault();
//               completeRegistration();
//             }}
//           >
//             <label htmlFor="name">Full Name</label>
//             <input
//               type="text"
//               id="name"
//               value={userData.name}
//               onChange={handleInputChange}
//               required
//             />

//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               value={userData.email}
//               onChange={handleInputChange}
//               required
//             />

//             <button type="submit">Complete Registration</button>
//           </form>
//         )}

//         <p className="register-text">
//           Already have an account? <a href="/login">Login</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  analytics,
  logEvent,
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../firebase";
import loginBg from "../assets/logos/loginbg.png";
import logonoBg from "../assets/logos/logo-nobg.png";
import "./Login.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const normalizePhone = (inputPhone) => {
    const trimmed = inputPhone.trim().replace(/\s|-/g, "");
    return trimmed.startsWith("+91") ? trimmed : `+91${trimmed}`;
  };

  const isValidIndianPhone = (p) => /^\+91\d{10}$/.test(p);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => console.log("reCAPTCHA verified"),
      });
    }
  };

  const sendOtp = async () => {
    const normalizedPhone = normalizePhone(phone);
    if (!isValidIndianPhone(normalizedPhone)) {
      toast.error("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, normalizedPhone, appVerifier);
      setConfirmationResult(result);
      setStep(2);
      toast.success("OTP sent!");
      setTimer(30);
      setCanResend(false);

      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error sending OTP:", err);
      toast.error("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    if (!confirmationResult) {
      toast.error("No OTP request found.");
      return;
    }

    try {
      const res = await confirmationResult.confirm(otp);
      const user = res.user;
      toast.success("Phone verified! Continue registration.");
      // Get Firebase ID token
      const idToken = await user.getIdToken();

      // Send token to backend to set JWT cookie
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/firebase-login`,
        { idToken },
        { withCredentials: true }
      );
      setStep(3);

      if (analytics) logEvent(analytics, "otp_verified", { method: "phone" });
    } catch (err) {
      console.error("OTP verification failed:", err);
      toast.error("Invalid OTP");
    }
  };

  const completeRegistration = async () => {
    const normalizedPhone = normalizePhone(phone);
    if (!isValidIndianPhone(normalizedPhone)) {
      toast.error("Invalid phone number format.");
      return;
    }

    try {
      // ✅ Just rely on the cookie set by /firebase-login
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/update-profile`,
        { phone: normalizedPhone, ...userData },
        { withCredentials: true } // important
      );

      if (analytics) logEvent(analytics, "registration_complete", { method: "phone" });

      toast.success("Registration complete!");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.response?.data?.error || "Failed to complete registration");
    }
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.id]: e.target.value });
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${loginBg})` }}>
      <button className="go-back-button" onClick={() => navigate("/")}>
        ← Go Back
      </button>

      <div className="login-box">
        <img src={logonoBg} alt="Logo" className="login-logo" />
        <div id="recaptcha-container"></div>

        {step === 1 && (
          <form
            className="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              sendOtp();
            }}
          >
            <label htmlFor="phone">Enter phone number to start registration</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter 10-digit phone number"
              required
            />
            <button type="submit">Send OTP</button>
          </form>
        )}

        {step === 2 && (
          <form
            className="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              verifyOtp();
            }}
          >
            <label htmlFor="otp">Enter OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP"
              required
            />
            <button
              type="button"
              onClick={sendOtp}
              disabled={!canResend}
              className="resend-otp-button"
            >
              {canResend ? "Resend OTP" : `Resend in ${timer}s`}
            </button>
            <button type="submit">Verify OTP</button>
          </form>
        )}

        {step === 3 && (
          <form
            className="login-form"
            onSubmit={(e) => {
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
              placeholder="Your full name"
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={userData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              required
            />

            <button type="submit">Complete Registration</button>
          </form>
        )}

        <p className="register-text">
          Already have an account? <a href="/login">Login here...</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

