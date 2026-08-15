// gemini.js
// Single point of contact with the Gemini API.

const logger = require("firebase-functions/logger");

// Model names change over time — confirm the current one in Google AI Studio.
const GEMINI_MODEL = "gemini-2.0-flash";

async function callGemini(parts) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Add it to functions/.env");
  }

  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${GEMINI_MODEL}:generateContent`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey, // kept out of the URL so it never lands in logs
    },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { temperature: 0.3 },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    logger.error("Gemini API error", data);
    throw new Error(data.error?.message || "Gemini request failed.");
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned no text (content may have been blocked).");
  }
  return text.trim();
}

module.exports = { callGemini, GEMINI_MODEL };