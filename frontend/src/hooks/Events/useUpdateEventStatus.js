import { useState } from 'react';
import { updateEventStatus } from '../../services/eventService';

export default function useUpdateEventStatus() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	const updateStatus = async (eventId, newStatus, token) => {
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			console.log('[useUpdateEventStatus] 🔄 Mise à jour du statut pour ID :', eventId);
			const result = await updateEventStatus(eventId, newStatus, token);
			setSuccess(true);
			return result;
		} catch (err) {
			console.error('[useUpdateEventStatus] ❌ Erreur :', err.message);
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		updateStatus,
		loading,
		error,
		success
	};
}
