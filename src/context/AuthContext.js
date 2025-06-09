import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // The api instance already handles auth headers via interceptors
  // No need to manually set headers here

  // Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data);
      } catch (error) {
        console.error("Error loading user:", error);
        localStorage.removeItem("token");
        setToken(null);
      }

      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      const res = await api.post("/api/auth/register", userData);

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);

      return {
        success: true,
        data: res.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      const res = await api.post("/api/auth/login", userData);

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);

      return {
        success: true,
        data: res.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Social login
  const socialLogin = async (provider) => {
    try {
      console.log("Starting social login for provider:", provider);

      // Store the current window reference
      const currentWindow = window;

      // Open the provider's OAuth popup
      const popupUrl = `${
        process.env.REACT_APP_API_URL || "http://localhost:5000"
      }/api/auth/${provider}`;
      console.log("Opening popup with URL:", popupUrl);

      const popup = currentWindow.open(
        popupUrl,
        "Social Login",
        "width=500,height=600,scrollbars=yes"
      );

      if (!popup) {
        throw new Error("Popup blocked. Please allow popups for this site.");
      }

      // Listen for the OAuth response via postMessage
      const result = await new Promise((resolve, reject) => {
        let popupClosed = false;
        let checkClosedInterval = null;

        const handleMessage = (event) => {
          console.log("Received message event:", {
            origin: event.origin,
            data: event.data,
            type: event.data?.type,
          });

          // Ignore MetaMask messages
          if (event.data?.target === "metamask-inpage") {
            console.log("Ignoring MetaMask message");
            return;
          }

          // Handle the authentication response
          if (event.data?.type === "social_auth_success") {
            console.log("Received success message:", event.data);
            popupClosed = true;
            cleanup();
            resolve(event.data);
          } else if (event.data?.type === "social_auth_error") {
            console.log("Received error message:", event.data);
            popupClosed = true;
            cleanup();
            reject(new Error(event.data.error));
          }
        };

        const cleanup = () => {
          if (checkClosedInterval) {
            clearInterval(checkClosedInterval);
            checkClosedInterval = null;
          }
          currentWindow.removeEventListener("message", handleMessage);
          try {
            if (popup && !popup.closed) {
              popup.close();
            }
          } catch (e) {
            console.log("Error closing popup:", e);
          }
        };

        // Add message listener
        currentWindow.addEventListener("message", handleMessage);

        // Handle popup closed
        checkClosedInterval = setInterval(() => {
          try {
            if (popup.closed) {
              console.log("Popup was closed");
              cleanup();
              if (!popupClosed) {
                reject(new Error("Authentication window closed"));
              }
            }
          } catch (e) {
            console.log("Error checking popup state:", e);
            // Continue checking even if we get a COOP error
          }
        }, 1000);

        // Cleanup after 5 minutes (maximum OAuth flow time)
        setTimeout(() => {
          if (!popupClosed) {
            console.log("OAuth timeout reached");
            cleanup();
            reject(new Error("Authentication timeout"));
          }
        }, 300000); // 5 minutes
      });

      console.log("Social login successful, storing data:", result);

      // Store token and user data
      localStorage.setItem("token", result.token);
      setToken(result.token);
      setUser(result.user);

      // Trigger a page reload to ensure all components update with the new auth state
      console.log("Reloading page to update auth state");
      window.location.href = "/";

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Social login error:", error);
      return {
        success: false,
        error: error.message || `${provider} login failed`,
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => !!token;

  const value = {
    user,
    loading,
    register,
    login,
    socialLogin,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
