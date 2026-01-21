// 1. CORRECCIÓN: Importamos desde utils.js para evitar el error y los ciclos
import { translations, getLang } from "./utils.js";
import { filteredTournaments, editTournament } from "./tournaments.js";

let calendar;

function initCalendar() {
  const calendarEl = document.getElementById("calendar");
  if (!calendarEl) return;

  // Verificar si la librería cargó
  if (typeof FullCalendar === "undefined") {
    calendarEl.innerHTML = `<div class="text-center p-8 text-gray-500">Calendar library not loaded.</div>`;
    return;
  }

  // 2. CORRECCIÓN: Usamos getLang() en lugar de la variable importada
  const lang = getLang();

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next",
      center: "title",
      right: "today",
    },
    height: "auto",
    contentHeight: "auto",
    aspectRatio: 1.35,
    events: [],

    // Al hacer click, editamos
    // 3. CORRECCIÓN: Quitamos parseInt porque los IDs de Firebase son strings
    eventClick: function (info) {
      editTournament(info.event.id);
    },

    eventDisplay: "block",
    eventTimeFormat: {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    },
    firstDay: 1, // Lunes
    locale: lang, // Usamos la variable local obtenida de getLang()
    buttonText: {
      today: translations[lang]?.calendarButtons?.today || "Hoy",
    },
    dayMaxEvents: 3,
    dayMaxEventRows: 2,

    // Texto para "ver más"
    moreLinkText: function (num) {
      return `+${num}`;
    },

    eventDidMount: function (info) {
      // Solo dejamos el tooltip nativo
      info.el.title = info.event.title;
    },
  });

  calendar.render();

  // Renderizamos los eventos iniciales
  renderCalendar();
}

function renderCalendar() {
  if (!calendar) return;

  calendar.removeAllEvents();

  // Obtenemos los torneos filtrados
  const list = filteredTournaments();

  list.forEach((tournament) => {
    // Asegurar fechas válidas
    if (!tournament.startDate || !tournament.endDate) return;

    const start = new Date(tournament.startDate);
    const end = new Date(tournament.endDate);

    // FullCalendar es exclusivo con la fecha final, sumamos 1 día
    end.setUTCDate(end.getUTCDate() + 1);

    const colorBase = tournament.color || "blue";

    calendar.addEvent({
      id: tournament.id,
      title: `${tournament.name} (${tournament.tier})`,
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],

      // Clases de Tailwind
      classNames: [
        `bg-${colorBase}-600`,
        "border-none",
        "text-white",
        "shadow-sm",
        "hover:brightness-110",
        "cursor-pointer",
        "text-xs",
        "font-medium",
        "px-1",
      ],

      extendedProps: {
        tier: tournament.tier,
        location: tournament.location,
        modality: tournament.modality,
      },
    });
  });
}

// Exportamos
export { initCalendar, renderCalendar };
