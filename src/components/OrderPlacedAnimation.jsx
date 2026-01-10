import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import orderSuccessAnimation from '../assets/lottie/order-placed.json';
import '../css/OrderPlacedAnimation.css';

const OrderPlacedAnimation = ({ duration = 3000, soundUrl }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Play sound if provided
    if (soundUrl) {
      const audio = new Audio(soundUrl);
      audio.play();
    }

    // Navigate to home after duration
    const timer = setTimeout(() => {
      navigate('/');
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, navigate, soundUrl]);

  return (
    <div className="order-placed-overlay">
      <Player
        autoplay
        keepLastFrame
        src={orderSuccessAnimation}
        style={{ height: '300px', width: '300px' }}
      />
      <h2>Order Placed Successfully!</h2>
    </div>
  );
};

export default OrderPlacedAnimation;
