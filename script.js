// ==================== Traducciones ====================
const translations = {
  es: {
    pageTitle: "Calendario de Esports (CS2)",
    storageNote:
      "Los datos se guardan localmente en tu navegador. Exporta tu calendario para respaldarlo o compartirlo. No compartas el archivo JSON si contiene información sensible.",
    formTitle: "Agregar Nuevo Torneo",
    startDateLabel: "Fecha de Inicio",
    endDateLabel: "Fecha de Fin",
    vrsLabel: "Cuenta para el VRS",
    saveButton: "Agregar Torneo",
    cancelEditButton: "Cancelar",
    exportButton: "Exportar",
    importButton: "Importar",
    helpButton: "Ayuda",
    clearAllButton: "Borrar todo",

    thTournament: "Torneo",
    thTier: "Tier",
    thDates: "Fechas",
    thTeams: "Equipos",
    thLocation: "Ubicación",
    thModality: "Modalidad",
    thColor: "Color",
    thVRS: "VRS",
    thActions: "Acciones",

    helpTitle: "Ayuda",
    helpIntro:
      "Bienvenido al Calendario de Esports (CS2). Aquí tienes las instrucciones básicas:",
    helpAdd: "Agregar Torneo:",
    helpEdit: "Editar Torneo:",
    helpDelete: "Eliminar Torneo:",
    helpExport: "Exportar:",
    helpImport: "Importar:",
    helpClear: "Borrar todo:",
    helpNote: "Nota:",
    closeHelp: "Cerrar",

    confirmClear:
      "¿Estás seguro de que deseas borrar todos los torneos? Esta acción no se puede deshacer. Te recomendamos exportar tus datos primero.",
    clearSuccess: "Todos los torneos han sido borrados.",
    incompleteFields: "Por favor, completa todos los campos.",
    invalidDate: "La fecha de fin no puede ser anterior a la fecha de inicio.",
    noTournaments: "No hay torneos para exportar.",

    placeholderName: "Nombre del Torneo",
    placeholderTeams: "Equipos (separados por coma)",
    placeholderLocation: "Ubicación (ej. Londres, Online)",

    tierOptions: ["S (Máxima Relevancia)", "A", "B", "C"],
    colorOptions: ["Azul", "Naranja", "Verde", "Rojo", "Violeta", "Amarillo"],

    calendarButtons: {
      today: "Hoy",
      month: "Mes",
      week: "Semana",
      day: "Día",
    },

    // NUEVOS
    actions: { edit: "Editar", delete: "Eliminar" },
    bool: { yes: "Sí", no: "No" },
    confirmDelete: "¿Eliminar este torneo? Esta acción no se puede deshacer.",
    importSuccess: "Torneos importados correctamente.",
    importError: "Error al importar. Asegúrate de que el archivo es un JSON válido.",
    formTitles: { add: "Agregar Nuevo Torneo", edit: "Editar Torneo" },
    saveButtons: { add: "Agregar Torneo", edit: "Guardar Cambios" },
    toggleLight: "Modo Claro",
    toggleDark: "Modo Oscuro",
  },

  en: {
    pageTitle: "Esports Calendar (CS2)",
    storageNote:
      "Data is saved locally in your browser. Export your calendar for backup or sharing. Do not share the JSON file if it contains sensitive information.",
    formTitle: "Add New Tournament",
    startDateLabel: "Start Date",
    endDateLabel: "End Date",
    vrsLabel: "Count for VRS",
    saveButton: "Add Tournament",
    cancelEditButton: "Cancel",
    exportButton: "Export",
    importButton: "Import",
    helpButton: "Help",
    clearAllButton: "Clear All",

    thTournament: "Tournament",
    thTier: "Tier",
    thDates: "Dates",
    thTeams: "Teams",
    thLocation: "Location",
    thModality: "Modality",
    thColor: "Color",
    thVRS: "VRS",
    thActions: "Actions",

    helpTitle: "Help",
    helpIntro:
      "Welcome to the Esports Calendar (CS2). Here are the basic instructions:",
    helpAdd: "Add Tournament:",
    helpEdit: "Edit Tournament:",
    helpDelete: "Delete Tournament:",
    helpExport: "Export:",
    helpImport: "Import:",
    helpClear: "Clear All:",
    helpNote: "Note:",
    closeHelp: "Close",

    confirmClear:
      "Are you sure you want to clear all tournaments? This action cannot be undone. We recommend exporting your data first.",
    clearSuccess: "All tournaments have been cleared.",
    incompleteFields: "Please fill in all fields.",
    invalidDate: "The end date cannot be earlier than the start date.",
    noTournaments: "There are no tournaments to export.",

    placeholderName: "Tournament Name",
    placeholderTeams: "Teams (comma separated)",
    placeholderLocation: "Location (e.g. London, Online)",

    tierOptions: ["S (Highest Relevance)", "A", "B", "C"],
    colorOptions: ["Blue", "Orange", "Green", "Red", "Purple", "Yellow"],

    calendarButtons: {
      today: "Today",
      month: "Month",
      week: "Week",
      day: "Day",
    },

    // NEW
    actions: { edit: "Edit", delete: "Delete" },
    bool: { yes: "Yes", no: "No" },
    confirmDelete: "Delete this tournament? This action cannot be undone.",
    importSuccess: "Tournaments imported successfully.",
    importError: "Import error. Make sure the file is a valid JSON.",
    formTitles: { add: "Add New Tournament", edit: "Edit Tournament" },
    saveButtons: { add: "Add Tournament", edit: "Save Changes" },
    toggleLight: "Light Mode",
    toggleDark: "Dark Mode",
  },
};

