import { initCalendar, renderCalendar } from './calendar.js';
import { 
    loadTournaments, 
    saveTournament, 
    exportTournaments, 
    importTournaments, 
    cancelEdit, 
    confirmClearAll, 
    exportICS,
    renderTournaments,
    sortByDate, 
    sortByVRS,
    editTournament,   // <--- Importamos directo
    confirmDelete,    // <--- Importamos directo
    toggleFavorite    // <--- Importamos directo
} from './tournaments.js';
import { 
    loadTheme, 
    setLanguage, 
    toggleTheme, 
    showHelp, 
    hideHelp, 
    setView,
    toggleAddForm
} from './ui.js';
import { setupTeamAutocomplete, setupFormAutocomplete } from './utils.js';
import { renderHighlights } from './highlights.js';
import { currentLang, currentView } from './ui.js';

document.addEventListener('DOMContentLoaded', function() {
    // 1. Carga inicial
    loadTheme();
    loadTournaments();
    initCalendar();
    setLanguage(currentLang);
    setView(currentView);
    renderHighlights();
    setupTeamAutocomplete();
    setupFormAutocomplete();

    // 2. Eventos de Configuración General
    document.getElementById('lang-es')?.addEventListener('click', () => setLanguage('es'));
    document.getElementById('lang-en')?.addEventListener('click', () => setLanguage('en'));
    document.getElementById('toggleTheme')?.addEventListener('click', toggleTheme);
    
    // 3. Botones Principales (Acciones del Formulario)
    document.getElementById('saveButton')?.addEventListener('click', (e) => {
        e.preventDefault(); 
        saveTournament();
    });

    document.getElementById('btnCancel')?.addEventListener('click', (e) => {
        e.preventDefault();
        cancelEdit();
    });

    document.getElementById('btnExport')?.addEventListener('click', exportTournaments);
    document.getElementById('exportICS')?.addEventListener('click', exportICS);
    document.getElementById('btnClearAll')?.addEventListener('click', confirmClearAll);

    // 4. Lógica de Importar
    document.getElementById('importButton')?.addEventListener('click', () => {
        const fileInput = document.getElementById('importFile');
        if(fileInput) fileInput.click();
    });
    document.getElementById('importFile')?.addEventListener('change', importTournaments);

    // 5. Ayuda
    document.getElementById('btnHelp')?.addEventListener('click', showHelp);
    // El modal tiene botones para cerrar (dentro del modal o el fondo)
    const helpModal = document.getElementById('helpModal');
    if (helpModal) {
        // Cerrar al clickear el botón "Cerrar"
        document.getElementById('closeHelp')?.addEventListener('click', hideHelp);
        // Cerrar al clickear fuera del contenido (fondo oscuro)
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) hideHelp();
        });
    }

    // 6. Toggle del Formulario
    const toggleFormBtn = document.getElementById('btnToggleForm');
    if(toggleFormBtn) toggleFormBtn.addEventListener('click', toggleAddForm);

    // 7. Interacción Tags Input (Focus al clickear el contenedor)
    document.getElementById('teamTagsInput')?.addEventListener('click', () => {
        document.getElementById('tournamentTeams')?.focus();
    });

    // 8. Vistas y Ordenamiento
    document.getElementById('viewCards')?.addEventListener('click', () => setView('cards'));
    document.getElementById('viewTable')?.addEventListener('click', () => setView('table'));
    
    // Solo existen en la tabla, validamos que existan
    document.getElementById('thDates')?.addEventListener('click', sortByDate);
    document.getElementById('thVRS')?.addEventListener('click', sortByVRS);

    // 9. Filtros (Reactivdad)
    ["fText","fTier","fModality","fLocation","fFrom","fTo","fVRS", "fFav"].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        // Usamos 'input' para texto y 'change' para selects/fechas para mejor UX
        const eventType = (el.type === 'text' || el.type === 'search') ? 'input' : 'change';
        el.addEventListener(eventType, () => { 
            renderTournaments(); 
            // Opcional: Si quieres que el filtro afecte al calendario también
            renderCalendar(); 
        });
    });

    // Botón Limpiar Filtros
    const btnClear = document.getElementById("btnClearFilters");
    if (btnClear) {
        btnClear.addEventListener("click", () => {
            ["fText","fTier","fModality","fLocation","fFrom","fTo","fVRS"].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = "";
            });
            const fFav = document.getElementById("fFav");
            if (fFav) fFav.checked = false;
            
            // Disparar evento para limpiar autocompletado si quedó abierto
            const fText = document.getElementById("fText");
            if(fText) fText.dispatchEvent(new Event('input'));

            renderTournaments();
            renderCalendar();
        });
    }

    // Checkbox de Favoritos en Highlights
    const favCheckbox = document.getElementById("highlightsFavOnly");
    if (favCheckbox) {
        favCheckbox.addEventListener("change", renderHighlights);
    }

    // ==========================================
    // 10. GLOBAL EVENT LISTENER (DELEGACIÓN)
    // ==========================================
    // Importante: Adjuntamos esto al DOCUMENTO entero.
    // ¿Por qué? Porque las "Cards" se crean y destruyen dinámicamente.
    // Si lo adjuntamos solo a un ID, perderemos el evento al cambiar de vista.
    
    document.addEventListener('click', (e) => {
        
        // A. BOTONES DE ACCIÓN (Editar, Borrar, Favorito)
        // Usamos .closest() para detectar clicks en el botón o en el icono dentro
        const editBtn = e.target.closest('.btn-edit');
        if (editBtn) {
            editTournament(editBtn.dataset.id);
            return;
        }

        const deleteBtn = e.target.closest('.btn-delete');
        if (deleteBtn) {
            confirmDelete(deleteBtn.dataset.id);
            return;
        }

        const favBtn = e.target.closest('.btn-fav');
        if (favBtn) {
            // Evitamos que el click se propague si está dentro de una tarjeta clickeable
            e.stopPropagation(); 
            toggleFavorite(favBtn.dataset.id);
            return;
        }

        // B. TAGS DE EQUIPOS (Filtrado rápido)
        const tagSpan = e.target.closest('.team-tag');
        if (tagSpan) {
            const teamName = tagSpan.dataset.team;
            if(teamName) {
                const input = document.getElementById("fText");
                if(input) {
                    input.value = teamName;
                    // Disparamos el evento input para que el autocompletado y filtros reaccionen
                    input.dispatchEvent(new Event('input'));
                    // Hacemos scroll suave hacia los filtros
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    });
});