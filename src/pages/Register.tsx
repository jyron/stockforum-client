import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    confirmPassword: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, socialLogin } = useAuth();
  const navigate = useNavigate();

  const { confirmPassword, email, password } = formData;

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError("Please enter all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    // Generate a username from email (everything before @)
    const username = email.split("@")[0];

    const result = await register({
      email,
      password,
      username,
    });

    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Registration failed");
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
      <h1 className="auth-title">Register</h1>

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
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            onChange={handleChange}
            required
            type="password"
            value={confirmPassword}
          />
        </div>
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? "Registering..." : "Register with Email"}
        </button>
      </form>

      <p className="my-1">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