// ==================== Estado ====================
let currentLang = "es";
let isDarkMode = true; // por defecto
let tournaments = [];
let sortDirectionDate = 1;
let sortDirectionVRS = 1;
let editingTournamentId = null;
let calendar;

// ==================== Utilidades ====================
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// ==================== Tema ====================
function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle("light-mode", !isDarkMode);
  // texto del botón según idioma
  document.getElementById("toggleTheme").textContent = isDarkMode
    ? translations[currentLang].toggleLight
    : translations[currentLang].toggleDark;
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
}

// ==================== Persistencia ====================
function saveTournaments() {
  localStorage.setItem("tournaments", JSON.stringify(tournaments));
}

function loadTournamentsAndTheme() {
  const savedTournaments = localStorage.getItem("tournaments");
  if (savedTournaments) {
    tournaments = JSON.parse(savedTournaments);
    renderTournaments();
    renderCalendar();
  }
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    // aplica modo claro si fue guardado
    toggleTheme();
  }
  // NO marcamos 🇪🇸 como activo acá; lo maneja setLanguage
}

// ==================== Calendario ====================
function initCalendar() {
  const calendarEl = document.getElementById("calendar");
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    events: [],
    eventClick: function (info) {
      editTournament(parseInt(info.event.id));
    },
    eventDisplay: "block",
    eventTimeFormat: { hour: "numeric", minute: "2-digit", hour12: false },
    firstDay: 1,
    // usar el idioma actual desde el arranque
    locale: currentLang === "es" ? "es" : "en",
    buttonText: translations[currentLang].calendarButtons,
  });
  calendar.render();
}

function renderCalendar() {
  if (!calendar) return;
  calendar.removeAllEvents();
  tournaments.forEach((tournament) => {
    const start = new Date(tournament.startDate);
    const end = new Date(tournament.endDate);
    end.setDate(end.getDate() + 1); // FC usa end exclusivo
    calendar.addEvent({
      id: tournament.id,
      title: `${tournament.name} (${tournament.teams}, ${tournament.location}, ${tournament.modality}, ${formatDate(
        tournament.startDate
      )} - ${formatDate(tournament.endDate)})`,
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
      classNames: [`event-${tournament.color}`],
      extendedProps: {
        tier: tournament.tier,
        vrs: tournament.vrs,
        location: tournament.location,
        modality: tournament.modality,
      },
    });
  });
}

