import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/contacts";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.includes("@") || !formData.password) {
      setError("Please enter a valid email and password.");
      return;
    }
    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
      console.error("Login error:", err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          onChange={handleChange}
          value={formData.email}
          placeholder="Email"
          required
        />
        <input
          name="password"
          onChange={handleChange}
          value={formData.password}
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
