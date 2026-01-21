import {
  filteredTournaments,
  toggleFavorite,
  isFavorite,
} from "./tournaments.js";

import { translations, getLang, formatDate } from "./utils.js";

function renderHighlights() {
  const container = document.getElementById("highlightsContent");
  const noDataMsg = document.getElementById("noHighlights");
  const favOnlyCheckbox = document.getElementById("highlightsFavOnly");

  if (!container) return;

  let list = filteredTournaments();
  if (favOnlyCheckbox && favOnlyCheckbox.checked)
    list = list.filter((t) => isFavorite(t.id));

  const today = new Date().toISOString().slice(0, 10);
  const tmr = new Date();
  tmr.setDate(tmr.getDate() + 1);
  const tomorrow = tmr.toISOString().slice(0, 10);

  const highlights = list.filter(
    (t) =>
      t.startDate === today ||
      t.startDate === tomorrow ||
      t.endDate === today ||
      t.endDate === tomorrow ||
      (t.startDate <= today && t.endDate >= today),
  );

  // Traducciones de estados
  const lang = getLang();
  const tStatus = translations[lang].status;

  container.innerHTML = "";

  if (highlights.length === 0) {
    noDataMsg.classList.remove("hidden");
  } else {
    noDataMsg.classList.add("hidden");

    highlights.forEach((t) => {
      const isLive = t.startDate <= today && t.endDate >= today;
      const statusColor = isLive ? "red" : "blue";

      // Texto del badge traducido
      const statusText = isLive
        ? tStatus.liveNow
        : t.startDate === tomorrow
          ? tStatus.tomorrow
          : tStatus.today;

      const card = document.createElement("div");
      card.className =
        "glass-panel p-4 rounded-lg border border-white/10 hover:border-brand-500/50 transition-all group relative overflow-hidden";

      card.innerHTML = `
                <div class="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <span class="text-xs font-bold px-2 py-1 rounded bg-${statusColor}-500/20 text-${statusColor}-400 border border-${statusColor}-500/50 animate-pulse">
                        ${statusText}
                    </span>
                </div>

                <div class="flex items-center gap-3 mb-2">
                    <span class="text-2xl">${t.tier === "S" ? "🏆" : "🎮"}</span>
                    <div>
                        <h4 class="font-bold text-white leading-tight text-lg">${t.name}</h4>
                        <span class="text-xs text-gray-400 font-mono">${formatDate(t.startDate)} - ${formatDate(t.endDate)}</span>
                    </div>
                </div>
                
                <div class="mt-3 flex items-center justify-between">
                    <div class="text-xs text-gray-500 truncate max-w-[70%]">
                        ${t.teams || "TBD"}
                    </div>
                    <button class="btn-fav-highlight hover:scale-110 transition-transform text-lg" data-id="${t.id}">
                        ${isFavorite(t.id) ? "⭐" : "☆"}
                    </button>
                </div>
            `;

      const btnFav = card.querySelector(".btn-fav-highlight");
      btnFav.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(t.id);
      });

      container.appendChild(card);
    });
  }
}

export { renderHighlights };
