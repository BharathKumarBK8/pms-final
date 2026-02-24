"use client";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface User {
  id: string;
  role: "owner" | "admin" | "doctor" | "staff";
  email: string;
  displayName?: string;
}

export type UserType = User;

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshMe: () => Promise<UserType | null>;
  login: (email: string, password: string) => Promise<UserType | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  const refreshMe = async (): Promise<UserType | null> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        setUser(null);
        return null;
      }

      const data = await res.json();
      setUser(data.user ?? null);
      return data.user ?? null;
    } catch (err) {
      console.error("auth/me failed", err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<UserType | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/native/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid email or password");

      const user = await refreshMe();
      return user;
    } catch (err: any) {
      console.error("Native login failed:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshMe();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshMe,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
