import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "./styles/typography.css";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import StockBanner from "./components/StockBanner";
import PrivateRoute from "./components/PrivateRoute";

// Context
import { useAuth } from "./context/AuthContext";
import { getAllStocks } from "./services/stockService";

// Lazy loaded components
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const StockDetail = lazy(() => import("./pages/StockDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const ConversationView = lazy(() => import("./pages/ConversationView"));
const NewConversation = lazy(() => import("./pages/NewConversation"));
const AdminArticles = lazy(() => import("./pages/AdminArticles"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const Articles = lazy(() => import("./pages/Articles"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
        <Suspense fallback={<div className="loading">Loading...</div>}>
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
            <Route path="/conversation/:id" element={<ConversationView />} />
            <Route path="/new-conversation" element={<NewConversation />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/articles" element={<Articles />} />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/articles"
              element={
                <PrivateRoute>
                  <AdminArticles />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
