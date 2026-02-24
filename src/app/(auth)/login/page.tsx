"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      await login(email, password);
      router.push("/"); // redirect to internal dashboard
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--bg-main) " }}
    >
      <div className="w-full max-w-md">
        <div
          className="p-8 rounded-sm border shadow-md"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-default)",
          }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/assets/logo2.png"
              alt="Hospital Logo"
              width={750}
              height={0}
              className="object-contain"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h2
              className="font-bold mb-1"
              style={{ fontSize: "1.8rem", color: "var(--text-primary)" }}
            >
              Patient Management System
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Sign in to your staff account
            </p>
          </div>

          {/* Error message */}
          {loginError && (
            <p
              className="mb-4 text-center font-medium"
              style={{ color: "red" }}
            >
              {loginError}
            </p>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@hospital.com"
                className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--bg-main)",
                  borderColor: "var(--border-default)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent)";
                  e.target.style.boxShadow = `0 0 0 2px var(--accent)33`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-default)";
                  e.target.style.boxShadow = "none";
                }}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--bg-main)",
                  borderColor: "var(--border-default)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent)";
                  e.target.style.boxShadow = `0 0 0 2px var(--accent)33`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-default)";
                  e.target.style.boxShadow = "none";
                }}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className="text-sm transition-colors"
                style={{ color: "var(--accent)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--accent-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--accent)")
                }
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: "var(--accent)",
                color: "#000",
              }}
              onMouseEnter={(e) =>
                !isLoading &&
                (e.currentTarget.style.backgroundColor = "var(--accent-hover)")
              }
              onMouseLeave={(e) =>
                !isLoading &&
                (e.currentTarget.style.backgroundColor = "var(--accent)")
              }
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
