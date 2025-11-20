import React, { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import { AuthForm } from "./components/AuthForm";

export default function App() {
  const [user, setUser] = useState(null);

  // Load saved user on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        setUser(null);
      }
    }
  }, []);

  // Handle Sign In
  const handleSignIn = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { error: data.error };

      // Save user info and token
      const userData = {
        fullName: data.fullName,
        subscription: data.subscription,
      };
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      return {};
    } catch (err) {
      return { error: "Network error" };
    }
  };

  // Handle Sign Up
  const handleSignUp = async (email, password, fullName) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await res.json();
      if (!res.ok) return { error: data.error };

      const userData = {
        fullName: data.fullName,
        subscription: data.subscription,
      };
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      return {};
    } catch (err) {
      return { error: "Network error" };
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div>
      {!user ? (
        <AuthForm onSignIn={handleSignIn} onSignUp={handleSignUp} />
      ) : (
        <Dashboard user={user} onSignOut={handleLogout} />
      )}
    </div>
  );
}
