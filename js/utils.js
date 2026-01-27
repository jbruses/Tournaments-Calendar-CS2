// ==========================================
// 1. TRADUCCIONES
// ==========================================
export const translations = {
  es: {
    pageTitle: "Calendario de Esports (CS2)",
    storageNote:
      "Inicia sesión con Google para guardar tus torneos en la nube.",
    signInText: "Iniciar Sesión",
    formTitles: { add: "Agregar Nuevo Torneo", edit: "Editar Torneo" },
    startDateLabel: "Fecha de Inicio",
    endDateLabel: "Fecha de Fin",
    vrsLabel: "Cuenta para Ranking VRS",
    vrsDesc: "¿Este torneo suma puntos para el ranking?",
    saveButtons: { add: "Agregar Torneo", edit: "Guardar Cambios" },
    cancelEditButton: "Cancelar",
    phName: "Ej: IEM Katowice 2026",
    phLocation: "Ej: Colonia, Alemania",
    phSearch: "Buscar torneo, equipo...",
    phTeams: "Escribe equipo y pulsa Enter...",
    filters: {
      tier: "Tier (Todos)",
      mod: "Modalidad",
      location: "Ubicación",
      vrs: "Ranking VRS",
      vrsYes: "Sí (VRS)",
      vrsNo: "No",
      fav: "Solo Favoritos",
      clear: "Limpiar Filtros",
    },
    status: {
      live: "🔴 EN VIVO",
      upcoming: "🔜 PROX",
      completed: "🏁 FIN",
      today: "HOY",
      tomorrow: "MAÑANA",
      liveNow: "EN VIVO AHORA",
    },
    exportButton: "Exportar JSON",
    importButton: "Importar JSON",
    helpButton: "Ayuda",
    clearAllButton: "Borrar todo",
    btnInstall: "Instalar App",
    thTournament: "Torneo",
    thTier: "Tier",
    thDates: "Fechas ↕",
    thTeams: "Equipos",
    thLocation: "Ubicación",
    thModality: "Mod",
    thColor: "Etiqueta",
    thVRS: "VRS ↕",
    thActions: "Acciones",
    highlightsTitle: "Destacados",
    noHighlights: "No hay torneos destacados hoy o mañana",
    favOnly: "Solo favoritos",
    invalidDate: "La fecha de fin no puede ser anterior a la de inicio.",
    incompleteFields: "Completa el nombre y las fechas.",
    confirmDelete: "¿Eliminar este torneo?",
    noTournaments: "No hay torneos para exportar.",
    importSuccess: "Torneos importados correctamente.",
    importError: "Error al importar el archivo JSON.",
    confirmClear:
      "¿Estás seguro de que quieres borrar TODOS los torneos? Esta acción no se puede deshacer.",
    clearSuccess: "Todos los torneos han sido eliminados.",
    calendarButtons: {
      today: "Hoy",
      month: "Mes",
      list: "Lista",
      edit: "Editar",
      delete: "Borrar",
    },
    toggleLight: "Modo Claro",
    toggleDark: "Modo Oscuro",
    helpTitle: "Guía Rápida",
    helpIntro: "Organiza tus torneos de CS2 competitivos.",
    tierOptions: {
      s: "S - Premium",
      a: "A - Alto Nivel",
      b: "B - Nivel Medio",
      c: "C - Nivel Bajo",
      s_short: "S - Premium",
      a_short: "A - Alto",
      b_short: "B - Medio",
      c_short: "C - Bajo",
    },
    modalityOptions: {
      online: "Online",
      offline: "Presencial (LAN)",
      hybrid: "Híbrido (On/Off)",
    },
    colorOptions: {
      blue: "🔵 Azul",
      orange: "🟠 Naranja",
      green: "🟢 Verde",
      red: "🔴 Rojo",
      purple: "🟣 Violeta",
      yellow: "🟡 Amarillo",
    },

    // Labels Form (IDs)
    lbl_name: "Nombre del Torneo",
    lbl_tier: "Tier / Nivel",
    lbl_color: "Color / Etiqueta",
    lbl_teams: "Equipos Participantes",
    lbl_loc: "Ubicación",
    lbl_mod: "Modalidad",
    listTitle: "Lista de Torneos",
    btnCards: "🎴 Tarjetas",
    btnTable: "📊 Tabla",
    btnICS: "📅 Descargar ICS",
    btnCloseHelp: "Entendido",
    footerDev: "Desarrollado por",
    footerCopy: "© 2026 Calendario CS2. Todos los derechos reservados.",
  },
  en: {
    pageTitle: "Esports Calendar (CS2)",
    storageNote: "Sign in with Google to save your tournaments to the cloud.",
    signInText: "Sign In via Google",
    formTitles: { add: "Add New Tournament", edit: "Edit Tournament" },
    startDateLabel: "Start Date",
    endDateLabel: "End Date",
    vrsLabel: "Counts for VRS Ranking",
    vrsDesc: "Does this tournament count for ranking?",
    saveButtons: { add: "Add Tournament", edit: "Save Changes" },
    cancelEditButton: "Cancel",
    phName: "Ex: PGL Major Copenhagen",
    phLocation: "Ex: Cologne, Germany",
    phSearch: "Search tournament, team...",
    phTeams: "Type team and hit Enter...",
    filters: {
      tier: "Tier (All)",
      mod: "Modality",
      location: "Location",
      vrs: "VRS Ranking",
      vrsYes: "Yes (VRS)",
      vrsNo: "No",
      fav: "Favorites Only",
      clear: "Clear Filters",
    },
    status: {
      live: "🔴 LIVE",
      upcoming: "🔜 SOON",
      completed: "🏁 END",
      today: "TODAY",
      tomorrow: "TOMORROW",
      liveNow: "LIVE NOW",
    },
    exportButton: "Export JSON",
    importButton: "Import JSON",
    helpButton: "Help",
    clearAllButton: "Clear All",
    btnInstall: "Install App",
    thTournament: "Tournament",
    thTier: "Tier",
    thDates: "Dates ↕",
    thTeams: "Teams",
    thLocation: "Location",
    thModality: "Mod",
    thColor: "Label",
    thVRS: "VRS ↕",
    thActions: "Actions",
    highlightsTitle: "Highlights",
    noHighlights: "No highlights for today or tomorrow",
    favOnly: "Favorites only",
    invalidDate: "End date cannot be earlier than start date.",
    incompleteFields: "Please complete name and dates.",
    confirmDelete: "Delete this tournament?",
    noTournaments: "No tournaments to export.",
    importSuccess: "Tournaments imported successfully.",
    importError: "Error importing JSON file.",
    confirmClear:
      "Are you sure you want to clear ALL tournaments? This action cannot be undone.",
    clearSuccess: "All tournaments have been cleared.",
    calendarButtons: {
      today: "Today",
      month: "Month",
      list: "List",
      edit: "Edit",
      delete: "Delete",
    },
    toggleLight: "Light Mode",
    toggleDark: "Dark Mode",
    helpTitle: "Quick Guide",
    helpIntro: "Manage your competitive CS2 tournaments.",
    tierOptions: {
      s: "S - Premium",
      a: "A - High Tier",
      b: "B - Mid Tier",
      c: "C - Low Tier",
      s_short: "S - Premium",
      a_short: "A - High",
      b_short: "B - Mid",
      c_short: "C - Low",
    },
    modalityOptions: {
      online: "Online",
      offline: "Offline (LAN)",
      hybrid: "Hybrid (On/Off)",
    },
    colorOptions: {
      blue: "🔵 Blue",
      orange: "🟠 Orange",
      green: "🟢 Green",
      red: "🔴 Red",
      purple: "🟣 Purple",
      yellow: "🟡 Yellow",
    },

    // Labels Form (IDs)
    lbl_name: "Tournament Name",
    lbl_tier: "Tier / Level",
    lbl_color: "Color / Label",
    lbl_teams: "Participating Teams",
    lbl_loc: "Location",
    lbl_mod: "Modality",
    listTitle: "Tournaments List",
    btnCards: "🎴 Cards",
    btnTable: "📊 Table",
    btnICS: "📅 Download ICS",
    btnCloseHelp: "Got it",
    footerDev: "Developed by",
    footerCopy: "© 2026 CS2 Calendar. All rights reserved.",
  },
};

