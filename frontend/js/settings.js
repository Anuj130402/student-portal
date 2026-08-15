const modeEl = document.getElementById("defaultMode");
const maxEl = document.getElementById("maxSources");
const statusEl = document.getElementById("status");
const saveBtn = document.getElementById("saveBtn");

let currentUid = null;

// Wait for auth — the session may still be restoring on page load.
auth.onAuthStateChanged(async (user) => {
  if (!user) return;                 // auth-guard handles the redirect
  currentUid = user.uid;
  await loadPrefs(user.uid);
});

async function loadPrefs(uid) {
  try {
    const snap = await db.collection("users").doc(uid).get();
    if (snap.exists) {
      const prefs = snap.data();
      if (prefs.defaultMode) modeEl.value = prefs.defaultMode;
      if (typeof prefs.maxSources === "number") maxEl.value = prefs.maxSources;
    } else {
      modeEl.value = DEFAULT_MODE;   // no prefs yet — show app defaults
      maxEl.value = MAX_SOURCES;
    }
  } catch (err) {
    statusEl.textContent = "Could not load preferences: " + err.message;
  }
}

saveBtn.addEventListener("click", async () => {
  if (!currentUid) return;
  const maxSources = parseInt(maxEl.value, 10);
  if (isNaN(maxSources) || maxSources < 1 || maxSources > 10) {
    statusEl.textContent = "Max sources must be between 1 and 10.";
    return;
  }
  statusEl.textContent = "Saving…";
  try {
    await db.collection("users").doc(currentUid).set(
      { defaultMode: modeEl.value, maxSources },
      { merge: true }               // don't clobber other user fields (e.g. saved summaries)
    );
    statusEl.textContent = "Saved.";
  } catch (err) {
    statusEl.textContent = "Save failed: " + err.message;
  }
});