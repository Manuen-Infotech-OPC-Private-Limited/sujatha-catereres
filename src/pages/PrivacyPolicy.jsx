import React, { useEffect } from 'react';
import Header from '../components/Header';
import '../css/PrivacyPolicy.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    return (
        <div className="home">
            <Header />

            <section className="privacy-content">
                <div className="privacy-page" data-aos="fade-up">
                    <h1 className="privacy-title">Privacy Policy</h1>
                    <p className="last-updated">Last Updated: March 4, 2026</p>

                    <p>
                        At Sujatha Caterers, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our catering services.
                    </p>

                    <h2>1. Information We Collect</h2>
                    <p>We may collect information about you in a variety of ways. The information we may collect on the website includes:</p>
                    <ul>
                        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the website or when you choose to participate in various activities related to the website, such as online chat and message boards.</li>
                        <li><strong>Service Data:</strong> Information related to your catering needs, such as event type, approximate number of guests, and specific notes or requests.</li>
                        <li><strong>Technical Data:</strong> We may collect location data (with your permission) to verify service availability in your area. We also collect FCM tokens for sending push notifications regarding your orders and inquiries.</li>
                    </ul>

                    <h2>2. Use of Your Information</h2>
                    <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the website to:</p>
                    <ul>
                        <li>Create and manage your account.</li>
                        <li>Process your orders and consultation requests.</li>
                        <li>Email or call you regarding your account or order.</li>
                        <li>Verify service availability based on your location.</li>
                        <li>Send you push notifications regarding order updates and promotions.</li>
                        <li>Improve our website and services.</li>
                    </ul>

                    <h2>3. Disclosure of Your Information</h2>
                    <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
                    <ul>
                        <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
                        <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, and customer service (e.g., Firebase for authentication and notifications).</li>
                    </ul>

                    <h2>4. Security of Your Information</h2>
                    <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

                    <h2>5. Your Rights</h2>
                    <p>You have the right to access, correct, or delete your personal information. Specifically:</p>
                    <ul>
                        <li><strong>Access & Update:</strong> You can view and update your personal details (name, email, address) through your Profile page.</li>
                        <li><strong>Account Deletion:</strong> You have the right to request the deletion of your account and all associated data. To ensure the security of your data, deletion requests must be submitted through our official <Link to="/request-deletion">Data Deletion Request Form</Link>. Once your request is verified and processed, your profile, order history, and consultation requests will be permanently removed from our active databases.</li>
                    </ul>

                    <h2>6. Contact Us</h2>
                    <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
                    <div className="contact-info">
                        <p><strong>Sujatha Caterers</strong></p>
                        <p>Opposite to Meenakshi Palms, Tarakarama Nagar, Srinivasa Nagar Colony</p>
                        <p>Guntur - 522006</p>
                        <p>Phone: +91 97035 05356</p>
                        <p>Email: sujathameals@gmail.com</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
