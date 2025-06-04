import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  name: string;
  organizationId: string;
  organizationName: string;
  role: "admin" | "user";
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (
    organizationName: string,
    email: string,
    password: string,
    name: string,
  ) => Promise<void>;
  joinOrganization: (
    inviteCode: string,
    email: string,
    password: string,
    name: string,
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Mock authentication - in real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const mockUser: User = {
        id: "1",
        email,
        name: "John Doe",
        organizationId: "org-1",
        organizationName: "Acme Inc",
        role: "admin",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    organizationName: string,
    email: string,
    password: string,
    name: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Mock signup - in real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: "1",
        email,
        name,
        organizationId: "org-1",
        organizationName,
        role: "admin",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      navigate("/");
    } catch (err) {
      setError("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const joinOrganization = async (
    inviteCode: string,
    email: string,
    password: string,
    name: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Mock join organization - in real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: "2",
        email,
        name,
        organizationId: "org-1",
        organizationName: "Acme Inc",
        role: "user",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      navigate("/");
    } catch (err) {
      setError("Invalid invite code");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const value = {
    user,
    login,
    logout,
    signup,
    joinOrganization,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
