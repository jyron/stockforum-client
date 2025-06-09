import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components.css";

const AuthModal = ({ isOpen, onClose, action }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleRegister = () => {
    onClose();
    navigate("/register");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Sign In Required</h2>
        <p>Please sign in to {action}.</p>
        <div className="modal-actions">
          <button onClick={handleLogin} className="modal-button login">
            Sign In
          </button>
          <button onClick={handleRegister} className="modal-button register">
            Create Account
          </button>
          <button onClick={onClose} className="modal-button cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