// ==========================================
// 2. HELPERS BÁSICOS
// ==========================================
export function getLang() {
  return localStorage.getItem("lang") || "es";
}
export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}
export function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ==========================================
// 3. TOGGLE FORM
// ==========================================
export function toggleAddForm() {
  const formBody = document.getElementById("addTournamentFormBody");
  const formBtns = document.getElementById("addTournamentButtons");
  const icon = document.getElementById("toggleFormIcon");
  if (!formBody) return;
  const isHidden = formBody.classList.contains("hidden");
  if (isHidden) {
    formBody.classList.remove("hidden");
    if (formBtns) formBtns.classList.remove("hidden");
    if (icon) icon.style.transform = "rotate(180deg)";
  } else {
    formBody.classList.add("hidden");
    if (formBtns) formBtns.classList.add("hidden");
    if (icon) icon.style.transform = "rotate(0deg)";
  }
}

// ==========================================
// 4. GESTIÓN DE TAGS (EQUIPOS)
// ==========================================
export let currentTeams = [];

export function setCurrentTeams(teamsArray) {
  currentTeams = teamsArray || [];
  renderInputTags();
}

export function addTeamTag(team) {
  const cleaned = team.trim();
  if (
    cleaned &&
    !currentTeams.some((t) => t.toLowerCase() === cleaned.toLowerCase())
  ) {
    currentTeams.push(cleaned);
    renderInputTags();
  }
  const input = document.getElementById("tournamentTeams");
  if (input) {
    input.value = "";
    input.focus();
  }
}

