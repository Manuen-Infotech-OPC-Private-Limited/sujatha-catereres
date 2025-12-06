import './Services.css';
import mealboximg from '../assets/logos/mealbox.png';
import cateringImg from '../assets/logos/catering.png';
import Header from '../components/Header';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ServiceCard = ({ imgSrc, title, tagline, description, badge, showButton }) => {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="service-item-container" data-aos="fade-up">
      {badge && <div className="coming-soon-badge">{badge}</div>}
      <div className="image-wrapper">
        {!loaded && <div className="image-skeleton"></div>}
        <img
          src={imgSrc}
          alt={title}
          style={{ display: loaded ? 'block' : 'none' }}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="service-item-description">
        <h3 className="service-item-title">{title}</h3>
        <p className="service-item-tagline">{tagline}</p>
        {showButton && (
          <button className="order-button" onClick={() => navigate('/order')}>
            Order Now
          </button>
        )}
        <p>{description}</p>
      </div>
    </div>
  );
};

const Services = () => {
  const [user, setUser] = useState(null);

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
        <h1 className="service-title" data-aos="fade-down">
          Our Services
        </h1>

        <div className="service-items">
          <ServiceCard
            imgSrc={mealboximg}
            title="Meal Box"
            tagline="Hearty, flavorful, aromatic, wholesome."
            description="Perfect for small gatherings, office lunches, or personal occasions,
            our South Indian vegetarian meal boxes bring you the same Sujatha Catering quality
            in a convenient, ready-to-eat format. Each meal box is carefully packed with balanced
            portions, freshly prepared items, and authentic flavors that reflect our culinary heritage."
            badge="Coming Soon"
          />

          <ServiceCard
            imgSrc={cateringImg}
            title="Catering"
            tagline="Delicious, traditional, generous, satisfying."
            description="Catering service provides a full-service, end-to-end dining experience. We cater for
            breakfast, lunch, and dinner, offering four tiers of curated menus: Basic, Classic, Luxury,
            and Premium. Whether it's a simple family event or an elegant wedding celebration,
            we tailor our service to match your needs—combining traditional South Indian flavors
            with elegant presentation, impeccable hygiene, and seamless execution."
            showButton={user}
          />
        </div>
      </section>
    </div>
  );
};

export default Services;
