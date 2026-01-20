import { translations, currentLang, setView, currentView } from './ui.js';
import { renderCalendar } from './calendar.js';
import { renderHighlights } from './highlights.js';
import { escapeHtml } from './utils.js';


let tournaments = [];
let editingTournamentId = null;
let sortDirectionDate = 1;
let sortDirectionVRS = 1;
let favoriteTournamentIds = JSON.parse(localStorage.getItem("favorites") || "[]");

function saveTournaments() {
    localStorage.setItem("tournaments", JSON.stringify(tournaments));
}

function loadTournaments() {
    const savedTournaments = localStorage.getItem("tournaments");
    if (savedTournaments) {
        tournaments = JSON.parse(savedTournaments);
        renderTournaments();
        renderCalendar();
    }
}

function saveTournament() {
    const name = document.getElementById("tournamentName").value.trim();
    const tier = document.getElementById("tournamentTier").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    // Add any pending text in input as a tag
    const pendingTeam = document.getElementById("tournamentTeams").value.trim();
    if (pendingTeam) addTeamTag(pendingTeam);

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
        renderHighlights();
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
    currentTeams = t.teams.split(",").map(s => s.trim()).filter(s => s);
    renderInputTags();
    document.getElementById("tournamentColor").value = t.color;
    document.getElementById("tournamentVRS").checked = t.vrs;

    document.getElementById("formTitle").textContent = translations[currentLang].formTitles.edit;
    document.getElementById("saveButton").textContent = translations[currentLang].saveButtons.edit;
    document.getElementById("cancelEditButton").classList.remove("hidden");
    editingTournamentId = id;

    // Open form if closed
    const formBody = document.getElementById("addTournamentFormBody");
    if (formBody.classList.contains("hidden")) {
        toggleAddForm();
    }
    document.getElementById("formTitle").scrollIntoView({ behavior: "smooth" });
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
    renderHighlights();
}

function clearForm() {
    document.getElementById("tournamentName").value = "";
    document.getElementById("tournamentTier").value = "S";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
    currentTeams = [];
    renderInputTags();
    document.getElementById("tournamentTeams").value = "";
    document.getElementById("tournamentLocation").value = "";
    document.getElementById("tournamentModality").value = "Online";
    document.getElementById("tournamentColor").value = "blue";
    document.getElementById("tournamentVRS").checked = false;
}

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
            alert(translations[currentLang].importSuccess);
        } catch (error) {
            alert(translations[currentLang].importError);
        }
    };
    reader.readAsText(file);
    event.target.value = ""; // limpia input
}

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
    renderHighlights();
    alert(translations[currentLang].clearSuccess);
}

