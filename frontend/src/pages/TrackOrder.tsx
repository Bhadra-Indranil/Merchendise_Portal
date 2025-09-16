import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';

type StatusHistory = {
  status: string;
  timestamp: string;
};

type TrackingInfo = {
  trackingId?: string;
  estimatedDelivery?: string;
  deliveryStatus?: string;
  statusHistory?: StatusHistory[];
};

export default function TrackOrder() {
  const { id } = useParams();
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTrackingInfo();
  }, [id]);

  async function loadTrackingInfo() {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get(`/orders/${id}/track`);
      setTrackingInfo(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load tracking information');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div>Loading tracking information...</div>
      </div>
    );
  }

  if (error || !trackingInfo) {
    return (
      <div className="card text-center">
        <div className="form-error mb-2">{error || 'Tracking information not found'}</div>
        <Link to="/orders" className="btn">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Track Order</h1>
        <p className="page-subtitle">Order ID: {id}</p>
      </div>

      <div className="card">
        <div className="mb-2">
          <strong>Tracking ID:</strong> {trackingInfo.trackingId || 'N/A'}
        </div>
        <div className="mb-2">
          <strong>Status:</strong> {trackingInfo.deliveryStatus || 'N/A'}
        </div>
        <div className="mb-2">
          <strong>Estimated Delivery:</strong>{' '}
          {trackingInfo.estimatedDelivery
            ? new Date(trackingInfo.estimatedDelivery).toLocaleDateString()
            : 'N/A'}
        </div>
      </div>

      <div className="card mt-3">
        <h3 className="mb-2">Order History</h3>
        <div className="timeline">
          {trackingInfo.statusHistory && trackingInfo.statusHistory.length > 0 ? (
            trackingInfo.statusHistory.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-status">{item.status}</div>
                  <div className="timeline-timestamp">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No status history available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
