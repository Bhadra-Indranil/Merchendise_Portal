import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../lib/api';

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
};

export default function Profile() {
  const { user } = useAuth();
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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
      </div>

      <div className="card-grid">
        <div className="card">
          <h3 className="mb-2">Profile Information</h3>
          <div className="form-group">
            <label className="form-label">Name</label>
            <p>{user.name}</p>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <p>{user.email}</p>
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <p>{user.phone}</p>
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <p>{user.department || 'N/A'}</p>
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <p>{user.role}</p>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-2">Shipping Address</h3>
          <div className="form-group">
            <p>
              {user.address}, {user.city}, {user.state} - {user.pincode}
            </p>
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <h3 className="mb-2">My Orders</h3>
        {loading && <div>Loading orders...</div>}
        {error && <div className="form-error">{error}</div>}
        {orders.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here!</p>
          </div>
        )}
        {orders.length > 0 && (
          <div>
            {orders.map((order) => (
              <div key={order._id} className="order-item">
                <div className="order-header">
                  <div className="order-id">Order #{order._id.slice(-8)}</div>
                  <div className={`order-status ${order.status}`}>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
