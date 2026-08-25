// HARISS OfficeQuest V3 — dashboard.js
// Gère l'affichage des quêtes, du classement et de la progression XP

const API_BASE = "/api";
const token = localStorage.getItem("hariss_token");

if (!token) {
  window.location.href = "/index.html";
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok || data.success === false) {
    if (res.status === 401) {
      localStorage.removeItem("hariss_token");
      window.location.href = "/index.html";
    }
    throw new Error(data.message || "Erreur inconnue.");
  }
  return data;
}

// --- Chargement du profil utilisateur ---
let currentUser = null;

async function loadProfile() {
  const data = await apiRequest("/auth/me");
  currentUser = data.user;

  document.getElementById("user-name").textContent = currentUser.name;
  document.getElementById("user-level").textContent = `Niveau ${currentUser.level}`;

  const avatarEl = document.getElementById("user-avatar");
  if (currentUser.avatar) {
    avatarEl.innerHTML = `<img src="${currentUser.avatar}" alt="avatar" />`;
  } else {
    avatarEl.textContent = currentUser.name.charAt(0).toUpperCase();
  }

  const progress = data.progress;
  document.getElementById("xp-progress-bar").style.width = `${progress.progressPercent}%`;
  document.getElementById("xp-text").textContent =
    `${progress.currentLevelXp} / ${progress.xpForNextLevel} XP vers le niveau ${progress.level + 1}`;

  if (currentUser.role === "ADMIN") {
    document.getElementById("new-quest-btn").classList.remove("hidden");
  }
}

// --- Chargement des quêtes ---
async function loadQuests() {
  const listEl = document.getElementById("quest-list");
  try {
    const data = await apiRequest("/quests");
    if (data.quests.length === 0) {
      listEl.innerHTML = `<p class="loading">Aucune quête disponible pour le moment.</p>`;
      return;
    }

    listEl.innerHTML = "";
    data.quests.forEach((quest) => {
      const alreadyDone = quest.completions?.some((c) => c.userId === currentUser.id);
      const card = document.createElement("div");
      card.className = `quest-card${alreadyDone ? " done" : ""}`;
      card.innerHTML = `
        <div>
          <div class="quest-title">${escapeHtml(quest.title)}</div>
          <div class="quest-desc">${escapeHtml(quest.description || "")}</div>
          <div class="quest-meta">+${quest.xpReward} XP • ${difficultyLabel(quest.difficulty)}</div>
        </div>
        <button class="btn-primary btn-small" ${alreadyDone ? "disabled" : ""} data-quest-id="${quest.id}">
          ${alreadyDone ? "Complétée" : "Terminer"}
        </button>
      `;
      listEl.appendChild(card);
    });

    listEl.querySelectorAll("button[data-quest-id]").forEach((btn) => {
      btn.addEventListener("click", () => completeQuest(btn.dataset.questId));
    });
  } catch (err) {
    listEl.innerHTML = `<p class="loading">Erreur : ${err.message}</p>`;
  }
}

function difficultyLabel(difficulty) {
  const map = { EASY: "Facile", MEDIUM: "Moyen", HARD: "Difficile", EPIC: "Épique" };
  return map[difficulty] || difficulty;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function completeQuest(questId) {
  try {
    const data = await apiRequest(`/quests/${questId}/complete`, { method: "POST" });
    alert(data.message);
    await loadProfile();
    await loadQuests();
    await loadLeaderboard();
  } catch (err) {
    alert(err.message);
  }
}

// --- Classement ---
async function loadLeaderboard() {
  const listEl = document.getElementById("leaderboard-list");
  try {
    const data = await apiRequest("/users/leaderboard");
    listEl.innerHTML = "";
    data.leaderboard.forEach((user, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="leaderboard-rank">#${index + 1}</span>
        <span class="leaderboard-name">${escapeHtml(user.name)}</span>
        <span class="leaderboard-xp">Niv. ${user.level} • ${user.xp} XP</span>
      `;
      listEl.appendChild(li);
    });
  } catch (err) {
    listEl.innerHTML = `<li class="loading">Erreur : ${err.message}</li>`;
  }
}

// --- Modale de création de quête (admin) ---
const questModal = document.getElementById("quest-modal");
document.getElementById("new-quest-btn").addEventListener("click", () => {
  questModal.classList.remove("hidden");
});
document.getElementById("quest-cancel-btn").addEventListener("click", () => {
  questModal.classList.add("hidden");
});

document.getElementById("quest-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const messageEl = document.getElementById("quest-form-message");
  messageEl.textContent = "";
  messageEl.className = "form-message";

  try {
    await apiRequest("/quests", {
      method: "POST",
      body: JSON.stringify({
        title: document.getElementById("quest-title").value.trim(),
        description: document.getElementById("quest-description").value.trim(),
        xpReward: Number(document.getElementById("quest-xp").value),
        difficulty: document.getElementById("quest-difficulty").value,
      }),
    });

    questModal.classList.add("hidden");
    document.getElementById("quest-form").reset();
    await loadQuests();
  } catch (err) {
    messageEl.textContent = err.message;
    messageEl.classList.add("error");
  }
});

// --- Déconnexion ---
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("hariss_token");
  localStorage.removeItem("hariss_user");
  window.location.href = "/index.html";
});

// --- Initialisation ---
(async function init() {
  try {
    await loadProfile();
    await loadQuests();
    await loadLeaderboard();
  } catch (err) {
    console.error(err);
  }
})();
