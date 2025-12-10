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
  const totalAmount = order.guests * order.pricePerPerson;

  const handleDownload = () => {
    const opt = {
      margin: 0.5,
      filename: `${user.name}-${order._id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, scrollY: 0 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(invoiceRef.current).save();
  };

  // Helper: split items into pairs for two-column layout
  const chunkArray = (arr, size = 2) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", backgroundColor: "#f0f2f5" }}>
      <div
        ref={invoiceRef}
        style={{
          maxWidth: "700px",
          margin: "auto",
          padding: "2rem",
          border: "1px solid #ddd",
          borderRadius: "10px",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <img src={logo} alt="Company Logo" style={{ maxWidth: "120px" }} />
          <div style={{ textAlign: "right" }}>
            <h3 style={{ margin: "0 0 5px 0" }}>Sujatha Caterers</h3>
            <p style={{ margin: "0", fontSize: "0.9rem" }}>Email: info@sujathacaterers.com</p>
            <p style={{ margin: "0", fontSize: "0.9rem" }}>Phone: +91-9123456789</p>
          </div>
        </div>

        <h2 style={{ textAlign: "center", margin: "0 0 1rem 0" }}>Invoice</h2>

        {/* Customer & Order Info */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div>
            <p><strong>Invoice ID:</strong> {order._id}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Address:</strong> {user.address}</p>
          </div>
          <div>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Delivery Date:</strong> {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString("en-IN") : "N/A"}</p>
            <p><strong>Meal Type:</strong> {order.selectedMealType}</p>
            <p><strong>Package:</strong> {order.selectedPackage}</p>
            <p><strong>No. of Guests:</strong> {order.guests}</p>
            <p><strong>Price / Person:</strong> ₹{order.pricePerPerson}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
        </div>

        {/* Items Table Grouped by Category - Two Columns */}
        <h3 style={{ marginTop: "1rem" }}>Package Items:</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "0.5rem" }}>
          <tbody>
            {Object.entries(order.cart).map(([category, items], catIdx) => {
              const chunks = chunkArray(items, 2);
              return (
                <React.Fragment key={category}>
                  {/* Category Header */}
                  <tr style={{ backgroundColor: "#e8f0fe" }}>
                    <td colSpan={2} style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </td>
                  </tr>
                  {/* Items Rows */}
                  {chunks.map((pair, rowIdx) => (
                    <tr key={rowIdx} style={{ backgroundColor: rowIdx % 2 === 0 ? "#fafafa" : "#fff" }}>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{pair[0]?.name || ""}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{pair[1]?.name || ""}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {/* Total */}
        <div style={{ textAlign: "right", marginTop: "1rem", fontSize: "1.2rem", fontWeight: "bold" }}>
          Package Total: ₹{totalAmount}
        </div>

        {/* Footer - Download Date */}
        <div style={{ marginTop: "2rem", fontSize: "0.75rem", color: "#555", textAlign: "right" }}>
          Invoice Download Date: {new Date().toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button onClick={() => navigate(-1)} style={{ marginRight: "1rem", padding: "0.6rem 1.2rem" }}>
          Back
        </button>
        <button
          onClick={handleDownload}
          style={{ background: "#d32f2f", color: "#fff", padding: "0.6rem 1.2rem", border: "none", borderRadius: "6px" }}
        >
          Share / Download PDF
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
