// auth-guard.js — include on every protected page.
// Bounces signed-out visitors to the login page.

auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  const el = document.getElementById("userEmail");
  if (el) el.textContent = user.email || user.displayName || "Signed in";
});

function signOut() {
  auth.signOut().then(() => { window.location.href = "login.html"; });
}