const EventService = require('../services/EventService');

function startStatusScheduler(intervalMinutes = 5) {
	console.log(`[Scheduler] Lancement de la vérification automatique toutes les ${intervalMinutes} minutes.`);

	setInterval(async () => {
		try {
			await EventService.updateAllEventStatusesByDate();
		} catch (err) {
			console.error('[Scheduler] Erreur pendant la mise à jour des statuts :', err.message);
		}
	}, intervalMinutes * 60 * 1000);
}

module.exports = startStatusScheduler;