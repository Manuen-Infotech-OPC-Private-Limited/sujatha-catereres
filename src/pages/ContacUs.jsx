import { useEffect, useState } from 'react';
import Header from '../components/Header';
import '../css/ContactUs.css';
import { toast } from 'react-toastify';
import { testimonials } from '../data/testimonials';
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaEnvelope,
  FaClock,
  FaMapMarkerAlt
} from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';


const ContactUs = () => {
  // -----------------------------
  // 🔹 STATE
  // -----------------------------
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState('');
  const [guests, setGuests] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState('');
  const [serviceInfo, setServiceInfo] = useState(null);

  const [index, setIndex] = useState(0);
  const api = process.env.REACT_APP_API_URL;

  // -----------------------------
  // 🔹 AOS INIT
  // -----------------------------
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // -----------------------------
  // 🔹 TESTIMONIAL AUTO ROTATE
  // -----------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // -----------------------------
  // 🔹 CONSULTATION SUBMIT
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!navigator.geolocation) {
      toast.error("Location permission is required to submit consultation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          toast.info("Checking service availability...");

          // ----------------------------
          // 1️⃣ CHECK SERVICE AREA
          // ----------------------------
          const areaRes = await fetch(`${api}/api/consultations/check-service-area`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ lat: latitude, lng: longitude }),
          });

          if (!areaRes.ok) throw new Error("Service area check failed");

          const areaData = await areaRes.json();
          setServiceInfo(areaData);

          // ----------------------------
          // Validate type
          // ----------------------------
          if (!areaData.isServiceArea && type === "offline") {
            toast.warning(
              "You are outside the regular service area. Only online consultation is allowed."
            );
            return;
          }

          toast.info("Submitting consultation request...");

          // ----------------------------
          // 2️⃣ SUBMIT CONSULTATION
          // ----------------------------
          const submitRes = await fetch(`${api}/api/consultations/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              type,
              name,
              email,
              phone,
              eventType,
              guests,
              notes,
              isServiceArea: areaData.isServiceArea,
            }),
          });

          if (!submitRes.ok) throw new Error("Consultation submit failed");

          toast.success("Consultation request submitted successfully!");

          // Clear form
          setName("");
          setPhone("");
          setEmail("");
          setEventType("");
          setGuests("");
          setNotes("");
          setType("");

        } catch (err) {
          console.error(err);
          toast.error("Failed to submit consultation request.");
        }
      },
      () => {
        toast.warning("Please allow location access to proceed.");
      }
    );
  };


  // -----------------------------
  // 🔹 JSX
  // -----------------------------
  return (
    <div className="home">
      <Header />

      {/* HERO */}
      <section className="contact-hero" data-aos="fade-down">
        <h1>We’d Love to Hear From You!</h1>
        <p>
          Whether you're planning a wedding, festive gathering, or corporate
          event, Sujatha Caterers is here to bring your vision to life with
          exquisite South Indian vegetarian cuisine.
        </p>
      </section>

      {/* CONTACT DETAILS */}
      <section className="contact-details">
        <div className="contact-box" data-aos="fade-up">
          <FaPhoneAlt className="contact-icon" />
          <h3>Phone</h3>
          <p><a href="tel:+919703505356">+91 97035 05356</a></p>
          <p>Available 24/7</p>
        </div>

        <div className="contact-box" data-aos="fade-up" data-aos-delay="100">
          <FaWhatsapp className="contact-icon" />
          <h3>WhatsApp</h3>
          <p>
            <a
              href="https://wa.me/919703505356"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat Now
            </a>
          </p>
          <p>Instant Support</p>
        </div>

        <div className="contact-box" data-aos="fade-up" data-aos-delay="200">
          <FaEnvelope className="contact-icon" />
          <h3>Email</h3>
          <p>
            <a href="mailto:sujathameals@gmail.com">
              sujathameals@gmail.com
            </a>
          </p>
          <p>Replies within 12 hours</p>
        </div>

        <div className="contact-box" data-aos="fade-up" data-aos-delay="300">
          <FaClock className="contact-icon" />
          <h3>Business Hours</h3>
          <p>Monday – Sunday</p>
          <p>8:00 AM – 9:00 PM</p>
          <p className="info">Applicable to Meal Box</p>
        </div>

        <div className="contact-box" data-aos="fade-up" data-aos-delay="400">
          <FaMapMarkerAlt className="contact-icon" />
          <h3>Address</h3>
          <p>
            Opposite to Meenakshi Palms, Tarakarama Nagar, Srinivasa Nagar Colony,
            Guntur - 522006
          </p>
        </div>

        <div className="contact-box social" data-aos="fade-up" data-aos-delay="500">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com/share/1BCf3bKKyk/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://instagram.com/sujathacaterers" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
          </div>
        </div>
      </section>

      {/* CONSULTATION */}
      <section className="consultation-section" data-aos="fade-up">
        <h2>Request a Consultation</h2>
        <p className="section-subtext">
          Share a few details and our team will get back to you shortly.
        </p>

        <form className="consultation-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input required placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <input required placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>

          <div className="form-row">
            <input placeholder="Email (optional)" value={email} onChange={e => setEmail(e.target.value)} />
            <select required value={eventType} onChange={e => setEventType(e.target.value)}>
              <option value="">Select Event Type</option>
              <option>Wedding</option>
              <option>Pooja / Annadanam</option>
              <option>Corporate Event</option>
              <option>Housewarming</option>
              <option>Birthday / Family Event</option>
            </select>
          </div>

          <div className="form-row">
            <input placeholder="Approx Guests" value={guests} onChange={e => setGuests(e.target.value)} />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="">Consultation Type</option>
              {serviceInfo?.isServiceArea ? (
                <>
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                </>
              ) : (
                <option value="online">Online</option>
              )}
            </select>

          </div>

          <textarea
            placeholder="Additional notes (optional)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />

          <button className='cta-button' type="submit">Request Consultation</button>

          {serviceInfo && (
            <p className={`service-info ${serviceInfo.isServiceArea ? 'ok' : 'warn'}`}>
              {serviceInfo.isServiceArea
                ? `Service available (Distance: ${serviceInfo.distanceKm} km)`
                : `Outside service area (${serviceInfo.distanceKm} km). Special approval required.`}
            </p>
          )}
        </form>
      </section>

      {/* EVENTS */}
      <section className="events-section" data-aos="fade-up">
        <h2>Events We Cater</h2>
        <div className="event-chips">
          <span>Weddings</span>
          <span>Engagements</span>
          <span>Housewarming</span>
          <span>Poojas & Annadanam</span>
          <span>Corporate Events</span>
          <span>Birthday Celebrations</span>
          <span>Festival Catering</span>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section" data-aos="fade-up">
        <h2>What Our Clients Say</h2>

        <div className="testimonial-card">
          <p>“{testimonials[index].message}”</p>
          <span>
            — {testimonials[index].name}, {testimonials[index].location}
          </span>
        </div>

        <div className="testimonial-controls">
          {testimonials.map((_, i) => (
            <span
              key={i}
              className={i === index ? 'dot active' : 'dot'}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </section>

      {/* MAP */}
      <section className="map-section" data-aos="zoom-in">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3828.878551065998!2d80.40892567409921!3d16.329148632429334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a358b71d28fdfc7%3A0x7699357a26dcc9e1!2sSujatha%20Meals%20Contractors!5e0!3m2!1sen!2sin!4v1752248567560!5m2!1sen!2sin"
          width="60%"
          height="550"
          style={{ border: 0 }}
          loading="lazy"
          title="Sujatha Caterers Map"
        />
      </section>
    </div>
  );
};

export default ContactUs;
