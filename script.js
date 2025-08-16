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
    actions: { edit: "Editar", delete: "Eliminar" },
    bool: { yes: "Sí", no: "No" },
    confirmDelete: "¿Eliminar este torneo? Esta acción no se puede deshacer.",
    importSuccess: "Torneos importados correctamente.",
    importError: "Error al importar. Asegúrate de que el archivo es un JSON válido.",
    formTitles: { add: "Agregar Nuevo Torneo", edit: "Editar Torneo" },
    saveButtons: { add: "Agregar Torneo", edit: "Guardar Cambios" },
    toggleLight: "Modo Claro",
    toggleDark: "Modo Oscuro",

    // Filtros + ICS + Leyenda
    filters: {
      text: "Buscar por nombre/equipo",
      tierAny: "Tier (todos)",
      modalityAny: "Modalidad (todas)",
      location: "Ubicación",
      from: "Desde",
      to: "Hasta",
      vrsAny: "VRS (todos)",
      vrsYes: "Sí",
      vrsNo: "No",
      clear: "Limpiar filtros"
    },
    icsButton: "Exportar ICS",
    colorsLegendTitle: "Colores de torneos",
    colorNames: { blue: "Azul", orange: "Naranja", green: "Verde", red: "Rojo", purple: "Violeta", yellow: "Amarillo" },
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

    actions: { edit: "Edit", delete: "Delete" },
    bool: { yes: "Yes", no: "No" },
    confirmDelete: "Delete this tournament? This action cannot be undone.",
    importSuccess: "Tournaments imported successfully.",
    importError: "Import error. Make sure the file is a valid JSON.",
    formTitles: { add: "Add New Tournament", edit: "Edit Tournament" },
    saveButtons: { add: "Add Tournament", edit: "Save Changes" },
    toggleLight: "Light Mode",
    toggleDark: "Dark Mode",

    // Filters + ICS + Legend
    filters: {
      text: "Search by name/team",
      tierAny: "Tier (any)",
      modalityAny: "Modality (any)",
      location: "Location",
      from: "From",
      to: "To",
      vrsAny: "VRS (any)",
      vrsYes: "Yes",
      vrsNo: "No",
      clear: "Clear filters"
    },
    icsButton: "Export ICS",
    colorsLegendTitle: "Tournament colors",
    colorNames: { blue: "Blue", orange: "Orange", green: "Green", red: "Red", purple: "Purple", yellow: "Yellow" },
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

function getFilters() {
  return {
    text: (document.getElementById("fText")?.value || "").toLowerCase(),
    tier: document.getElementById("fTier")?.value || "",
    modality: document.getElementById("fModality")?.value || "",
    location: (document.getElementById("fLocation")?.value || "").toLowerCase(),
    from: document.getElementById("fFrom")?.value || "",
    to: document.getElementById("fTo")?.value || "",
    vrs: document.getElementById("fVRS")?.value || "", // "" | "1" | "0"
  };
}

function filteredTournaments() {
  const f = getFilters();
  return tournaments.filter(t => {
    const textOK =
      !f.text ||
      t.name.toLowerCase().includes(f.text) ||
      t.teams.toLowerCase().includes(f.text);

    const tierOK = !f.tier || t.tier === f.tier;
    const modalityOK = !f.modality || t.modality === f.modality;
    const locationOK = !f.location || t.location.toLowerCase().includes(f.location);

    const start = new Date(t.startDate);
    const end = new Date(t.endDate);
    let rangeOK = true;
    if (f.from) rangeOK = rangeOK && (end >= new Date(f.from));
    if (f.to)   rangeOK = rangeOK && (start <= new Date(f.to));

    let vrsOK = true;
    if (f.vrs === "1") vrsOK = t.vrs === true;
    if (f.vrs === "0") vrsOK = t.vrs === false;

    return textOK && tierOK && modalityOK && locationOK && rangeOK && vrsOK;
  });
}

// ==================== Tema ====================
function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle("light-mode", !isDarkMode);
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
    toggleTheme();
  }
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
    locale: currentLang === "es" ? "es" : "en",
    buttonText: translations[currentLang].calendarButtons,
  });
  calendar.render();
}

