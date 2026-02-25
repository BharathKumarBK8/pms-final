"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GiHeartPlus } from "react-icons/gi";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  // ✅ Redirect if already authenticated (after loading finishes)
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  // ✅ Prevent flicker while checking auth state
  if (loading) {
    return null; // or a centered spinner if you prefer
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError("");

    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err: any) {
      setLoginError(err.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#111" }} // Background color: #111
    >
      <div className="w-full max-w-md">
        <div
          className="p-8 rounded-sm border shadow-md"
          style={{
            backgroundColor: "#111", // Background color: #111
            borderColor: "#333", // A slightly lighter border for contrast
          }}
        >
          {/* Logo Replacement: "myPMS GiHeartPlus" */}
          <div className="flex justify-center mb-6">
            <h1
              className="text-4xl font-extrabold flex items-center" // Flex container with items centered vertically
              style={{
                color: "#a5b4fc", // Accent color for text
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Clean modern font
              }}
            >
              <GiHeartPlus size={32} style={{ marginRight: "8px" }} />{" "}
              {/* Add margin to space the icon and text */}
              myPMS
            </h1>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h2
              className="font-bold mb-1"
              style={{ fontSize: "1.8rem", color: "#fff" }} // Text color: #fff
            >
              Patient Management System
            </h2>
            <p style={{ color: "#ccc" }}>Sign in to your staff account</p>
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
                style={{ color: "#fff" }} // Label text color: #fff
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
                  backgroundColor: "#111", // Background color: #111
                  borderColor: "#333", // Border color: #333
                  color: "#fff", // Input text color: #fff
                }}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#fff" }} // Label text color: #fff
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
                  backgroundColor: "#111", // Background color: #111
                  borderColor: "#333", // Border color: #333
                  color: "#fff", // Input text color: #fff
                }}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className="text-sm transition-colors"
                style={{
                  color: "#a5b4fc", // Accent color for link
                }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: "#a5b4fc", // Accent color for button
                color: "#111", // Button text color: #111
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#818cf8")
              } // Accent hover effect
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#a5b4fc")
              }
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
