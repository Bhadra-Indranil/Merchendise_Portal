import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { loadRazorpay } from "../lib/razorpay";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      // Construct address from user profile
      const address = `${user.address || ""}, ${user.city || ""}, ${
        user.state || ""
      } - ${user.pincode || ""}`;
      setShippingAddress(address);
      setUserProfile(user);
    }
  }, [user]);

  async function handlePayment() {
    if (items.length === 0) {
      setMessage("Your cart is empty");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      const ok = await loadRazorpay();
      if (!ok) {
        setMessage("Failed to load payment gateway");
        setLoading(false);
        return;
      }

      const groupOrder = items.find(item => item.groupOrder)?.groupOrder;

      const { data } = await api.post("/payments/create-order", {
        amount: total,
        items: items.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          customization: item.customization,
        })),
        groupOrder,
        shippingAddress,
      });

      const { razorpayOrder, order, keyId } = data;

      const options = {
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Merch Portal",
        description: `Order for ${items.length} item(s)`,
        order_id: razorpayOrder.id,
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "+919876543210",
        },
        handler: async function (response: any) {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            });

            setMessage("Payment successful! Order placed.");
            clear();
            setTimeout(() => {
              navigate("/orders");
            }, 2000);
          } catch (err: any) {
            setMessage(
              err?.response?.data?.message || "Payment verification failed"
            );
          }
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Checkout</h1>
        </div>

        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to proceed with checkout!</p>
          <button onClick={() => navigate("/products")} className="btn mt-2">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">Review your order and complete payment</p>
      </div>

      <div className="card-grid">
        <div className="card">
          <h3 className="mb-2">Order Items</h3>

          {items.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">
                  ₹ {item.unitPrice} × {item.quantity} = ₹{" "}
                  {item.unitPrice * item.quantity}
                </div>
                {item.customization && item.customization.note && (
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Customization: {item.customization.note}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="cart-total">Total: ₹ {total}</div>
        </div>

        <div className="card">
          <h3 className="mb-2">Shipping Information</h3>

          {userProfile && (
            <div
              className="mb-2"
              style={{
                padding: "1rem",
                background: "#f9fafb",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
              }}
            >
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: "#374151",
                }}
              >
                Default Address from Profile:
              </h4>
              <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                <div>
                  <strong>{userProfile.name}</strong>
                </div>
                <div>{userProfile.address}</div>
                <div>
                  {userProfile.city}, {userProfile.state} -{" "}
                  {userProfile.pincode}
                </div>
                <div>Phone: {userProfile.phone}</div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Shipping Address</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Enter your complete shipping address..."
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
            <div
              style={{
                fontSize: "0.8rem",
                color: "#6b7280",
                marginTop: "0.25rem",
              }}
            >
              You can modify the address above if needed for this order
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <div
              style={{
                padding: "1rem",
                background: "#f9fafb",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <span>💳</span>
                <span>Razorpay (Cards, UPI, Net Banking)</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading || !shippingAddress.trim()}
            className="btn"
            style={{ width: "100%" }}
          >
            {loading ? "Processing..." : `Pay ₹ ${total}`}
          </button>

          {message && (
            <div
              className={
                message.includes("successful")
                  ? "form-success mt-2"
                  : "form-error mt-2"
              }
            >
              {message}
            </div>
          )}

          <div className="mt-2">
            <button
              onClick={() => navigate("/cart")}
              className="btn btn-outline"
              style={{ width: "100%" }}
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
