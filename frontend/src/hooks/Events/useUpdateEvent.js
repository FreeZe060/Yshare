import { useState } from 'react';
import { updateEvent } from '../../services/eventService';
import { useAuth } from '../../config/authHeader';

function useUpdateEvent() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const handleUpdateEvent = async (eventId, eventData) => {
		if (!user?.token) throw new Error("Authentification requise");
		setLoading(true);
		setError(null);
		try {
			return await updateEvent(eventId, eventData, user.token);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { handleUpdateEvent, loading, error };
}

export default useUpdateEvent;