// ==================== Idioma ====================
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", currentLang);
  document.documentElement.setAttribute("lang", lang === "es" ? "es" : "en");

  const t = translations[lang];

  // Textos de cabecera / formularios / tabla / ayuda
  document.getElementById("pageTitle").textContent = t.pageTitle;
  document.getElementById("storageNote").textContent = t.storageNote;
  document.getElementById("formTitle").textContent =
    editingTournamentId ? t.formTitles.edit : t.formTitles.add;
  document.getElementById("startDateLabel").textContent = t.startDateLabel;
  document.getElementById("endDateLabel").textContent = t.endDateLabel;
  document.getElementById("vrsLabel").textContent = t.vrsLabel;
  document.getElementById("saveButton").textContent =
    editingTournamentId ? t.saveButtons.edit : t.saveButtons.add;
  document.getElementById("cancelEditButton").textContent = t.cancelEditButton;
  document.getElementById("exportButton").textContent = t.exportButton;
  document.getElementById("importButton").textContent = t.importButton;
  document.getElementById("helpButton").textContent = t.helpButton;
  document.getElementById("clearAllButton").textContent = t.clearAllButton;

  document.getElementById("thTournament").textContent = t.thTournament;
  document.getElementById("thTier").textContent = t.thTier;
  document.getElementById("thDates").textContent = t.thDates;
  document.getElementById("thTeams").textContent = t.thTeams;
  document.getElementById("thLocation").textContent = t.thLocation;
  document.getElementById("thModality").textContent = t.thModality;
  document.getElementById("thColor").textContent = t.thColor;
  document.getElementById("thVRS").textContent = t.thVRS;
  document.getElementById("thActions").textContent = t.thActions;

  document.getElementById("helpTitle").textContent = t.helpTitle;
  document.getElementById("helpIntro").textContent = t.helpIntro;
  document.getElementById("helpAdd").textContent = t.helpAdd;
  document.getElementById("helpEdit").textContent = t.helpEdit;
  document.getElementById("helpDelete").textContent = t.helpDelete;
  document.getElementById("helpExport").textContent = t.helpExport;
  document.getElementById("helpImport").textContent = t.helpImport;
  document.getElementById("helpClear").textContent = t.helpClear;
  document.getElementById("helpNote").textContent = t.helpNote;
  document.getElementById("closeHelp").textContent = t.closeHelp;

  // Placeholders
  document.getElementById("tournamentName").placeholder = t.placeholderName;
  document.getElementById("tournamentTeams").placeholder = t.placeholderTeams;
  document.getElementById("tournamentLocation").placeholder =
    t.placeholderLocation;

  // Re-crear opciones de selects manteniendo selección previa
  const tierSelect = document.getElementById("tournamentTier");
  const colorSelect = document.getElementById("tournamentColor");
  const prevTier = tierSelect.value;
  const prevColor = colorSelect.value;

  tierSelect.innerHTML = "";
  ["S", "A", "B", "C"].forEach((val, i) => {
    const opt = document.createElement("option");
    opt.value = val;
    opt.text = t.tierOptions[i];
    tierSelect.appendChild(opt);
  });

  const colorVals = ["blue", "orange", "green", "red", "purple", "yellow"];
  colorSelect.innerHTML = "";
  colorVals.forEach((val, i) => {
    const opt = document.createElement("option");
    opt.value = val;
    opt.text = t.colorOptions[i];
    colorSelect.appendChild(opt);
  });

  if (prevTier) tierSelect.value = prevTier;
  if (prevColor) colorSelect.value = prevColor;

  // Calendario (locale + labels de botones)
  if (calendar) {
    calendar.setOption("locale", lang === "es" ? "es" : "en");
    calendar.setOption("buttonText", t.calendarButtons);
  }

  // Estado visual de los toggles de idioma
  document
    .getElementById("lang-es")
    .classList.toggle("active", lang === "es");
  document
    .getElementById("lang-en")
    .classList.toggle("active", lang === "en");

  // Texto del botón de tema acorde idioma + estado
  document.getElementById("toggleTheme").textContent = isDarkMode
    ? t.toggleLight
    : t.toggleDark;

  // Re-pintar UI dependiente de textos
  renderTournaments();
  renderCalendar();
}

