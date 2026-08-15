const generateBtn = document.getElementById("generateBtn");
const errorEl = document.getElementById("error");
const resultEl = document.getElementById("result");
const summaryEl = document.getElementById("summary");
const resultModeEl = document.getElementById("resultMode");

const MODE_LABELS = {
  short: "Short Summary",
  analytical: "Analytical",
  recall: "Data-Specific & Easy-to-Remember",
};

async function buildSources() {
  const sources = [];

  const urls = document.getElementById("urls").value
    .split("\n").map((u) => u.trim()).filter(Boolean);
  urls.forEach((u) => sources.push({ type: "url", value: u }));

  const files = document.getElementById("pdfs").files;
  for (const file of files) {
    const data = await fileToBase64(file);
    sources.push({ type: "pdf", data });
  }
  return sources;
}

generateBtn.addEventListener("click", async () => {
  errorEl.textContent = "";
  resultEl.classList.add("hidden");

  const mode = document.getElementById("mode").value;
  let sources;
  try {
    sources = await buildSources();
  } catch {
    errorEl.textContent = "Could not read one of the PDF files.";
    return;
  }

  if (sources.length === 0) {
    errorEl.textContent = "Add at least one URL or PDF.";
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = "Generating…";
  try {
    const res = await fetch(SUMMARIZE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, sources }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed.");

    resultModeEl.textContent = MODE_LABELS[mode];
    summaryEl.textContent = data.summary;
    resultEl.classList.remove("hidden");
  } catch (err) {
    errorEl.textContent = err.message;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate Summary";
  }
});