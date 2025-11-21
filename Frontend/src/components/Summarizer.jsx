// src/components/Summarizer.jsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Zap } from "lucide-react";

export default function Summarizer() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSummarize = async () => {
    setError(null);

    if (!input.trim())
      return setError("Please paste some text or upload a file.");

    const token = localStorage.getItem("token");
    if (!token) return setError("You are not logged in.");

    try {
      setLoading(true);

      const res = await fetch("https://eduquick-study-helper.onrender.com/api/study/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,   // ⬅ IMPORTANT
        },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          return setError("Session expired. Please log in again.");
        }
        return setError(data.error || "Failed to summarize.");
      }

      setSummary(data.summary || "No summary returned.");
    } catch (err) {
      setError("Failed to summarize. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setInput("");
    setSummary("");
    setError(null);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Summarize</h3>
        <div className="panel-actions">
          <button className="ghost" onClick={clearAll}>Clear</button>
          <button className="primary" onClick={handleSummarize} disabled={loading}>
            {loading ? "Summarizing..." : <><Zap className="icon" /> Summarize</>}
          </button>
        </div>
      </div>

      <textarea
        className="input-area"
        placeholder="Paste text here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={8}
      />

      {error && <div className="error">{error}</div>}

      {summary && (
        <div className="result fade-in">
          <h4>Summary</h4>
          <div className="result-body">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