// ==================== CRUD Torneos ====================
function saveTournament() {
  const name = document.getElementById("tournamentName").value.trim();
  const tier = document.getElementById("tournamentTier").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const teams = document.getElementById("tournamentTeams").value.trim();
  const location = document.getElementById("tournamentLocation").value.trim();
  const modality = document.getElementById("tournamentModality").value;
  const color = document.getElementById("tournamentColor").value;
  const vrs = document.getElementById("tournamentVRS").checked;

  if (name && tier && startDate && endDate && teams && location && modality && color) {
    if (new Date(endDate) < new Date(startDate)) {
      alert(translations[currentLang].invalidDate);
      return;
    }

    if (editingTournamentId) {
      tournaments = tournaments.map((t) =>
        t.id === editingTournamentId
          ? { ...t, name, tier, startDate, endDate, teams, location, modality, color, vrs }
          : t
      );
    } else {
      const tournament = {
        id: Date.now(),
        name,
        tier,
        startDate,
        endDate,
        teams,
        location,
        modality,
        color,
        vrs,
      };
      tournaments.push(tournament);
    }

    saveTournaments();
    renderTournaments();
    renderCalendar();
    cancelEdit();
  } else {
    alert(translations[currentLang].incompleteFields);
  }
}

function editTournament(id) {
  const t = tournaments.find((x) => x.id === id);
  if (!t) return;
  document.getElementById("tournamentName").value = t.name;
  document.getElementById("tournamentTier").value = t.tier;
  document.getElementById("tournamentLocation").value = t.location;
  document.getElementById("tournamentModality").value = t.modality;
  document.getElementById("startDate").value = t.startDate;
  document.getElementById("endDate").value = t.endDate;
  document.getElementById("tournamentTeams").value = t.teams;
  document.getElementById("tournamentColor").value = t.color;
  document.getElementById("tournamentVRS").checked = t.vrs;

  // Títulos y botones i18n para modo Edición
  document.getElementById("formTitle").textContent = translations[currentLang].formTitles.edit;
  document.getElementById("saveButton").textContent = translations[currentLang].saveButtons.edit;
  document.getElementById("cancelEditButton").classList.remove("hidden");
  editingTournamentId = id;
}

function cancelEdit() {
  editingTournamentId = null;
  document.getElementById("formTitle").textContent = translations[currentLang].formTitles.add;
  document.getElementById("saveButton").textContent = translations[currentLang].saveButtons.add;
  document.getElementById("cancelEditButton").classList.add("hidden");
  clearForm();
}

function confirmDelete(id) {
  const msg = translations[currentLang].confirmDelete;
  if (window.confirm(msg)) {
    deleteTournament(id);
  }
}

function deleteTournament(id) {
  tournaments = tournaments.filter((t) => t.id !== id);
  saveTournaments();
  renderTournaments();
  renderCalendar();
}

function clearForm() {
  document.getElementById("tournamentName").value = "";
  document.getElementById("tournamentTier").value = "S";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  document.getElementById("tournamentTeams").value = "";
  document.getElementById("tournamentLocation").value = "";
  document.getElementById("tournamentModality").value = "Online";
  document.getElementById("tournamentColor").value = "blue";
  document.getElementById("tournamentVRS").checked = false;
}

// ==================== Exportar / Importar ====================
function exportTournaments() {
  const data = localStorage.getItem("tournaments");
  if (data) {
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tournaments_backup.json";
    a.click();
    URL.revokeObjectURL(url);
  } else {
    alert(translations[currentLang].noTournaments);
  }
}

function importTournaments(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedData = e.target.result;
      tournaments = JSON.parse(importedData);
      localStorage.setItem("tournaments", JSON.stringify(tournaments));
      renderTournaments();
      renderCalendar();
      alert(translations[currentLang].importSuccess);
    } catch (error) {
      alert(translations[currentLang].importError);
    }
  };
  reader.readAsText(file);
  event.target.value = ""; // limpia input
}

