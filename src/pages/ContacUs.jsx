import Header from '../components/Header';
import './ContactUs.css';
import { FaPhoneAlt, FaWhatsapp, FaFacebook, FaInstagram, FaEnvelope, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const ContactUs = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="home">
      <Header />

      <section className="contact-hero" data-aos="fade-down">
        <h1>We’d Love to Hear From You!</h1>
        <p>
          Whether you're planning a wedding, a festive gathering, or a corporate event, Sujatha Caterers is here to bring your vision to life with exquisite South Indian vegetarian cuisine.
          Our team is warm, responsive, and ready to assist you with menu planning, pricing, and availability.
        </p>
      </section>

      <section className="contact-details">
        <div className="contact-box" data-aos="fade-up" data-aos-delay="100">
          <FaPhoneAlt className="contact-icon" />
          <h3>Phone</h3>
          <p><a href="tel:+919703505356">+91 97035 05356</a></p>
          <p>Available 24/7</p>
        </div>

        <div className="contact-box" data-aos="fade-up" data-aos-delay="200">
          <FaWhatsapp className="contact-icon" />
          <h3>WhatsApp</h3>
          <p><a href="https://wa.me/919703505356" target="_blank" rel="noopener noreferrer">Chat Now</a></p>
          <p>Instant Support</p>
        </div>

        <div className="contact-box" data-aos="fade-up" data-aos-delay="300">
          <FaEnvelope className="contact-icon" />
          <h3>Email</h3>
          <p><a href="mailto:sujathameals@gmail.com">sujathameals@gmail.com</a></p>
          <p>Replies within 12 hours</p>
        </div>

        <div className="contact-box" data-aos="fade-up" data-aos-delay="400">
          <FaClock className="contact-icon" />
          <h3>Business Hours</h3>
          <p>Monday – Sunday</p>
          <p>8:00 AM – 9:00 PM</p>
          <p className='info'>Applicable to Meal Box</p>
        </div>

        <div className="contact-box" data-aos="fade-up" data-aos-delay="500">
          <FaMapMarkerAlt className="contact-icon" />
          <h3>Address</h3>
          <p>Opposite to Meenakshi Palms, Tarakarama Nagar, Srinivasa Nagar Colony, Guntur-522006</p>
          <p>Open in Maps Below</p>
        </div>

        <div className="contact-box social" data-aos="fade-up" data-aos-delay="600">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com/share/1BCf3bKKyk/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://instagram.com/sujathacaterers" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            {/* <a href="https://twitter.com/sujathacaterers" target="_blank" rel="noopener noreferrer"><FaTwitter /></a> */}
          </div>
        </div>
      </section>

      <section className="map-section" data-aos="zoom-in">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3828.878551065998!2d80.40892567409921!3d16.329148632429334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a358b71d28fdfc7%3A0x7699357a26dcc9e1!2sSujatha%20Meals%20Contractors!5e0!3m2!1sen!2sin!4v1752248567560!5m2!1sen!2sin"
          width="80%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Sujatha Caterers Map"
        ></iframe>
      </section>
    </div>
  );
};

export default ContactUs;
