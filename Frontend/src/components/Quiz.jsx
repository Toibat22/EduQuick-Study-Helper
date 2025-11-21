// src/components/Quiz.jsx
import React, { useState } from "react";
import { BookOpen } from "lucide-react";

export default function Quiz() {
  const [input, setInput] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setError(null);
    setQuiz([]);

    if (!input.trim()) return setError("Enter a topic or paste study material.");

    const token = localStorage.getItem("token");
    if (!token) return setError("You are not logged in.");

    try {
      setLoading(true);

      const res = await fetch("https://eduquick-study-helper.onrender.com/study/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ topic: input }), // always generates 5 questions
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) return setError("Session expired. Please log in again.");
        return setError(data.error || "Quiz generation failed.");
      }

      let questions = data.questions;
      if (typeof questions === "string") {
        try {
          questions = JSON.parse(questions);
        } catch {
          questions = questions
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean)
            .map((q) => ({ question: q, options: [], answer: null }));
        }
      }

      const quizWithState = questions.map((q) => ({
        ...q,
        userAnswer: null,
      }));

      setQuiz(quizWithState);
      if (!questions || questions.length === 0)
        setError("No quiz returned. Try a more detailed topic.");
    } catch (err) {
      setError(err.message || "Quiz generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qIndex, option) => {
    setQuiz((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex || q.userAnswer) return q;
        return { ...q, userAnswer: option };
      })
    );
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Quiz Generator</h3>
        <div className="panel-actions">
          <button
            className="ghost"
            onClick={() => {
              setInput("");
              setQuiz([]);
              setError(null);
            }}
          >
            Clear
          </button>
          <button className="primary" onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : <><BookOpen className="icon" /> Generate Quiz</>}
          </button>
        </div>
      </div>

      <textarea
        className="input-area"
        placeholder="Enter a topic, chapter text, or paste study material..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
      />

      {error && <div className="error">{error}</div>}

      {quiz.length > 0 && (
        <div className="result fade-in">
          <h4>Generated Questions</h4>
          <div className="result-body">
            {quiz.map((q, i) => (
              <div key={i} className="question-card">
                <div className="q-title">{`${i + 1}. ${q.question}`}</div>
                {q.options && q.options.length > 0 ? (
                  <ul className="options">
                    {q.options.map((opt, oi) => {
                      const isSelected = q.userAnswer === opt;
                      const isCorrect = q.answer === opt;
                      let className = "";

                      if (q.userAnswer) {
                        if (isSelected) className = isCorrect ? "correct" : "wrong";
                        else if (isCorrect) className = "correct";
                      }

                      return (
                        <li
                          key={oi}
                          className={className}
                          onClick={() => handleSelectOption(i, opt)}
                        >
                          {opt} {q.userAnswer && isSelected && (isCorrect ? "✅" : "❌")}
                          {q.userAnswer && !isSelected && isCorrect ? "✅" : ""}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="small-muted">
                    No options provided. Likely a short-answer question.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