export function removeTeamTag(team) {
  currentTeams = currentTeams.filter((t) => t !== team);
  renderInputTags();
}

export function renderInputTags() {
  const container = document.getElementById("teamTagsInput");
  const input = document.getElementById("tournamentTeams");
  if (!container || !input) return;

  const existingTags = container.querySelectorAll(".tag-element");
  existingTags.forEach((t) => t.remove());

  currentTeams.forEach((team) => {
    const tag = document.createElement("span");
    tag.className =
      "tag-element flex items-center gap-1 bg-brand-600/20 text-brand-200 border border-brand-500/30 px-2 py-1 rounded text-xs font-semibold mr-1 mb-1 animate-fadeIn cursor-default";
    tag.innerHTML = `
        <span>${escapeHtml(team)}</span> 
        <span class="remove-tag-icon cursor-pointer hover:text-white hover:bg-brand-500 rounded-full w-4 h-4 flex items-center justify-center transition-colors font-bold">&times;</span>
    `;
    tag.querySelector(".remove-tag-icon").addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeTeamTag(team);
    });
    container.insertBefore(tag, input);
  });
}

// ==========================================
// 5. AUTOCOMPLETADO ROBUSTO
// ==========================================
const COMMON_TEAMS = [
  "Natus Vincere",
  "FaZe Clan",
  "Team Vitality",
  "G2 Esports",
  "Team Spirit",
  "MOUZ",
  "Virtus.pro",
  "Team Falcons",
  "Astralis",
  "Team Liquid",
  "Complexity",
  "FURIA Esports",
  "HEROIC",
  "Eternal Fire",
  "The MongolZ",
  "9z Team",
  "Imperial Esports",
  "MIBR",
  "BESTIA",
  "KRÜ Esports",
  "Leviatán",
  "paiN Gaming",
  "RED Canids",
  "Sharks Esports",
  "ODDIK",
];