// ==================== Borrar todo ====================
function confirmClearAll() {
  if (confirm(translations[currentLang].confirmClear)) {
    clearAllTournaments();
  }
}

function clearAllTournaments() {
  tournaments = [];
  localStorage.removeItem("tournaments");
  renderTournaments();
  renderCalendar();
  alert(translations[currentLang].clearSuccess);
}

// ==================== Render de tabla ====================
function renderTournaments() {
  const tbody = document.getElementById("tournamentBody");
  tbody.innerHTML = "";
  tournaments.forEach((t) => {
    const row = document.createElement("tr");
    row.className =
      "border-b border-gray-600 hover:bg-gray-700 transition-colors duration-200";
    row.innerHTML = `
      <td class="py-3 px-6 text-left">${t.name}</td>
      <td class="py-3 px-6 text-left">${t.tier}</td>
      <td class="py-3 px-6 text-left">${formatDate(t.startDate)} - ${formatDate(t.endDate)}</td>
      <td class="py-3 px-6 text-left">${t.teams}</td>
      <td class="py-3 px-6 text-left">${t.location}</td>
      <td class="py-3 px-6 text-left">${t.modality}</td>
      <td class="py-3 px-6 text-left">
        <span class="inline-block w-4 h-4 rounded-full event-${t.color}"></span>
        ${t.color.charAt(0).toUpperCase() + t.color.slice(1)}
      </td>
      <td class="py-3 px-6 text-left">
        ${t.vrs ? translations[currentLang].bool.yes : translations[currentLang].bool.no}
      </td>
      <td class="py-3 px-6 text-center flex gap-2 justify-center">
        <button onclick="editTournament(${t.id})"
          class="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700">
          ${translations[currentLang].actions.edit}
        </button>
        <button onclick="confirmDelete(${t.id})"
          class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
          ${translations[currentLang].actions.delete}
        </button>
      </td>`;
    tbody.appendChild(row);
  });
}

// ==================== Ordenamientos ====================
function sortByDate() {
  tournaments.sort((a, b) => sortDirectionDate * (new Date(a.startDate) - new Date(b.startDate)));
  sortDirectionDate = -sortDirectionDate;
  renderTournaments();
}

function sortByVRS() {
  tournaments.sort((a, b) => sortDirectionVRS * (b.vrs - a.vrs));
  sortDirectionVRS = -sortDirectionVRS;
  renderTournaments();
}

// ==================== Inicio ====================
function boot() {
  // idioma guardado (o ES por defecto)
  currentLang = localStorage.getItem("lang") || "es";

  // calendario primero, usando currentLang
  initCalendar();

  // torneos + tema
  loadTournamentsAndTheme();

  // aplicar textos del idioma
  setLanguage(currentLang);

  // listener de tema
  document.getElementById("toggleTheme").addEventListener("click", toggleTheme);

  // sincronizar texto del botón de tema
  document.getElementById("toggleTheme").textContent = isDarkMode
    ? translations[currentLang].toggleLight
    : translations[currentLang].toggleDark;
}

document.addEventListener("DOMContentLoaded", boot);

// Exponer funciones globales (por los onclick del HTML)
window.setLanguage = setLanguage;
window.toggleTheme = toggleTheme;
window.saveTournament = saveTournament;
window.cancelEdit = cancelEdit;
window.exportTournaments = exportTournaments;
window.importTournaments = importTournaments;
window.showHelp = showHelp;
window.hideHelp = hideHelp;
window.confirmClearAll = confirmClearAll;
window.sortByDate = sortByDate;
window.sortByVRS = sortByVRS;
window.editTournament = editTournament;
window.confirmDelete = confirmDelete;

// Modal
function showHelp() {
  document.getElementById("helpModal").classList.remove("hidden");
}
function hideHelp() {
  document.getElementById("helpModal").classList.add("hidden");
}