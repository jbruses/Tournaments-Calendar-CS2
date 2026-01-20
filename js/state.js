export let currentLang = "es";
export let isDarkMode = true;
export let tournaments = [];
export let sortDirectionDate = 1;
export let currentTeams = [];
export let sortDirectionVRS = 1;
export let editingTournamentId = null;
export let currentView = "cards";
export let selectedDate = null;
export let favoriteTournamentIds = JSON.parse(localStorage.getItem("favorites") || "[]");

export function setTournaments(newTournaments) {
    tournaments = newTournaments;
}

export function setEditingTournamentId(id) {
    editingTournamentId = id;
}

export function setCurrentTeams(teams) {
    currentTeams = teams;
}

export function setSortDirectionDate(direction) {
    sortDirectionDate = direction;
}

export function setSortDirectionVRS(direction) {
    sortDirectionVRS = direction;
}

export function setCurrentView(view) {
    currentView = view;
}

export function setSelectedDate(date) {
    selectedDate = date;
}

export function setFavoriteTournamentIds(ids) {
    favoriteTournamentIds = ids;
}

export function setCurrentLang(lang) {
    currentLang = lang;
}

export function setIsDarkMode(mode) {
    isDarkMode = mode;
}
