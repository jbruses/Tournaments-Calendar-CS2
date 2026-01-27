import { renderTournaments, editingTournamentId } from "./tournaments.js";
import { renderCalendar, setCalendarLocale } from "./calendar.js";
import { renderHighlights } from "./highlights.js";
import { translations } from "./utils.js";

let currentLang = localStorage.getItem("lang") || "es";
let isDarkMode = localStorage.getItem("theme") !== "light";
let currentView = localStorage.getItem("view") || "cards";

function loadTheme() {
  if (isDarkMode) {
    document.documentElement.classList.add("dark");
    document.body.classList.remove("light-mode");
  } else {
    document.documentElement.classList.remove("dark");
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
  if (btn)
    btn.textContent = isDarkMode
      ? translations[currentLang].toggleLight
      : translations[currentLang].toggleDark;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  const t = translations[lang];

  safeSetText("pageTitle", t.pageTitle);
  safeSetText("storageNote", t.storageNote);
  safeSetText("signInText", t.signInText);
  safeSetText("listTitle", t.listTitle);
  safeSetText("startDateLabel", t.startDateLabel);
  safeSetText("endDateLabel", t.endDateLabel);
  safeSetText("vrsLabel", t.vrsLabel);
  safeSetText("lblName", t.lbl_name);
  safeSetText("lblTier", t.lbl_tier);
  safeSetText("lblColor", t.lbl_color);
  safeSetText("lblTeams", t.lbl_teams);
  safeSetText("lblLoc", t.lbl_loc);
  safeSetText("lblMod", t.lbl_mod);

  // Descripción VRS (span pequeño debajo del título)
  const vrsContainer = document
    .getElementById("tournamentVRS")
    ?.closest(".col-span-2");
  if (vrsContainer) {
    const descSpan = vrsContainer.querySelector("span.text-xs");
    if (descSpan) descSpan.textContent = t.vrsDesc;
  }

  const formTitle = editingTournamentId ? t.formTitles.edit : t.formTitles.add;
  const saveBtnText = editingTournamentId
    ? t.saveButtons.edit
    : t.saveButtons.add;

  safeSetText("formTitle", formTitle);
  safeSetText("saveButton", saveBtnText);
  safeSetText("btnCancel", t.cancelEditButton);
  safeSetText("btnExport", t.exportButton);
  safeSetText("importButton", t.importButton);
  safeSetText("btnHelp", t.helpButton);
  safeSetText("btnClearAll", t.clearAllButton);
  safeSetText("btnInstallApp", t.btnInstall);
  safeSetText("exportICS", t.btnICS);
  safeSetText("closeHelp", t.btnCloseHelp);
  safeSetText("viewCards", t.btnCards);
  safeSetText("viewTable", t.btnTable);

  const fDev = document.getElementById("footerDev");
  if (fDev)
    fDev.innerHTML = `${t.footerDev} <span class="text-brand-400 font-semibold tracking-wide">Joaco Bruses</span>`;
  safeSetText("footerCopy", t.footerCopy);

  safeSetText("thTournament", t.thTournament);
  safeSetText("thTier", t.thTier);
  safeSetText("thDates", t.thDates);
  safeSetText("thTeams", t.thTeams);
  safeSetText("thLocation", t.thLocation);
  safeSetText("thModality", t.thModality);
  safeSetText("thColor", t.thColor);
  safeSetText("thVRS", t.thVRS);


  // --- HIGHLIGHTS ---
  const hlTitle = document.getElementById("highlightsTitle");
  if (hlTitle) hlTitle.querySelector("span").textContent = t.highlightsTitle;

  const hlNoData = document.getElementById("noHighlights");
  if (hlNoData) hlNoData.textContent = t.noHighlights;

  // Label Checkbox Highlights
  const lblHlFav = document.querySelector("label[for='highlightsFavOnly']");
  if (lblHlFav) lblHlFav.textContent = t.favOnly;

  // --- AYUDA ---
  safeSetText("helpTitle", t.helpTitle);
  safeSetText("helpIntro", t.helpIntro);

  setOptionText("fTier", "", t.filters.tier);
  setOptionText("fModality", "", t.filters.mod);
  setOptionText("fVRS", "", t.filters.vrs);
  setOptionText("fVRS", "1", t.filters.vrsYes);
  setOptionText("fVRS", "0", t.filters.vrsNo);

  setOptionText("tournamentTier", "S", t.tierOptions.s);
  setOptionText("tournamentTier", "A", t.tierOptions.a);
  setOptionText("tournamentTier", "B", t.tierOptions.b);
  setOptionText("tournamentTier", "C", t.tierOptions.c);

  setOptionText("tournamentColor", "blue", t.colorOptions.blue);
  setOptionText("tournamentColor", "orange", t.colorOptions.orange);
  setOptionText("tournamentColor", "green", t.colorOptions.green);
  setOptionText("tournamentColor", "red", t.colorOptions.red);
  setOptionText("tournamentColor", "purple", t.colorOptions.purple);
  setOptionText("tournamentColor", "yellow", t.colorOptions.yellow);

  setOptionText("tournamentModality", "Online", t.modalityOptions.online);
  setOptionText("tournamentModality", "Offline", t.modalityOptions.offline);
  setOptionText(
    "tournamentModality",
    "Online/Offline",
    t.modalityOptions.hybrid,
  );

  setOptionText("fTier", "", t.filters.tier); // "Tier (Todos)"
  setOptionText("fTier", "S", t.tierOptions.s_short);
  setOptionText("fTier", "A", t.tierOptions.a_short);
  setOptionText("fTier", "B", t.tierOptions.b_short);
  setOptionText("fTier", "C", t.tierOptions.c_short);

  setOptionText("fModality", "", t.filters.mod); // "Modalidad"
  setOptionText("fModality", "Online", t.modalityOptions.online);
  setOptionText("fModality", "Offline", t.modalityOptions.offline);
  setOptionText("fModality", "Online/Offline", t.modalityOptions.hybrid);

  setOptionText("fVRS", "", t.filters.vrs);
  setOptionText("fVRS", "1", t.filters.vrsYes);
  setOptionText("fVRS", "0", t.filters.vrsNo);

  const thActions = document.getElementById("thActions");
  if (thActions) {
      thActions.textContent = t.thActions;
  }

  // Label Checkbox Filtro Favoritos (Buscamos el span hermano del input)
  const lblFavFilter = document.querySelector("label:has(#fFav) span");
  if (lblFavFilter) lblFavFilter.textContent = t.filters.fav;

  // Botón Limpiar
  const btnClear = document.getElementById("btnClearFilters");
  if (btnClear) {
    // Mantenemos el icono SVG, solo cambiamos el texto
    const svg = btnClear.querySelector("svg");
    btnClear.textContent = " " + t.filters.clear; // Espacio para separar
    if (svg) btnClear.prepend(svg);
  }

  // --- PLACEHOLDERS ---
  safeSetPlaceholder("tournamentName", t.phName);
  safeSetPlaceholder("tournamentLocation", t.phLocation);
  safeSetPlaceholder("fText", t.phSearch);
  safeSetPlaceholder("tournamentTeams", t.phTeams);
  safeSetPlaceholder("fLocation", t.filters.location);

  updateThemeButton();
  renderTournaments();
  renderCalendar();
  renderHighlights();
  setCalendarLocale(lang);
  initDatePickers(lang);
}

function safeSetText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function safeSetPlaceholder(id, text) {
  const el = document.getElementById(id);
  if (el) el.placeholder = text;
}

function setOptionText(selectId, value, text) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  const opt = sel.querySelector(`option[value="${value}"]`);
  if (opt) opt.textContent = text;
}

