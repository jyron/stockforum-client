import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, socialLogin } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter all fields");
      return;
    }

    setLoading(true);
    setError("");

    const result = await login(formData);

    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Login failed");
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError("");

    const result = await socialLogin(provider);

    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || `${provider} login failed`);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Login</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="social-login-buttons">
        <button
          onClick={() => handleSocialLogin("google")}
          className="btn btn-social btn-google"
          disabled={loading}
        >
          <i className="fab fa-google"></i> Continue with Google
        </button>
      </div>

      <div className="divider">
        <span>or</span>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login with Email"}
        </button>
      </form>

      <p className="my-1">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
