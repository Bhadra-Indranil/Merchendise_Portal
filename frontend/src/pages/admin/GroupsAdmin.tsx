import { useEffect, useState } from "react";
import api from "../../lib/api";
import { required } from "../../lib/validate";

type Product = {
  _id: string;
  name: string;
  price: number;
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
  participants: number;
  createdAt: string;
  uniqueCode: string;
  collectedAmount: number;
  totalQuantityCollected: number;
};

type GroupOrderItemForm = {
  productId: string;
  quantityGoal: number;
  unitPrice: number;
};

type NewGroupFormData = {
  name: string;
  department: string;
  deadline: string;
  note: string;
  products: GroupOrderItemForm[];
};

export default function GroupsAdmin() {
  const [groups, setGroups] = useState<GroupOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [newGroupFormData, setNewGroupFormData] = useState<NewGroupFormData>({
    name: "",
    department: "",
    deadline: "",
    note: "",
    products: [],
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadGroups();
    loadProducts();
  }, []);

  async function loadGroups() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/groups");
      setGroups(data.groups || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load group orders");
    } finally {
      setLoading(false);
    }
  }

  async function loadProducts() {
    try {
      const { data } = await api.get("/products");
      setProducts(data.products || []);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  }

    async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    const nameErr = required(newGroupFormData.name, "Group name");
    if (nameErr) {
      setMessage(nameErr);
      setSubmitting(false);
      return;
    }

    try {
      const groupData = {
        name: newGroupFormData.name,
        department: newGroupFormData.department || undefined,
        deadline: newGroupFormData.deadline || undefined,
        note: newGroupFormData.note || undefined,
        products: newGroupFormData.products, // Pass products data
      };

      await api.post("/groups", groupData);
      setMessage("Group order created successfully!");
      setNewGroupFormData({ name: "", department: "", deadline: "", note: "", products: [] }); // Reset form
      await loadGroups();
    } catch (err: any) {
      setMessage(
        err?.response?.data?.message || "Failed to create group order"
      );
    } finally {
      setSubmitting(false);
    }
  }

  function addProduct() {
    setNewGroupFormData(prev => ({
      ...prev,
      products: [...prev.products, { productId: "", quantityGoal: 1, unitPrice: 0 }],
    }));
  }

  function removeProduct(index: number) {
    setNewGroupFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  }

  function handleProductChange(index: number, field: keyof GroupOrderItemForm, value: any) {
    setNewGroupFormData(prev => ({
      ...prev,
      products: prev.products.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  async function updateStatus(groupId: string, status: string) {
    try {
      await api.patch(`/groups/${groupId}/status`, { status });
      await loadGroups();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Failed to update status");
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "open":
        return "paid";
      case "closed":
        return "failed";
      case "fulfilled":
        return "paid";
      default:
        return "pending";
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div>Loading group orders...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin - Group Orders</h1>
        <p className="page-subtitle">Manage department and group orders</p>
      </div>

      {error && (
        <div className="card">
          <div className="form-error mb-2">{error}</div>
          <button onClick={loadGroups} className="btn">
            Try Again
          </button>
        </div>
      )}

      <div className="admin-section">
        <div className="admin-form">
          <h3 className="mb-2">Create New Group Order</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Group Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Computer Science Department"
                value={newGroupFormData.name}
                onChange={(e) =>
                  setNewGroupFormData({ ...newGroupFormData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Computer Science"
                value={newGroupFormData.department}
                onChange={(e) =>
                  setNewGroupFormData({ ...newGroupFormData, department: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Deadline</label>
              <input
                type="datetime-local"
                className="form-input"
                value={newGroupFormData.deadline}
                onChange={(e) =>
                  setNewGroupFormData({ ...newGroupFormData, deadline: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Note</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Additional information for participants"
                value={newGroupFormData.note}
                onChange={(e) =>
                  setNewGroupFormData({ ...newGroupFormData, note: e.target.value })
                }
              />
            </div>

            <h4 className="mb-2">Products for Group Order</h4>
            {newGroupFormData.products.map((product, index) => (
              <div key={index} className="card mb-2">
                <div className="form-group">
                  <label className="form-label">Product</label>
                  <select
                    className="form-input"
                    value={product.productId}
                    onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                  >
                    <option value="">Select a product</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} (₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity Goal</label>
                  <input
                    type="number"
                    className="form-input"
                    value={product.quantityGoal}
                    onChange={(e) => handleProductChange(index, 'quantityGoal', Number(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit Price</label>
                  <input
                    type="number"
                    className="form-input"
                    value={product.unitPrice}
                    onChange={(e) => handleProductChange(index, 'unitPrice', Number(e.target.value))}
                    min="0"
                    step="0.01"
                  />
                </div>
                <button type="button" className="btn btn-danger" onClick={() => removeProduct(index)}>
                  Remove Product
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-outline" onClick={addProduct}>
              Add Product
            </button>

            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? "Creating..." : "Create Group Order"}
            </button>

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
          <h3 className="mb-2">Group Orders ({groups.length})</h3>

          {groups.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <p>No group orders found</p>
            </div>
          ) : (
            <div>
              {groups.map((group) => (
                <div key={group._id} className="admin-item">
                  <div className="admin-item-info">
                    <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                      {group.name}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                      {group.department && `${group.department} • `}
                      {group.participants} participants • Created by{" "}
                      {group.createdBy.name}
                    </div>
                    {group.note && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          marginTop: "0.25rem",
                        }}
                      >
                        {group.note}
                      </div>
                    )}
                    {group.deadline && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          marginTop: "0.25rem",
                        }}
                      >
                        Deadline: {new Date(group.deadline).toLocaleString()}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#6b7280",
                        marginTop: "0.25rem",
                      }}
                    >
                      Created: {new Date(group.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "0.5rem" }}>
                      <strong>Unique Code:</strong> {group.uniqueCode}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                      <strong>Collected:</strong> ₹{group.collectedAmount} / {group.totalQuantityCollected} items
                    </div>
                  </div>

                  <div className="admin-item-actions">
                    <div
                      className={`order-status ${getStatusColor(group.status)}`}
                    >
                      {group.status.toUpperCase()}
                    </div>
                    {group.status === "open" && (
                      <button
                        onClick={() => updateStatus(group._id, "closed")}
                        className="btn btn-secondary"
                      >
                        Close
                      </button>
                    )}
                    {group.status === "closed" && (
                      <button
                        onClick={() => updateStatus(group._id, "fulfilled")}
                        className="btn"
                      >
                        Mark Fulfilled
                      </button>
                    )}
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