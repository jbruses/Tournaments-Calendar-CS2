import { translations, currentLang, toggleAddForm } from './ui.js';
import { renderCalendar } from './calendar.js';
import { renderHighlights } from './highlights.js';
// Importamos setCurrentTeams para arreglar la carga de tags al editar
import { escapeHtml, renderInputTags, addTeamTag, currentTeams, setCurrentTeams } from './utils.js';

let tournaments = [];
let editingTournamentId = null;
let sortDirectionDate = 1;
let sortDirectionVRS = 1;
// Estado de favoritos
let favoriteTournamentIds = JSON.parse(localStorage.getItem("favorites") || "[]");

// ==========================================
// LÓGICA DE DATOS (Por ahora LocalStorage, luego Supabase)
// ==========================================

function saveTournaments() {
    localStorage.setItem("tournaments", JSON.stringify(tournaments));
}

function loadTournaments() {
    const savedTournaments = localStorage.getItem("tournaments");
    if (savedTournaments) {
        tournaments = JSON.parse(savedTournaments);
        renderTournaments();
        renderCalendar();
        renderHighlights();
    }
}

function saveTournament() {
    const name = document.getElementById("tournamentName").value.trim();
    const tier = document.getElementById("tournamentTier").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    // Agregar tag pendiente si quedó texto en el input
    const pendingTeam = document.getElementById("tournamentTeams").value.trim();
    if (pendingTeam) addTeamTag(pendingTeam);

    // Usamos la variable exportada de utils.js que tiene los tags actuales
    const teams = currentTeams.join(", ");

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
            // EDITAR
            tournaments = tournaments.map((t) =>
                t.id === editingTournamentId
                    ? { ...t, name, tier, startDate, endDate, teams, location, modality, color, vrs }
                    : t
            );
        } else {
            // CREAR
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
        renderHighlights();
        cancelEdit();
        
        // Cerrar el formulario tras guardar para limpiar la vista
        const formBody = document.getElementById("addTournamentFormBody");
        if (!formBody.classList.contains("hidden")) {
            toggleAddForm();
        }

    } else {
        alert(translations[currentLang].incompleteFields);
    }
}

function editTournament(id) {
    const numericId = parseInt(id); 
    const t = tournaments.find((x) => x.id === numericId);
    if (!t) return;

    document.getElementById("tournamentName").value = t.name;
    document.getElementById("tournamentTier").value = t.tier;
    document.getElementById("tournamentLocation").value = t.location;
    document.getElementById("tournamentModality").value = t.modality;
    document.getElementById("startDate").value = t.startDate;
    document.getElementById("endDate").value = t.endDate;
    
    // CORRECCIÓN CRÍTICA: Cargar los tags visualmente usando utils.js
    const teamsArray = t.teams.split(",").map(s => s.trim()).filter(s => s);
    setCurrentTeams(teamsArray); 
    
    document.getElementById("tournamentColor").value = t.color;
    document.getElementById("tournamentVRS").checked = t.vrs;

    // Textos UI
    document.getElementById("formTitle").textContent = translations[currentLang].formTitles.edit;
    document.getElementById("saveButton").textContent = translations[currentLang].saveButtons.edit;
    document.getElementById("btnCancel").classList.remove("hidden");
    
    editingTournamentId = numericId;

    // Abrir form si está cerrado
    const formBody = document.getElementById("addTournamentFormBody");
    if (formBody.classList.contains("hidden")) {
        toggleAddForm();
    }
    document.getElementById("formTitle").scrollIntoView({ behavior: "smooth" });
}

function cancelEdit() {
    editingTournamentId = null;
    const t = translations[currentLang];
    document.getElementById("formTitle").textContent = t.formTitles.add;
    document.getElementById("saveButton").textContent = t.saveButtons.add;
    document.getElementById("btnCancel").classList.add("hidden");
    clearForm();
}

function confirmDelete(id) {
    const msg = translations[currentLang].confirmDelete || "¿Eliminar torneo?";
    if (window.confirm(msg)) {
        deleteTournament(parseInt(id));
    }
}

function deleteTournament(id) {
    tournaments = tournaments.filter((t) => t.id !== id);
    saveTournaments();
    renderTournaments();
    renderCalendar();
    renderHighlights();
}

