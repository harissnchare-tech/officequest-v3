// HARISS OfficeQuest V3 — main.js
// Gère la page de connexion / inscription

const API_BASE = "/api";

// --- Gestion des onglets ---
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".auth-form").forEach((f) => f.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(`${btn.dataset.tab}-form`).classList.add("active");
  });
});

// Si un token existe déjà, redirige directement vers le dashboard
if (localStorage.getItem("hariss_token")) {
  window.location.href = "/dashboard.html";
}

// --- Connexion ---
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const messageEl = document.getElementById("login-message");
  messageEl.textContent = "";
  messageEl.className = "form-message";

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Échec de la connexion.");
    }

    localStorage.setItem("hariss_token", data.token);
    localStorage.setItem("hariss_user", JSON.stringify(data.user));
    window.location.href = "/dashboard.html";
  } catch (err) {
    messageEl.textContent = err.message;
    messageEl.classList.add("error");
  }
});

// --- Inscription ---
const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;
  const messageEl = document.getElementById("register-message");
  messageEl.textContent = "";
  messageEl.className = "form-message";

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Échec de l'inscription.");
    }

    localStorage.setItem("hariss_token", data.token);
    localStorage.setItem("hariss_user", JSON.stringify(data.user));
    window.location.href = "/dashboard.html";
  } catch (err) {
    messageEl.textContent = err.message;
    messageEl.classList.add("error");
  }
});
