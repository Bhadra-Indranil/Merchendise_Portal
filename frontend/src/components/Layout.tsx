import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <div>
      <header className="header">
        <div className="container">
          <nav className="nav">
            <Link to="/" className="nav-brand">
              Merch Portal
            </Link>
            
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/products" className="nav-link">Products</Link>
              <Link to="/orders" className="nav-link">Orders</Link>
              <Link to="/group-orders/join" className="nav-link">Join Group Order</Link>
              <Link to="/cart" className="nav-link">
                Cart ({count})
              </Link>
              
              {user ? (
                <div className="nav-user">
                  <span className="user-info">Hi, {user.name}</span>
                  <Link to="/profile" className="nav-link">My Profile</Link>
                  {user.role === 'admin' && (
                    <>
                      <Link to="/admin/products" className="nav-link">Admin Products</Link>
                      <Link to="/admin/groups" className="nav-link">Admin Groups</Link>
                      <Link to="/admin/distribution" className="nav-link">Admin Distribution</Link>
                    </>
                  )}
                  <button onClick={logout} className="btn btn-outline">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn">
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>
      
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
}
