import { translations, currentLang } from './ui.js';
import { filteredTournaments, editTournament } from './tournaments.js';

let calendar;

function initCalendar() {
    const calendarEl = document.getElementById("calendar");
    if (!calendarEl) return;

    // Verificar si la librería cargó
    if (typeof FullCalendar === 'undefined') {
        calendarEl.innerHTML = `<div class="text-center p-8 text-gray-500">Calendar library not loaded.</div>`;
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
        
        // Al hacer click, editamos
        eventClick: function(info) {
            editTournament(parseInt(info.event.id));
        },
        
        eventDisplay: "block",
        eventTimeFormat: {
            hour: "numeric",
            minute: "2-digit",
            hour12: false
        },
        firstDay: 1, // Lunes
        locale: currentLang === "es" ? "es" : "en",
        buttonText: {
            today: translations[currentLang]?.calendarButtons?.today || "Hoy",
        },
        dayMaxEvents: 3,
        dayMaxEventRows: 2,
        
        // Texto para "ver más"
        moreLinkText: function(num) {
            return `+${num}`;
        },
        
        // Estilos al montar el evento (Limpieza: Delegamos estilos a CSS/Tailwind)
        eventDidMount: function(info) {
            // Solo dejamos el tooltip nativo
            info.el.title = info.event.title;
            // Los estilos visuales ahora van por clases en renderCalendar
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
        const start = new Date(tournament.startDate);
        const end = new Date(tournament.endDate);
        // FullCalendar es exclusivo con la fecha final, sumamos 1 día
        end.setUTCDate(end.getUTCDate() + 1); 
        
        // Corrección de color: Usamos clases de Tailwind directamente
        // Si tournament.color es "blue", generará "bg-blue-600"
        const colorBase = tournament.color || 'blue';
        
        calendar.addEvent({
            id: tournament.id,
            title: `${tournament.name} (${tournament.tier})`,
            start: start.toISOString().split("T")[0],
            end: end.toISOString().split("T")[0],
            
            // AQUI ESTÁ LA CLAVE: Clases de Tailwind para el evento
            classNames: [
                `bg-${colorBase}-600`, // Fondo dinámico según color
                'border-none',         // Sin borde default
                'text-white',          // Texto blanco
                'shadow-sm',           // Sombra suave
                'hover:brightness-110',// Efecto hover
                'cursor-pointer',      // Manito
                'text-xs',             // Texto pequeño
                'font-medium',         // Fuente semi-negrita
                'px-1'                 // Padding lateral
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
export {
    initCalendar,
    renderCalendar
};