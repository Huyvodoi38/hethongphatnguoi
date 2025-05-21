import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
// Định nghĩa kiểu user
interface User {
  id: string;
  email: string;
  fullName?: string;
  role?: any;
}

// Định nghĩa kiểu decoded token
interface DecodedToken {
  sub: string;
  email: string;
  exp: number;
  [key: string]: any;
}

// Định nghĩa context type
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
}

// Tạo context mặc định
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook để dùng
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAccessToken = () => {
    return localStorage.getItem("accessToken");
  };

  const fetchUserInfo = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error("No access token found");
      }

      const res = await api.get("/users/@me", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      setCurrentUser({
        id: res.data.id,
        email: "", // Không có email trong response, để trống
        fullName: res.data.fullname,
        role: res.data.permissions,
      });
    } catch (error) {
      console.error("Error fetching user info:", error);
      handleLogout();
    }
  };

  const checkToken = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        handleLogout();
        return;
      }

      const decodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp <= currentTime) {
        handleLogout();
        return;
      }

      await fetchUserInfo();
    } catch (err) {
      console.error("Error checking token:", err);
      handleLogout();
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await checkToken();
      } catch (err) {
        console.error("Error checking auth status:", err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
    const tokenCheckInterval = setInterval(checkToken, 60000);
    return () => clearInterval(tokenCheckInterval);
  }, []);

  // Hàm login dùng api
  const handleLogin = async (phone: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const data = new URLSearchParams();
      data.append('grant_type', 'password');
      data.append('username', phone);
      data.append('password', password);
      const response = await api.post("/users/login", data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const { access_token } = response.data;
      localStorage.setItem("accessToken", access_token);
      await fetchUserInfo();
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Hàm logout 
  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    setCurrentUser(null);
    setError(null);
    setLoading(false);
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
