import { renderTournaments, tournaments } from './tournaments.js';
import { renderCalendar } from './calendar.js';
import { renderHighlights } from './highlights.js';
import { renderInputTags } from './utils.js';

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

        // View toggle
        viewCards: "🎴 Cards",
        viewTable: "📊 Tabla",

        // Calendar filter
        showAll: "Mostrar todos",
        filtering: "Filtrando:",

        // Highlights
        highlightsTitle: "Destacados",
        noHighlights: "No hay torneos hoy ni mañana",
        addFavorite: "Añadir a favoritos",
        removeFavorite: "Quitar de favoritos",
        favOnlyLabel: "Mostrar favoritos",

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
            favOnly: "Solo Favoritos",
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

        // View toggle
        viewCards: "🎴 Cards",
        viewTable: "📊 Table",

        // Calendar filter
        showAll: "Show All",
        filtering: "Filtering:",

        // Highlights
        highlightsTitle: "Today in Esports",
        noHighlights: "No tournaments today or tomorrow",
        addFavorite: "Add to favorites",
        removeFavorite: "Remove from favorites",
        favOnlyLabel: "Favorites only",

        // Filters + ICS + Leyenda
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
            favOnly: "Favorites Only",
            clear: "Clear filters"
        },
        icsButton: "Export ICS",
        colorsLegendTitle: "Tournament colors",
        colorNames: { blue: "Blue", orange: "Orange", green: "Green", red: "Red", purple: "Purple", yellow: "Yellow" },
    },
};

let currentLang = "es";
let isDarkMode = true;
let currentView = "cards";

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("light-mode", !isDarkMode);
    document.getElementById("toggleTheme").textContent = isDarkMode
        ? translations[currentLang].toggleLight
        : translations[currentLang].toggleDark;
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
}

function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        toggleTheme();
    }
}

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
    renderInputTags(); // Update placeholder based on current tags

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

    // Calendar disabled

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

    const fFavLabel = document.getElementById("fFavLabel");
    if (fFavLabel) fFavLabel.textContent = f.favOnly;

    const btnClear = document.getElementById("btnClearFilters");
    if (btnClear) btnClear.textContent = f.clear;

    // Botón ICS
    const btnICS = document.getElementById("exportICS");
    if (btnICS) btnICS.textContent = translations[lang].icsButton;

    // View toggle buttons
    const viewCardsBtn = document.getElementById("viewCards");
    const viewTableBtn = document.getElementById("viewTable");
    if (viewCardsBtn) viewCardsBtn.textContent = translations[lang].viewCards;
    if (viewTableBtn) viewTableBtn.textContent = translations[lang].viewTable;

    // Update title and labels
    document.getElementById("highlightsTitle").innerHTML = `🔥 <span>${t.highlightsTitle}</span>`;
    noHighlights.textContent = t.noHighlights;

    const favLabel = document.querySelector("label[for='highlightsFavOnly']");
    if (favLabel) favLabel.textContent = t.favOnlyLabel;

    // Leyenda
    renderLegend();
}

function renderLegend() {
    const wrap = document.getElementById("legend");
    if (!wrap) return;
    const t = translations[currentLang];
    const names = t.colorNames;

    wrap.innerHTML = `
      <span class="font-semibold">${t.colorsLegendTitle}:</span>
      ${["blue", "orange", "green", "red", "purple", "yellow"].map(c => `
        <span class="inline-flex items-center gap-2">
          <span class="inline-block w-4 h-4 rounded-full event-${c}"></span>
          ${names[c]}
        </span>
      `).join("")}
    `;
}

function toggleAddForm() {
    const formBody = document.getElementById("addTournamentFormBody");
    const formBtns = document.getElementById("addTournamentButtons");
    const icon = document.getElementById("toggleFormIcon");

    const isHidden = formBody.classList.contains("hidden");

    if (isHidden) {
        formBody.classList.remove("hidden");
        formBtns.classList.remove("hidden");
        icon.classList.add("rotate-180");
    } else {
        formBody.classList.add("hidden");
        formBtns.classList.add("hidden");
        icon.classList.remove("rotate-180");
    }
}

function setView(view) {
    currentView = view;
    localStorage.setItem("view", view);
    renderTournaments();

    // Update button states
    document.getElementById("viewCards").classList.toggle("active", view === "cards");
    document.getElementById("viewTable").classList.toggle("active", view === "table");
}

function showHelp() {
    document.getElementById("helpModal").classList.remove("hidden");
}

function hideHelp() {
    document.getElementById("helpModal").classList.add("hidden");
}

export {
    translations,
    currentLang,
    isDarkMode,
    currentView,
    toggleTheme,
    loadTheme,
    setLanguage,
    renderLegend,
    toggleAddForm,
    setView,
    showHelp,
    hideHelp
};
