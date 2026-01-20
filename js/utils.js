import { tournaments } from './tournaments.js';
import { translations, currentLang } from './ui.js';
import { renderTournaments } from './tournaments.js';
import { renderCalendar } from './calendar.js';
import { renderHighlights } from './highlights.js';

let currentTeams = [];

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getAllTeams() {
    const teamsSet = new Set();
    tournaments.forEach(t => {
        t.teams.split(',').forEach(team => {
            const trimmed = team.trim();
            if (trimmed) teamsSet.add(trimmed);
        });
    });
    return Array.from(teamsSet).sort();
}

function setupTeamAutocomplete() {
    const input = document.getElementById("fText");
    if (!input) return;

    // Create dropdown element
    let dropdown = document.getElementById("autocompleteDropdown");
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = "autocompleteDropdown";
        dropdown.className = "autocomplete-dropdown hidden";
        input.parentNode.style.position = "relative";
        input.parentNode.appendChild(dropdown);
    }

    input.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        if (value.length < 1) {
            dropdown.classList.add("hidden");
            return;
        }

        const teams = getAllTeams();
        const matches = teams.filter(team =>
            team.toLowerCase().includes(value)
        );

        if (matches.length === 0) {
            dropdown.innerHTML = '<div class="autocomplete-item">No teams found</div>';
        } else {
            dropdown.innerHTML = matches.slice(0, 8).map(team =>
                `<div class="autocomplete-item" onclick="selectAutocompleteTeam('${escapeHtml(team)}')">${escapeHtml(team)}</div>`
            ).join('');
        }

        dropdown.classList.remove("hidden");
    });

    input.addEventListener('blur', () => {
        setTimeout(() => dropdown.classList.add("hidden"), 200);
    });

    input.addEventListener('keydown', (e) => {
        const activeItem = dropdown.querySelector('.autocomplete-item.active');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const items = dropdown.querySelectorAll('.autocomplete-item');
            if (activeItem) {
                activeItem.classList.remove('active');
                const next = activeItem.nextElementSibling;
                if (next) next.classList.add('active');
            } else {
                items[0]?.classList.add('active');
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const items = dropdown.querySelectorAll('.autocomplete-item');
            if (activeItem) {
                activeItem.classList.remove('active');
                const prev = activeItem.previousElementSibling;
                if (prev) prev.classList.add('active');
            } else {
                items[items.length - 1]?.classList.add('active');
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeItem) {
                activeItem.click();
            }
        } else if (e.key === 'Escape') {
            dropdown.classList.add("hidden");
        }
    });
}

function renderInputTags() {
    const container = document.getElementById("teamTagsInput");
    const input = document.getElementById("tournamentTeams");
    if (!container || !input) return;

    // Remove existing tags before input
    const existing = container.querySelectorAll(".input-tag");
    existing.forEach(el => el.remove());

    // Insert new tags before input
    currentTeams.forEach(team => {
        const tag = document.createElement("span");
        tag.className = "input-tag";
        tag.innerHTML = `${escapeHtml(team)} <span class="remove-tag" onclick="removeTeamTag('${team.replace(/'/g, "\'")}')">&times;</span>`;
        container.insertBefore(tag, input);
    });

    // Update placeholder
    input.placeholder = currentTeams.length > 0 ? "" : translations[currentLang].placeholderTeams;
}


function addTeamTag(teamName) {
    const trimmed = teamName.trim();
    if (trimmed && !currentTeams.includes(trimmed)) {
        currentTeams.push(trimmed);
        renderInputTags();
    }
    document.getElementById("tournamentTeams").value = "";
    document.getElementById("tournamentTeams").focus();
    renderInputTags();
}

function removeTeamTag(teamName) {
    currentTeams = currentTeams.filter(t => t !== teamName);
    renderInputTags();
}

function selectFormAutocompleteTeam(team) {
    addTeamTag(team);
    document.getElementById("teamsAutocompleteDropdown").classList.add("hidden");
}

function setupFormAutocomplete() {
    const input = document.getElementById("tournamentTeams");
    if (!input) return;

    let dropdown = document.getElementById("teamsAutocompleteDropdown");

    input.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        if (value.length < 1) {
            dropdown.classList.add("hidden");
            return;
        }

        const teams = getAllTeams();
        const matches = teams.filter(team =>
            team.toLowerCase().includes(value) && !currentTeams.includes(team)
        );

        if (matches.length === 0) {
            dropdown.innerHTML = '<div class="autocomplete-item">No teams found</div>';
        } else {
            dropdown.innerHTML = matches.slice(0, 8).map(team =>
                `<div class="autocomplete-item" onclick="selectFormAutocompleteTeam('${escapeHtml(team)}')">${escapeHtml(team)}</div>`
            ).join('');
        }

        dropdown.classList.remove("hidden");
    });

    input.addEventListener('blur', () => {
        setTimeout(() => dropdown.classList.add("hidden"), 200);
    });

    input.addEventListener('keydown', (e) => {
        const activeItem = dropdown.querySelector('.autocomplete-item.active');
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = input.value.replace(',', '');
            if (val.trim()) {
                addTeamTag(val);
                dropdown.classList.add("hidden");
            } else if (activeItem) {
                activeItem.click();
            }
        } else if (e.key === 'Backspace' && input.value === '' && currentTeams.length > 0) {
            currentTeams.pop();
            renderInputTags();
            dropdown.classList.add("hidden");
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const items = dropdown.querySelectorAll('.autocomplete-item');
            if (activeItem) {
                activeItem.classList.remove('active');
                const next = activeItem.nextElementSibling;
                if (next) next.classList.add('active');
            } else {
                items[0]?.classList.add('active');
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const items = dropdown.querySelectorAll('.autocomplete-item');
            if (activeItem) {
                activeItem.classList.remove('active');
                const prev = activeItem.previousElementSibling;
                if (prev) prev.classList.add('active');
            } else {
                items[items.length - 1]?.classList.add('active');
            }
        } else if (e.key === 'Escape') {
            dropdown.classList.add("hidden");
        }
    });
}

function selectAutocompleteTeam(team) {
    const input = document.getElementById("fText");
    const dropdown = document.getElementById("autocompleteDropdown");
    input.value = team;
    dropdown.classList.add("hidden");
    renderTournaments();
    renderCalendar();
    renderHighlights();
}

export {
    formatDate,
    escapeHtml,
    getAllTeams,
    setupTeamAutocomplete,
    renderInputTags,
    addTeamTag,
    removeTeamTag,
    selectFormAutocompleteTeam,
    setupFormAutocomplete,
    selectAutocompleteTeam,
    currentTeams
};
