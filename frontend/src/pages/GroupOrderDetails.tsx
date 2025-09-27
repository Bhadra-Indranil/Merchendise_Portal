import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

type Product = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  images?: string[];
};

type GroupOrderItem = {
  productId: Product; // Populated product
  quantityGoal: number;
  unitPrice: number;
  variants?: { name: string; value: string }[];
};

type GroupOrder = {
  _id: string;
  name: string;
  department?: string;
  status: string;
  deadline?: string;
  note?: string;
  createdBy: {
    name: string;
  };
  participants: string[]; // Array of user IDs
  createdAt: string;
  uniqueCode: string;
  collectedAmount: number;
  totalQuantityCollected: number;
  products: GroupOrderItem[];
};

export default function GroupOrderDetails() {
  const { uniqueCode } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [groupOrder, setGroupOrder] = useState<GroupOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<GroupOrderItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState('');

  useEffect(() => {
    loadGroupOrder();
  }, [uniqueCode]);

  async function loadGroupOrder() {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get(`/groups/${uniqueCode}`);
      setGroupOrder(data.group);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load group order');
    } finally {
      setLoading(false);
    }
  }

  function handleAddToCartClick(product: GroupOrderItem) {
    setSelectedProduct(product);
    setShowCustomizationModal(true);
  }

  function handleAddToCart() {
    if (selectedProduct) {
      addItem({
        productId: selectedProduct.productId._id,
        name: selectedProduct.productId.name,
        unitPrice: selectedProduct.unitPrice,
        quantity: quantity,
        customization: { note: customization },
        groupOrder: groupOrder?._id,
      });
      setShowCustomizationModal(false);
      setSelectedProduct(null);
      setQuantity(1);
      setCustomization('');
      navigate('/cart');
    }
  }

  const isParticipant = user && groupOrder?.participants.includes(user._id);

  if (loading) {
    return (
      <div className="loading">
        <div>Loading group order details...</div>
      </div>
    );
  }

  if (error || !groupOrder) {
    return (
      <div className="card text-center">
        <div className="form-error mb-2">{error || 'Group order not found'}</div>
        <Link to="/group-orders/join" className="btn">
          Try another code
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{groupOrder.name}</h1>
        <p className="page-subtitle">Group Order Details</p>
      </div>

      <div className="card">
        <p><strong>Department:</strong> {groupOrder.department || 'N/A'}</p>
        <p><strong>Status:</strong> {groupOrder.status}</p>
        <p><strong>Deadline:</strong> {groupOrder.deadline ? new Date(groupOrder.deadline).toLocaleString() : 'N/A'}</p>
        <p><strong>Note:</strong> {groupOrder.note || 'N/A'}</p>
        <p><strong>Created By:</strong> {groupOrder.createdBy.name}</p>
        <p><strong>Participants:</strong> {groupOrder.participants.length}</p>
        <p><strong>Collected:</strong> ₹{groupOrder.collectedAmount} / {groupOrder.totalQuantityCollected} items</p>
      </div>

      {isParticipant ? (
        <div className="card mt-3 text-center">
          <p>You have already joined this group order.</p>
          <Link to="/orders" className="btn mt-2">View Your Orders</Link>
        </div>
      ) : (
        <div className="card mt-3">
          <h3 className="mb-2">Products</h3>
          {groupOrder.products.map(item => (
            <div key={item.productId._id} className="cart-item">
              <div className="cart-item-info">
                <div className="cart-item-name">{item.productId.name}</div>
                <div className="cart-item-price">Price: ₹{item.unitPrice}</div>
                <div className="cart-item-price">Goal: {item.quantityGoal} units</div>
              </div>
              <button onClick={() => handleAddToCartClick(item)} className="btn">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

      {showCustomizationModal && selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ minWidth: '400px' }}>
            <h3 className="mb-2">Add to Cart: {selectedProduct.productId.name}</h3>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-input"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Customization Note</label>
              <textarea
                className="form-input form-textarea"
                placeholder="e.g., Size, Color, etc."
                value={customization}
                onChange={(e) => setCustomization(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleAddToCart} className="btn">Add to Cart</button>
              <button onClick={() => setShowCustomizationModal(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
