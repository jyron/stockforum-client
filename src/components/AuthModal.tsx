import { useNavigate } from "react-router-dom";

import "../styles/components.css";

const AuthModal = ({
  action,
  isOpen,
  onClose
}: any) => {
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
          <button className="modal-button login" onClick={handleLogin}>
            Sign In
          </button>
          <button className="modal-button register" onClick={handleRegister}>
            Create Account
          </button>
          <button className="modal-button cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
