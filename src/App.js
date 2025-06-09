import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import StockBanner from "./components/StockBanner";

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
import { getAllStocks } from "./services/stockService";

function App() {
  const { loading: authLoading } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStocks = async () => {
    try {
      setIsLoading(true);
      const result = await getAllStocks();
      if (result.success) {
        setStocks(result.data);
      }
    } catch (err) {
      console.error("An error occurred while fetching stocks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  if (authLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <Navbar />
      <StockBanner stocks={stocks} />
      <main className="container">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                stocks={stocks}
                isLoading={isLoading}
                onUpdate={fetchStocks}
              />
            }
          />
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
