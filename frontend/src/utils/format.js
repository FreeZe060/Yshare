
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';


export function formatEuro(amount) {
    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
        return 'Gratuit';
    }

    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
    }).format(numericAmount);
}

export function formatDate(dateInput, type = 'long') {
    const date = new Date(dateInput);
    if (isNaN(date)) return '';

    if (type === 'short') {
        return new Intl.DateTimeFormat('fr-FR').format(date);
    }

    const formatted = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);

    return capitalizeDayAndMonth(formatted);
}

function capitalizeDayAndMonth(str) {
    const moisEtJours = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
        'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'
    ];

    return str.split(' ').map(word => {
        return moisEtJours.includes(word.toLowerCase())
            ? word.charAt(0).toUpperCase() + word.slice(1)
            : word;
    }).join(' ');
}

export function getFormattedDayAndMonthYear(dateStr) {
    const date = new Date(dateStr);

    const day = format(date, 'dd', { locale: fr });
    const monthYear = format(date, 'MMMM yyyy', { locale: fr });

    const capitalizedMonthYear = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);

    return {
        day,
        monthYear: capitalizedMonthYear
    };
}

export function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
