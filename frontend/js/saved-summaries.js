// saved-summaries.js — read/write the user's saved summaries in Firestore.
// Summaries live as an array on the SAME users/{uid} document that holds
// preferences — which is why every write here uses { merge: true }.

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function saveSummary(uid, { mode, summary, sources }) {
  const entry = {
    id: generateId(),
    mode,
    summary,
    sourceCount: sources.length,
    // Store a readable label of each source, NOT the raw PDF bytes.
    sourceLabels: sources.map((s) => (s.type === "url" ? s.value : "PDF file")),
    createdAt: new Date().toISOString(),
  };
  await db.collection("users").doc(uid).set(
    { savedSummaries: firebase.firestore.FieldValue.arrayUnion(entry) },
    { merge: true }
  );
  return entry;
}

async function getSavedSummaries(uid) {
  const snap = await db.collection("users").doc(uid).get();
  if (!snap.exists) return [];
  const data = snap.data();
  const list = Array.isArray(data.savedSummaries) ? data.savedSummaries : [];
  return list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)); // newest first
}