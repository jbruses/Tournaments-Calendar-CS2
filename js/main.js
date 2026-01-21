import { auth, provider } from "./firebase-config.js";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { initCalendar, renderCalendar } from "./calendar.js";
import {
  loadTournaments,
  saveTournament,
  cancelEdit,
  editTournament,
  deleteTournament,
  toggleFavorite,
  renderTournaments,
  exportTournaments,
  importTournaments,
  exportICS,
  sortByDate,
  sortByVRS, // <--- 1. IMPORTAMOS LAS FUNCIONES DE ORDENAR
} from "./tournaments.js";
import {
  loadTheme,
  setLanguage,
  toggleTheme,
  setView,
  showHelp,
  hideHelp,
  currentLang,
  currentView,
} from "./ui.js";
import {
  setupTeamAutocomplete,
  setupFormAutocomplete,
  toggleAddForm,
} from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
  // Auth Listener
  onAuthStateChanged(auth, (user) => {
    updateAuthUI(user);
    loadTournaments();
  });

  // Login/Logout Buttons
  document.getElementById("btnSignIn")?.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error(e);
      alert("Error Login: " + e.message);
    }
  });
  document.getElementById("btnSignOut")?.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  });

  // Init UI
  loadTheme();
  initCalendar();
  setLanguage(currentLang);
  setView(currentView);
  setupTeamAutocomplete();
  setupFormAutocomplete();

  // Form Actions
  document.getElementById("saveButton")?.addEventListener("click", (e) => {
    e.preventDefault();
    saveTournament();
  });
  document.getElementById("btnCancel")?.addEventListener("click", (e) => {
    e.preventDefault();
    cancelEdit();
  });
  document
    .getElementById("btnToggleForm")
    ?.addEventListener("click", toggleAddForm);

  // Config Actions
  document
    .getElementById("toggleTheme")
    ?.addEventListener("click", toggleTheme);
  document
    .getElementById("lang-es")
    ?.addEventListener("click", () => setLanguage("es"));
  document
    .getElementById("lang-en")
    ?.addEventListener("click", () => setLanguage("en"));
  document
    .getElementById("viewCards")
    ?.addEventListener("click", () => setView("cards"));
  document
    .getElementById("viewTable")
    ?.addEventListener("click", () => setView("table"));

  // Help Actions
  document.getElementById("btnHelp")?.addEventListener("click", showHelp);
  document.getElementById("closeHelp")?.addEventListener("click", hideHelp);
  document.getElementById("helpModal")?.addEventListener("click", (e) => {
    if (e.target === document.getElementById("helpModal")) hideHelp();
  });

  // Utils Actions
  document
    .getElementById("btnExport")
    ?.addEventListener("click", exportTournaments);
  document.getElementById("exportICS")?.addEventListener("click", exportICS);
  document.getElementById("importButton")?.addEventListener("click", () => {
    document.getElementById("importFile")?.click();
  });
  document
    .getElementById("importFile")
    ?.addEventListener("change", importTournaments);
  document.getElementById("btnClearAll")?.addEventListener("click", () => {
    if (confirm("Borrar todo?")) {
      localStorage.clear();
      window.location.reload();
    }
  });

  // Filters
  const filterIds = [
    "fText",
    "fTier",
    "fModality",
    "fLocation",
    "fFrom",
    "fTo",
    "fVRS",
    "fFav",
  ];
  filterIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(
      el.type === "text" || el.type === "search" ? "input" : "change",
      () => {
        renderTournaments();
        renderCalendar();
      },
    );
  });
  document.getElementById("btnClearFilters")?.addEventListener("click", () => {
    filterIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        if (el.type === "checkbox") el.checked = false;
        else el.value = "";
      }
    });
    renderTournaments();
  });

  // ⬇️ 2. CLICK EN CABECERAS DE TABLA (PARA ORDENAR)
  document.getElementById("thDates")?.addEventListener("click", sortByDate);
  document.getElementById("thVRS")?.addEventListener("click", sortByVRS);

  // Delegation
  document.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".btn-edit");
    if (editBtn) {
      editTournament(editBtn.dataset.id);
      return;
    }
    const deleteBtn = e.target.closest(".btn-delete");
    if (deleteBtn) {
      deleteTournament(editBtn ? editBtn.dataset.id : deleteBtn.dataset.id);
      return;
    }
    const favBtn = e.target.closest(".btn-fav");
    if (favBtn) {
      toggleFavorite(favBtn.dataset.id);
      return;
    }
    const teamTag = e.target.closest(".team-tag");
    if (teamTag && teamTag.dataset.team) {
      const search = document.getElementById("fText");
      search.value = teamTag.dataset.team;
      search.dispatchEvent(new Event("input"));
      search.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});

function updateAuthUI(user) {
  const btnSignIn = document.getElementById("btnSignIn");
  const userProfile = document.getElementById("userProfile");
  if (user) {
    btnSignIn?.classList.add("hidden");
    userProfile?.classList.remove("hidden");
    if (document.getElementById("userAvatar"))
      document.getElementById("userAvatar").src = user.photoURL;
    if (document.getElementById("userName"))
      document.getElementById("userName").textContent = user.displayName;
  } else {
    btnSignIn?.classList.remove("hidden");
    userProfile?.classList.add("hidden");
  }
}