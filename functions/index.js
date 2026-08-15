// index.js
// HTTPS endpoint: POST { mode, sources: [{type, value|data}] } -> { summary }

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const { fetchUrlText } = require("./url-ingest");
const { buildPrompt, MODES } = require("./prompts");
const { callGemini } = require("./gemini");

exports.summarize = onRequest(
  { cors: true, timeoutSeconds: 120, memory: "512MiB" },
  async (req, res) => {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Use POST." });
      }

      const { sources, mode } = req.body || {};

      if (!MODES[mode]) {
        return res.status(400).json({
          error: `Unknown mode '${mode}'. Valid: ${Object.keys(MODES).join(", ")}.`,
        });
      }
      if (!Array.isArray(sources) || sources.length === 0) {
        return res.status(400).json({ error: "Provide at least one source." });
      }

      // Web pages become text; PDFs are handed to Gemini directly as data.
      const urlTexts = [];
      const pdfParts = [];

      for (const src of sources) {
        if (src.type === "url") {
          logger.info(`Fetching URL: ${src.value}`);
          urlTexts.push(await fetchUrlText(src.value));
        } else if (src.type === "pdf") {
          pdfParts.push({
            inline_data: { mime_type: "application/pdf", data: src.data },
          });
        } else {
          return res
            .status(400)
            .json({ error: `Unknown source type '${src.type}'.` });
        }
      }

      const combinedText = urlTexts.join("\n\n---\n\n");
      const promptText = buildPrompt(mode, combinedText, pdfParts.length);
      const parts = [{ text: promptText }, ...pdfParts];

      const summary = await callGemini(parts);
      return res.status(200).json({ mode, summary });
    } catch (err) {
      logger.error("Summarize failed", err);
      return res.status(500).json({ error: err.message || "Internal error." });
    }
  }
);