function clearForm() {
    document.getElementById("tournamentName").value = "";
    document.getElementById("tournamentTier").value = "S";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
    
    // Limpiar tags usando la función importada
    setCurrentTeams([]);
    
    document.getElementById("tournamentTeams").value = "";
    document.getElementById("tournamentLocation").value = "";
    document.getElementById("tournamentModality").value = "Online";
    document.getElementById("tournamentColor").value = "blue";
    document.getElementById("tournamentVRS").checked = false;
}

// ==========================================
// IMPORT / EXPORT / UTILS
// ==========================================

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
            renderHighlights();
            alert(translations[currentLang].importSuccess || "Importado con éxito");
        } catch (error) {
            alert(translations[currentLang].importError || "Error al importar");
        }
    };
    reader.readAsText(file);
    event.target.value = ""; 
}

function confirmClearAll() {
    if (confirm(translations[currentLang].confirmClear || "¿Borrar todo?")) {
        clearAllTournaments();
    }
}

function clearAllTournaments() {
    tournaments = [];
    localStorage.removeItem("tournaments");
    renderTournaments();
    renderCalendar();
    renderHighlights();
    alert(translations[currentLang].clearSuccess || "Calendario borrado");
}

function toggleFavorite(id) {
    const numericId = parseInt(id);
    const index = favoriteTournamentIds.indexOf(numericId);
    if (index === -1) {
        favoriteTournamentIds.push(numericId);
    } else {
        favoriteTournamentIds.splice(index, 1);
    }
    localStorage.setItem("favorites", JSON.stringify(favoriteTournamentIds));
    renderTournaments();
    renderHighlights();
}

function isFavorite(id) {
    return favoriteTournamentIds.includes(parseInt(id));
}

// ==========================================
// RENDERING (VISUALES PREMIUM)
// ==========================================

function renderTournaments() {
    const tbody = document.getElementById("tournamentBody");
    const cardContainer = document.getElementById("tournamentCardContainer");
    const tableElement = document.getElementById("tournamentTable");

    if (!tbody || !tableElement) return;

    // Modo Cards
    if (localStorage.getItem("view") === "cards") {
        tableElement.classList.add("hidden");
        if (cardContainer) cardContainer.remove();
        
        const newCardContainer = renderTournamentCards();
        newCardContainer.id = "tournamentCardContainer";
        tableElement.parentNode.insertBefore(newCardContainer, tableElement);
    } 
    // Modo Tabla
    else {
        if (cardContainer) cardContainer.remove();
        tableElement.classList.remove("hidden");
        tbody.innerHTML = "";
        
        filteredTournaments().forEach((t) => {
            const row = document.createElement("tr");
            // Estilo de fila Glass hover
            row.className = "border-b border-gray-700/50 hover:bg-white/5 transition-colors duration-200";
            
            row.innerHTML = `
          <td class="py-4 px-4 text-left font-medium text-white">${escapeHtml(t.name)}</td>
          <td class="py-4 px-4 text-left">
            <span class="bg-dark-900 border border-gray-700 text-gray-300 px-2 py-1 rounded text-xs font-bold font-display">${t.tier}</span>
          </td>
          <td class="py-4 px-4 text-left text-xs text-gray-400 font-mono">
            ${formatDate(t.startDate)} - ${formatDate(t.endDate)}
          </td>
          <td class="py-4 px-4 text-left">${renderTeamTags(t.teams)}</td>
          <td class="py-4 px-4 text-left text-sm text-gray-400">${escapeHtml(t.location)}</td>
          <td class="py-4 px-4 text-left text-sm text-gray-400">${t.modality}</td>
          <td class="py-4 px-4 text-left">
             <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-${t.color}-500 shadow-[0_0_8px] shadow-${t.color}-500/50"></span>
                <span class="capitalize text-sm text-gray-400">${t.color}</span>
             </div>
          </td>
          <td class="py-4 px-4 text-left">
            ${t.vrs ? '<span class="text-green-500 font-bold">✓</span>' : '<span class="text-gray-600">-</span>'}
          </td>
          <td class="py-4 px-4 text-center">
            <div class="flex item-center justify-center gap-3">
                <button class="btn-fav hover:scale-110 transition-transform ${isFavorite(t.id) ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-gray-600 hover:text-yellow-200'}" 
                        data-id="${t.id}" title="Favorito">
                    ${isFavorite(t.id) ? '⭐' : '☆'}
                </button>
                <button class="btn-edit hover:scale-110 transition-transform text-blue-400 hover:text-white" 
                        data-id="${t.id}" title="Editar">✏️</button>
                <button class="btn-delete hover:scale-110 transition-transform text-red-400 hover:text-white" 
                        data-id="${t.id}" title="Borrar">🗑️</button>
            </div>
          </td>`;
            tbody.appendChild(row);
        });
    }
}