function setView(view) {
  currentView = view;
  localStorage.setItem("view", view);
  renderTournaments();
  const btnCards = document.getElementById("viewCards");
  const btnTable = document.getElementById("viewTable");
  const activeClass = "bg-brand-600 text-white shadow-lg";
  const inactiveClass = "text-gray-400 hover:text-white";

  if (btnCards && btnTable) {
    if (view === "cards") {
      btnCards.className = `view-toggle-btn px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeClass}`;
      btnTable.className = `view-toggle-btn px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${inactiveClass}`;
    } else {
      btnCards.className = `view-toggle-btn px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${inactiveClass}`;
      btnTable.className = `view-toggle-btn px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeClass}`;
    }
  }
}

export function initDatePickers(currentLang) {
    const lang = currentLang || localStorage.getItem('lang') || 'es'; 
    
    const placeholderText = lang === 'es' ? 'dd/mm/aaaa' : 'dd/mm/yyyy';
    
    document.querySelectorAll(".date-picker").forEach(input => {
        input.placeholder = placeholderText;
    });


    flatpickr(".date-picker", {
        dateFormat: "d/m/Y",
        disableMobile: "true",
        locale: lang === 'es' ? 'es' : 'default',
        allowInput: true,
        
        prevArrow: '<span class="text-white">&lsaquo;</span>',
        nextArrow: '<span class="text-white">&rsaquo;</span>'
    });
}

function showHelp() {
  document.getElementById("helpModal")?.classList.remove("hidden");
}
function hideHelp() {
  document.getElementById("helpModal")?.classList.add("hidden");
}

export {
  currentLang,
  isDarkMode,
  currentView,
  toggleTheme,
  loadTheme,
  setLanguage,
  setView,
  showHelp,
  hideHelp,
};
