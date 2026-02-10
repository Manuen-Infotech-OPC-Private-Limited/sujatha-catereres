import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import '../css/MealBox.css';
import mealBoxImg from '../assets/logos/new_mealbox.png';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../utils/AuthContext'; // ✅ get logged-in user

const PICKUP_LOCATIONS = [
  "Taraka Rama Nagar - 10th Line",
  "Tanvika Function Hall - Ala Hospital Backside",
  "Sujatha Convention - Vidya Nagar Main Road",
  "Near SBI Bank, Pattabhipuram",
  "Sujatha Caterers Main Kitchen, Guntur"
];

const MealBox = () => {
  const { user } = useAuthContext(); // ✅ get logged-in user

  const [selectedVariant, setSelectedVariant] = useState(199);
  const [deliveryMode, setDeliveryMode] = useState('pickup'); // 'pickup' | 'door'
  
  const TAX_RATE = 0.025; // 2.5% CGST + 2.5% SGST = 5% Total
  const MIN_QTY = 1;
  const MAX_QTY = 15;

  const API = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(MIN_QTY);
  const [loading, setLoading] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // New State for Delivery
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState({
    address: '',
    landmark: '',
    city: '',
    pincode: '',
  });

  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDateObj = new Date();
  maxDateObj.setMonth(maxDateObj.getMonth() + 3);
  const maxDate = maxDateObj.toISOString().split('T')[0];


  useEffect(() => {
    if (user && deliveryMode === 'door') {
      setDeliveryLocation((prev) => ({
        ...prev,
        address: user.address || '',
      }));
    } else if (deliveryMode === 'pickup') {
       // Reset or set to default pickup? 
       // We'll handle pickup selection separately
       setDeliveryLocation({
           address: PICKUP_LOCATIONS[0],
           landmark: 'Pickup Point',
           city: 'Guntur',
           pincode: '522001' 
       });
    }
  }, [user, deliveryMode]);

  // Variant Menu Logic
  const baseItems = [
    'Sweet', 'Veg Roll', 
    'Tomato Pappu', 'Fry', 'Curry', 'Rice', 'Ghee',
    'Pickle', 'Papad', 'Sambar', 'Curd', 'Salt', 'Water', 'Napkins'
  ];

  const variantItems = selectedVariant === 199 
    ? ['Veg Biryani', 'Veg Kurma', 'Raitha'] 
    : ['Pulihora']; // 179 Variant replaces Biryani/Kurma/Raita with Pulihora

  const menuItems = [...baseItems, ...variantItems];

  const increment = () => quantity < MAX_QTY && setQuantity(q => q + 1);
  const decrement = () => quantity > MIN_QTY && setQuantity(q => q - 1);

  const subTotal = selectedVariant * quantity;
  const cgst = Math.round(subTotal * TAX_RATE);
  const sgst = Math.round(subTotal * TAX_RATE);
  const totalPrice = subTotal + cgst + sgst;


  const sendBrowserNotification = (title, body) => {
    if (!("Notification" in window)) return;

    try {
      if (Notification.permission === "granted") {
        new Notification(title, {
          body,
          icon: "/logo192.png",
        });
      }
    } catch (e) {
      console.warn("Notification API failed:", e);
    }
  };

  // --------------------------------------------------
  // PAYMENT + ORDER
  // --------------------------------------------------
  const handleOrder = async () => {
    // Validations
    if (!deliveryDate) {
      toast.error('Please select a delivery date');
      return;
    }

    const selectedDate = new Date(deliveryDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (selectedDate < now) {
      toast.error('Delivery date cannot be in the past');
      return;
    }

    if (deliveryMode === 'door') {
        if (!deliveryLocation.address) {
            toast.error('Please enter delivery address');
            return;
        }
        if (!deliveryLocation.city) {
            toast.error('Please enter city');
            return;
        }
        if (!/^\d{6}$/.test(deliveryLocation.pincode)) {
            toast.error('Please enter a valid 6-digit pincode');
            return;
        }
    }

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
            pricePerBox: selectedVariant,
            items: menuItems,
            taxes: { cgst, sgst },
            variant: selectedVariant === 199 ? 'Premium (199)' : 'Classic (179)',
            deliveryMode
          },
          deliveryDate, // ✅ Send delivery date
          deliveryLocation, // ✅ Send full delivery location
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

          {/* Variant Selector */}
          <div className="variant-selector">
              <label className={`variant-option ${selectedVariant === 199 ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="variant" 
                    value={199} 
                    checked={selectedVariant === 199}
                    onChange={() => setSelectedVariant(199)}
                  />
                  <span>
                      <strong>Premium (₹199)</strong>
                      <small>Includes Veg Biryani, Kurma, Raita</small>
                  </span>
              </label>
              <label className={`variant-option ${selectedVariant === 179 ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="variant" 
                    value={179} 
                    checked={selectedVariant === 179}
                    onChange={() => setSelectedVariant(179)}
                  />
                  <span>
                      <strong>Classic (₹179)</strong>
                      <small>Replaces Biryani with Pulihora</small>
                  </span>
              </label>
          </div>

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
                    <strong>₹{selectedVariant}</strong>
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
                    <span>CGST (2.5%):</span>
                    <strong>₹{cgst}</strong>
                  </div>
                  <div className="row">
                    <span>SGST (2.5%):</span>
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

                {/* Delivery Date */}
                <div className="">
                  <label>Delivery Date</label>
                  <input
                    type="date"
                    min={minDate}
                    max={maxDate}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>

                {/* Delivery Mode Toggle */}
                <div className="delivery-mode-toggle">
                    <label>
                        <input 
                            type="radio" 
                            name="deliveryMode" 
                            value="pickup" 
                            checked={deliveryMode === 'pickup'}
                            onChange={() => setDeliveryMode('pickup')}
                        />
                        Pickup
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="deliveryMode" 
                            value="door" 
                            checked={deliveryMode === 'door'}
                            onChange={() => setDeliveryMode('door')}
                        />
                        Door Delivery
                    </label>
                </div>

                {/* Conditional Location Input */}
                {deliveryMode === 'pickup' ? (
                    <div className="pickup-locations">
                        <label>Select Pickup Location:</label>
                        <select 
                            value={deliveryLocation.address} 
                            onChange={(e) => setDeliveryLocation({
                                ...deliveryLocation,
                                address: e.target.value,
                                landmark: 'Pickup Point',
                                city: 'Guntur'
                            })}
                        >
                            {PICKUP_LOCATIONS.map((loc, idx) => (
                                <option key={idx} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div className="input-group">
                        <div className="info-banner" style={{background:'#e3f2fd', padding:'10px', borderRadius:'5px', marginBottom:'10px', fontSize:'0.9rem', color:'#0d47a1'}}>
                            <i className="fas fa-info-circle"></i> Delivery will be done via Rapido Parcel. <strong>Delivery charges are to be paid by you directly to the rider.</strong>
                        </div>
                        <label>Delivery Location</label>
                        <input
                            type="text"
                            placeholder="Full Address"
                            value={deliveryLocation.address}
                            onChange={(e) =>
                            setDeliveryLocation({ ...deliveryLocation, address: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Landmark (optional)"
                            value={deliveryLocation.landmark}
                            onChange={(e) =>
                            setDeliveryLocation({ ...deliveryLocation, landmark: e.target.value })
                            }
                            style={{ marginTop: '0.5rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <input
                            type="text"
                            placeholder="City"
                            value={deliveryLocation.city}
                            onChange={(e) =>
                                setDeliveryLocation({ ...deliveryLocation, city: e.target.value })
                            }
                            style={{ flex: 1 }}
                            />
                            <input
                            type="tel"
                            placeholder="Pincode"
                            maxLength={6}
                            value={deliveryLocation.pincode}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length <= 6) {
                                setDeliveryLocation({ ...deliveryLocation, pincode: val });
                                }
                            }}
                            style={{ flex: 1 }}
                            />
                        </div>
                    </div>
                )}

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