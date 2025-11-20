// src/lib/api.js
const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request(path, body) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // If server returned HTML (like 404 page), trying to parse JSON will fail.
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      if (!res.ok) {
        throw new Error(data?.error || `Request failed: ${res.status}`);
      }
      return data;
    } catch (err) {
      throw new Error(`Unexpected server response: ${text.slice(0, 200)}`);
    }
  } catch (err) {
    console.error("API request error:", err);
    throw err;
  }
}

// ---------------- Auth Functions ----------------
export async function signUp(email, password, fullName) {
  const data = await request("/api/auth/signup", { email, password, fullName });
  // Ensure fullName & subscription are returned
  return {
    ...data,
    fullName: data.fullName || fullName,
    subscription: data.subscription || "Free plan",
  };
}

export async function signIn(email, password) {
  const data = await request("/api/auth/signin", { email, password });
  // Ensure fullName & subscription are returned
  return {
    ...data,
    fullName: data.fullName || "", // backend must return fullName
    subscription: data.subscription || "Free plan",
  };
}

// ---------------- Study Helpers ----------------
export async function generateSummary(text) {
  const data = await request("/api/study/summarize", { text });
  return data.summary;
}

export async function generateQuiz(text) {
  const data = await request("/api/study/quiz", { topic: text });
  return data.questions;
}

export async function getHomeworkHelp(text) {
  const data = await request("/api/study/homework", { question: text });
  return data.answer;
}

// ---------------- Health Check ----------------
export async function healthCheck() {
  try {
    const res = await fetch(`${BASE}/api/health`);
    if (!res.ok) throw new Error("Health check failed");
    return res.json();
  } catch (err) {
    console.error("healthCheck error:", err);
    return { status: "error", error: err.message };
  }
}

export default {
  signUp,
  signIn,
  generateSummary,
  generateQuiz,
  getHomeworkHelp,
  healthCheck,
};
