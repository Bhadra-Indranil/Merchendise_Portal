import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import Protected from './components/Protected';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductsAdmin from './pages/admin/ProductsAdmin';
import GroupsAdmin from './pages/admin/GroupsAdmin';
import DistributionAdmin from './pages/admin/DistributionAdmin';
import Profile from './pages/Profile';
import TrackOrder from './pages/TrackOrder';
import GroupOrderDetails from './pages/GroupOrderDetails';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/orders" element={<Protected><Orders /></Protected>} />
              <Route path="/orders/:id/track" element={<Protected><TrackOrder /></Protected>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
              <Route path="/admin/products" element={<Protected requiredRoles={['admin']}><ProductsAdmin /></Protected>} />
              <Route path="/admin/groups" element={<Protected requiredRoles={['admin', 'dept_head']}><GroupsAdmin /></Protected>} />
              <Route path="/admin/distribution" element={<Protected requiredRoles={['admin']}><DistributionAdmin /></Protected>} />
              <Route path="/profile" element={<Protected><Profile /></Protected>} />
              <Route path="/group-orders/:uniqueCode" element={<GroupOrderDetails />} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;