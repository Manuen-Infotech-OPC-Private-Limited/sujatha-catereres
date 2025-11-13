import './Services.css';
import mealboximg from '../assets/logos/mealbox.png';
import cateringImg from '../assets/logos/catering.png';
import Header from '../components/Header';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Services = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="home">
      <Header />
      <section className="service-content">
        <h1 className="service-title" data-aos="fade-down">Our Services</h1>

        <div className="service-items">
          {/* Meal Box */}
          <div className="service-item-container" data-aos="fade-right">
            <div className="coming-soon-badge">Coming Soon</div>
            <div>
              <img src={mealboximg} alt="Meal Box" />
            </div>
            <div className="service-item-description">
              <h3 className="service-item-title">Meal Box</h3>
              <p className="service-item-tagline">Hearty, flavorful, aromatic, wholesome.</p>
              <p>
                Perfect for small gatherings, office lunches, or personal occasions,
                our South Indian vegetarian meal boxes bring you the same Sujatha Catering quality
                in a convenient, ready-to-eat format. Each meal box is carefully packed with balanced
                portions, freshly prepared items, and authentic flavors that reflect our culinary heritage.
              </p>
            </div>
          </div>

          {/* Catering */}
          <div className="service-item-container" data-aos="fade-left">
            <div>
              <img src={cateringImg} alt="Catering" />
            </div>
            <div className="service-item-description">
              <h3 className="service-item-title">Catering</h3>
              <p className="service-item-tagline">Delicious, traditional, generous, satisfying.</p>

              {user && (
                <button className="order-button" onClick={() => navigate('/order')}>
                  Order Now
                </button>
              )}

              <p>
                Catering service provides a full-service, end-to-end dining experience. We cater for
                breakfast, lunch, and dinner, offering four tiers of curated menus: Basic, Classic, Luxury,
                and Premium. Whether it's a simple family event or an elegant wedding celebration,
                we tailor our service to match your needs—combining traditional South Indian flavors
                with elegant presentation, impeccable hygiene, and seamless execution.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