function renderTournamentCards() {
    const container = document.createElement('div');
    container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6';

    filteredTournaments().forEach((t) => {
        const status = getStatus(t.startDate, t.endDate);
        const card = document.createElement('div');
        
        // Estilo Glass Card Premium
        card.className = `
            glass-panel relative flex flex-col h-full rounded-xl overflow-hidden
            border border-white/5 transition-all duration-300 group
            hover:border-brand-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:-translate-y-1
        `; 
        
        card.innerHTML = `
        <div class="absolute top-0 left-0 w-full h-1 bg-${t.color}-500 shadow-[0_0_10px] shadow-${t.color}-500/50"></div>

        <div class="p-6 flex flex-col flex-grow">
            <div class="flex justify-between items-start mb-4">
                <h3 class="font-display font-bold text-xl text-white leading-tight w-3/4 truncate" title="${escapeHtml(t.name)}">
                    ${escapeHtml(t.name)}
                </h3>
                <div class="flex flex-col items-end gap-2">
                     ${getStatusBadge(status)}
                </div>
            </div>
            
            <div class="space-y-2 text-sm text-gray-400 mb-6">
                 <div class="flex items-center gap-3 group/item">
                    <span class="text-brand-500 group-hover/item:text-brand-400 transition-colors">📅</span>
                    <span class="font-medium text-gray-300 font-mono text-xs">${formatDate(t.startDate)} - ${formatDate(t.endDate)}</span>
                 </div>
                 <div class="flex items-center gap-3 group/item">
                    <span class="text-brand-500 group-hover/item:text-brand-400 transition-colors">📍</span>
                    <span class="truncate">${escapeHtml(t.location)} (${t.modality})</span>
                 </div>
                 <div class="flex items-center gap-3">
                    <span class="text-brand-500">🏆</span>
                    <span class="text-xs font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded text-gray-300">
                        Tier ${t.tier}
                    </span>
                 </div>
            </div>

            <div class="mb-6 flex-grow">
                 <div class="text-[10px] text-gray-500 uppercase font-bold mb-2 tracking-widest">Equipos</div>
                 ${renderTeamTags(t.teams, true)}
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                 <button class="btn-fav p-2 rounded-lg hover:bg-white/10 transition-colors" 
                         data-id="${t.id}" title="Favorito">
                    <span class="text-lg block ${isFavorite(t.id) ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]' : 'text-gray-600'}">
                        ${isFavorite(t.id) ? '⭐' : '☆'}
                    </span>
                 </button>
                 
                 <div class="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                     <button class="btn-edit text-xs bg-dark-800 hover:bg-brand-600 text-white px-3 py-1.5 rounded border border-white/10 hover:border-brand-500 transition-all font-bold uppercase tracking-wide"
                             data-id="${t.id}">
                        Editar
                     </button>
                     
                     <button class="btn-delete text-xs bg-dark-800 hover:bg-red-600 text-white px-3 py-1.5 rounded border border-white/10 hover:border-red-500 transition-all font-bold uppercase tracking-wide" 
                             data-id="${t.id}">
                        Borrar
                     </button>
                 </div>
            </div>
        </div>
      `;
        container.appendChild(card);
    });

    return container;
}

// ==========================================
// HELPERS
// ==========================================

function getFilters() {
    return {
        text: (document.getElementById("fText")?.value || "").toLowerCase(),
        tier: document.getElementById("fTier")?.value || "",
        modality: document.getElementById("fModality")?.value || "",
        location: (document.getElementById("fLocation")?.value || "").toLowerCase(),
        from: document.getElementById("fFrom")?.value || "",
        to: document.getElementById("fTo")?.value || "",
        vrs: document.getElementById("fVRS")?.value || "", 
        fav: document.getElementById("fFav")?.checked || false,
    };
}

