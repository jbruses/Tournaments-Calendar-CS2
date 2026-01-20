import { tournaments } from "./tournaments.js";

// Estado local para los tags del formulario
let currentTeams = [];

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function getAllTeams() {
  const teamsSet = new Set();
  tournaments.forEach((t) => {
    if (!t.teams) return;
    t.teams.split(",").forEach((team) => {
      const trimmed = team.trim();
      if (trimmed) teamsSet.add(trimmed);
    });
  });
  return Array.from(teamsSet).sort();
}

// --- ESTILOS COMPARTIDOS ---
const dropdownClasses =
  "autocomplete-dropdown hidden absolute w-full max-h-48 overflow-y-auto bg-dark-800 border border-gray-700 rounded-lg shadow-xl z-50 mt-1";
const itemClasses =
  "autocomplete-item p-3 hover:bg-brand-600 hover:text-white cursor-pointer text-sm text-gray-300 border-b border-gray-700/50 last:border-0 transition-colors";

// ==========================================
// 1. AUTOCOMPLETADO DEL FILTRO PRINCIPAL
// ==========================================
function setupTeamAutocomplete() {
  const input = document.getElementById("fText");
  if (!input) return;

  let dropdown = document.getElementById("autocompleteDropdown");

  // Si no existe, lo creamos
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.id = "autocompleteDropdown";
    dropdown.className = dropdownClasses;
    if (input.parentNode) {
      input.parentNode.style.position = "relative";
      input.parentNode.appendChild(dropdown);
    }
  }

  // ARREGLO 1: El listener VA FUERA del if, para asegurar que se adjunte siempre
  // Usamos cloneNode para limpiar listeners viejos y evitar duplicados
  const newDropdown = dropdown.cloneNode(true);
  dropdown.parentNode.replaceChild(newDropdown, dropdown);
  dropdown = newDropdown;

  dropdown.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const item = e.target.closest(".autocomplete-item");
    if (item) {
      selectAutocompleteTeam(item.dataset.team);
    }
  });

  input.addEventListener("input", function () {
    const val = this.value.toLowerCase();
    dropdown.innerHTML = "";

    if (!val) {
      dropdown.classList.add("hidden");
      return;
    }

    const matches = getAllTeams().filter((t) => t.toLowerCase().includes(val));

    if (matches.length === 0) {
      dropdown.classList.add("hidden");
      return;
    }

    matches.forEach((team) => {
      const div = document.createElement("div");
      div.className = itemClasses;
      div.dataset.team = team;
      div.textContent = team;
      dropdown.appendChild(div);
    });
    dropdown.classList.remove("hidden");
  });

  document.addEventListener("mousedown", function (e) {
    if (e.target !== input && !dropdown.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });
}

function selectAutocompleteTeam(team) {
  const input = document.getElementById("fText");
  const dropdown = document.getElementById("autocompleteDropdown");

  if (input) {
    input.value = team;
    input.dispatchEvent(new Event("input"));
  }
  if (dropdown) dropdown.classList.add("hidden");
}

// ==========================================
// 2. TAGS Y AUTOCOMPLETADO DEL FORMULARIO
// ==========================================

function renderInputTags() {
  const container = document.getElementById("teamTagsInput");
  const input = document.getElementById("tournamentTeams");
  if (!container || !input) return;

  const existingTags = container.querySelectorAll(".tag-element");
  existingTags.forEach((t) => t.remove());

  currentTeams.forEach((team) => {
    const tag = document.createElement("span");
    tag.className =
      "tag-element flex items-center gap-1 bg-brand-600/20 text-brand-200 border border-brand-500/30 px-2 py-1 rounded text-xs font-semibold mr-1 mb-1 animate-fadeIn";
    tag.innerHTML = `
            <span>${escapeHtml(team)}</span> 
            <span class="remove-tag-icon cursor-pointer hover:text-white hover:bg-brand-500 rounded-full w-4 h-4 flex items-center justify-center transition-colors" data-team="${escapeHtml(team)}">&times;</span>
        `;
    container.insertBefore(tag, input);
  });
}

function addTeamTag(team) {
  const cleaned = team.trim();
  if (cleaned && !currentTeams.includes(cleaned)) {
    currentTeams.push(cleaned);
    renderInputTags();
  }
  const input = document.getElementById("tournamentTeams");
  if (input) {
    input.value = "";
    input.focus();
  }
}

function removeTeamTag(team) {
  currentTeams = currentTeams.filter((t) => t !== team);
  renderInputTags();
}

function setupFormAutocomplete() {
  const input = document.getElementById("tournamentTeams");
  const container = document.getElementById("teamTagsInput");

  if (!input || !container) return;

  container.onclick = (e) => {
    const removeIcon = e.target.closest(".remove-tag-icon");
    if (removeIcon) {
      e.preventDefault();
      e.stopPropagation();
      removeTeamTag(removeIcon.dataset.team);
      return;
    }
    if (e.target === container || e.target.classList.contains("tag-element")) {
      input.focus();
    }
  };

  let dropdown = document.getElementById("teamsAutocompleteDropdown");

  // Si no existe, lo creamos (aunque ya existe en tu HTML)
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.id = "teamsAutocompleteDropdown";
    dropdown.className = dropdownClasses;
    if (container.parentElement) {
      container.parentElement.style.position = "relative";
      container.parentElement.appendChild(dropdown);
    }
  }

  // ARREGLO 2: Aquí estaba el error.
  // Ahora limpiamos el elemento (clonándolo) y le pegamos el listener SIEMPRE.
  const newDropdown = dropdown.cloneNode(true);
  dropdown.parentNode.replaceChild(newDropdown, dropdown);
  dropdown = newDropdown;

  dropdown.addEventListener("mousedown", (e) => {
    e.preventDefault(); // Magia
    const item = e.target.closest(".autocomplete-item");
    if (item) {
      addTeamTag(item.dataset.team);
      dropdown.classList.add("hidden");
    }
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTeamTag(this.value.replace(",", ""));
      dropdown.classList.add("hidden");
    }
    if (e.key === "Backspace" && this.value === "" && currentTeams.length > 0) {
      currentTeams.pop();
      renderInputTags();
    }
  });

  input.addEventListener("input", function () {
    const val = this.value.toLowerCase();
    dropdown.innerHTML = "";
    if (!val) {
      dropdown.classList.add("hidden");
      return;
    }

    const matches = getAllTeams().filter(
      (t) => t.toLowerCase().includes(val) && !currentTeams.includes(t),
    );

    if (matches.length === 0) {
      dropdown.classList.add("hidden");
      return;
    }

    matches.forEach((team) => {
      const div = document.createElement("div");
      div.className = itemClasses;
      div.dataset.team = team;
      div.textContent = team;
      dropdown.appendChild(div);
    });
    dropdown.classList.remove("hidden");
  });

  document.addEventListener("mousedown", function (e) {
    if (e.target !== input && !dropdown.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });
}

function setCurrentTeams(teamsArray) {
  currentTeams = teamsArray || [];
  renderInputTags();
}

export {
  formatDate,
  escapeHtml,
  getAllTeams,
  setupTeamAutocomplete,
  renderInputTags,
  addTeamTag,
  removeTeamTag,
  setupFormAutocomplete,
  currentTeams,
  setCurrentTeams,
};
