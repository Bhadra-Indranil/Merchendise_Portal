import { useEffect, useState } from "react";
import api from "../../lib/api";

type Distribution = {
  _id: string;
  groupOrder?: {
    name: string;
  };
  items: Array<{
    order: {
      _id: string;
      user: {
        name: string;
      };
    };
    assignee?: string;
    status: string;
    notes?: string;
    pickupCode?: string;
    pickedUpAt?: string;
  }>;
  scheduledAt?: string;
  completedAt?: string;
  createdAt: string;
};

export default function DistributionAdmin() {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDistribution, setSelectedDistribution] =
    useState<Distribution | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDistributions();
  }, []);

  async function loadDistributions() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/distribution");
      setDistributions(data.distributions || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load distributions");
    } finally {
      setLoading(false);
    }
  }

  async function updateItemStatus(
    distributionId: string,
    itemIndex: number,
    status: string
  ) {
    try {
      await api.patch(`/distribution/${distributionId}/items/${itemIndex}`, {
        status,
      });
      await loadDistributions();
      setMessage("Status updated successfully!");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Failed to update status");
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "ready":
        return "paid";
      case "picked_up":
        return "paid";
      case "not_ready":
        return "pending";
      default:
        return "pending";
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div>Loading distributions...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin - Distribution</h1>
        <p className="page-subtitle">
          Manage merchandise distribution and pickup
        </p>
      </div>

      {error && (
        <div className="card">
          <div className="form-error mb-2">{error}</div>
          <button onClick={loadDistributions} className="btn">
            Try Again
          </button>
        </div>
      )}

      {message && (
        <div className="card">
          <div
            className={
              message.includes("successfully") ? "form-success" : "form-error"
            }
          >
            {message}
          </div>
        </div>
      )}

      <div className="admin-section">
        <div className="admin-list">
          <h3 className="mb-2">
            Distribution Batches ({distributions.length})
          </h3>

          {distributions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <p>No distribution batches found</p>
            </div>
          ) : (
            <div>
              {distributions.map((distribution) => (
                <div key={distribution._id} className="admin-item">
                  <div className="admin-item-info">
                    <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                      {distribution.groupOrder
                        ? distribution.groupOrder.name
                        : "Individual Orders"}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                      {distribution.items.length} items • Created:{" "}
                      {new Date(distribution.createdAt).toLocaleDateString()}
                    </div>
                    {distribution.scheduledAt && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          marginTop: "0.25rem",
                        }}
                      >
                        Scheduled:{" "}
                        {new Date(distribution.scheduledAt).toLocaleString()}
                      </div>
                    )}
                    {distribution.completedAt && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#059669",
                          marginTop: "0.25rem",
                        }}
                      >
                        Completed:{" "}
                        {new Date(distribution.completedAt).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="admin-item-actions">
                    <button
                      onClick={() =>
                        setSelectedDistribution(
                          selectedDistribution?._id === distribution._id
                            ? null
                            : distribution
                        )
                      }
                      className="btn btn-outline"
                    >
                      {selectedDistribution?._id === distribution._id
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedDistribution && (
          <div className="admin-form">
            <h3 className="mb-2">
              Distribution Items -{" "}
              {selectedDistribution.groupOrder?.name || "Individual Orders"}
            </h3>

            <div>
              {selectedDistribution.items.map((item, index) => (
                <div key={index} className="card mb-2">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "600" }}>
                        Order #{item.order._id.slice(-8)}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                        Customer: {item.order.user.name}
                      </div>
                      {item.assignee && (
                        <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                          Assignee: {item.assignee}
                        </div>
                      )}
                      {item.pickupCode && (
                        <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                          Pickup Code: {item.pickupCode}
                        </div>
                      )}
                    </div>

                    <div
                      className={`order-status ${getStatusColor(item.status)}`}
                    >
                      {item.status.replace("_", " ").toUpperCase()}
                    </div>
                  </div>

                  {item.notes && (
                    <div
                      style={{
                        marginBottom: "1rem",
                        fontSize: "0.9rem",
                        color: "#6b7280",
                      }}
                    >
                      Notes: {item.notes}
                    </div>
                  )}

                  {item.pickedUpAt && (
                    <div
                      style={{
                        marginBottom: "1rem",
                        fontSize: "0.9rem",
                        color: "#059669",
                      }}
                    >
                      Picked up: {new Date(item.pickedUpAt).toLocaleString()}
                    </div>
                  )}

                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    {item.status === "not_ready" && (
                      <button
                        onClick={() =>
                          updateItemStatus(
                            selectedDistribution._id,
                            index,
                            "ready"
                          )
                        }
                        className="btn"
                      >
                        Mark Ready
                      </button>
                    )}
                    {item.status === "ready" && (
                      <button
                        onClick={() =>
                          updateItemStatus(
                            selectedDistribution._id,
                            index,
                            "picked_up"
                          )
                        }
                        className="btn"
                      >
                        Mark Picked Up
                      </button>
                    )}
                    {item.status === "picked_up" && (
                      <span style={{ color: "#059669", fontWeight: "500" }}>
                        ✓ Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
