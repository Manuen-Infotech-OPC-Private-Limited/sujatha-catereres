import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/NotFound.css';
import Header from '../components/Header';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <Header />
      <div className="not-found-container">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Oops! Page Not Found</h2>
        <p className="not-found-text">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <button className="not-found-button" onClick={() => navigate('/')}>
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;