const historyEl = document.getElementById("history");
const statusEl = document.getElementById("status");

const MODE_LABELS = {
  short: "Short Summary",
  analytical: "Analytical",
  recall: "Data-Specific & Easy-to-Remember",
};

auth.onAuthStateChanged(async (user) => {
  if (!user) return;                 // auth-guard handles the redirect
  await renderHistory(user.uid);
});

async function renderHistory(uid) {
  statusEl.textContent = "Loading…";
  let items;
  try {
    items = await getSavedSummaries(uid);
  } catch (err) {
    statusEl.textContent = "Could not load summaries: " + err.message;
    return;
  }

  if (items.length === 0) {
    statusEl.textContent =
      "No saved summaries yet. Generate one on the dashboard and hit Save.";
    return;
  }
  statusEl.textContent = `${items.length} saved.`;

  historyEl.innerHTML = "";
  items.forEach((item) => historyEl.appendChild(renderCard(item)));
}

function renderCard(item) {
  const card = document.createElement("div");
  card.className = "result";

  const head = document.createElement("div");
  head.className = "result-head";

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = MODE_LABELS[item.mode] || item.mode;

  const when = document.createElement("span");
  when.style.cssText = "color:var(--muted); font-size:.8rem;";
  when.textContent = new Date(item.createdAt).toLocaleString();

  head.append(badge, when);

  const meta = document.createElement("p");
  meta.className = "subtitle";
  meta.style.marginTop = ".5rem";
  meta.textContent = "Sources: " + (item.sourceLabels || []).join(", ");

  const body = document.createElement("div");
  body.className = "summary";
  body.textContent = item.summary;   // textContent, never innerHTML

  card.append(head, meta, body);
  return card;
}