function filteredTournaments() {
    const f = getFilters();
    let filtered = tournaments;

    if (f.fav) {
        filtered = filtered.filter(t => isFavorite(t.id));
    }

    return filtered.filter(t => {
        const textOK =
            !f.text ||
            t.name.toLowerCase().includes(f.text) ||
            t.teams.toLowerCase().includes(f.text);

        const tierOK = !f.tier || t.tier === f.tier;
        const modalityOK = !f.modality || t.modality === f.modality;
        const locationOK = !f.location || t.location.toLowerCase().includes(f.location);

        // Fechas: convertimos todo a string ISO YYYY-MM-DD para comparar fácil
        const tStart = t.startDate; 
        const tEnd = t.endDate;

        let rangeOK = true;
        if (f.from) rangeOK = rangeOK && (tEnd >= f.from);
        if (f.to) rangeOK = rangeOK && (tStart <= f.to);

        let vrsOK = true;
        if (f.vrs === "1") vrsOK = t.vrs === true;
        if (f.vrs === "0") vrsOK = t.vrs === false;

        return textOK && tierOK && modalityOK && locationOK && rangeOK && vrsOK;
    });
}

function getStatus(startDate, endDate) {
    const today = new Date();
    // Ajuste de zona horaria simple
    const offset = today.getTimezoneOffset() * 60000;
    const localToday = new Date(today.getTime() - offset).toISOString().slice(0, 10);

    if (localToday >= startDate && localToday <= endDate) {
        return 'live';
    } else if (localToday < startDate) {
        return 'upcoming';
    } else {
        return 'completed';
    }
}

function getStatusBadge(status) {
    const labels = {
        live: '🔴 LIVE',
        upcoming: '🔜 PROX',
        completed: '🏁 FIN'
    };
    const styles = {
        live: 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse',
        upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
        completed: 'bg-gray-700/50 text-gray-500 border-gray-600/50'
    };
    return `<span class="px-2 py-0.5 rounded text-[10px] font-bold border ${styles[status]} tracking-wider">${labels[status]}</span>`;
}

