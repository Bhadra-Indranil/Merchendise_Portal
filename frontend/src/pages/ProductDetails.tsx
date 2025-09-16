import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { positiveNumber, required } from '../lib/validate';
import ProductIcon from '../components/ProductIcon';

type Product = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  images?: string[];
};

type Review = {
  _id: string;
  rating: number;
  comment?: string;
  user: {
    name: string;
  };
  createdAt: string;
};

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);
      setError('');
      const [productRes, reviewsRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/reviews/product/${id}`)
      ]);
      setProduct(productRes.data.item);
      setReviews(reviewsRes.data.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);
    
    const err = required(String(rating), 'Rating') || positiveNumber(rating, 'Rating');
    if (err) {
      setMessage(err);
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/reviews', { product: id, rating, comment });
      await loadData();
      setMessage('Review submitted successfully!');
      setComment('');
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  }

  function handleAddToCart() {
    if (product) {
      addItem({
        productId: product._id,
        name: product.name,
        unitPrice: product.price
      });
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div>Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="card text-center">
        <div className="form-error mb-2">{error || 'Product not found'}</div>
        <Link to="/products" className="btn">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2">
        <Link to="/products" className="btn btn-outline">
          ← Back to Products
        </Link>
      </div>

      <div className="card-grid">
        <div className="card">
          <div className="mb-2" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', borderRadius: '6px' }}>
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[0]} 
                alt={product.name}
                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '6px' }}
              />
            ) : (
              <ProductIcon category={product.category} size={128} />
            )}
          </div>
          
          <h1 className="product-name">{product.name}</h1>
          <div className="product-price">₹ {product.price}</div>
          
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
          
          {product.description && (
            <div className="product-description mb-2">
              {product.description}
            </div>
          )}
          
          <button onClick={handleAddToCart} className="btn" style={{ width: '100%' }}>
            Add to Cart
          </button>
        </div>

        <div className="card">
          <h3 className="mb-2">Reviews ({reviews.length})</h3>
          
          {reviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">⭐</div>
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div>
              {reviews.map((review) => (
                <div key={review._id} className="review-item">
                  <div className="review-rating">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  {review.comment && (
                    <div className="review-comment mb-1">
                      {review.comment}
                    </div>
                  )}
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    by {review.user.name} • {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {user && (
            <div className="mt-3">
              <h4 className="mb-2">Write a Review</h4>
              <form onSubmit={submitReview}>
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <select 
                    className="form-input"
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Comment (optional)</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Share your thoughts about this product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                
                <button type="submit" className="btn" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                
                {message && (
                  <div className={message.includes('successfully') ? 'form-success mt-1' : 'form-error mt-1'}>
                    {message}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}