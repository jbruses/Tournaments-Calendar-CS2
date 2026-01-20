import { renderTournaments, tournaments, editingTournamentId } from './tournaments.js';
import { renderCalendar } from './calendar.js';
import { renderHighlights } from './highlights.js';
// renderInputTags no se usa aquí directamente, pero lo dejamos por si acaso
import { renderInputTags } from './utils.js'; 

const translations = {
    es: {
        pageTitle: "Calendario de Esports (CS2)",
        storageNote: "Los datos se guardan localmente. Exporta tu calendario para respaldarlo.",
        formTitles: { add: "Agregar Nuevo Torneo", edit: "Editar Torneo" },
        startDateLabel: "Fecha de Inicio",
        endDateLabel: "Fecha de Fin",
        vrsLabel: "Cuenta para el VRS",
        saveButtons: { add: "Agregar Torneo", edit: "Guardar Cambios" },
        cancelEditButton: "Cancelar",
        exportButton: "Exportar",
        importButton: "Importar",
        helpButton: "Ayuda",
        clearAllButton: "Borrar todo",
        
        // Tabla Headers
        thTournament: "Torneo",
        thTier: "Tier",
        thDates: "Fechas",
        thTeams: "Equipos",
        thLocation: "Ubicación",
        thModality: "Modalidad",
        thColor: "Color",
        thVRS: "VRS",
        thActions: "Acciones",
        
        // Highlights
        highlightsTitle: "Destacados Hoy/Mañana",
        noHighlights: "No hay torneos destacados hoy o mañana",
        favOnly: "Solo favoritos",

        // Ayuda
        helpTitle: "Ayuda",
        helpIntro: "Bienvenido al Calendario de Esports (CS2).",
        helpAdd: "Agregar Torneo:",
        helpEdit: "Editar Torneo:",
        helpDelete: "Eliminar Torneo:",
        helpExport: "Exportar:",
        helpImport: "Importar:",
        helpClear: "Borrar todo:",
        helpNote: "Nota:",

        // Mensajes JS
        invalidDate: "La fecha de fin no puede ser anterior a la de inicio.",
        incompleteFields: "Por favor completa todos los campos requeridos.",
        confirmDelete: "¿Estás seguro de que quieres eliminar este torneo?",
        noTournaments: "No hay torneos para exportar.",
        importSuccess: "Torneos importados correctamente.",
        importError: "Error al importar el archivo JSON.",
        confirmClear: "¿Estás seguro de que quieres borrar TODOS los torneos? Esta acción no se puede deshacer.",
        clearSuccess: "Todos los torneos han sido eliminados.",
        
        bool: { yes: "Sí", no: "No" },
        actions: { delete: "Borrar", edit: "Editar" },
        calendarButtons: { today: "Hoy", month: "Mes", list: "Lista", edit: "Editar", delete: "Borrar" },
        toggleLight: "Modo Claro",
        toggleDark: "Modo Oscuro"
    },
    en: {
        pageTitle: "Esports Calendar (CS2)",
        storageNote: "Data is stored locally. Export your calendar to backup.",
        formTitles: { add: "Add New Tournament", edit: "Edit Tournament" },
        startDateLabel: "Start Date",
        endDateLabel: "End Date",
        vrsLabel: "Counts for VRS",
        saveButtons: { add: "Add Tournament", edit: "Save Changes" },
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

        highlightsTitle: "Highlights Today/Tomorrow",
        noHighlights: "No highlights for today or tomorrow",
        favOnly: "Favorites only",

        helpTitle: "Help",
        helpIntro: "Welcome to the Esports Calendar (CS2).",
        helpAdd: "Add Tournament:",
        helpEdit: "Edit Tournament:",
        helpDelete: "Delete Tournament:",
        helpExport: "Export:",
        helpImport: "Import:",
        helpClear: "Clear All:",
        helpNote: "Note:",

        invalidDate: "End date cannot be earlier than start date.",
        incompleteFields: "Please complete all required fields.",
        confirmDelete: "Are you sure you want to delete this tournament?",
        noTournaments: "No tournaments to export.",
        importSuccess: "Tournaments imported successfully.",
        importError: "Error importing JSON file.",
        confirmClear: "Are you sure you want to clear ALL tournaments? This action cannot be undone.",
        clearSuccess: "All tournaments have been cleared.",

        bool: { yes: "Yes", no: "No" },
        actions: { delete: "Delete", edit: "Edit" },
        calendarButtons: { today: "Today", month: "Month", list: "List", edit: "Edit", delete: "Delete" },
        toggleLight: "Light Mode",
        toggleDark: "Dark Mode"
    }
};

