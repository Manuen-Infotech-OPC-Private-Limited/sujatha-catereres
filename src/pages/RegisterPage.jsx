// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   analytics,
//   logEvent,
//   auth,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from "../firebase";
// import loginBg from "../assets/logos/loginbg.png";
// import logonoBg from "../assets/logos/logo-nobg.png";
// import "./Login.css";

// const RegisterPage = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [userData, setUserData] = useState({ name: "", email: "" });
//   const [timer, setTimer] = useState(30);
//   const [canResend, setCanResend] = useState(false);
//   const [confirmationResult, setConfirmationResult] = useState(null);

//   const normalizePhone = (inputPhone) => {
//     const trimmed = inputPhone.trim().replace(/\s|-/g, "");
//     return trimmed.startsWith("+91") ? trimmed : `+91${trimmed}`;
//   };

//   const isValidIndianPhone = (p) => /^\+91\d{10}$/.test(p);

//   const setupRecaptcha = () => {
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
//         size: "invisible",
//         callback: () => console.log("reCAPTCHA verified"),
//       });
//     }
//   };

//   const sendOtp = async () => {
//     const normalizedPhone = normalizePhone(phone);
//     if (!isValidIndianPhone(normalizedPhone)) {
//       toast.error("Please enter a valid 10-digit Indian phone number.");
//       return;
//     }

//     try {
//       setupRecaptcha();
//       const appVerifier = window.recaptchaVerifier;
//       const result = await signInWithPhoneNumber(auth, normalizedPhone, appVerifier);
//       setConfirmationResult(result);
//       setStep(2);
//       toast.success("OTP sent!");
//       setTimer(30);
//       setCanResend(false);

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
//       console.error("Error sending OTP:", err);
//       toast.error("Failed to send OTP");
//     }
//   };

//   const verifyOtp = async () => {
//     if (!confirmationResult) {
//       toast.error("No OTP request found.");
//       return;
//     }

//     try {
//       const res = await confirmationResult.confirm(otp);
//       const user = res.user;
//       toast.success("Phone verified! Continue registration.");
//       // Get Firebase ID token
//       const idToken = await user.getIdToken();

//       // Send token to backend to set JWT cookie
//       await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/users/firebase-login`,
//         { idToken },
//         { withCredentials: true }
//       );
//       setStep(3);

//       if (analytics) logEvent(analytics, "otp_verified", { method: "phone" });
//     } catch (err) {
//       console.error("OTP verification failed:", err);
//       toast.error("Invalid OTP");
//     }
//   };

//   const completeRegistration = async () => {
//     const normalizedPhone = normalizePhone(phone);
//     if (!isValidIndianPhone(normalizedPhone)) {
//       toast.error("Invalid phone number format.");
//       return;
//     }

//     try {
//       // ✅ Just rely on the cookie set by /firebase-login
//       await axios.put(
//         `${process.env.REACT_APP_API_URL}/api/users/update-profile`,
//         { phone: normalizedPhone, ...userData },
//         { withCredentials: true } // important
//       );

//       if (analytics) logEvent(analytics, "registration_complete", { method: "phone" });

//       toast.success("Registration complete!");
//       navigate("/");
//     } catch (err) {
//       console.error("Registration error:", err);
//       toast.error(err.response?.data?.error || "Failed to complete registration");
//     }
//   };

//   const handleInputChange = (e) => {
//     setUserData({ ...userData, [e.target.id]: e.target.value });
//   };

//   return (
//     <div className="login-container" style={{ backgroundImage: `url(${loginBg})` }}>
//       <button className="go-back-button" onClick={() => navigate("/")}>
//         ← Go Back
//       </button>

//       <div className="login-box">
//         <img src={logonoBg} alt="Logo" className="login-logo" />
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
//             <label htmlFor="otp">Enter OTP</label>
//             <input
//               type="text"
//               id="otp"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="Enter the OTP"
//               required
//             />
//             <button
//               type="button"
//               onClick={sendOtp}
//               disabled={!canResend}
//               className="resend-otp-button"
//             >
//               {canResend ? "Resend OTP" : `Resend in ${timer}s`}
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
//               placeholder="Your full name"
//               required
//             />

//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               value={userData.email}
//               onChange={handleInputChange}
//               placeholder="you@example.com"
//               required
//             />

//             <button type="submit">Complete Registration</button>
//           </form>
//         )}

//         <p className="register-text">
//           Already have an account? <a href="/login">Login here...</a>
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

  // NEW LOADING STATES
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsSending(true);

      // 1️⃣ Precheck if phone exists
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/check-phone`,
        { phone: normalizedPhone }
      );

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
      if (err.response?.status === 409) {
        toast.error("Phone number is already registered. Please login instead.");
      } else {
        console.error("Error sending OTP:", err);
        toast.error("Failed to send OTP");
      }
    } finally {
      setIsSending(false);
    }
  };

  const verifyOtp = async () => {
    if (!confirmationResult) {
      toast.error("No OTP request found.");
      return;
    }

    try {
      setIsVerifying(true);

      const res = await confirmationResult.confirm(otp);
      const user = res.user;

      toast.success("Phone verified! Continue registration.");

      const idToken = await user.getIdToken();
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/firebase-login`,
        { idToken },
        { withCredentials: true }
      );

      if (analytics) logEvent(analytics, "otp_verified", { method: "phone" });

      setStep(3);
    } catch (err) {
      console.error("OTP verification failed:", err);
      toast.error("Invalid OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const completeRegistration = async () => {
    const normalizedPhone = normalizePhone(phone);

    if (!isValidIndianPhone(normalizedPhone)) {
      toast.error("Invalid phone number format.");
      return;
    }

    try {
      setIsSubmitting(true);

      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/update-profile`,
        { phone: normalizedPhone, ...userData },
        { withCredentials: true }
      );

      if (analytics) logEvent(analytics, "registration_complete", { method: "phone" });

      toast.success("Registration complete!");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.response?.data?.error || "Failed to complete registration");
    } finally {
      setIsSubmitting(false);
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

        {/* STEP 1: ENTER PHONE */}
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

            <button type="submit" disabled={isSending}>
              {isSending ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2: ENTER OTP */}
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
              disabled={!canResend || isSending}
              className="resend-otp-button"
            >
              {isSending
                ? "Sending..."
                : canResend
                  ? "Resend OTP"
                  : `Resend in ${timer}s`}
            </button>

            <button type="submit" disabled={isVerifying}>
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {/* STEP 3: COMPLETE REGISTRATION */}
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

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Complete Registration"}
            </button>
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