function renderCalendar() {
  if (!calendar) return;
  calendar.removeAllEvents();
  filteredTournaments().forEach((tournament) => {
    const start = new Date(tournament.startDate);
    const end = new Date(tournament.endDate);
    end.setDate(end.getDate() + 1); // FullCalendar usa end exclusivo
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

// ==================== Leyenda de colores ====================
function renderLegend() {
  const wrap = document.getElementById("legend");
  if (!wrap) return;
  const t = translations[currentLang];
  const names = t.colorNames;

  wrap.innerHTML = `
    <span class="font-semibold">${t.colorsLegendTitle}:</span>
    ${["blue","orange","green","red","purple","yellow"].map(c => `
      <span class="inline-flex items-center gap-2">
        <span class="inline-block w-4 h-4 rounded-full event-${c}"></span>
        ${names[c]}
      </span>
    `).join("")}
  `;
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
  document.getElementById("tournamentLocation").placeholder = t.placeholderLocation;

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
  document.getElementById("lang-es").classList.toggle("active", lang === "es");
  document.getElementById("lang-en").classList.toggle("active", lang === "en");

  // Texto del botón de tema acorde idioma + estado
  document.getElementById("toggleTheme").textContent = isDarkMode
    ? t.toggleLight
    : t.toggleDark;

  // Re-pintar UI dependiente de textos
  renderTournaments();
  renderCalendar();

  // Filtros (placeholders y opciones)
  const f = translations[lang].filters;

  const fText = document.getElementById("fText");
  if (fText) fText.placeholder = f.text;

  const fTier = document.getElementById("fTier");
  if (fTier && fTier.options.length) fTier.options[0].text = f.tierAny;

  const fModality = document.getElementById("fModality");
  if (fModality && fModality.options.length) fModality.options[0].text = f.modalityAny;

  const fLocation = document.getElementById("fLocation");
  if (fLocation) fLocation.placeholder = f.location;

  const fFrom = document.getElementById("fFrom");
  if (fFrom) fFrom.title = f.from;
  const fTo = document.getElementById("fTo");
  if (fTo) fTo.title = f.to;

  const fVRS = document.getElementById("fVRS");
  if (fVRS && fVRS.options.length >= 3) {
    fVRS.options[0].text = f.vrsAny;
    fVRS.options[1].text = f.vrsYes;
    fVRS.options[2].text = f.vrsNo;
  }

  const btnClear = document.getElementById("btnClearFilters");
  if (btnClear) btnClear.textContent = f.clear;

  // Botón ICS
  const btnICS = document.getElementById("exportICS");
  if (btnICS) btnICS.textContent = translations[lang].icsButton;

  // Leyenda
  renderLegend();
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

function icsEscape(s = "") {
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function exportICS() {
  const list = filteredTournaments();
  if (!list.length) {
    alert(translations[currentLang].noTournaments);
    return;
  }

  let ics = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//CS2 Calendar//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n";

  list.forEach(t => {
    const dtStart = t.startDate.replace(/-/g, "");
    const endPlus1 = new Date(t.endDate);
    endPlus1.setDate(endPlus1.getDate() + 1);
    const dtEnd = endPlus1.toISOString().slice(0,10).replace(/-/g,"");

    const uid = `${t.id}@cs2-calendar`;
    const summary = icsEscape(`${t.name} [${t.tier}]`);
    const description = icsEscape(
      `Equipos: ${t.teams}\nModalidad: ${t.modality}\nVRS: ${t.vrs ? translations[currentLang].bool.yes : translations[currentLang].bool.no}`
    );
    const location = icsEscape(t.location || "");

    ics += "BEGIN:VEVENT\r\n";
    ics += `UID:${uid}\r\n`;
    ics += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g,"").split(".")[0]}Z\r\n`;
    ics += `DTSTART;VALUE=DATE:${dtStart}\r\n`;
    ics += `DTEND;VALUE=DATE:${dtEnd}\r\n`;
    ics += `SUMMARY:${summary}\r\n`;
    if (location) ics += `LOCATION:${location}\r\n`;
    if (description) ics += `DESCRIPTION:${description}\r\n`;
    ics += "END:VEVENT\r\n";
  });

  ics += "END:VCALENDAR\r\n";

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "esports_calendar.ics";
  a.click();
  URL.revokeObjectURL(url);
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
  filteredTournaments().forEach((t) => {
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
  currentLang = localStorage.getItem("lang") || "es";

  initCalendar();
  loadTournamentsAndTheme();
  setLanguage(currentLang);

  ["fText","fTier","fModality","fLocation","fFrom","fTo","fVRS"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", () => { renderTournaments(); renderCalendar(); });
    el.addEventListener("change", () => { renderTournaments(); renderCalendar(); });
  });

  const btnClear = document.getElementById("btnClearFilters");
  if (btnClear) {
    btnClear.addEventListener("click", () => {
      ["fText","fTier","fModality","fLocation","fFrom","fTo","fVRS"].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.value = "";
      });
      renderTournaments();
      renderCalendar();
    });
  }

  document.getElementById("toggleTheme").addEventListener("click", toggleTheme);

  const btnICS = document.getElementById("exportICS");
  if (btnICS) btnICS.addEventListener("click", exportICS);

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