import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StockDetail from "./pages/StockDetail";
import Profile from "./pages/Profile";

import NotFound from "./pages/NotFound";

// Context
import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stocks/:symbol" element={<StockDetail />} />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
