import { db, auth } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { renderCalendar } from "./calendar.js";
import { renderHighlights } from "./highlights.js";

// ⬇️ IMPORTACIONES CRÍTICAS (Aquí estaba el error)
import {
  escapeHtml,
  formatDate, // Ahora viene de utils
  addTeamTag,
  currentTeams,
  setCurrentTeams,
  translations,
  getLang,
  toggleAddForm,
  formatDateForDisplay
} from "./utils.js";

let tournaments = [];
let editingTournamentId = null;
let sortDirectionDate = 1;
let sortDirectionVRS = 1;
let favoriteTournamentIds = JSON.parse(
  localStorage.getItem("favorites") || "[]",
);

// ==========================================
// LOGOS (Local para renderAvatars)
// ==========================================
const teamLogos = {
  navi: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ac/NaVi_logo.svg/1200px-NaVi_logo.svg.png",
  faze: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/FaZe_Clan.svg/1200px-FaZe_Clan.svg.png",
  g2: "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/G2_Esports_logo.svg/1200px-G2_Esports_logo.svg.png",
  vitality:
    "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Team_Vitality_logo.svg/1200px-Team_Vitality_logo.svg.png",
  spirit:
    "https://upload.wikimedia.org/wikipedia/en/thumb/c/ce/Team_Spirit_logo.svg/1200px-Team_Spirit_logo.svg.png",
  mouz: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1f/Mousesports_logo.svg/1200px-Mousesports_logo.svg.png",
  liquid:
    "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Team_Liquid_logo.svg/1200px-Team_Liquid_logo.svg.png",
  astralis:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Astralis_logo.svg/1200px-Astralis_logo.svg.png",
  "9z team":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/9z_Team_logo.png/600px-9z_Team_logo.png",
  bestia:
    "https://img-cdn.hltv.org/teamlogo/0x8d5c41e8c4f2e5a6a6f1d8c4f2e5a6a6/11918/bestia.png",
};

// ==========================================
// CRUD FIREBASE
// ==========================================

// 1. CARGAR
async function loadTournaments() {
  const user = auth.currentUser;
  if (!user) {
    tournaments = [];
    renderAll();
    return;
  }

  try {
    const q = query(
      collection(db, "tournaments"),
      where("uid", "==", user.uid),
    );
    const querySnapshot = await getDocs(q);

    tournaments = [];
    querySnapshot.forEach((doc) => {
      tournaments.push({ id: doc.id, ...doc.data() });
    });
    tournaments.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    renderAll();
  } catch (e) {
    console.error("Error cargando torneos:", e);
  }
}

function formatDateForSave(dateStr) {
  if (!dateStr) return "";
  if (dateStr.includes("-")) return dateStr;
  
  const parts = dateStr.split("/");
  if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
  }
  return dateStr;
}

async function saveTournament() {
  const user = auth.currentUser;
  if (!user) {
    alert("Inicia sesión para guardar.");
    return;
  }

  const name = document.getElementById("tournamentName").value.trim();
  const tier = document.getElementById("tournamentTier").value;

  const rawStart = document.getElementById("startDate").value;
  const rawEnd = document.getElementById("endDate").value;

  const startDate = formatDateForSave(rawStart);
  const endDate = formatDateForSave(rawEnd);

  const pendingTeam = document.getElementById("tournamentTeams").value.trim();
  if (pendingTeam) addTeamTag(pendingTeam);
  const teams = currentTeams.join(", ");

  const location = document.getElementById("tournamentLocation").value.trim();
  const modality = document.getElementById("tournamentModality").value;
  const color = document.getElementById("tournamentColor").value;
  const vrs = document.getElementById("tournamentVRS").checked;

  if (!name || !tier || !startDate || !endDate) {
    alert(translations[getLang()].incompleteFields);
    return;
  }

  if (new Date(endDate) < new Date(startDate)) {
    alert(translations[getLang()].invalidDate);
    return;
  }

  const tournamentData = {
    name,
    tier,
    startDate,
    endDate,
    teams,
    location,
    modality,
    color,
    vrs,
    uid: user.uid,
    updatedAt: new Date(),
  };

  try {
    if (editingTournamentId) {
      const docRef = doc(db, "tournaments", editingTournamentId);
      await updateDoc(docRef, tournamentData);
    } else {
      tournamentData.createdAt = new Date();
      await addDoc(collection(db, "tournaments"), tournamentData);
    }
    await loadTournaments();
    cancelEdit();
    toggleAddForm();
  } catch (e) {
    console.error("Error saving:", e);
    alert("Error al guardar en la nube.");
  }
}

