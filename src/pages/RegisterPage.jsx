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

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

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

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.id]: e.target.value });
  };

  const sendOtp = async () => {
    const normalizedPhone = normalizePhone(userData.phone);
    if (!isValidIndianPhone(normalizedPhone)) {
      toast.error("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    try {
      setIsSending(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/check-phone?for=register`, { phone: normalizedPhone });

      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, normalizedPhone, appVerifier);
      setConfirmationResult(result);
      setIsOtpSent(true);
      toast.success("OTP sent to your phone!");
    } catch (err) {
      console.error("Error sending OTP:", err);
      toast.error(err.response?.data?.error || "Failed to send OTP");
      setIsOtpSent(false);
    } finally {
      setIsSending(false);
    }
  };

  const verifyOtpAndRegister = async () => {
    if (!confirmationResult) {
      toast.error("No OTP request found. Please try registering again.");
      return;
    }

    try {
      setIsVerifying(true);
      const res = await confirmationResult.confirm(otp);
      const user = res.user;

      const idToken = await user.getIdToken();

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/register`,
        { ...userData, idToken },
        { withCredentials: true }
      );

      toast.success("Registration successful!");
      if (analytics) logEvent(analytics, "registration_complete", { method: "phone" });

      navigate("/"); // Redirect to home or login
    } catch (err) {
      console.error("OTP verification or registration failed:", err);
      toast.error("Invalid OTP or registration failed. Please try again.");
      setIsOtpSent(false);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${loginBg})` }}>
      <button className="go-back-button" onClick={() => navigate("/")}>
        ← Go Back
      </button>

      <div className="login-box">
        <img src={logonoBg} alt="Logo" className="login-logo" />
        <div id="recaptcha-container"></div>

        {!isOtpSent ? (
          <form
            className="login-form grid-form"
            onSubmit={(e) => {
              e.preventDefault();
              sendOtp();
            }}
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  placeholder="Your address"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isSending}>
              {isSending ? "Sending OTP..." : "Register & Verify OTP"}
            </button>
          </form>
        ) : (
          <form
            className="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              verifyOtpAndRegister();
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
            <button type="submit" disabled={isVerifying}>
              {isVerifying ? "Verifying..." : "Verify OTP & Complete Registration"}
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
