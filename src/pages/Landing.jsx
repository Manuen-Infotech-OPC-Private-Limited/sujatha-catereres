import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css//Landing.css';
import Header from '../components/Header';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const Home = () => {
  const navigate = useNavigate();
  const { user, loading: loadingUser } = useAuth();
  const [visitCount, setVisitCount] = useState(null);
  const [showCookiePrompt, setShowCookiePrompt] = useState(false);

  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [complaintData, setComplaintData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [sendingComplaint, setSendingComplaint] = useState(false);

  const API = process.env.REACT_APP_API_URL;

  // ---------------- INIT ----------------
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const consent = Cookies.get('cookie_consent');
    const alreadyVisited = Cookies.get('already_visited');

    if (!consent) {
      setShowCookiePrompt(true);
    } else {
      if (!alreadyVisited || consent === 'true' || consent === 'customize') {
        axios
          .get(`${API}/api/visit`, { withCredentials: true })
          .then(res => {
            setVisitCount(res.data.count);
            Cookies.set('already_visited', 'true', { expires: 7 });
          })
          .catch(err => console.error('Failed to fetch visit count:', err));
      }
    }
  }, [API]);

  // ---------------- COOKIE HANDLERS ----------------
  const acceptAllCookies = () => {
    Cookies.set('cookie_consent', 'true', { expires: 365 });
    setShowCookiePrompt(false);
    // window.location.reload();
  };
  const acceptEssentialCookies = () => {
    Cookies.set('cookie_consent', 'essential', { expires: 365 });
    toast.info('Only essential cookies will be used.');
    setShowCookiePrompt(false);
    // window.location.reload();
  };

  const handleViewMenu = () => navigate('/menu');
  const handleViewMealbox = () => navigate('/mealbox');
  const handleLogin = () => navigate('/login');
  const handleRegister = () => navigate('/register');

  // ---------------- SUPPORT DIALOG ----------------
  const openSupportDialog = () => {
    if (user) {
      setComplaintData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        message: '',
      });
    } else {
      setComplaintData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    }
    setSupportDialogOpen(true);
  };

  const closeSupportDialog = () => setSupportDialogOpen(false);

  const handleComplaintChange = (e) => {
    const { name, value } = e.target;
    setComplaintData(prev => ({ ...prev, [name]: value }));
  };

  const sendComplaint = async () => {
    const { name, email, phone, message } = complaintData;

    // Basic validation
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    // Remove optional '+91' prefix if present
    let cleanedPhone = phone.replace(/^(\+91)?/, '');

    // Phone validation (10 digits)
    if (!/^\d{10}$/.test(cleanedPhone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }


    setSendingComplaint(true);

    try {
      const res = await axios.post(`${API}/api/complaints/register-complaint`, complaintData, {
        withCredentials: true
      });

      if (res.status === 200) {
        toast.success('Your complaint has been sent! We will look into it shortly.');
        setSupportDialogOpen(false);
        setComplaintData(prev => ({ ...prev, message: '' }));
      } else {
        throw new Error('Failed to send complaint');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to send complaint. Please try again later.');
    } finally {
      setSendingComplaint(false);
    }
  };

  return (
    <div className="home">
      <Header />

      {/* Welcome message */}
      <section className="home-content">
        {!loadingUser && user ? (
          <h2 className="welcome-message">Welcome, {user.name} 👋</h2>
        ) : (
          <h2 className="welcome-message">Welcome, Food Lover 👋</h2>
        )}

        <h1 className="home-title">Sujatha Caterers</h1>
        <h3 className="home-tagline">
          Not Just Food, But a Feast of Flavors — Crafted with Love, Served with Tradition.
        </h3>
        <p className="home-description">
          Discover the rich heritage of Indian cuisine brought to life by Sujatha Caterers.
          From grand weddings to intimate gatherings, we deliver unforgettable culinary experiences
          with authentic South and North Indian dishes. Each plate is a celebration — of culture,
          flavor, and heartfelt hospitality.
        </p>

        <div className="cta-buttons">
          <button className="cta-button" onClick={handleViewMenu}>
            Explore Our Menu
          </button>
          <button className="cta-button" onClick={handleViewMealbox}>
            Browse Our Meal Boxes
          </button>
        </div>

        {!loadingUser && !user && (
          <div className="guest-auth-note">
            <p>
              For a personalized experience,{' '}
              <button className="link-button" onClick={handleLogin}>log in</button> or{' '}
              <button className="link-button" onClick={handleRegister}>sign up</button>.
            </p>
          </div>
        )}
      </section>

      <div className="visit-counter">
        {visitCount !== null ? (
          <p>Look who’s hungry! We’ve had <strong>{visitCount}</strong> food-loving visitors.</p>
        ) : (
          <p>Loading visit count...</p>
        )}
      </div>

      {showCookiePrompt && (
        <div className="cookie-box">
          <p>
            This site uses essential cookies by default. To improve your experience, do you accept all cookies?
          </p>
          <div className="cookie-actions">
            <button onClick={acceptAllCookies}>Accept All</button>
            <button onClick={acceptEssentialCookies}>Accept Essential Only</button>
          </div>
        </div>
      )}

      {/* ---------------- FLOATING ACTION BUTTON ---------------- */}
      <button
        className="fab-contact-support"
        onClick={openSupportDialog}
        title="Contact Support"
      >
        Contact Support 👩‍💻
      </button>

      {/* ---------------- SUPPORT DIALOG ---------------- */}
      {supportDialogOpen && (
        <div className="support-dialog-overlay">
          <div className="support-dialog">
            <h3>Contact Support</h3>
            <p>Tell us your issue, and we'll respond within 24 hours.</p>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={complaintData.name}
              onChange={handleComplaintChange}
              disabled={!!user?.name}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={complaintData.email}
              onChange={handleComplaintChange}
              disabled={!!user?.email}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone"
              value={complaintData.phone}
              onChange={handleComplaintChange}
              disabled={!!user?.phone}
            />
            <textarea
              name="message"
              placeholder="Describe your issue..."
              value={complaintData.message}
              onChange={handleComplaintChange}
            />

            <div className="support-dialog-actions">
              <button onClick={closeSupportDialog}>Cancel</button>
              <button onClick={sendComplaint} disabled={sendingComplaint}>
                {sendingComplaint ? 'Sending...' : 'Send'}
              </button>
            </div>
            <p className="support-info">We typically respond within 24 hours. Thank you for reaching out!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
