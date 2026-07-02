import { createContext, useContext, useEffect, useState } from "react";
import { getMeApi, loginApi, logoutApi, signupApi } from "../services/authService";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMeApi();
        setUser(data.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signup = async (payload) => {
    const { data } = await signupApi(payload);
    setUser(data.data.user);
    showToast(data.message || "Signup Successful", "success");
    return data;
  };

  const login = async (payload) => {
    const { data } = await loginApi(payload);
    setUser(data.data.user);
    showToast(data.message || "Login Successful", "success");
    return data;
  };

  const logout = async () => {
    try {
      const { data } = await logoutApi();
      showToast(data.message || "Logout Successful", "success");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
