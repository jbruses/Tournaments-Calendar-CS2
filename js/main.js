import { initCalendar } from './calendar.js';
import { loadTournaments } from './tournaments.js';
import { loadTheme, setLanguage, toggleTheme } from './ui.js';
import { setupTeamAutocomplete, setupFormAutocomplete } from './utils.js';
import { renderHighlights } from './highlights.js';
import { setView } from './ui.js';
import { currentLang, currentView } from './state.js';
import { exportICS } from './tournaments.js';
import { renderCalendar } from './calendar.js';
import { renderTournaments } from './tournaments.js';


document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    loadTournaments();
    initCalendar();
    setLanguage(currentLang);
    setView(currentView);
    renderHighlights();
    setupTeamAutocomplete();
    setupFormAutocomplete();

    document.getElementById('lang-es').addEventListener('click', () => setLanguage('es'));
    document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));

    document.getElementById('toggleTheme').addEventListener('click', toggleTheme);

    const btnICS = document.getElementById("exportICS");
    if (btnICS) btnICS.addEventListener("click", exportICS);

    ["fText","fTier","fModality","fLocation","fFrom","fTo","fVRS", "fFav"].forEach(id => {
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
          const fFav = document.getElementById("fFav");
          if (fFav) fFav.checked = false;
          renderTournaments();
          renderCalendar();
        });
      }

      const favCheckbox = document.getElementById("highlightsFavOnly");
      if (favCheckbox) {
        favCheckbox.addEventListener("change", renderHighlights);
      }
});
