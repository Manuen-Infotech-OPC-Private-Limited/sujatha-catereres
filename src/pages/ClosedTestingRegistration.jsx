import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import '../css/ClosedTesting.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ClosedTestingRegistration = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [deviceType, setDeviceType] = useState('Android');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const API = process.env.REACT_APP_API_URL;

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(`${API}/api/testing/register`, {
                name,
                email,
                phone,
                deviceType
            });

            toast.success(res.data.message || "Registration successful!");
            navigate('/');
        } catch (err) {
            console.error('Testing registration failed:', err);
            toast.error(err.response?.data?.error || "Failed to process registration. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home">
            <Header />

            <div className="testing-registration-container">
                <div className="testing-card" data-aos="zoom-in">
                    <h1>Join our Closed Testing</h1>
                    <p className="testing-subtitle">
                        Be among the first to experience the new Sujatha Caterers app. Help us build the perfect catering experience.
                    </p>

                    <form className="testing-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                required 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="yourname@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input 
                                type="tel" 
                                required 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                                placeholder="+91 00000 00000"
                            />
                        </div>

                        <div className="form-group">
                            <label>Primary Device for Testing</label>
                            <select 
                                value={deviceType} 
                                onChange={(e) => setDeviceType(e.target.value)}
                                required
                            >
                                <option value="Android">Android Smartphone</option>
                                <option value="iOS">iPhone (iOS)</option>
                                <option value="Web">Web Browser</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="testing-benefits">
                            <h3>Why join?</h3>
                            <ul>
                                <li>Early access to new features</li>
                                <li>Direct communication with our developers</li>
                                <li>Help shape the future of our app</li>
                            </ul>
                        </div>

                        <button className="submit-testing-btn" type="submit" disabled={loading}>
                            {loading ? "Registering..." : "Apply for Closed Testing"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClosedTestingRegistration;
