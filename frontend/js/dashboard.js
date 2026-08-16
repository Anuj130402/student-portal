// dashboard.js — collects sources, calls summarize, shows the result,
// and lets the user save a result to their profile.

const generateBtn = document.getElementById("generateBtn");
const errorEl = document.getElementById("error");
const resultEl = document.getElementById("result");
const summaryEl = document.getElementById("summary");
const resultModeEl = document.getElementById("resultMode");
const saveBtn = document.getElementById("saveBtn");
const saveStatus = document.getElementById("saveStatus");

const urlsEl = document.getElementById("urls");
const urlCountEl = document.getElementById("urlCount");
if (urlsEl && urlCountEl) {
  const updateCount = () => {
    urlCountEl.textContent = `${urlsEl.value.length} characters`;
  };
  urlsEl.addEventListener("input", updateCount);
  updateCount();
}

const MODE_LABELS = {
  short: "Short Summary",
  analytical: "Analytical",
  recall: "Data-Specific & Easy-to-Remember",
};

let maxSources = MAX_SOURCES;
let currentUid = null;
let lastResult = null;   // { mode, summary, sources } of the most recent generation

auth.onAuthStateChanged(async (user) => {
  if (!user) return;                 // auth-guard handles the redirect
  currentUid = user.uid;
  try {
    const snap = await db.collection("users").doc(user.uid).get();
    if (snap.exists) {
      const prefs = snap.data();
      if (prefs.defaultMode) document.getElementById("mode").value = prefs.defaultMode;
      if (typeof prefs.maxSources === "number") maxSources = prefs.maxSources;
    }
  } catch {
    // Preferences are optional — keep config defaults.
  }
});

async function buildSources() {
  const sources = [];

const urls = document.getElementById("urls").value
    .split("\n").map((u) => u.trim()).filter(Boolean);
  const uniqueUrls = [...new Set(urls)];   // drop duplicate URLs
  uniqueUrls.forEach((u) => sources.push({ type: "url", value: u }));

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
  saveStatus.textContent = "";

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
  if (sources.length > maxSources) {
    errorEl.textContent = `You can summarize at most ${maxSources} sources at once.`;
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

    lastResult = { mode, summary: data.summary, sources };  // remember for Save
    saveBtn.disabled = false;
    saveBtn.textContent = "Save to profile";
  } catch (err) {
    errorEl.textContent = err.message;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate Summary";
  }
});

saveBtn.addEventListener("click", async () => {
  if (!currentUid || !lastResult) return;
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving…";
  saveStatus.textContent = "";
  try {
    await saveSummary(currentUid, lastResult);
    saveStatus.textContent = "Saved to your profile.";
    saveBtn.textContent = "Saved";
  } catch (err) {
    saveStatus.textContent = "Save failed: " + err.message;
    saveBtn.disabled = false;
    saveBtn.textContent = "Save to profile";
  }
});