const dropdownClasses =
  "autocomplete-dropdown hidden absolute w-full max-h-48 overflow-y-auto bg-dark-800 border border-gray-700 rounded-lg shadow-xl z-50 mt-1";
const itemClasses =
  "autocomplete-item p-3 hover:bg-brand-600 hover:text-white cursor-pointer text-sm text-gray-300 border-b border-gray-700/50 last:border-0 transition-colors";

// --- A. FILTRO PRINCIPAL (BUSCADOR) ---
export function setupTeamAutocomplete() {
  const input = document.getElementById("fText");
  if (!input) return;

  // Creamos dropdown SOLO si no existe en HTML
  let dropdown = document.getElementById("autocompleteDropdown");
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.id = "autocompleteDropdown";
    dropdown.className = dropdownClasses;
    if (input.parentNode) {
      input.parentNode.style.position = "relative";
      input.parentNode.appendChild(dropdown);
    }
  }

  input.addEventListener("input", function () {
    const val = this.value.toLowerCase();

    if (!val) {
      dropdown.classList.add("hidden");
      return;
    }

    const matches = COMMON_TEAMS.filter((t) => t.toLowerCase().includes(val));

    if (matches.length === 0) {
      dropdown.classList.add("hidden");
      return;
    }

    dropdown.innerHTML = "";
    matches.forEach((team) => {
      const div = document.createElement("div");
      div.className = itemClasses;
      div.textContent = team;

      div.addEventListener("mousedown", (e) => {
        e.preventDefault();
        input.value = team;
        input.dispatchEvent(new Event("input"));
        dropdown.classList.add("hidden");
      });
      dropdown.appendChild(div);
    });
    dropdown.classList.remove("hidden");
  });

  input.addEventListener("blur", () =>
    setTimeout(() => dropdown.classList.add("hidden"), 200),
  );
}

// --- B. FORMULARIO (AGREGAR EQUIPOS) ---
export function setupFormAutocomplete() {
  const input = document.getElementById("tournamentTeams");
  const container = document.getElementById("teamTagsInput");
  // USAMOS EL DROPDOWN EXISTENTE
  const dropdown = document.getElementById("teamsAutocompleteDropdown");

  if (!input || !container || !dropdown) return;

  // Clic en contenedor -> Foco en input
  container.addEventListener("click", (e) => {
    if (e.target === container || e.target.classList.contains("tag-element")) {
      input.focus();
    }
  });

  // 1. Enter Key
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); // Stop Submit
      addTeamTag(this.value.replace(",", ""));
      dropdown.classList.add("hidden");
    }
    if (e.key === "Backspace" && this.value === "" && currentTeams.length > 0) {
      currentTeams.pop();
      renderInputTags();
    }
  });

  // 2. Escribir
  input.addEventListener("input", function () {
    const val = this.value.toLowerCase();

    if (!val) {
      dropdown.classList.add("hidden");
      return;
    }

    const matches = COMMON_TEAMS.filter(
      (t) =>
        t.toLowerCase().includes(val) &&
        !currentTeams.some((ct) => ct.toLowerCase() === t.toLowerCase()),
    );

    if (matches.length === 0) {
      dropdown.classList.add("hidden");
      return;
    }

    dropdown.innerHTML = "";
    matches.forEach((team) => {
      const div = document.createElement("div");
      div.className = itemClasses;
      div.textContent = team;

      div.addEventListener("mousedown", (e) => {
        e.preventDefault();
        addTeamTag(team);
        dropdown.classList.add("hidden");
      });

      dropdown.appendChild(div);
    });
    dropdown.classList.remove("hidden");
  });

  input.addEventListener("blur", () =>
    setTimeout(() => dropdown.classList.add("hidden"), 200),
  );
}
