// login.js — Google and email/password authentication.

const errorEl = document.getElementById("error");
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");

function showError(err) { errorEl.textContent = err.message || String(err); }

// Already signed in? Skip the login page.
auth.onAuthStateChanged((user) => {
  if (user) window.location.href = "dashboard.html";
});

document.getElementById("googleBtn").addEventListener("click", async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);   // redirect handled by onAuthStateChanged
  } catch (err) { showError(err); }
});

document.getElementById("signInBtn").addEventListener("click", async () => {
  try { await auth.signInWithEmailAndPassword(emailEl.value, passwordEl.value); }
  catch (err) { showError(err); }
});

document.getElementById("signUpBtn").addEventListener("click", async () => {
  try { await auth.createUserWithEmailAndPassword(emailEl.value, passwordEl.value); }
  catch (err) { showError(err); }
});