import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Profile.css';
import Header from '../components/Header';
import logo from '../assets/logos/logo-nobg.png';
import * as htmlToImage from 'html-to-image';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [address, setAddress] = useState('');
    const [editing, setEditing] = useState(false);
    const [orders, setOrders] = useState([]);
    const [invoiceOrder, setInvoiceOrder] = useState(null);

    const invoiceRef = useRef(null);
    const closeBtnRef = useRef(null);
    const shareBtnRef = useRef(null);

    const navigate = useNavigate();
    const API = process.env.REACT_APP_API_URL;

    useEffect(() => {
        AOS.init({ duration: 800 });

        const fetchUser = async () => {
            try {
                const res = await axios.get(`${API}/api/users/me`, { withCredentials: true });
                setUser(res.data.user);
                setAddress(res.data.user.address || '');
            } catch (err) {
                console.error('User fetch failed:', err);
                navigate('/');
            }
        };

        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${API}/api/orders`, { withCredentials: true });
                if (Array.isArray(res.data.orders)) {
                    setOrders(res.data.orders);
                } else {
                    console.error('Expected an array from /api/orders, got:', res.data);
                    setOrders([]);
                }
            } catch (err) {
                console.error('Order fetch failed:', err);
                setOrders([]);
            }
        };

        fetchUser();
        fetchOrders();
    }, [API, navigate]);

    const handleSave = async () => {
        try {
            const updatedUser = {
                phone: user.phone,
                name: user.name || '',
                email: user.email || '',
                address,
            };

            const res = await axios.put(`${API}/api/users/update-profile`, updatedUser, {
                withCredentials: true,
            });
            setUser(res.data.user);
            setEditing(false);
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    const shareInvoice = async () => {
        if (!invoiceRef.current) {
            alert('Invoice not ready for sharing.');
            return;
        }

        // Hide buttons
        if (closeBtnRef.current) closeBtnRef.current.style.display = 'none';
        if (shareBtnRef.current) shareBtnRef.current.style.display = 'none';

        try {
            const dataUrl = await htmlToImage.toPng(invoiceRef.current);

            // Restore buttons visibility
            if (closeBtnRef.current) closeBtnRef.current.style.display = '';
            if (shareBtnRef.current) shareBtnRef.current.style.display = '';

            const res = await fetch(dataUrl);
            const blob = await res.blob();

            const filesArray = [
                new File([blob], 'invoice.png', {
                    type: blob.type,
                    lastModified: new Date().getTime(),
                }),
            ];

            if (navigator.canShare && navigator.canShare({ files: filesArray })) {
                await navigator.share({
                    files: filesArray,
                    title: 'Order Invoice',
                    text: 'Here is your order invoice.',
                });
            } else {
                // fallback: open image in new tab
                const win = window.open();
                if (win) {
                    win.document.write(`<img src="${dataUrl}" alt="Invoice Image"/>`);
                } else {
                    alert('Sharing not supported, but opened image in new tab.');
                }
            }
        } catch (error) {
            // Make sure to restore buttons even if error occurs
            if (closeBtnRef.current) closeBtnRef.current.style.display = '';
            if (shareBtnRef.current) shareBtnRef.current.style.display = '';

            console.error('Sharing image failed:', error);
            alert('Sharing image failed.');
        }
    };

    return (
        <div className="home">
            <Header />
            <div className="profile-container" data-aos="fade-up">
                <h2>Profile</h2>
                {user && (
                    <>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <div className="address-section" data-aos="fade-up">
                            <strong>Address</strong>
                            {editing ? (
                                <>
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        rows={3}
                                    />
                                    <div className="button-group">
                                        <button onClick={handleSave}>Save</button>
                                        <button
                                            className="cancel-btn"
                                            onClick={() => {
                                                setAddress(user.address || '');
                                                setEditing(false);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>{user.address || 'No address added yet.'}</p>
                                    <button onClick={() => setEditing(true)}>
                                        {user.address ? 'Edit Address' : 'Add Address'}
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="order-history" data-aos="fade-up">
                            <h3>Order History</h3>
                            {orders.length === 0 ? (
                                <p>No orders yet.</p>
                            ) : (
                                <ul>
                                    {orders.map((order) => (
                                        <li key={order._id} className="order-item" data-aos="zoom-in">
                                            <p><strong>Order ID:</strong> {order._id}</p>
                                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                            <p><strong>Total:</strong> ₹{order.guests * order.pricePerPerson}</p>
                                            <p><strong>Status:</strong> {order.status || 'Confirmed'}</p>
                                            <p><strong>Items:</strong> {
                                                Object.entries(order.cart || {})
                                                    .flatMap(([_, items]) => items.map(item => item.name))
                                                    .join(', ')
                                            }</p>
                                            <button
                                                className="invoice-btn"
                                                onClick={() => navigate(`/invoice/${order._id}`, { state: { order, user } })}
                                            >
                                                Show Invoice
                                            </button>

                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}

                {invoiceOrder && (
                    <div className="modal-overlay" onClick={() => setInvoiceOrder(null)}>
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                            data-aos="zoom-in"
                            ref={invoiceRef}
                        >
                            {/* Company logo at top of invoice */}
                            <img src={logo} alt="Company Logo" className="invoice-logo" />

                            <h3>Invoice - {invoiceOrder._id}</h3>
                            <p><strong>Date:</strong> {new Date(invoiceOrder.createdAt).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> {invoiceOrder.status || 'Confirmed'}</p>
                            <p><strong>Items:</strong></p>
                            <ul>
                                {Object.values(invoiceOrder.cart).flat().map((item, idx) => (
                                    <li key={idx}>{item.name}</li>
                                ))}
                            </ul>
                            <p><strong>Total:</strong> ₹{invoiceOrder.guests * invoiceOrder.pricePerPerson}</p>

                            <div className="invoice-actions">
                                <button
                                    className="close-btn"
                                    onClick={() => setInvoiceOrder(null)}
                                    ref={closeBtnRef}
                                >
                                    Close
                                </button>
                                <button
                                    className="share-btn"
                                    onClick={shareInvoice}
                                    ref={shareBtnRef}
                                >
                                    Share Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
