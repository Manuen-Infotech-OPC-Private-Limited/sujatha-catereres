import React, { useEffect } from 'react';
import './AboutUs.css';
import newLogo from '../assets/logos/newlogo.png';
import Header from '../components/Header';
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    return (
        <div className="home">
            <Header />
            <section className="about-content">
                <div className="about-container">
                    <div className="about-container-left" data-aos="fade-right">
                        <div className="about-logo">
                            <img src={newLogo} alt="Sujatha Logo" />
                        </div>
                    </div>

                    <div className="about-text" data-aos="fade-left">
                        <h1>About Us</h1>
                        <p>
                            At Sujatha Catering, we believe food is more than nourishment—it's a celebration of heritage, emotion, and experience.
                            With over <strong>23+ years of expertise</strong> in the catering industry, our team brings deep-rooted culinary knowledge
                            and consistent excellence to every event.
                        </p>

                        <p>
                            Rooted in tradition yet elevated with a touch of luxury, every dish we serve is a reflection of our values—purity, passion,
                            and perfection. From delicate spices to handpicked vegetables, our ingredients are thoughtfully sourced and prepared with the
                            highest standards of hygiene and excellence.
                        </p>

                        <h3 data-aos="fade-left">Where Tradition Meets Sophistication</h3>
                        <p>
                            Our team doesn't just serve food—we curate experiences. Whether it's a wedding, pooja, corporate gathering, or intimate
                            celebration, Sujatha Catering takes pride in delivering meals that not only satisfy the palate but create lasting impressions.
                            We handle every detail—from menu design and preparation to seamless delivery and presentation—so you can focus on enjoying the
                            occasion.
                        </p>

                        <p>
                            We are proud to offer a service that's not only rich in flavor, but effortless in execution. With Sujatha Catering, you experience
                            the ease of professionalism with the warmth of home.
                        </p>

                        <h3 data-aos="fade-left">Why Choose Sujatha Catering?</h3>
                        <div className="about-badges" data-aos="zoom-in-up">
                            <span>23+ Years of Catering Expertise</span>
                            <span>100% Authentic South Indian Vegetarian Cuisine</span>
                            <span>Elegant Presentation & Customized Menus</span>
                            <span>White-Glove Service with Personal Attention</span>
                            <span>Punctual, Hassle-Free Delivery & Setup</span>
                            <span>Uncompromised Hygiene & Quality Standards</span>
                        </div>

                        <p className="about-closing" data-aos="fade-up">
                            Whether it's the sizzle of a live dosa station or the grace of a traditional banana leaf meal, we serve not just food—but
                            meaning, memory, and magic. Sujatha Catering — Where every bite tells a story, and every event becomes unforgettable.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
