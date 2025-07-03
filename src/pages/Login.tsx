import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Login.css";
import { useAuth } from "../context/AuthContext";

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

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
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

  const handleSocialLogin = async (provider: any) => {
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
          className="btn btn-social btn-google"
          disabled={loading}
          onClick={() => handleSocialLogin("google")}
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
            id="email"
            name="email"
            onChange={handleChange}
            required
            type="email"
            value={email}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            onChange={handleChange}
            required
            type="password"
            value={password}
          />
        </div>
        <button className="btn btn-primary" disabled={loading} type="submit">
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
