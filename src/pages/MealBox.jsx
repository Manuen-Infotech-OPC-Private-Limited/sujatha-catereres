import React, { useState } from 'react';
import Header from '../components/Header';
import '../css/MealBox.css';
import mealBoxImg from '../assets/logos/new_mealbox.png';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../utils/AuthContext'; // ✅ new import

const MealBox = () => {
  const { user } = useAuthContext(); // ✅ get logged-in user

  const PRICE_PER_BOX = 179;
  const TAX_RATE = 0.09; // 9% CGST + 9% SGST
  const MIN_QTY = 5;
  const MAX_QTY = 15;

  const API = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(MIN_QTY);
  const [loading, setLoading] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const menuItems = [
    'Sweet', 'Veg Roll', 'Veg Biryani', 'Veg Kurma', 'Raitha',
    'Tomato Pappu', 'Fry', 'Curry', 'Rice', 'Ghee',
    'Pickle', 'Papad', 'Sambar', 'Curd', 'Salt', 'Water', 'Napkins'
  ];

  const increment = () => quantity < MAX_QTY && setQuantity(q => q + 1);
  const decrement = () => quantity > MIN_QTY && setQuantity(q => q - 1);

  const subTotal = PRICE_PER_BOX * quantity;
  const cgst = Math.round(subTotal * TAX_RATE);
  const sgst = Math.round(subTotal * TAX_RATE);
  const totalPrice = subTotal + cgst + sgst;


  const sendBrowserNotification = (title, body) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/logo192.png",
      });
    }
  };

  // --------------------------------------------------
  // PAYMENT + ORDER
  // --------------------------------------------------
  const handleOrder = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/payments/create-razorpay-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: totalPrice }),
      });

      const data = await res.json();
      if (!data?.orderId) throw new Error();

      const options = {
        key: data.key,
        amount: data.amount,
        currency: 'INR',
        name: 'Sujatha Caterers',
        description: 'South Indian Veg Meal Box',
        order_id: data.orderId,
        theme: { color: '#0f766e' },

        // ✅ SUCCESS
        handler: async (response) => {
          sendBrowserNotification(
            "Sujatha Caterers • Payment Successful",
            `Your payment of ₹${totalPrice} was completed successfully.`
          );
          await placeMealBoxOrder(response, data.orderId);
        },

        // ❌ PAYMENT FAILED
        modal: {
          ondismiss: () => {
            sendBrowserNotification(
              "Sujatha Caterers • Payment Cancelled",
              "You closed the payment window. You can retry anytime."
            );

            toast.info('Payment cancelled. You can try again.');
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      // ❌ PAYMENT FAILURE EVENT
      razorpay.on('payment.failed', (response) => {
        sendBrowserNotification(
          "Sujatha Caterers • Payment Failed",
          response.error?.description || "Payment could not be completed. Please try again."
        );
        console.error('Payment failed:', response);
        toast.error(response.error?.description || 'Payment failed');
        setLoading(false);
      });

      razorpay.open();
    } catch (err) {
      console.error(err);
      toast.error('Payment initiation failed');
      setLoading(false);
    }
  };


  // --------------------------------------------------
  // FINALIZE ORDER
  // --------------------------------------------------
  const placeMealBoxOrder = async (paymentResponse, razorpayOrderId) => {
    try {
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderType: 'mealbox',
          mealBox: {
            quantity,
            pricePerBox: PRICE_PER_BOX,
            items: menuItems,
            taxes: { cgst, sgst },
          },
          deliveryLocation: {
            address: user?.address || '', // ✅ fallback if address not set,
          },
          payment: {
            orderId: razorpayOrderId,
            paymentId: paymentResponse.razorpay_payment_id,
            signature: paymentResponse.razorpay_signature,
            amount: totalPrice,
          },
        }),
      });

      if (!res.ok) throw new Error();
      setTimeout(() => {
        navigate('/');
      }, 500);
      toast.success('Meal Box order placed successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Order placement failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <Header />

      <section className="mealbox-container">
        <div className="mealbox-image">
          <img src={mealBoxImg} alt="South Indian Veg Meal Box" />
        </div>

        <div className="mealbox-details">
          <h1>South Indian Veg Meal Box</h1>

          <p className="description">
            Authentic South Indian vegetarian meal prepared with fresh ingredients.
            Ideal for office lunches, poojas, and small events.
          </p>

          <div className="menu-items">
            <h2>What’s Inside</h2>
            <div className="chips">
              {menuItems.map((item, idx) => (
                <span key={idx} className="chip">{item}</span>
              ))}
            </div>
          </div>

          <p className="note">
            <strong>Note:</strong> Fry and curry items vary daily.
          </p>

          {/* ---------------- ORDER CARD ---------------- */}
          <div className="order-card">

            {!showOrderDetails ? (
              /* STEP 1: Order button only */
              <button
                className="cta-button"
                onClick={() => setShowOrderDetails(true)}
              >
                Order Meal Box
              </button>
            ) : (
              /* STEP 2: Reveal pricing & payment */
              <>
                <div className="price-breakdown">
                  <div className="row">
                    <span>Price per box:</span>
                    <strong>₹{PRICE_PER_BOX}</strong>
                  </div>
                  <div className="row">
                    <span>Quantity:</span>
                    <strong>{quantity}</strong>
                  </div>
                  <div className="row">
                    <span>Subtotal:</span>
                    <strong>₹{subTotal}</strong>
                  </div>
                  <div className="row">
                    <span>CGST (9%):</span>
                    <strong>₹{cgst}</strong>
                  </div>
                  <div className="row">
                    <span>SGST (9%):</span>
                    <strong>₹{sgst}</strong>
                  </div>
                  <div className="row total">
                    <span>Total:</span>
                    <strong>₹{totalPrice}</strong>
                  </div>
                </div>

                <div className="quantity-selector">
                  <button onClick={decrement} disabled={quantity === MIN_QTY}>−</button>
                  <span>{quantity}</span>
                  <button onClick={increment} disabled={quantity === MAX_QTY}>+</button>
                </div>

                <button
                  className="cta-button"
                  onClick={handleOrder}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Pay ₹${totalPrice}`}
                </button>
              </>
            )}

          </div>
        </div>
      </section>
    </div>
  );
};

export default MealBox;
