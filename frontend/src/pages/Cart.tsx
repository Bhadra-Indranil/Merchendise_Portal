import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { items, total, count, removeItem, clear } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Shopping Cart</h1>
        </div>
        
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started!</p>
          <button onClick={() => navigate('/products')} className="btn mt-2">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Shopping Cart ({count} items)</h1>
      </div>

      <div className="card-grid">
        <div className="card">
          <h3 className="mb-2">Cart Items</h3>
          
          {items.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">
                  ₹ {item.unitPrice} × {item.quantity} = ₹ {item.unitPrice * item.quantity}
                </div>
                {item.customization && item.customization.note && (
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Customization: {item.customization.note}
                  </div>
                )}
              </div>
              <button 
                onClick={() => removeItem(index)}
                className="btn btn-danger"
              >
                Remove
              </button>
            </div>
          ))}
          
          <div className="cart-total">
            Total: ₹ {total}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              onClick={() => navigate('/checkout')}
              className="btn"
              style={{ flex: 1 }}
            >
              Proceed to Checkout
            </button>
            <button onClick={clear} className="btn btn-secondary">
              Clear Cart
            </button>
          </div>
        </div>
        
        <div className="card">
          <h3 className="mb-2">Order Summary</h3>
          <div className="order-details">
            <div className="order-detail">
              <strong>Items:</strong> {count}
            </div>
            <div className="order-detail">
              <strong>Subtotal:</strong> ₹ {total}
            </div>
            <div className="order-detail">
              <strong>Shipping:</strong> Free
            </div>
            <div className="order-detail">
              <strong>Total:</strong> ₹ {total}
            </div>
          </div>
          
          <div className="mt-2">
            <button 
              onClick={() => navigate('/products')}
              className="btn btn-outline"
              style={{ width: '100%' }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
