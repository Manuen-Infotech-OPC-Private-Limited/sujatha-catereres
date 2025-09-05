import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import logo from "../assets/logos/logo-nobg.png";

const InvoicePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const invoiceRef = useRef();

  if (!state || !state.order || !state.user) {
    return <p>No invoice data available</p>;
  }

  const { order, user } = state;

  const handleDownload = () => {
    const opt = {
      margin: 0.5,
      filename: `${user.name}-${order._id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(invoiceRef.current).save();
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <div ref={invoiceRef} style={{ maxWidth: "600px", margin: "auto", padding: "2rem", border: "1px solid #ddd", borderRadius: "10px" }}>
        <img src={logo} alt="Company Logo" style={{ maxWidth: "120px", display: "block", margin: "0 auto 20px" }} />
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Invoice</h2>

        <p><strong>Invoice ID:</strong> {order._id}</p>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Delivery Date:</strong> {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString("en-IN") : "N/A"}</p>

        <p><strong>Meal Type:</strong> {order.selectedMealType}</p>
        <p><strong>Package:</strong> {order.selectedPackage}</p>
        <p><strong>No. of Guests:</strong> {order.guests}</p>
        <p><strong>Price per Plate:</strong> ₹{order.pricePerPerson}</p>

        <h3>Items Ordered</h3>
        <ul>
          {Object.values(order.cart).flat().map((item, idx) => (
            <li key={idx}>{item.name}</li>
          ))}
        </ul>

        <h3>Total: ₹{order.guests * order.pricePerPerson}</h3>
      </div>

      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button onClick={() => navigate(-1)} style={{ marginRight: "1rem", padding: "0.6rem 1.2rem" }}>
          Back
        </button>
        <button onClick={handleDownload} style={{ background: "#d32f2f", color: "#fff", padding: "0.6rem 1.2rem", border: "none", borderRadius: "6px" }}>
          Share / Download PDF
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