function renderTournaments() {
    const tbody = document.getElementById("tournamentBody");
    const cardContainer = document.getElementById("tournamentCardContainer");
    const tableElement = document.getElementById("tournamentTable");

    if (currentView === "cards") {
        // Hide table, show cards
        tableElement.classList.add("table-view-hidden");
        tbody.innerHTML = "";
        if (cardContainer) {
            cardContainer.remove();
        }
        const newCardContainer = renderTournamentCards();
        newCardContainer.id = "tournamentCardContainer";
        tableElement.parentNode.insertBefore(newCardContainer, tableElement);
    } else {
        // Show table, hide cards
        if (cardContainer) {
            cardContainer.remove();
        }
        tableElement.classList.remove("table-view-hidden");
        tbody.innerHTML = "";
        filteredTournaments().forEach((t) => {
            const row = document.createElement("tr");
            row.className =
                "border-b border-gray-600 hover:bg-gray-700 transition-colors duration-200";
            row.innerHTML = `
          <td class="py-3 px-6 text-left">${t.name}</td>
          <td class="py-3 px-6 text-left">${t.tier}</td>
          <td class="py-3 px-6 text-left">${formatDate(t.startDate)} - ${formatDate(t.endDate)}</td>
          <td class="py-3 px-6 text-left">${renderTeamTags(t.teams)}</td>
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

        const start = new Date(t.startDate);
        const end = new Date(t.endDate);
        let rangeOK = true;
        if (f.from) rangeOK = rangeOK && (end >= new Date(f.from));
        if (f.to) rangeOK = rangeOK && (start <= new Date(f.to));

        let vrsOK = true;
        if (f.vrs === "1") vrsOK = t.vrs === true;
        if (f.vrs === "0") vrsOK = t.vrs === false;

        return textOK && tierOK && modalityOK && locationOK && rangeOK && vrsOK;
    });
}

function toggleFavorite(id) {
    const index = favoriteTournamentIds.indexOf(id);
    if (index === -1) {
        favoriteTournamentIds.push(id);
    } else {
        favoriteTournamentIds.splice(index, 1);
    }
    localStorage.setItem("favorites", JSON.stringify(favoriteTournamentIds));
    renderTournaments();
    renderHighlights();
}

function isFavorite(id) {
    return favoriteTournamentIds.includes(id);
}

function renderTournamentCards() {
    const container = document.createElement('div');
    container.className = 'tournament-cards-container';

    filteredTournaments().forEach((t) => {
        const status = getStatus(t.startDate, t.endDate);
        const card = document.createElement('div');
        card.className = 'tournament-card';
        card.innerHTML = `
        <div class="tournament-card-header">
          <h3 class="tournament-card-title">${t.name}</h3>
          <div class="tournament-card-badges">
            <span class="tier-badge">${t.tier}</span>
            ${getStatusBadge(status)}
          </div>
        </div>
        <div class="tournament-card-info">
          <div class="tournament-card-info-row">
            <span>📅</span>
            <span>${formatDate(t.startDate)} - ${formatDate(t.endDate)}</span>
          </div>
          <div class="tournament-card-info-row">
            <span>📍</span>
            <span>${t.location}</span>
          </div>
          <div class="tournament-card-info-row">
            <span>🎮</span>
            <span>${t.modality}</span>
          </div>
          <div class="tournament-card-info-row">
            <span>🏆</span>
            <span>VRS: ${t.vrs ? translations[currentLang].bool.yes : translations[currentLang].bool.no}</span>
          </div>
        </div>
        <div class="tournament-card-teams">
          <div class="tournament-card-teams-label">
            ${translations[currentLang].thTeams}
          </div>
          ${renderTeamTags(t.teams)}
        </div>
        <div style="margin-top: auto; display: flex; gap: 0.5rem; justify-content: flex-end; align-items: center;">
          <button onclick="toggleFavorite(${t.id})" class="favorite-btn ${isFavorite(t.id) ? 'active' : ''}" title="${isFavorite(t.id) ? translations[currentLang].removeFavorite : translations[currentLang].addFavorite}">
            ${isFavorite(t.id) ? '⭐' : '☆'}
          </button>
          <button onclick="editTournament(${t.id})"
            class="bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700 text-sm">
            ${translations[currentLang].actions.edit}
          </button>
          <button onclick="confirmDelete(${t.id})"
            class="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm">
            ${translations[currentLang].actions.delete}
          </button>
        </div>
      `;
        container.appendChild(card);
    });

    return container;
}

function renderTeamTags(teamsString) {
    const teams = teamsString.split(',').map(t => t.trim()).filter(t => t);
    const visibleCount = 8; // Show first 8 teams
    const hiddenTeams = teams.slice(visibleCount);
    const moreTitle = hiddenTeams.join(', ');

    return `
      <div class="team-tags">
        ${teams.slice(0, visibleCount).map(team =>
        `<span class="team-tag" onclick="filterByTeam('${team.replace(/'/g, "\'")}')" data-tooltip="${escapeHtml(team)}">${escapeHtml(team)}</span>`
    ).join('')}
        ${teams.length > visibleCount ?
            `<span class="team-tag more" data-tooltip="${escapeHtml(moreTitle)}">+${teams.length - visibleCount} more</span>` : ''}
      </div>
    `;
}

function filterByTeam(teamName) {
    document.getElementById('fText').value = teamName;
    renderTournaments();
    renderCalendar();
}

function getStatus(startDate, endDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today >= start && today <= end) {
        return 'live';
    } else if (today < start) {
        return 'upcoming';
    } else {
        return 'completed';
    }
}

function getStatusBadge(status) {
    const t = translations[currentLang];
    const labels = {
        live: 'Live',
        upcoming: 'Upcoming',
        completed: 'Completed'
    };
    return `<span class="status-badge ${status}">${labels[status]}</span>`;
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
        const dtEnd = endPlus1.toISOString().slice(0, 10).replace(/-/g, "");

        const uid = `${t.id}@cs2-calendar`;
        const summary = icsEscape(`${t.name} [${t.tier}]`);
        const description = icsEscape(
            `Equipos: ${t.teams}\nModalidad: ${t.modality}\nVRS: ${t.vrs ? translations[currentLang].bool.yes : translations[currentLang].bool.no}`
        );
        const location = icsEscape(t.location || "");

        ics += "BEGIN:VEVENT\r\n";
        ics += `UID:${uid}\r\n`;
        ics += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z\r\n`;
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

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
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
    exportICS
};