function formatDate(dateString) {
    if(!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    // const year = date.getUTCFullYear(); // Opcional si quieres ahorrar espacio
    return `${day}/${month}`;
}

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

function icsEscape(s = "") {
    return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
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
        const dtEnd = endPlus1.toISOString().slice(0, 10).replace(/-/g, "");
        const uid = `${t.id}@cs2-calendar`;
        const summary = icsEscape(`${t.name} [${t.tier}]`);
        const description = icsEscape(`Equipos: ${t.teams}\nModalidad: ${t.modality}\nVRS: ${t.vrs ? 'Si' : 'No'}`);
        const location = icsEscape(t.location || "");
        ics += `BEGIN:VEVENT\r\nUID:${uid}\r\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z\r\nDTSTART;VALUE=DATE:${dtStart}\r\nDTEND;VALUE=DATE:${dtEnd}\r\nSUMMARY:${summary}\r\nLOCATION:${location}\r\nDESCRIPTION:${description}\r\nEND:VEVENT\r\n`;
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

// ==========================================
// RENDER TAGS (A PRUEBA DE ERRORES)
// ==========================================

const teamLogos = {
    "navi": "https://upload.wikimedia.org/wikipedia/en/thumb/a/ac/NaVi_logo.svg/1200px-NaVi_logo.svg.png",
    "faze": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/FaZe_Clan.svg/1200px-FaZe_Clan.svg.png",
    "g2": "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/G2_Esports_logo.svg/1200px-G2_Esports_logo.svg.png",
    "vitality": "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Team_Vitality_logo.svg/1200px-Team_Vitality_logo.svg.png",
    "spirit": "https://upload.wikimedia.org/wikipedia/en/thumb/c/ce/Team_Spirit_logo.svg/1200px-Team_Spirit_logo.svg.png",
    "mouz": "https://upload.wikimedia.org/wikipedia/en/thumb/1/1f/Mousesports_logo.svg/1200px-Mousesports_logo.svg.png",
    "liquid": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Team_Liquid_logo.svg/1200px-Team_Liquid_logo.svg.png",
    "astralis": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Astralis_logo.svg/1200px-Astralis_logo.svg.png",
    "9z team": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/9z_Team_logo.png/600px-9z_Team_logo.png",
    "bestia": "https://img-cdn.hltv.org/teamlogo/0x8d5c41e8c4f2e5a6a6f1d8c4f2e5a6a6/11918/bestia.png" 
};

function renderTeamTags(teamsString, limit = false) {
    if (!teamsString) return '';
    const teams = teamsString.split(',').map(t => t.trim()).filter(t => t);
    const visibleCount = limit ? 5 : 100;
    const hiddenTeams = teams.length - visibleCount;

    return `
      <div class="flex flex-wrap gap-2">
        ${teams.slice(0, visibleCount).map(team => {
            const lowerName = team.toLowerCase();
            
            // 1. Generamos SIEMPRE la URL del avatar de respaldo
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(team)}&background=random&color=fff&size=64&font-size=0.33&bold=true`;
            
            // 2. Intentamos usar el logo VIP, si no existe, usamos el avatar directo
            let currentSrc = teamLogos[lowerName] || avatarUrl;
            
            return `
            <div class="team-tag flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full cursor-pointer select-none border border-white/5 bg-dark-900/50 hover:bg-dark-800 transition-all group/tag"
                 data-team="${escapeHtml(team)}" 
                 title="Filtrar por ${escapeHtml(team)}">
                
                <img src="${currentSrc}" 
                     onerror="this.onerror=null; this.src='${avatarUrl}';"
                     alt="${escapeHtml(team)}" 
                     class="w-5 h-5 rounded-full object-cover shadow-sm bg-dark-800 group-hover/tag:scale-110 transition-transform">
                
                <span class="text-[10px] font-bold tracking-wide text-gray-300 group-hover/tag:text-white">
                    ${escapeHtml(team)}
                </span>
            </div>`;
        }).join('')}
        
        ${limit && hiddenTeams > 0 ?
            `<span class="text-[10px] text-gray-500 self-center font-mono ml-1">+${hiddenTeams}</span>` : ''}
      </div>
    `;
}

function loadDemoData() {
    if (!confirm("Esto borrará tus torneos actuales y cargará datos de prueba. ¿Continuar?")) return;

    const today = new Date();
    const oneDay = 86400000; // Milisegundos en un día

    // Función auxiliar para calcular fechas relativas a hoy
    const relativeDate = (days) => {
        return new Date(today.getTime() + (days * oneDay)).toISOString().slice(0, 10);
    };

    tournaments = [
        {
            id: Date.now(),
            name: "IEM Katowice 2026 (Demo)",
            tier: "S",
            // Empieza hace 2 días, termina en 3 días (ESTADO: LIVE)
            startDate: relativeDate(-2), 
            endDate: relativeDate(3),
            teams: "Navi, FaZe, G2, Vitality, Spirit, Mouz, Liquid, Astralis",
            location: "Katowice, Poland",
            modality: "Offline",
            color: "orange",
            vrs: true
        },
        {
            id: Date.now() + 1,
            name: "PGL Major Copenhagen",
            tier: "S",
            // Empieza en 10 días (ESTADO: UPCOMING)
            startDate: relativeDate(10),
            endDate: relativeDate(24),
            teams: "TBD",
            location: "Copenhagen, Denmark",
            modality: "Offline",
            color: "yellow",
            vrs: true
        },
        {
            id: Date.now() + 2,
            name: "Blast Premier Spring",
            tier: "A",
            // Terminó hace 5 días (ESTADO: COMPLETED)
            startDate: relativeDate(-10),
            endDate: relativeDate(-5),
            teams: "Cloud9, Virtus.pro, Heroic, FURIA",
            location: "London, UK",
            modality: "Offline",
            color: "blue",
            vrs: false
        },
        {
            id: Date.now() + 3,
            name: "ESL Pro League S21",
            tier: "A",
            startDate: relativeDate(30),
            endDate: relativeDate(60),
            teams: "Complexity, BIG, MIBR, 9z Team, Fnatic",
            location: "Malta",
            modality: "Offline",
            color: "purple",
            vrs: true
        },
        {
            id: Date.now() + 4,
            name: "CCT Online Series #5",
            tier: "B",
            startDate: relativeDate(-1),
            endDate: relativeDate(5), // LIVE
            teams: "Monte, Aurora, 9 Pandas, SAW",
            location: "Europe",
            modality: "Online",
            color: "green",
            vrs: false
        }
    ];

    saveTournaments();
    renderTournaments();
    renderCalendar();
    renderHighlights();
    alert("¡Datos de prueba cargados!"); // Opcional
}

export {
    tournaments,
    editingTournamentId,
    saveTournaments,
    loadTournaments,
    saveTournament,
    editTournament,
    cancelEdit,
    confirmDelete,
    deleteTournament,
    clearForm,
    exportTournaments,
    importTournaments,
    confirmClearAll,
    clearAllTournaments,
    renderTournaments,
    filteredTournaments,
    getFilters,
    toggleFavorite,
    isFavorite,
    sortByDate,
    sortByVRS,
    exportICS,
    getStatus,
    getStatusBadge,
    loadDemoData
};