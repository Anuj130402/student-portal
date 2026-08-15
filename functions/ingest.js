// ingest.js
// Fetches a web page and extracts its readable text, discarding
// scripts, styles, navigation, and other boilerplate.

const { parse } = require("node-html-parser");

const MAX_CHARS = 100000; // guardrail: keep payloads to Gemini reasonable

async function fetchUrlText(url) {
  if (!/^https?:\/\//i.test(url)) {
    throw new Error(`Invalid URL: ${url}`);
  }

  const res = await fetch(url, {
    headers: { "User-Agent": "StudentPortalCrux/1.0 (summarizer)" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url} (status ${res.status})`);
  }

  const html = await res.text();
  const root = parse(html);

  // Remove noise before extracting text.
  root
    .querySelectorAll("script, style, nav, footer, header, noscript, aside")
    .forEach((node) => node.remove());

  // Prefer the main content region if the page marks one.
  const main =
    root.querySelector("article") ||
    root.querySelector("main") ||
    root.querySelector("body") ||
    root;

  const text = main.text.replace(/\s+/g, " ").trim();
  return text.slice(0, MAX_CHARS);
}

module.exports = { fetchUrlText };