import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import Header from '../components/Header';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [address, setAddress] = useState('');
    const [editing, setEditing] = useState(false);
    const [orders, setOrders] = useState([]); // Simulated order data
    const [invoiceOrder, setInvoiceOrder] = useState(null); // Track which invoice to show
    const navigate = useNavigate();

    const API = process.env.api_url;
    // const API = import.meta.env.VITE_API_URL;


    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        const userObj = JSON.parse(storedUser);
        setUser(userObj);

        axios
            .get(`${API}/api/users/${userObj._id}`)
            .then((res) => {
                setUser(res.data);
                setAddress(res.data.address || '');
            })
            .catch((err) => console.error('Fetch user failed:', err));

        // Simulate fetching order history
        const fakeOrders = [
            {
                id: 'ORD001',
                date: '2025-07-10',
                total: '₹980',
                status: 'Delivered',
                items: ['T-shirt', 'Cap'],
            },
            {
                id: 'ORD002',
                date: '2025-07-02',
                total: '₹475',
                status: 'Shipped',
                items: ['Notebook', 'Pen'],
            },
        ];
        setOrders(fakeOrders);
    }, [API, navigate]);

    const handleSave = async () => {
        try {
            const res = await axios.put(`${API}/api/users/${user._id}/address`, { address });
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            setEditing(false);
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    return (
        <div className='home'>
            <Header />
            <div className="profile-container">
                <h2>Profile</h2>
                {user && (
                    <>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <div className="address-section">
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

                        {/* Order History Section */}
                        <div className="order-history">
                            <h3>Order History</h3>
                            {orders.length === 0 ? (
                                <p>No orders yet.</p>
                            ) : (
                                <ul>
                                    {orders.map((order) => (
                                        <li key={order.id} className="order-item">
                                            <p><strong>Order ID:</strong> {order.id}</p>
                                            <p><strong>Date:</strong> {order.date}</p>
                                            <p><strong>Total:</strong> {order.total}</p>
                                            <p><strong>Status:</strong> {order.status}</p>
                                            <p><strong>Items:</strong> {order.items.join(', ')}</p>
                                            <button
                                                className="invoice-btn"
                                                onClick={() => setInvoiceOrder(order)}
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

                {/* Invoice Modal */}
                {invoiceOrder && (
                    <div className="modal-overlay" onClick={() => setInvoiceOrder(null)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h3>Invoice - {invoiceOrder.id}</h3>
                            <p><strong>Date:</strong> {invoiceOrder.date}</p>
                            <p><strong>Status:</strong> {invoiceOrder.status}</p>
                            <p><strong>Items:</strong></p>
                            <ul>
                                {invoiceOrder.items.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                            <p><strong>Total:</strong> {invoiceOrder.total}</p>
                            <button className="close-btn" onClick={() => setInvoiceOrder(null)}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
};

export default Profile;
