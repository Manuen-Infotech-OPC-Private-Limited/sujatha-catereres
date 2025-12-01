import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import Header from '../components/Header';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [visitCount, setVisitCount] = useState(null);
  const [user, setUser] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const [showCookiePrompt, setShowCookiePrompt] = useState(false);

  const API = process.env.REACT_APP_API_URL;
  // console.log(`API url is: ${API}`);

  useEffect(() => {
    const alreadyVisited = Cookies.get('already_visited');
    if (!alreadyVisited) {
      Cookies.set('already_visited', 'true', { expires: 365 });
    }
    // Fetch logged-in user info if token cookie is present
    axios
      .get(`${API}/api/users/me`, { withCredentials: true })
      .then((res) => {
        // console.log("Full response: ", res);
        setUser(res.data.user);
        setSessionExpired(false);
        // Mark that user was logged in at least once
        Cookies.set('was_logged_in_once', 'true', { expires: 365 });
      })
      .catch((err) => {
        const wasLoggedInOnce = Cookies.get('was_logged_in_once');

        if (err.response?.status === 401) {
          setUser(null);

          // Show session expired only if they visited and logged in at least once
          if (alreadyVisited === 'true' && wasLoggedInOnce === 'true') {
            setSessionExpired(true);
            // Auto-hide session expired box after 10 seconds
            setTimeout(() => {
              setSessionExpired(false);
            }, 3000); // 10 seconds
          }

          Cookies.remove('is_authenticated'); // Optional cleanup
        } else {
          console.error("Error fetching user:", err);
        }
      });


    const consent = Cookies.get('cookie_consent');

    if (!consent) {
      // No consent cookie at all — show prompt
      setShowCookiePrompt(true);
    } else if (consent === 'true') {
      // Consent given — do visit counting
      if (!alreadyVisited) {
        axios
          .get(`${API}/api/visit`, { withCredentials: true }) // Ensure credentials are included for cookie
          .then((res) => {
            setVisitCount(res.data.count);
            Cookies.set('already_visited', 'true', { expires: 7 });
          })
          .catch((err) => console.error('Failed to fetch visit count:', err));
      } else {
        axios
          .get(`${API}/api/visit`, { withCredentials: true }) // Ensure credentials are included for cookie
          .then((res) => {
            setVisitCount(res.data.count);
          })
          .catch((err) => console.error('Failed to fetch visit count:', err));
      }
    } else if (consent === 'customize') {
      // User chose to customize later, so no visit counting
      // but fetch count just to display
      axios
        .get(`${API}/api/visit`, { withCredentials: true }) // Ensure credentials are included for cookie
        .then((res) => {
          setVisitCount(res.data.count);
        })
        .catch((err) => console.error('Failed to fetch visit count:', err));
    }
    // If consent has any other value, treat as no consent (optional)
  }, [API, navigate]);

  const handleViewMenu = () => {
    navigate('/menu');
  };

  const acceptAllCookies = () => {
    Cookies.set('cookie_consent', 'true', { expires: 365 });
    setShowCookiePrompt(false);
    window.location.reload(); // Reload to trigger visit counting
  };

  const customizeLater = () => {
    // Set consent cookie to 'customize' to remember choice
    Cookies.set('cookie_consent', 'customize', { expires: 365 });
    toast.info('You can customize your cookie preferences later.');
    setShowCookiePrompt(false);
    window.location.reload();
  };

  return (
    <div className="home">
      <Header />
      {sessionExpired && (
        <div className="session-expired-box">
          <p>Session expired or logged out. Please sign in to continue.</p>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      )}

      <section className="home-content">
        {user && <h2 className="welcome-message">Welcome, {user.name} 👋</h2>}

        <h1 className="home-title">Sujatha Caterers</h1>
        <h3 className="home-tagline">
          Not Just Food, But a Feast of — Crafted with Love, Served with Tradition.
        </h3>
        <p className="home-description">
          Discover the rich heritage of Indian cuisine brought to life by Sujatha Caterers. From grand weddings to intimate gatherings, we deliver unforgettable culinary experiences with authentic South and North Indian dishes. Each plate is a celebration — of culture, flavor, and heartfelt hospitality.
        </p>

        <button className="cta-button" onClick={handleViewMenu}>
          Explore Our Menu
        </button>
      </section>

      <footer className="visit-counter">
        {visitCount !== null ? (
          <p>Look who’s hungry! We’ve had <strong>{visitCount}</strong> food-loving visitors.</p>
        ) : (
          <p>Loading visit count...</p>
        )}
      </footer>

      {/* Cookie consent prompt */}
      {showCookiePrompt && (
        <div className="cookie-box">
          <p>
            This site uses essential cookies by default. To improve your experience, do you accept all cookies?
          </p>
          <div className="cookie-actions">
            <button onClick={acceptAllCookies}>Accept All</button>
            <button onClick={customizeLater}>Customize Later</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
