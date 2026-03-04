import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import '../css/DataDeletion.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

const DataDeletionRequest = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [reason, setReason] = useState('');
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
            const res = await axios.post(`${API}/api/users/request-deletion`, {
                name,
                phone,
                email,
                reason
            });

            toast.success(res.data.message || "Request submitted successfully.");
            navigate('/');
        } catch (err) {
            console.error('Deletion request failed:', err);
            toast.error(err.response?.data?.error || "Failed to submit request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home">
            <Header />

            <div className="deletion-request-container">
                <div className="deletion-card" data-aos="fade-up">
                    <h1>Request Data Deletion</h1>
                    <p className="deletion-subtitle">
                        Please fill out this form to request the permanent deletion of your account and all associated personal data from Sujatha Caterers.
                    </p>

                    <form className="deletion-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                required 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                placeholder="Your registered name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input 
                                type="tel" 
                                required 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                                placeholder="Your registered phone number"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address (Optional)</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Your registered email"
                            />
                        </div>

                        <div className="form-group">
                            <label>Reason for Deletion (Optional)</label>
                            <textarea 
                                value={reason} 
                                onChange={(e) => setReason(e.target.value)} 
                                placeholder="Help us improve by sharing why you're leaving"
                                rows={4}
                            />
                        </div>

                        <div className="deletion-notice">
                            <p><strong>Notice:</strong> Once your request is processed, your profile, order history, and consultation requests will be permanently removed. This action cannot be reversed.</p>
                        </div>

                        <button className="submit-deletion-btn" type="submit" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Deletion Request"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DataDeletionRequest;
