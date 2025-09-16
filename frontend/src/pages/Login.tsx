import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { email as validateEmail, required } from "../lib/validate";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const emailErr = validateEmail(email);
    const passwordErr = required(password, "Password");

    if (emailErr || passwordErr) {
      setMessage(emailErr || passwordErr);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.token, data.user);
      navigate("/");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-header text-center">
        <h1 className="page-title">Login</h1>
        <p className="page-subtitle">Sign in to your account</p>
      </div>

      <div className="card" style={{ maxWidth: "400px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          {message && (
            <div className="form-error mt-2 text-center">{message}</div>
          )}
        </form>

        <div className="text-center mt-2">
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#2563eb" }}>
              Register here
            </Link>
          </p>
        </div>
      </div>

      <div
        className="card text-center mt-2"
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <h3 className="mb-2">Demo Credentials</h3>
        <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
          <p>
            <strong>Admin:</strong> admin@example.com / admin123
          </p>
          <p>
            <strong>User:</strong> user@example.com / user123
          </p>
        </div>
        <button
          onClick={() => {
            setEmail("admin@example.com");
            setPassword("admin123");
          }}
          className="btn btn-outline mt-2"
          style={{ width: "100%" }}
        >
          Use Admin Demo
        </button>
      </div>
    </div>
  );
}