let currentLang = localStorage.getItem("lang") || "es";
let isDarkMode = localStorage.getItem("theme") !== "light"; // Default dark
let currentView = localStorage.getItem("view") || "cards";

function loadTheme() {
    if (isDarkMode) {
        document.documentElement.classList.add('dark'); // Para Tailwind
        document.body.classList.remove("light-mode");
    } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.add("light-mode");
    }
    updateThemeButton();
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    loadTheme();
}

function updateThemeButton() {
    const btn = document.getElementById("toggleTheme");
    if (btn) {
        btn.textContent = isDarkMode 
            ? translations[currentLang].toggleLight 
            : translations[currentLang].toggleDark;
    }
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    const t = translations[lang];

    // Static Texts
    safeSetText("pageTitle", t.pageTitle);
    safeSetText("storageNote", t.storageNote);
    
    // Form Labels
    safeSetText("startDateLabel", t.startDateLabel);
    safeSetText("endDateLabel", t.endDateLabel);
    
    const formTitle = editingTournamentId ? t.formTitles.edit : t.formTitles.add;
    const saveBtnText = editingTournamentId ? t.saveButtons.edit : t.saveButtons.add;
    
    safeSetText("formTitle", formTitle);
    safeSetText("saveButton", saveBtnText);
    
    safeSetText("btnCancel", t.cancelEditButton);
    safeSetText("btnExport", t.exportButton);
    safeSetText("importButton", t.importButton);
    safeSetText("btnHelp", t.helpButton);
    safeSetText("btnClearAll", t.clearAllButton);
    
    // Table Headers
    safeSetText("thTournament", t.thTournament);
    safeSetText("thTier", t.thTier);
    safeSetText("thDates", t.thDates);
    safeSetText("thTeams", t.thTeams);
    safeSetText("thLocation", t.thLocation);
    safeSetText("thModality", t.thModality);
    safeSetText("thColor", t.thColor);
    safeSetText("thVRS", t.thVRS);
    safeSetText("thActions", t.thActions);

    const vrsLabel = document.getElementById("vrsLabel");
    if(vrsLabel) {
        vrsLabel.textContent = t.vrsLabel;
    }

    // Help Modal
    safeSetText("helpTitle", t.helpTitle);
    safeSetText("helpIntro", t.helpIntro);
    // ... actualizar lista de ayuda si es necesario ...

    updateThemeButton();
    renderTournaments();
    renderCalendar();
    renderHighlights();
}

function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function toggleAddForm() {
    const formBody = document.getElementById("addTournamentFormBody");
    const formBtns = document.getElementById("addTournamentButtons");
    const icon = document.getElementById("toggleFormIcon");

    if (!formBody) return;

    const isHidden = formBody.classList.contains("hidden");

    if (isHidden) {
        formBody.classList.remove("hidden");
        if(formBtns) formBtns.classList.remove("hidden");
        if(icon) icon.style.transform = "rotate(180deg)";
    } else {
        formBody.classList.add("hidden");
        if(formBtns) formBtns.classList.add("hidden");
        if(icon) icon.style.transform = "rotate(0deg)";
    }
}

// CORRECCIÓN: Estilos Tailwind para los botones de vista
function setView(view) {
    currentView = view;
    localStorage.setItem("view", view);
    renderTournaments();

    const btnCards = document.getElementById("viewCards");
    const btnTable = document.getElementById("viewTable");

    // Clases para estado ACTIVO e INACTIVO
    const activeClass = "bg-brand-600 text-white shadow-lg";
    const inactiveClass = "text-gray-400 hover:text-white";

    // Resetear clases base (asumiendo que tienen clases comunes en el HTML)
    // Lo más fácil es quitar y poner clases específicas
    
    if (btnCards && btnTable) {
        if (view === "cards") {
            // Activar Cards
            btnCards.className = `view-toggle-btn px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeClass}`;
            btnTable.className = `view-toggle-btn px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${inactiveClass}`;
        } else {
            // Activar Table
            btnCards.className = `view-toggle-btn px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${inactiveClass}`;
            btnTable.className = `view-toggle-btn px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeClass}`;
        }
    }
}

function showHelp() {
    document.getElementById("helpModal")?.classList.remove("hidden");
}

function hideHelp() {
    document.getElementById("helpModal")?.classList.add("hidden");
}

export {
    translations,
    currentLang,
    isDarkMode,
    currentView,
    toggleTheme,
    loadTheme,
    setLanguage,
    toggleAddForm,
    setView,
    showHelp,
    hideHelp
};