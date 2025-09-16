import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useCart } from '../context/CartContext';
import ProductIcon from '../components/ProductIcon';

type Product = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  images?: string[];
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/products');
      setProducts(data.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  function handleAddToCart(product: Product) {
    addItem({
      productId: product._id,
      name: product.name,
      unitPrice: product.price
    });
  }

  if (loading) {
    return (
      <div className="loading">
        <div>Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center">
        <div className="form-error mb-2">{error}</div>
        <button onClick={loadProducts} className="btn">
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📦</div>
        <h3>No products available</h3>
        <p>Check back later for new merchandise!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <p className="page-subtitle">Browse our collection of campus merchandise</p>
      </div>

      <div className="card-grid">
        {products.map((product) => (
          <div key={product._id} className="card card-product">
            <div className="mb-2" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', borderRadius: '6px' }}>
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px' }}
                />
              ) : (
                <ProductIcon category={product.category} />
              )}
            </div>
            
            <div className="product-name">
              <Link to={`/products/${product._id}`}>
                {product.name}
              </Link>
            </div>
            
            <div className="product-price">₹ {product.price}</div>
            
            {product.description && (
              <div className="product-description">
                {product.description}
              </div>
            )}
            
            {product.category && (
              <div className="mb-2">
                <span style={{ 
                  background: '#f1f5f9', 
                  color: '#475569', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '4px', 
                  fontSize: '0.8rem' 
                }}>
                  {product.category}
                </span>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => handleAddToCart(product)}
                className="btn"
                style={{ flex: 1 }}
              >
                Add to Cart
              </button>
              <Link 
                to={`/products/${product._id}`}
                className="btn btn-outline"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}