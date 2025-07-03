import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

type AuthContextType = {
  isAuthenticated: () => boolean;
  loading: boolean;
  login: (userData: any) => Promise<{ data?: any; error?: string; success: boolean; }>;
  logout: () => void;
  register: (userData: any) => Promise<{ data?: any; error?: string; success: boolean; }>;
  socialLogin: (provider: string) => Promise<any>;
  token: null | string;
  updateUsername: (username: string) => Promise<{ data?: any; error?: string; success: boolean; }>;
  user: null | User;
};

type User = {
  _id: string;
  email: string;
  role?: string;
  username: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({
  children
}: any) => {
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
      } catch (error: unknown) {
        console.error("Error loading user:", error);
        localStorage.removeItem("token");
        setToken(null);
      }

      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (userData: any) => {
    try {
      const res = await api.post("/api/auth/register", userData);

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);

      return {
        data: res.data,
        success: true,
      };
    } catch (error: unknown) {
      return {
        error: error.response?.data?.message || "Registration failed",
        success: false,
      };
    }
  };

  // Login user
  const login = async (userData: any) => {
    try {
      const res = await api.post("/api/auth/login", userData);

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);

      return {
        data: res.data,
        success: true,
      };
    } catch (error: unknown) {
      return {
        error: error.response?.data?.message || "Login failed",
        success: false,
      };
    }
  };

  // Social login
  const socialLogin = async (provider: any) => {
    try {
      console.log("Starting social login for provider:", provider);

      // Store the current window reference
      const currentWindow = window;

      // Open the provider's OAuth popup
      const popupUrl = `${
        import.meta.env.REACT_APP_API_URL || "http://localhost:5000"
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
        let checkClosedInterval: any = null;

        const handleMessage = (event: any) => {
          console.log("Received message event:", {
            data: event.data,
            origin: event.origin,
            type: event.data?.type,
          });

          // Get the expected origin from env or default
          const expectedOrigin =
            import.meta.env.REACT_APP_API_URL || "http://localhost:5000";
          const allowedOrigins = [
            expectedOrigin,
            expectedOrigin.replace("http://", "https://"),
            expectedOrigin.replace("https://", "http://"),
          ];

          // Verify the origin
          if (!allowedOrigins.includes(event.origin)) {
            console.log(
              "Ignoring message from unexpected origin:",
              event.origin
            );
            return;
          }

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

      return {
        data: result,
        success: true,
      };
    } catch (error: unknown) {
      console.error("Social login error:", error);
      return {
        error: error.message || `${provider} login failed`,
        success: false,
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

  // Update username
  const updateUsername = async (username: any) => {
    try {
      const res = await api.put("/api/auth/username", { username });
      setUser(res.data.user);
      return {
        data: res.data,
        success: true,
      };
    } catch (error: unknown) {
      return {
        error: error.response?.data?.message || "Failed to update username",
        success: false,
      };
    }
  };

  const value = {
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    socialLogin,
    updateUsername,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