// 3. BORRAR
async function deleteTournament(id) {
  if (!confirm(translations[getLang()].confirmDelete)) return;
  try {
    await deleteDoc(doc(db, "tournaments", id));
    tournaments = tournaments.filter((t) => t.id !== id);
    renderAll();
  } catch (e) {
    console.error("Error deleting:", e);
  }
}

function editTournament(id) {
  const t = tournaments.find((x) => x.id === id);
  if (!t) return;

  editingTournamentId = id;

  document.getElementById("tournamentName").value = t.name;
  document.getElementById("tournamentTier").value = t.tier;

  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");

  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`; 
    }
    return dateStr;
  };
  
  if (startInput._flatpickr) {
    const fechaFinal = normalizeDate(t.startDate);
    console.log("🔥 Seteando en Flatpickr:", fechaFinal); 

    startInput._flatpickr.setDate(fechaFinal, true);
  } else {
    startInput.value = t.startDate;
  }

  if (endInput._flatpickr) {
    endInput._flatpickr.setDate(normalizeDate(t.endDate), true);
  } else {
    endInput.value = t.endDate;
  }

  document.getElementById("tournamentLocation").value = t.location || "";
  document.getElementById("tournamentModality").value = t.modality || "Online";
  document.getElementById("tournamentColor").value = t.color || "blue";
  document.getElementById("tournamentVRS").checked = t.vrs || false;

  const teamsArray = t.teams
    ? t.teams
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s)
    : [];
  setCurrentTeams(teamsArray);

  const tText = translations[getLang()];
  document.getElementById("formTitle").textContent = tText.formTitles.edit;
  document.getElementById("saveButton").textContent = tText.saveButtons.edit;
  document.getElementById("btnCancel").classList.remove("hidden");

  const formBody = document.getElementById("addTournamentFormBody");
  if (formBody.classList.contains("hidden")) toggleAddForm();
  document.getElementById("formTitle").scrollIntoView({ behavior: "smooth" });
}

function cancelEdit() {
  editingTournamentId = null;
  clearForm();
  const tText = translations[getLang()];
  document.getElementById("formTitle").textContent = tText.formTitles.add;
  document.getElementById("saveButton").textContent = tText.saveButtons.add;
  document.getElementById("btnCancel").classList.add("hidden");
}

function clearForm() {
  document.getElementById("tournamentName").value = "";
  document.getElementById("tournamentTier").value = "S";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  document.getElementById("tournamentTeams").value = "";
  document.getElementById("tournamentLocation").value = "";
  document.getElementById("tournamentVRS").checked = false;
  setCurrentTeams([]);
}

// ==========================================
// RENDERING
// ==========================================

function renderAll() {
  renderTournaments();
  renderCalendar();
  renderHighlights();
}

function renderTournaments() {
  const tbody = document.getElementById("tournamentBody");
  const cardContainer = document.getElementById("tournamentCardContainer");
  const tableElement = document.getElementById("tournamentTable");

  if (!tbody || !tableElement) return;

  if (localStorage.getItem("view") === "cards") {
    tableElement.classList.add("hidden");
    if (cardContainer) cardContainer.remove();
    const newCardContainer = renderTournamentCards();
    newCardContainer.id = "tournamentCardContainer";
    tableElement.parentNode.insertBefore(newCardContainer, tableElement);
  } else {
    if (cardContainer) cardContainer.remove();
    tableElement.classList.remove("hidden");
    tbody.innerHTML = "";

    filteredTournaments().forEach((t) => {
      const row = document.createElement("tr");
      row.className =
        "border-b border-gray-700/50 hover:bg-white/5 transition-colors";
      row.innerHTML = `
                <td class="py-4 px-4 text-white">${escapeHtml(t.name)}</td>
                <td class="py-4 px-4"><span class="bg-dark-900 border border-gray-700 px-2 py-1 rounded text-xs font-bold">${t.tier}</span></td>
                <td class="py-4 px-4 text-xs text-gray-400 font-mono">${formatDateForDisplay(t.startDate)} - ${formatDateForDisplay(t.endDate)}</td>
                <td class="py-4 px-4">${renderAvatars(t.teams, true)}</td>
                <td class="py-4 px-4 text-sm text-gray-400">${escapeHtml(t.location)}</td>
                <td class="py-4 px-4 text-sm">${t.modality}</td>
                <td class="py-4 px-4"><span class="w-3 h-3 rounded-full block bg-${t.color}-500 shadow-[0_0_8px] shadow-${t.color}-500/50"></span></td>
                <td class="py-4 px-4">${t.vrs ? "✅" : "-"}</td>
                <td class="py-4 px-4 text-center">
                    <div class="flex justify-center gap-2">
                        <button class="btn-edit text-blue-400 hover:text-white" data-id="${t.id}">✏️</button>
                        <button class="btn-delete text-red-400 hover:text-white" data-id="${t.id}">🗑️</button>
                    </div>
                </td>`;
      tbody.appendChild(row);
    });
  }
}

function renderTournamentCards() {
  const container = document.createElement("div");
  container.className =
    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6";

  filteredTournaments().forEach((t) => {
    const status = getStatus(t.startDate, t.endDate);
    const card = document.createElement("div");
    card.className =
      "glass-panel relative flex flex-col h-full rounded-xl overflow-hidden border border-white/5 transition-all duration-300 group hover:border-brand-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:-translate-y-1";

    // AQUÍ ES DONDE SE USA escapeHtml (Ahora funciona porque está importado)
    card.innerHTML = `
            <div class="absolute top-0 left-0 w-full h-1 bg-${t.color}-500 shadow-[0_0_10px] shadow-${t.color}-500/50"></div>
            <div class="p-6 flex flex-col flex-grow">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="font-display font-bold text-xl text-white leading-tight pr-16 break-words">${escapeHtml(t.name)}</h3>
                    <div class="flex flex-col items-end gap-2">${getStatusBadge(status)}</div>
                </div>
                <div class="space-y-2 text-sm text-gray-400 mb-6">
                     <div class="flex items-center gap-3"><span class="text-brand-500">📅</span><span class="font-mono text-xs">${formatDate(t.startDate)} - ${formatDate(t.endDate)}</span></div>
                     <div class="flex items-center gap-3"><span class="text-brand-500">📍</span><span class="truncate">${escapeHtml(t.location)} (${t.modality})</span></div>
                     <div class="flex items-center gap-3"><span class="text-brand-500">🏆</span><span class="text-xs font-bold uppercase bg-white/5 px-2 py-0.5 rounded">Tier ${t.tier}</span></div>
                </div>
                <div class="mb-6 flex-grow">
                     <div class="text-[10px] text-gray-500 uppercase font-bold mb-2 tracking-widest">Equipos</div>
                     <div class="flex -space-x-2 overflow-hidden items-center p-1">${renderAvatars(t.teams)}</div>
                </div>
                <div class="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                     <button class="btn-fav p-2 hover:bg-white/10 rounded-lg" data-id="${t.id}">${isFavorite(t.id) ? "⭐" : "☆"}</button>
                     <div class="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                         <button class="btn-edit text-xs bg-dark-800 hover:bg-brand-600 text-white px-3 py-1.5 rounded border border-white/10 font-bold uppercase" data-id="${t.id}">Editar</button>
                         <button class="btn-delete text-xs bg-dark-800 hover:bg-red-600 text-white px-3 py-1.5 rounded border border-white/10 font-bold uppercase" data-id="${t.id}">Borrar</button>
                     </div>
                </div>
            </div>`;
    container.appendChild(card);
  });
  return container;
}

function renderAvatars(teamsString, isTable = false) {
  if (!teamsString) return "";
  const teams = teamsString
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);
  const maxVisible = 5;

  let html = teams
    .slice(0, maxVisible)
    .map((team) => {
      const lower = team.toLowerCase();
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(team)}&background=random&color=fff&size=64&bold=true`;
      const src = teamLogos[lower] || avatarUrl;
      const sizeClass = isTable ? "w-6 h-6" : "w-8 h-8";

      return `<div class="relative group z-10 hover:z-20 transition-all hover:scale-110">
            <div class="${sizeClass} rounded-full bg-dark-800 border border-white/10 ring-2 ring-dark-900 overflow-hidden" title="${escapeHtml(team)}">
                 <img src="${src}" class="w-full h-full object-cover" onerror="this.src='${avatarUrl}'"/>
            </div>
        </div>`;
    })
    .join("");

  if (teams.length > maxVisible) {
    const hidden = teams.slice(maxVisible).join(", ");
    html += `<div class="relative z-0 hover:z-20 transition-all hover:scale-110">
            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-dark-700 border border-white/10 ring-2 ring-dark-900 text-xs font-bold text-gray-300 cursor-help" title="${escapeHtml(hidden)}">
                +${teams.length - maxVisible}
            </div>
        </div>`;
  }
  return html;
}

