import React from "react";
import AdminArticleManager from "../components/AdminArticleManager";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminArticles = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect if not authenticated or not admin
  if (!isAuthenticated() || !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Manage Articles</h1>
      </header>
      <AdminArticleManager />
    </div>
  );
};

export default AdminArticles;
