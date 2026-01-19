import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../css/Profile.css';
import Header from '../components/Header';
// import { useSocket } from '../utils/SocketContext'; // ✅ Import global socket

const Profile = () => {
    const [user, setUser] = useState(null);
    const [address, setAddress] = useState('');
    const [editing, setEditing] = useState(false);
    const [orders, setOrders] = useState([]);

    const navigate = useNavigate();
    const API = process.env.REACT_APP_API_URL;
    // const { socket } = useSocket(); // ✅ Destructure socket from context

    // 🔔 Request Notification Permission on page load
    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    // 🔔 Browser notification helper
    const sendBrowserNotification = (title, body) => {
        if (!("Notification" in window)) return;
        try {
            if (Notification.permission === "granted") {
                new Notification(title, {
                    body,
                    icon: "/logo192.png"
                });
            }
        } catch (e) {
            console.warn("Notification API failed:", e);
        }
    };

    // Handle partial payments
    const handlePayRemaining = async (order, amount) => {
        if (!window.Razorpay) {
            alert("Razorpay SDK not loaded");
            return;
        }

        try {
            const res = await axios.post(
                `${API}/api/payments/create-razorpay-order`,
                { amount },
                { withCredentials: true }
            );

            const orderData = res.data;
            if (!orderData?.orderId) throw new Error("Failed to create Razorpay order");

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: "INR",
                name: "Sujatha Caterers",
                order_id: orderData.orderId,
                handler: async (response) => {
                    try {
                        const finalizeRes = await axios.post(
                            `${API}/api/orders/${order._id}/repay`,
                            {
                                payment: {
                                    orderId: orderData.orderId,
                                    paymentId: response.razorpay_payment_id,
                                    signature: response.razorpay_signature,
                                    amount,
                                },
                            },
                            { withCredentials: true }
                        );

                        const updatedOrder = finalizeRes.data.order;
                        setOrders((prev) =>
                            prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
                        );

                        sendBrowserNotification(
                            "Sujatha Caterers • Payment Successful",
                            `Your remaining amount of ₹${amount} has been paid successfully.`
                        );
                    } catch (err) {
                        console.error("Error finalizing payment:", err);
                        alert("Payment succeeded, but updating order failed.");
                    }
                },
                theme: { color: "#0f766e" },
            };

            new window.Razorpay(options).open();
        } catch (err) {
            console.error("Error creating Razorpay order:", err);
            alert("Failed to initiate payment");
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

    // ✅ Listen to global socket events
    // useEffect(() => {
    //     if (!socket || !user?._id) return;

    //     const handleOrderUpdate = (updatedOrder) => {
    //         if (String(updatedOrder.user?._id) === String(user._id)) {
    //             setOrders((prevOrders) =>
    //                 prevOrders.map((order) =>
    //                     order._id === updatedOrder._id ? updatedOrder : order
    //                 )
    //             );

    //             sendBrowserNotification(
    //                 "Sujatha Caterers • Order Update",
    //                 `Your order ${updatedOrder._id} is now "${updatedOrder.status}".`
    //             );
    //         }
    //     };

    //     const handleNewOrder = (newOrder) => {
    //         if (String(newOrder.user?._id) === String(user._id)) {
    //             setOrders((prevOrders) => [newOrder, ...prevOrders]);
    //         }
    //     };

    //     socket.on('orderUpdated', handleOrderUpdate);
    //     socket.on('orderCreated', handleNewOrder);

    //     return () => {
    //         socket.off('orderUpdated', handleOrderUpdate);
    //         socket.off('orderCreated', handleNewOrder);
    //     };
    // }, [socket, user?._id]);

    // Save profile changes
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
                                <div className="orders-list">
                                    {orders.map((order) => {
                                        const remainingAmount = order.total - (order.payment?.amount || 0);

                                        let itemList = [];
                                        if (order.orderType === "catering") {
                                            itemList = Object.values(order.cart || {})
                                                .flat()
                                                .map((item) => item.name);
                                        } else if (order.orderType === "mealbox") {
                                            itemList = order.mealBox?.items || [];
                                        }

                                        return (
                                            <div key={order._id} className="order-item">
                                                <p><strong>Order ID:</strong> {order._id}</p>
                                                <p><strong>Type:</strong> {order.orderType}</p>
                                                {order.orderType === "mealbox" ? <p><strong>Quantity: {order.mealBox.quantity}</strong></p> :
                                                    <p><strong>No of Guests:</strong> {order.guests}</p>
                                                }
                                                <p><strong>Ordered Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                                <p><strong>Total:</strong> ₹{order.total}</p>
                                                <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
                                                <p><strong>Delivery Addr:</strong> {order.deliveryLocation.address}</p>

                                                {order.payment && (
                                                    <div className="payment-card">
                                                        <h4>Payment Details</h4>

                                                        <p>
                                                            Your payment was made using <strong>{order.payment.provider}</strong>.{" "}
                                                            {order.payment.status === "paid" && (
                                                                <>
                                                                    The payment has been <strong>successfully completed</strong>, and an amount
                                                                    of <strong>₹{order.payment.amount}</strong> was received on{" "}
                                                                    <strong>{new Date(order.payment.paidAt).toLocaleString()}</strong>.
                                                                </>
                                                            )}

                                                            {order.payment.status === "partial" && (
                                                                <>
                                                                    A <strong>partial payment</strong> of{" "}
                                                                    <strong>₹{order.payment.amount}</strong> was received on{" "}
                                                                    <strong>{new Date(order.payment.paidAt).toLocaleString()}</strong>.{" "}
                                                                    The remaining balance can be paid at your convenience.
                                                                </>
                                                            )}

                                                            {order.payment.status === "failed" && (
                                                                <>
                                                                    Unfortunately, the payment attempt was <strong>unsuccessful</strong>. Please
                                                                    try again to complete your order.
                                                                </>
                                                            )}
                                                        </p>

                                                        {order.payment.status === "partial" && remainingAmount > 0 && (
                                                            <button
                                                                className="repay-btn"
                                                                onClick={() => handlePayRemaining(order, remainingAmount)}
                                                            >
                                                                Pay Remaining ₹{remainingAmount}
                                                            </button>
                                                        )}
                                                    </div>

                                                )}

                                                <p>
                                                    <strong>Order Status:</strong>{" "}
                                                    <span className={`status-label ${order.status}`}>
                                                        {order.status}
                                                    </span>
                                                </p>

                                                <p>
                                                    <strong>Items:</strong> {itemList.join(", ")}
                                                </p>

                                                <button
                                                    className="invoice-btn"
                                                    onClick={() =>
                                                        navigate(`/invoice/${order._id}`, { state: { order, user } })
                                                    }
                                                >
                                                    Show Invoice
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
