// import React, { useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import loginBg from '../assets/logos/loginbg.png';
// import logonoBg from '../assets/logos/logo-nobg.png';
// import './Login.css';

// const LoginPage = () => {
//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState('');
//   const [step, setStep] = useState(1);
//   const navigate = useNavigate();
//   const [timer, setTimer] = useState(30);
//   const [canResend, setCanResend] = useState(false);

//   const API = process.env.REACT_APP_API_URL;

//   const normalizePhone = (inputPhone) => {
//     const trimmedPhone = inputPhone.trim().replace(/\s|-/g, '');
//     const normalizedPhone = trimmedPhone.startsWith('+91') ? trimmedPhone : `+91${trimmedPhone}`;
//     return normalizedPhone;
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
//       console.log(`error while sending otp is: ${err}`);
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
//       const res = await axios.post(
//         `${API}/api/users/verify-otp`,
//         { phone: normalizedPhone, code: otp },
//         { withCredentials: true }
//       );

//       const user = res.data.user;
//       toast.success('OTP verified!');

//       if (!user.name || !user.email) {
//         toast.info('Looks like you are new! Complete registration to proceed!');
//         navigate('/register', { state: { phone: normalizedPhone } });
//       } else {
//         navigate('/');
//       }
//     } catch (err) {
//       console.log(`error while verifying otp is: ${err}`);
//       toast.error(err.response?.data?.error || 'Invalid OTP');
//     }
//   };

//   return (
//     <div className="login-container" style={{ backgroundImage: `url(${loginBg})` }}>
//       <button className="go-back-button" onClick={() => navigate('/')}>
//         ← Go Back
//       </button>
//       <div className="login-box">
//         <img src={logonoBg} alt="Logo" className="login-logo" />
//         {step === 1 ? (
//           <form
//             className="login-form"
//             onSubmit={e => {
//               e.preventDefault();
//               sendOtp();
//             }}
//           >
//             <label htmlFor="phone">Enter phone number to login</label>
//             <input
//               type="tel"
//               id="phone"
//               placeholder="Enter 10-digit phone number"
//               value={phone}
//               onChange={e => setPhone(e.target.value)}
//               required
//             />
//             <button type="submit">Send OTP</button>
//           </form>
//         ) : (
//           <form
//             className="login-form"
//             onSubmit={e => {
//               e.preventDefault();
//               verifyOtp();
//             }}
//           >
//             <label htmlFor="otp">Enter OTP</label>
//             <input
//               type="text"
//               id="otp"
//               placeholder="Enter the OTP"
//               value={otp}
//               onChange={e => setOtp(e.target.value)}
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

//             <button type="submit">Verify & Login</button>
//           </form>
//         )}
//         <p className="register-text">
//           Don’t have an account? <a href="/register">Register here...</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { analytics, logEvent, auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase';
import loginBg from '../assets/logos/loginbg.png';
import logonoBg from '../assets/logos/logo-nobg.png';
import './Login.css';
import axios from 'axios';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const navigate = useNavigate();

  const normalizePhone = (inputPhone) => {
    const trimmed = inputPhone.trim().replace(/\s|-/g, '');
    return trimmed.startsWith('+91') ? trimmed : `+91${trimmed}`;
  };

  const isValidIndianPhone = (p) => /^\+91\d{10}$/.test(p);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          console.log('reCAPTCHA verified');
        },
      });
    }
  };

  const sendOtp = async () => {
    const normalizedPhone = normalizePhone(phone);
    if (!isValidIndianPhone(normalizedPhone)) {
      toast.error('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    try {
      setIsLoading(true);  // <-- START LOADING
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, normalizedPhone, appVerifier);
      setConfirmationResult(result);
      setStep(2);
      toast.success('OTP sent!');
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
      console.error('Error sending OTP:', err);
      toast.error('Failed to send OTP');
    } finally {
      setIsLoading(false); // <-- END LOADING
    }
  };

  const verifyOtp = async () => {
    if (!confirmationResult) {
      toast.error('No OTP request found.');
      return;
    }

    try {
      setIsVerifying(true);  // <-- START LOADING
      const res = await confirmationResult.confirm(otp);
      const user = res.user;
      console.log('Firebase user:', user);

      // Optionally send user.phoneNumber or user.getIdToken() to backend
      const idToken = await user.getIdToken();
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/firebase-login`,
        { idToken },
        { withCredentials: true }
      );
      if (analytics) logEvent(analytics, "login_success", { method: "phone" })
      toast.success('Phone verified successfully!');
      navigate('/');
    } catch (err) {
      console.error('OTP verification failed:', err);
      toast.error('Invalid OTP');
    } finally {
      setIsVerifying(false);  // <-- END LOADING
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${loginBg})` }}>
      <button className="go-back-button" onClick={() => navigate('/')}>
        ← Go Back
      </button>

      <div className="login-box">
        <img src={logonoBg} alt="Logo" className="login-logo" />

        <div id="recaptcha-container"></div>

        {step === 1 ? (
          <form
            className="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              sendOtp();
            }}
          >
            <label htmlFor="phone">Enter phone number to login</label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter 10-digit phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>

          </form>
        ) : (
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
              placeholder="Enter the OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
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
            <button type="submit" disabled={isVerifying}>
              {isVerifying ? "Verifying..." : "Verify & Login"}
            </button>

          </form>
        )}

        <p className="register-text">
          Don't have an account? <a href="/register">Register here...</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
