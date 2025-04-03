import { useState } from 'react';
import { deleteEvent } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';

function useDeleteEvent() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const handleDeleteEvent = async (eventId, status = 'Annulé') => {
		if (!user?.token) throw new Error("Authentification requise");
		setLoading(true);
		setError(null);
		try {
			return await deleteEvent(eventId, status, user.token);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { handleDeleteEvent, loading, error };
}

export default useDeleteEvent;