// src/components/Homework.jsx
import React, { useState } from "react";
import { HelpCircle } from "lucide-react";

export default function Homework() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleHelp = async () => {
    setError(null);
    setAnswer("");

    if (!input.trim()) {
      return setError("Please paste a homework question or problem statement.");
    }

    const token = localStorage.getItem("token");
    if (!token) return setError("You are not logged in.");

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/study/homework", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) return setError("Session expired. Please log in again.");
        return setError(data.error || "Homework helper failed.");
      }

      if (!data.answer) {
        return setError("No answer returned. Try rephrasing the question.");
      }

      setAnswer(data.answer); // just set the answer
    } catch (err) {
      setError(err.message || "Homework helper failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Homework Helper</h3>
        <div className="panel-actions">
          <button
            className="ghost"
            onClick={() => {
              setInput("");
              setAnswer("");
              setError(null);
            }}
          >
            Clear
          </button>
          <button className="primary" onClick={handleHelp} disabled={loading}>
            {loading ? "Working..." : <><HelpCircle className="icon" /> Get Help</>}
          </button>
        </div>
      </div>

      <textarea
        className="input-area"
        placeholder="Type or paste your homework question (math word problem, essay prompt, science question)..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
      />

      {error && <div className="error">{error}</div>}

      {answer && (
        <div className="result fade-in">
          <div className="result-body">
            <strong>Answer:</strong> {answer}
          </div>
        </div>
      )}
    </div>
  );
}
