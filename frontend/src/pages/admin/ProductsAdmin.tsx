import { useEffect, useState } from "react";
import api from "../../lib/api";
import { positiveNumber, required } from "../../lib/validate";

type Product = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  images?: string[];
  isActive: boolean;
};

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    images: "",
    isActive: true,
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/products");
      setProducts(data.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "",
      images: "",
      isActive: true,
    });
    setEditing(null);
    setMessage("");
  }

  function startEdit(product: Product) {
    setEditing(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description || "",
      category: product.category || "",
      images: product.images?.join(", ") || "",
      isActive: product.isActive,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    const nameErr = required(formData.name, "Name");
    const priceErr = positiveNumber(Number(formData.price), "Price");

    if (nameErr || priceErr) {
      setMessage(nameErr || priceErr);
      setSubmitting(false);
      return;
    }

    try {
      const productData = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description || undefined,
        category: formData.category || undefined,
        images: formData.images
          ? formData.images.split(",").map((url) => url.trim())
          : undefined,
        isActive: formData.isActive,
      };

      if (editing) {
        await api.put(`/products/${editing._id}`, productData);
        setMessage("Product updated successfully!");
      } else {
        await api.post("/products", productData);
        setMessage("Product created successfully!");
      }

      await loadProducts();
      resetForm();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(product: Product) {
    try {
      await api.patch(`/products/${product._id}/active`, {
        isActive: !product.isActive,
      });
      await loadProducts();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Failed to update product");
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div>Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin - Products</h1>
        <p className="page-subtitle">Manage product catalog</p>
      </div>

      {error && (
        <div className="card">
          <div className="form-error mb-2">{error}</div>
          <button onClick={loadProducts} className="btn">
            Try Again
          </button>
        </div>
      )}

      <div className="admin-section">
        <div className="admin-form">
          <h3 className="mb-2">
            {editing ? "Edit Product" : "Create New Product"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Product name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input
                type="number"
                className="form-input"
                placeholder="0"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Product description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Apparel, Accessories"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image URLs (comma-separated)</label>
              <textarea
                className="form-input form-textarea"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                value={formData.images}
                onChange={(e) =>
                  setFormData({ ...formData, images: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
                Active (visible to customers)
              </label>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" className="btn" disabled={submitting}>
                {submitting
                  ? "Saving..."
                  : editing
                  ? "Update Product"
                  : "Create Product"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>

            {message && (
              <div
                className={
                  message.includes("successfully")
                    ? "form-success mt-2"
                    : "form-error mt-2"
                }
              >
                {message}
              </div>
            )}
          </form>
        </div>

        <div className="admin-list">
          <h3 className="mb-2">Products ({products.length})</h3>

          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <p>No products found</p>
            </div>
          ) : (
            <div>
              {products.map((product) => (
                <div key={product._id} className="admin-item">
                  <div className="admin-item-info">
                    <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                      ₹ {product.price} • {product.category || "No category"} •
                      <span
                        style={{
                          color: product.isActive ? "#059669" : "#dc2626",
                          fontWeight: "500",
                        }}
                      >
                        {product.isActive ? " Active" : " Inactive"}
                      </span>
                    </div>
                    {product.description && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          marginTop: "0.25rem",
                        }}
                      >
                        {product.description}
                      </div>
                    )}
                  </div>

                  <div className="admin-item-actions">
                    <button
                      onClick={() => startEdit(product)}
                      className="btn btn-outline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleActive(product)}
                      className={`btn ${
                        product.isActive ? "btn-secondary" : "btn"
                      }`}
                    >
                      {product.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
