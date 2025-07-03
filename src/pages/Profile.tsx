import { useEffect, useState } from "react";

import StockCard from "../components/StockCard";
import { useAuth } from "../context/AuthContext";
import { getAllStocks } from "../services/stockService";
import "./Profile.css";

const Profile = () => {
  const { updateUsername, user } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  useEffect(() => {
    const fetchUserStocks = async () => {
      setLoading(true);
      const result = await getAllStocks();

      if (result.success) {
        // Filter stocks created by the current user
        const userStocks = result.data.filter(
          (stock: any) => stock.createdBy && stock.createdBy._id === user.id
        );
        setStocks(userStocks);
        setError("");
      } else {
        setError(result.error || "Failed to fetch your stocks");
      }

      setLoading(false);
    };

    fetchUserStocks();
  }, [user]);

  const handleEditUsername = () => {
    setEditingUsername(true);
    setNewUsername(user.username);
    setUpdateError("");
    setUpdateSuccess("");
  };

  const handleCancelEdit = () => {
    setEditingUsername(false);
    setNewUsername("");
    setUpdateError("");
  };

  const handleUsernameSubmit = async (e: any) => {
    e.preventDefault();

    if (!newUsername || newUsername.length < 4) {
      setUpdateError("Username must be at least 4 characters long");
      return;
    }

    const result = await updateUsername(newUsername);

    if (result.success) {
      setEditingUsername(false);
      setUpdateSuccess("Username updated successfully!");
      setTimeout(() => setUpdateSuccess(""), 3000); // Clear success message after 3 seconds
    } else {
      setUpdateError(result.error);
    }
  };

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>

      <div className="profile-info">
        {updateSuccess && (
          <div className="alert alert-success">{updateSuccess}</div>
        )}
        {updateError && <div className="alert alert-danger">{updateError}</div>}

        <div className="info-row">
          <label>Username:</label>
          {editingUsername ? (
            <form className="username-form" onSubmit={handleUsernameSubmit}>
              <input
                className="username-input"
                minLength={4}
                onChange={(e: any) => setNewUsername(e.target.value)}
                required
                type="text"
                value={newUsername}
              />
              <div className="username-buttons">
                <button className="btn btn-primary btn-sm" type="submit">
                  Save
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleCancelEdit}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="info-value">
              <span>{user.username}</span>
              <button
                className="btn btn-link btn-sm edit-link"
                onClick={handleEditUsername}
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <div className="info-row">
          <label>Email:</label>
          <div className="info-value">{user.email}</div>
        </div>
      </div>

      <h2>Your Stocks</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading">Loading your stocks...</div>
      ) : stocks.length === 0 ? (
        <div className="alert alert-info">
          You haven't added any stocks yet.{" "}
          <a href="/add-stock">Add your first stock</a>
        </div>
      ) : (
        <div className="stock-grid">
          {stocks.map((stock) => (
            <StockCard
              key={stock._id}
              onUpdate={() =>
                setStocks(stocks.filter((s) => s._id !== stock._id))
              }
              stock={stock}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