// ==========================================
// FILTROS & HELPERS
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
  if (f.fav) filtered = filtered.filter((t) => isFavorite(t.id));

  return filtered.filter((t) => {
    const textOK =
      !f.text ||
      t.name.toLowerCase().includes(f.text) ||
      t.teams.toLowerCase().includes(f.text);
    const tierOK = !f.tier || t.tier === f.tier;
    const modalityOK = !f.modality || t.modality === f.modality;
    const locationOK =
      !f.location || t.location.toLowerCase().includes(f.location);
    const rangeOK =
      (!f.from || t.endDate >= f.from) && (!f.to || t.startDate <= f.to);

    let vrsOK = true;
    if (f.vrs === "1") vrsOK = t.vrs === true;
    if (f.vrs === "0") vrsOK = t.vrs === false;

    return textOK && tierOK && modalityOK && locationOK && rangeOK && vrsOK;
  });
}

function getStatus(startDate, endDate) {
  const today = new Date().toISOString().slice(0, 10);
  if (today >= startDate && today <= endDate) return "live";
  else if (today < startDate) return "upcoming";
  else return "completed";
}

function getStatusBadge(status) {
  const lang = getLang();
  // Usamos las traducciones de utils.js
  const t = translations[lang].status;

  const map = {
    live: {
      text: t.live,
      class: "bg-red-500/20 text-red-400 border-red-500/50 animate-pulse",
    },
    upcoming: {
      text: t.upcoming,
      class: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    },
    completed: {
      text: t.completed,
      class: "bg-gray-700/50 text-gray-500 border-gray-600/50",
    },
  };
  const s = map[status];
  return `<span class="px-2 py-0.5 rounded text-[10px] font-bold border ${s.class} tracking-wider">${s.text}</span>`;
}

