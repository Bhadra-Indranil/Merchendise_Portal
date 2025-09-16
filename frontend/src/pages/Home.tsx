import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <div className="page-header text-center">
        <h1 className="page-title">Welcome to Merch Portal</h1>
        <p className="page-subtitle">
          Your one-stop shop for campus merchandise and group orders
        </p>
      </div>

      <div className="card-grid">
        <div className="card">
          <h3 className="mb-2">Browse Products</h3>
          <p className="mb-2">
            Discover our collection of campus merchandise, from apparel to accessories.
          </p>
          <Link to="/products" className="btn">
            Shop Now
          </Link>
        </div>

        <div className="card">
          <h3 className="mb-2">Group Orders</h3>
          <p className="mb-2">
            Organize bulk orders for your department or group with special pricing.
          </p>
          <Link to="/products" className="btn">
            Learn More
          </Link>
        </div>

        <div className="card">
          <h3 className="mb-2">Track Orders</h3>
          <p className="mb-2">
            Monitor your order status and delivery updates in real-time.
          </p>
          {user ? (
            <Link to="/orders" className="btn">
              View Orders
            </Link>
          ) : (
            <Link to="/login" className="btn">
              Login to Track
            </Link>
          )}
        </div>
      </div>

      {!user && (
        <div className="card text-center mt-3">
          <h3 className="mb-2">Get Started</h3>
          <p className="mb-2">
            Create an account to start shopping and managing your orders.
          </p>
          <Link to="/login" className="btn">
            Create Account
          </Link>
        </div>
      )}
    </div>
  );
}
