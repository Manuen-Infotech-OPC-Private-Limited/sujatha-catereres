import React, { useState } from 'react';
import './InvoiceModal.css';
import { PRICES } from '../utils/pricing';
import logo from '../assets/logos/logo-nobg.png';
import { useCart } from '../utils/cartContext';

const InvoiceModal = ({ selectedMealType, selectedPackage, onClose }) => {
    const { cart } = useCart();
    const [guestCount, setGuestCount] = useState(1);

    const pricePerPerson = PRICES[selectedMealType][selectedPackage];
    const totalPrice = guestCount * pricePerPerson;

    const handleShare = () => {
        const shareText = `
🍽️ Verified Invoice - ${selectedMealType} | ${selectedPackage} Package

Items:
${Object.entries(cart)
                .map(([category, items]) =>
                    `${category}:\n${items.map(item => `- ${item.name}`).join('\n')}`
                ).join('\n\n')}

👤 Guests: ${guestCount}
💰 Total: ₹${totalPrice}
✅ This invoice is verified. Any alteration will make it invalid.
`;

        if (navigator.share) {
            navigator.share({
                title: 'Catering Invoice',
                text: shareText,
            }).catch(console.error);
        } else {
            alert("Sharing not supported on this device.");
        }
    };

    return (
        <div className="invoice-modal-overlay">
            <div className="invoice-modal">
                <img src={logo} alt="Company Logo" className="invoice-logo" />
                <h2>Invoice Summary</h2>

                <p><strong>Meal Type:</strong> {selectedMealType}</p>
                <p><strong>Package:</strong> {selectedPackage}</p>
                <p><strong>Price per person:</strong> ₹{pricePerPerson}</p>

                <div className="guest-input">
                    <label>Number of Guests:</label>
                    <input
                        type="number"
                        value={guestCount}
                        min={1}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                    />
                </div>

                <div className="selected-items-section">
                    <h3>Selected Items</h3>
                    {Object.entries(cart).map(([category, items]) => (
                        <div key={category} className="category-block">
                            <div className="category-title">
                                {category.replace(/([A-Z])/g, ' $1')}
                            </div>
                            <div className="item-list">
                                {items.map((item) => (
                                    <div key={item.name} className="item-chip">
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>


                <hr />
                <h3>Total: ₹{totalPrice}</h3>
                <p className="verified-note">
                    ✅ This invoice is verified. Any alterations will make it invalid.
                </p>

                <div className="invoice-actions">
                    <button onClick={handleShare}>📤 Share Invoice</button>
                    <button onClick={onClose}>❌ Close</button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
