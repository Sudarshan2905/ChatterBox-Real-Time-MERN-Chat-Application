import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../utils/getErrorMessage";
import Loader from "../components/Loader";

const initialState = { username: "", mobile: "", city: "", password: "", confirmPassword: "" };

export default function Signup() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    setLoading(true);
    try {
      await signup(form);
      navigate("/dashboard");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join ChatterBox and start chatting instantly</p>

        <label>Username</label>
        <input name="username" value={form.username} onChange={handleChange} required minLength={3} />

        <label>Mobile Number</label>
        <input
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          required
          pattern="\d{10}"
          maxLength={10}
          title="Mobile must be exactly 10 digits"
        />

        <label>City</label>
        <input name="city" value={form.city} onChange={handleChange} required />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
        />

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? <Loader size="sm" /> : "Sign Up"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
