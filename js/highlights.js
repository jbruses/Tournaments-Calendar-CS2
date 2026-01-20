import { tournaments, isFavorite, getStatus, getStatusBadge } from './tournaments.js';
import { translations, currentLang } from './ui.js';
import { escapeHtml, formatDate } from './utils.js';

function getHighlights() {
    const today = new Date();
    // Ajuste: Usamos ISO string local para evitar problemas de zona horaria simples
    const offset = today.getTimezoneOffset() * 60000;
    const localToday = new Date(today.getTime() - offset).toISOString().slice(0, 10);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const localTomorrow = new Date(tomorrow.getTime() - offset).toISOString().slice(0, 10);

    return tournaments.filter(t => {
        // Live (Si hoy está entre inicio y fin)
        const isLive = localToday >= t.startDate && localToday <= t.endDate;
        // Empieza hoy o mañana
        const isToday = t.startDate === localToday;
        const isTomorrow = t.startDate === localTomorrow;

        return isLive || isToday || isTomorrow;
    });
}

function renderHighlights() {
    const highlights = getHighlights();
    const container = document.getElementById("highlightsContent");
    const noHighlights = document.getElementById("noHighlights");
    const favOnlyCheckbox = document.getElementById("highlightsFavOnly");
    const t = translations[currentLang];

    // Actualizar títulos dinámicos
    const titleEl = document.getElementById("highlightsTitle");
    if(titleEl) titleEl.innerHTML = `🔥 <span>${t.highlightsTitle || "Highlights"}</span>`;
    
    if(noHighlights) noHighlights.textContent = t.noHighlights || "No hay torneos destacados";

    const favLabel = document.querySelector("label[for='highlightsFavOnly']");
    if (favLabel) favLabel.textContent = t.favOnly || "Solo favoritos";

    // Filtrar favoritos si el checkbox está activo
    let filteredHighlights = highlights;
    if (favOnlyCheckbox && favOnlyCheckbox.checked) {
        filteredHighlights = highlights.filter(t => isFavorite(t.id));
    }

    // Mostrar mensaje si no hay nada
    if (filteredHighlights.length === 0) {
        container.innerHTML = "";
        if(noHighlights) noHighlights.classList.remove("hidden");
        return;
    }

    if(noHighlights) noHighlights.classList.add("hidden");
    
    // Generar HTML de las tarjetas
    container.innerHTML = filteredHighlights.slice(0, 6).map(t => {
        const status = getStatus(t.startDate, t.endDate);
        const isFav = isFavorite(t.id);
        const isLive = status === 'live';
        
        // Estilos condicionales
        const borderClass = isLive ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10 hover:border-brand-500/50';
        const bgClass = isLive ? 'bg-gradient-to-br from-dark-800 to-red-900/10' : 'bg-dark-800/50';

        return `
        <div class="highlight-card cursor-pointer group relative p-5 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${borderClass} ${bgClass}" 
             data-id="${t.id}">
          
          <div class="flex justify-between items-start mb-3 gap-2">
            <h3 class="font-bold text-lg text-white leading-tight brand-font truncate w-3/4 group-hover:text-brand-400 transition-colors">
                ${escapeHtml(t.name)}
            </h3>
            <div class="flex flex-col items-end gap-1">
               ${getStatusBadge(status)}
               <span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-dark-900 text-gray-400 border border-white/5">
                 ${t.tier}
               </span>
            </div>
          </div>
          
          <div class="text-sm text-gray-400 space-y-1">
            <div class="flex items-center gap-2">
               <span class="text-brand-500">📅</span>
               <span class="font-medium text-gray-300">${formatDate(t.startDate)}</span>
            </div>
            <div class="flex items-center gap-2">
               <span class="text-brand-500">📍</span>
               <span class="truncate">${escapeHtml(t.location)}</span>
            </div>
          </div>

          <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button class="btn-fav p-2 rounded-full bg-dark-900/80 hover:bg-brand-600 hover:text-white transition-all shadow-lg backdrop-blur-sm ${isFav ? 'text-yellow-400 opacity-100' : 'text-gray-400'}" 
                      data-id="${t.id}" 
                      title="${isFav ? 'Quitar favorito' : 'Agregar favorito'}">
                ${isFav ? '⭐' : '☆'}
              </button>
          </div>
          
          ${isFav ? '<div class="absolute top-0 right-0 p-2"><span class="text-xs">⭐</span></div>' : ''}
        </div>
      `;
    }).join("");
}

export { renderHighlights };