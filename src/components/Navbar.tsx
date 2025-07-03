import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "../styles/components.css";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-logo" to="/">
          <img
            alt="StockForum Logo"
            className="navbar-logo-img"
            src="/logo192.png"
          />
          <span>StockForum.io</span>
        </Link>
        <div className="navbar-menu">
          <Link to="/">Home</Link>
          <Link to="/rate-my-portfolio">Rate My Portfolio</Link>
          {isAuthenticated() ? (
            <>
              <Link to="/profile">Profile</Link>
              {user?.isAdmin && (
                <Link to="/admin/articles">Manage Articles</Link>
              )}
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
