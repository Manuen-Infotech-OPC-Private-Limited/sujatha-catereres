import React, { useEffect } from 'react';
import '../css/AboutUs.css';
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
                <div className="about-page" data-aos="fade-up">
                    <h1 className="about-title">About Us</h1>

                    {/* Image aligned top-right like a textbook illustration */}
                    <div className="about-figure" data-aos="fade-left">
                        <img src={newLogo} alt="Sujatha Catering Logo" />
                        <span className="figure-caption">
                            Sujatha Catering — Serving Tradition with Grace
                        </span>
                    </div>

                    <p>
                        At Sujatha Catering, we believe food is more than nourishment—it's a
                        celebration of heritage, emotion, and experience. With over
                        <strong> 23+ years of expertise</strong> in the catering industry,
                        our team brings deep-rooted culinary knowledge and consistent
                        excellence to every event.
                    </p>

                    <p>
                        Rooted in tradition yet elevated with a touch of luxury, every dish
                        we serve is a reflection of our values—purity, passion, and
                        perfection. From delicate spices to handpicked vegetables, our
                        ingredients are thoughtfully sourced and prepared with uncompromised
                        hygiene and care.
                    </p>

                    <h2>Where Tradition Meets Sophistication</h2>

                    <p>
                        Our team doesn’t just serve food—we curate experiences. Whether it’s
                        a wedding, pooja, corporate gathering, or intimate celebration,
                        Sujatha Catering takes pride in delivering meals that create lasting
                        impressions.
                    </p>

                    <p>
                        From menu design and preparation to seamless delivery and elegant
                        presentation, we handle every detail so you can remain present in
                        the moment.
                    </p>

                    <h2>Why Choose Sujatha Catering?</h2>

                    <div className="about-chips" data-aos="fade-up">
                        <span>23+ Years of Catering Expertise</span>
                        <span>100% Authentic South Indian Vegetarian Cuisine</span>
                        <span>Customized Menus with Elegant Presentation</span>
                        <span>White-Glove Service & Personal Attention</span>
                        <span>Punctual, Hassle-Free Setup & Delivery</span>
                        <span>Uncompromised Hygiene & Quality Standards</span>
                    </div>


                    <p className="about-closing">
                        Whether it’s the sizzle of a live dosa station or the grace of a
                        traditional banana leaf meal, we serve not just food—but meaning,
                        memory, and magic.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default About;
