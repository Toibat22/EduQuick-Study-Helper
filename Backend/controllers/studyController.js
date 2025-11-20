// controllers/studyController.js
import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper: try to extract JSON (array/object) from a free-form text response
function extractJSONFromText(text) {
  if (!text || typeof text !== "string") return null;

  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch (e) {
    // continue to extraction
  }

  // Look for a JSON array/object somewhere in the text
  const arrayMatch = text.match(/\[\s*[\s\S]*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]);
    } catch (e) {
      // fallthrough
    }
  }

  const objMatch = text.match(/\{\s*[\s\S]*\}/);
  if (objMatch) {
    try {
      return JSON.parse(objMatch[0]);
    } catch (e) {
      // fallthrough
    }
  }

  return null;
}

// Normalize quiz item to { question, options: [], answer, explanation }
function normalizeQuizItem(item, index) {
  const out = {
    question: "",
    options: [],
    answer: null,
    explanation: "",
    raw: item,
  };

  if (!item) return out;

  // If item is a string - make a simple question
  if (typeof item === "string") {
    out.question = item;
    return out;
  }

  // If item has fields
  out.question = item.question || item.q || item.prompt || "";

  // Options: accept several shapes
  if (Array.isArray(item.options)) {
    out.options = item.options;
  } else if (item.options && typeof item.options === "object") {
    // object like { A: "...", B: "..." }
    out.options = Object.entries(item.options).map(([k, v]) => `${k}. ${v}`);
  } else if (item.choices && Array.isArray(item.choices)) {
    out.options = item.choices;
  } else {
    // If options absent, try to infer from A/B/C keys
    const letters = ["A", "B", "C", "D"];
    const opts = [];
    for (const L of letters) {
      if (item[L]) opts.push(`${L}. ${item[L]}`);
    }
    if (opts.length) out.options = opts;
  }

  // Answer: many responses use correctAnswer or answer or correct
  out.answer =
    item.correctAnswer ||
    item.correct ||
    item.answer ||
    item.correct_option ||
    item.key ||
    null;

  // If answer is a single letter and options exist like "A", convert to option text:
  if (out.answer && out.options.length > 0 && /^[A-D]$/i.test(String(out.answer).trim())) {
    const letter = String(out.answer).trim().toUpperCase();
    const idx = letter.charCodeAt(0) - 65;
    if (out.options[idx]) out.answer = out.options[idx];
  }

  out.explanation = item.explanation || item.explain || item.explanation_text || "";

  // fallback question
  if (!out.question && typeof item === "object") {
    out.question = JSON.stringify(item).slice(0, 200);
  }

  return out;
}

/* ---------------------- SUMMARIZER ---------------------- */
export async function summarize(req, res) {
  try {
    const { text } = req.body;
    if (!text || !String(text).trim()) return res.status(400).json({ error: "Text is required" });

    const completion = await client.responses.create({
      model: "gpt-4o-mini",
      input: `Summarize the following text clearly and concisely. Keep it short (3-6 sentences):\n\n${text}`,
      temperature: 0,
      // you can set max_output_tokens if you wish
    });

    const outText =
      completion.output_text ||
      (completion?.output?.[0]?.content?.[0]?.text || "");

    const summary = outText.trim() || "No summary generated.";

    res.json({ summary });
  } catch (error) {
    console.error("Summarize error:", error);
    res.status(500).json({ error: "Summarization failed" });
  }
}

/* ---------------------- QUIZ GENERATOR ---------------------- */
export async function quiz(req, res) {
  try {
    const { topic } = req.body;

    const completion = await client.responses.create({
      model: "gpt-4o-mini",
      input: `
You are a helpful quiz generator.
Generate exactly 5 multiple-choice questions on the following topic:
"${topic}"

- Each question should have 4 options labeled A, B, C, D.
- Include the correct answer clearly.
- Return the result strictly as a JSON array like this:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option B"
  }
]
Do not add any extra text outside the JSON.
      `,
    });

    const outputText =
      completion.output_text ||
      (completion?.output?.[0]?.content?.[0]?.text || "");

    // Extract JSON array
    const jsonMatch = outputText.match(/\[.*\]/s);
    if (!jsonMatch) {
      return res
        .status(500)
        .json({ error: "Failed to parse quiz output. Try rephrasing the topic." });
    }

    let questions = [];
    try {
      const parsed = JSON.parse(jsonMatch[0]);

      // Filter valid questions
      questions = parsed.filter(
        (q) =>
          q.question &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          typeof q.answer === "string"
      );
    } catch {
      return res
        .status(500)
        .json({ error: "Failed to parse quiz output. Try rephrasing the topic." });
    }

    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Quiz generation failed." });
  }
}

/* ---------------------- HOMEWORK SOLVER ---------------------- */
export async function homework(req, res) {
  try {
    const { question } = req.body;

    const completion = await client.responses.create({
      model: "gpt-4o-mini",
      input: `
Answer the following homework question concisely and clearly. 
Give only the final answer, no steps needed.

Question:
"${question}"

Return the answer as plain text.
      `,
    });

    // Get AI output
    const answer =
      completion.output_text ||
      (completion?.output?.[0]?.content?.[0]?.text || "No answer returned.");

    res.json({ answer: answer.trim() });
  } catch (error) {
    res.status(500).json({ error: "Homework solving failed" });
  }
}
