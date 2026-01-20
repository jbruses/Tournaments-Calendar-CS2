import { tournaments, isFavorite, toggleFavorite, editTournament } from './tournaments.js';
import { translations, currentLang } from './ui.js';
import { escapeHtml } from './utils.js';
import { getStatus, getStatusBadge } from './tournaments.js';
import { formatDate } from './utils.js';


function getHighlights() {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    return tournaments.filter(t => {
        // Live today
        const isLive = todayStr >= t.startDate && todayStr <= t.endDate;

        // Starting today or tomorrow
        const isToday = t.startDate === todayStr;
        const isTomorrow = t.startDate === tomorrowStr;

        return isLive || isToday || isTomorrow;
    });
}

function renderHighlights() {
    const highlights = getHighlights();
    const container = document.getElementById("highlightsContent");
    const noHighlights = document.getElementById("noHighlights");
    const favOnlyCheckbox = document.getElementById("highlightsFavOnly");
    const t = translations[currentLang];

    // Update title and labels
    document.getElementById("highlightsTitle").innerHTML = `🔥 <span>${t.highlightsTitle}</span>`;
    noHighlights.textContent = t.noHighlights;

    const favLabel = document.querySelector("label[for='highlightsFavOnly']");
    if (favLabel) favLabel.textContent = t.favOnlyLabel;

    // Filter for favorites only if checked
    let filteredHighlights = highlights;
    if (favOnlyCheckbox && favOnlyCheckbox.checked) {
        filteredHighlights = highlights.filter(t => isFavorite(t.id));
    }

    if (filteredHighlights.length === 0) {
        container.innerHTML = "";
        noHighlights.classList.remove("hidden");
        return;
    }

    noHighlights.classList.add("hidden");
    container.innerHTML = filteredHighlights.slice(0, 6).map(t => {
        const status = getStatus(t.startDate, t.endDate);
        const isFav = isFavorite(t.id);
        return `
        <div class="highlight-card ${status === 'live' ? 'live' : ''}" onclick="editTournament(${t.id})">
          <div class="highlight-header">
            <h3 class="highlight-title">${escapeHtml(t.name)}</h3>
            <div class="highlight-badges">
              <span class="tier-badge">${t.tier}</span>
              ${getStatusBadge(status)}
              <button onclick="event.stopPropagation(); toggleFavorite(${t.id})" class="favorite-btn ${isFav ? 'active' : ''}" title="${isFav ? t.removeFavorite : t.addFavorite}">
                ${isFav ? '⭐' : '☆'}
              </button>
            </div>
          </div>
          <div class="highlight-info">
            <div>📅 ${formatDate(t.startDate)} - ${formatDate(t.endDate)}</div>
            <div>📍 ${escapeHtml(t.location)}</div>
          </div>
        </div>
      `;
    }).join('');
}

export { getHighlights, renderHighlights };