function sortByDate() {
  tournaments.sort(
    (a, b) =>
      sortDirectionDate * (new Date(a.startDate) - new Date(b.startDate)),
  );
  sortDirectionDate = -sortDirectionDate;
  renderTournaments();
}

function sortByVRS() {
  tournaments.sort((a, b) => sortDirectionVRS * (b.vrs - a.vrs));
  sortDirectionVRS = -sortDirectionVRS;
  renderTournaments();
}

function toggleFavorite(id) {
  const index = favoriteTournamentIds.indexOf(id);
  if (index === -1) favoriteTournamentIds.push(id);
  else favoriteTournamentIds.splice(index, 1);
  localStorage.setItem("favorites", JSON.stringify(favoriteTournamentIds));
  renderAll();
}

function isFavorite(id) {
  return favoriteTournamentIds.includes(id);
}

// ==========================================
// UTILS EXPORT (Backup)
// ==========================================
function exportTournaments() {
  if (!tournaments.length) {
    alert(translations[getLang()].noTournaments);
    return;
  }
  const cleanData = tournaments.map(({ id, uid, ...rest }) => rest);
  const blob = new Blob([JSON.stringify(cleanData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cs2_calendar_backup.json";
  a.click();
}

function importTournaments(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      const user = auth.currentUser;
      if (!user) return alert("Inicia sesión para importar.");

      const batchPromises = imported.map((t) => {
        return addDoc(collection(db, "tournaments"), {
          ...t,
          uid: user.uid,
          createdAt: new Date(),
        });
      });

      await Promise.all(batchPromises);
      await loadTournaments();
      alert("Importación completada.");
    } catch (err) {
      console.error(err);
      alert("Error al importar JSON.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function exportICS() {
  const list = filteredTournaments();
  if (!list.length) return alert(translations[getLang()].noTournaments);

  let ics = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//CS2 Calendar//EN\r\n";
  list.forEach((t) => {
    const start = t.startDate.replace(/-/g, "");
    const end = t.endDate.replace(/-/g, "");
    ics += `BEGIN:VEVENT\r\nDTSTART;VALUE=DATE:${start}\r\nDTEND;VALUE=DATE:${end}\r\nSUMMARY:${t.name}\r\nDESCRIPTION:Tier ${t.tier} - ${t.teams}\r\nEND:VEVENT\r\n`;
  });
  ics += "END:VCALENDAR\r\n";

  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "calendar.ics";
  a.click();
}

export {
  tournaments,
  editingTournamentId,
  loadTournaments,
  saveTournament,
  editTournament,
  deleteTournament,
  cancelEdit,
  renderTournaments,
  filteredTournaments,
  toggleFavorite,
  isFavorite,
  sortByDate,
  sortByVRS,
  getStatus,
  getStatusBadge,
  exportTournaments,
  importTournaments,
  exportICS,
};
