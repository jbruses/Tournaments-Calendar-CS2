import "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js";
import "https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.15/locales/es.global.min.js";

import { getLang } from "./utils.js";
import { filteredTournaments, editTournament } from "./tournaments.js";

let calendar;

function initCalendar() {
  const calendarEl = document.getElementById("calendar");
  if (!calendarEl) return;

  const { Calendar } = window.FullCalendar;
  const lang = getLang();

  calendar = new Calendar(calendarEl, {
    initialView: "dayGridMonth",

    locale: lang,

    headerToolbar: {
      left: "prev,next",
      center: "title",
      right: "today",
    },
    height: "auto",
    contentHeight: "auto",
    aspectRatio: 1.35,
    events: [],

    eventClick: function (info) {
      editTournament(info.event.id);
    },
    eventDisplay: "block",
    eventTimeFormat: { hour: "numeric", minute: "2-digit", hour12: false },
    firstDay: 1,
    dayMaxEvents: 3,
    dayMaxEventRows: 2,
    moreLinkText: (num) => `+${num}`,
    eventDidMount: (info) => {
      info.el.title = info.event.title;
    },
  });

  calendar.render();
  renderCalendar();
}

function renderCalendar() {
  if (!calendar) return;
  calendar.removeAllEvents();
  const list = filteredTournaments();

  list.forEach((tournament) => {
    if (!tournament.startDate || !tournament.endDate) return;
    const start = new Date(tournament.startDate);
    const end = new Date(tournament.endDate);
    end.setUTCDate(end.getUTCDate() + 1);

    const colorBase = tournament.color || "blue";

    calendar.addEvent({
      id: tournament.id,
      title: `${tournament.name} (${tournament.tier})`,
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
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

function setCalendarLocale(lang) {
  if (calendar) {
    calendar.setOption("locale", lang);
  }
}

export { initCalendar, renderCalendar, setCalendarLocale };
