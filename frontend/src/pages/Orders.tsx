import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Link } from 'react-router-dom';

type Order = {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  items: Array<{
    product: {
      name: string;
    };
    quantity: number;
    unitPrice: number;
  }>;
  paymentId?: string;
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/orders/me');
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'paid': return 'paid';
      case 'pending': return 'pending';
      case 'failed': return 'failed';
      case 'cancelled': return 'failed';
      case 'fulfilled': return 'paid';
      default: return 'pending';
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div>Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center">
        <div className="form-error mb-2">{error}</div>
        <button onClick={loadOrders} className="btn">
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">My Orders</h1>
        </div>
        
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Orders</h1>
        <p className="page-subtitle">Track your order history and status</p>
      </div>

      <div>
        {orders.map((order) => (
          <div key={order._id} className="order-item">
            <div className="order-header">
              <div className="order-id">Order #{order._id.slice(-8)}</div>
              <div className={`order-status ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </div>
            </div>
            
            <div className="order-details">
              <div className="order-detail">
                <strong>Amount:</strong> ₹ {order.amount}
              </div>
              <div className="order-detail">
                <strong>Items:</strong> {order.items.length}
              </div>
              <div className="order-detail">
                <strong>Ordered:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </div>
              {order.paymentId && (
                <div className="order-detail">
                  <strong>Payment ID:</strong> {order.paymentId}
                </div>
              )}
            </div>

            <div className="mt-2" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <h4 className="mb-1">Order Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} style={{ 
                    padding: '0.5rem', 
                    background: '#f9fafb', 
                    borderRadius: '4px',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem'
                  }}>
                    <div><strong>{item.product.name}</strong></div>
                    <div>Quantity: {item.quantity} × ₹ {item.unitPrice} = ₹ {item.quantity * item.unitPrice}</div>
                  </div>
                ))}
              </div>
              <Link to={`/orders/${order._id}/track`} className="btn">
                Track Order
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}