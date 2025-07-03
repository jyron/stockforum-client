import { lazy, Suspense, useEffect, useState } from "react";

import "./App.css";
import "./styles/typography.css";
import { Route, Routes } from "react-router-dom";

import AdSenseLoader from "./components/AdSenseLoader";
import Footer from "./components/Footer";
// Components
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import StockBanner from "./components/StockBanner";
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
const RateMyPortfolio = lazy(() => import("./pages/RateMyPortfolio"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PortfolioDetail = lazy(() => import("./pages/PortfolioDetail"));

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
    <>
      <AdSenseLoader />
      <div className="app">
        <Navbar />
        <StockBanner stocks={stocks} />
        <main className="container">
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Routes>
              <Route
                element={
                  <Home
                    isLoading={isLoading}
                    onUpdate={fetchStocks}
                    stocks={stocks}
                  />
                }
                path="/"
              />
              <Route element={<Login />} path="/login" />
              <Route element={<Register />} path="/register" />
              <Route element={<StockDetail />} path="/stocks/:symbol" />
              <Route element={<ConversationView />} path="/conversation/:id" />
              <Route element={<NewConversation />} path="/new-conversation" />
              <Route element={<ArticleDetail />} path="/article/:id" />
              <Route element={<Articles />} path="/articles" />
              <Route element={<RateMyPortfolio />} path="/rate-my-portfolio" />
              <Route element={<PortfolioDetail />} path="/portfolio/:id" />

              <Route
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
                path="/profile"
              />

              <Route
                element={
                  <PrivateRoute>
                    <AdminArticles />
                  </PrivateRoute>
                }
                path="/admin/articles"
              />

              <Route element={<NotFound />} path="*" />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
