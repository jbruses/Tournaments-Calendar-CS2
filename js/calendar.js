import {
    tournaments,
    currentLang
} from './state.js';
import {
    translations
} from './ui.js';
import {
    editTournament,
    filteredTournaments
} from './tournaments.js';
import {
    formatDate
} from './utils.js';

let calendar;

function initCalendar() {
    const calendarEl = document.getElementById("calendar");
    if (!calendarEl) return;

    if (typeof FullCalendar === 'undefined') {
        calendarEl.innerHTML = `<div style="text-align: center; padding: 2rem; color: #9ca3af;">Calendar library not loaded.</div>`;
        return;
    }

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
        eventClick: function(info) {
            editTournament(parseInt(info.event.id));
        },
        eventDisplay: "block",
        eventTimeFormat: {
            hour: "numeric",
            minute: "2-digit",
            hour12: false
        },
        firstDay: 1,
        locale: currentLang === "es" ? "es" : "en",
        buttonText: {
            today: translations[currentLang].calendarButtons.today,
        },
        dayMaxEvents: 3,
        dayMaxEventRows: 2,
        moreLinkText: function(num) {
            return `+${num}`;
        },
        eventDidMount: function(info) {
            // Customize event display
            info.el.style.fontSize = '0.75rem';
            info.el.style.padding = '1px 4px';
        },
    });
    calendar.render();
}

function renderCalendar() {
    if (!calendar) return;
    calendar.removeAllEvents();
    filteredTournaments().forEach((tournament) => {
        const start = new Date(tournament.startDate);
        const end = new Date(tournament.endDate);
        end.setUTCDate(end.getUTCDate() + 1); // FullCalendar usa end exclusivo
        calendar.addEvent({
            id: tournament.id,
            title: `${tournament.name} (${tournament.teams}, ${tournament.location}, ${tournament.modality}, ${formatDate(
                tournament.startDate
            )} - ${formatDate(tournament.endDate)})`,
            start: start.toISOString().split("T")[0],
            end: end.toISOString().split("T")[0],
            classNames: [`event-${tournament.color}`],
            extendedProps: {
                tier: tournament.tier,
                vrs: tournament.vrs,
                location: tournament.location,
                modality: tournament.modality,
            },
        });
    });
}

export {
    initCalendar,
    renderCalendar
};
