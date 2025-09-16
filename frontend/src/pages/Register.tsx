import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { email as validateEmail, required } from "../lib/validate";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const nameErr = required(name, "Name");
    const emailErr = validateEmail(email);
    const passwordErr = required(password, "Password");
    const phoneErr = required(phone, "Phone number");
    const addressErr = required(address, "Address");
    const cityErr = required(city, "City");
    const stateErr = required(state, "State");
    const pincodeErr = required(pincode, "Pincode");

    if (
      nameErr ||
      emailErr ||
      passwordErr ||
      phoneErr ||
      addressErr ||
      cityErr ||
      stateErr ||
      pincodeErr
    ) {
      setMessage(
        nameErr ||
          emailErr ||
          passwordErr ||
          phoneErr ||
          addressErr ||
          cityErr ||
          stateErr ||
          pincodeErr
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
        phone,
        address,
        city,
        state,
        pincode,
        department: department || undefined,
        role,
      });
      login(data.token, data.user);
      navigate("/");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-header text-center">
        <h1 className="page-title">Register</h1>
        <p className="page-subtitle">Create a new account</p>
      </div>

      <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Computer Science"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address *</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Enter your complete address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">State *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pincode *</label>
              <input
                type="text"
                className="form-input"
                placeholder="123456"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                className="form-input"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="dept_head">Department Head</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          {message && (
            <div className="form-error mt-2 text-center">{message}</div>
          )}
        </form>

        <div className="text-center mt-2">
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2563eb" }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
