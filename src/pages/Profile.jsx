import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Profile.css';
import Header from '../components/Header';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [address, setAddress] = useState('');
    const [editing, setEditing] = useState(false);
    const [orders, setOrders] = useState([]);

    const navigate = useNavigate();
    const API = process.env.REACT_APP_API_URL;

    // 🔔 Request Notification Permission on page load
    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    // 🔔 Browser notification helper
    const sendBrowserNotification = (title, body) => {
        if (Notification.permission === "granted") {
            new Notification(title, {
                body,
                icon: "/logo192.png" // optional icon
            });
        }
    };

    // Load user + orders
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

    // SOCKET.IO: Real-time updates
    useEffect(() => {
        if (!user?._id) return; // Wait until user is loaded

        const socket = io(API, {
            withCredentials: true,
            transports: ["polling", "websocket"],
            reconnection: true,
        });

        socket.on("connect", () => {
            console.log("Connected to Socket.IO server");
            socket.emit("register", { userId: user._id });
        });

        // 📌 Real-time STATUS UPDATE
        socket.on('orderUpdated', (updatedOrder) => {
            console.log("Order updated:", updatedOrder);

            if (String(updatedOrder.user?._id) === String(user._id)) {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === updatedOrder._id ? updatedOrder : order
                    )
                );

                // 🔔 SEND SYSTEM NOTIFICATION
                sendBrowserNotification(
                    "Sujatha Caterers • Order Update",
                    `Your order ${updatedOrder._id} is now "${updatedOrder.status}".`
                );
            }
        });

        // 📌 Real-time NEW ORDER created by this user
        socket.on('orderCreated', (newOrder) => {
            if (String(newOrder.user?._id) === String(user._id)) {
                setOrders((prevOrders) => [newOrder, ...prevOrders]);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [API, user?._id]);

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

                        {/* Address Section */}
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

                        {/* Order History */}
                        <div className="order-history" data-aos="fade-up">
                            <h3>Order History</h3>

                            {orders.length === 0 ? (
                                <p>No orders yet.</p>
                            ) : (
                                <ul>
                                    {orders.map((order) => (
                                        <li key={order._id} className="order-item" data-aos="fade">
                                            <p><strong>Order ID:</strong> {order._id}</p>
                                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                            <p><strong>Total:</strong> ₹{order.total}</p>

                                            <p>
                                                <strong>Status:</strong>
                                                <span className={`status-label ${order.status}`}>
                                                    {order.status}
                                                </span>
                                            </p>

                                            <p>
                                                <strong>Items:</strong>{" "}
                                                {Object.values(order.cart || {})
                                                    .flat()
                                                    .map((item) => item.name)
                                                    .join(", ")}
                                            </p>

                                            <button
                                                className="invoice-btn"
                                                onClick={() =>
                                                    navigate(`/invoice/${order._id}`, { state: { order, user } })
                                                }
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
            </div>
        </div>
    );
};

export default Profile;
