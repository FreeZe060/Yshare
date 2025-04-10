import { useState } from 'react';
import { createEvent } from '../../services/eventService';
import { useAuth } from '../../config/authHeader';

function useCreateEvent() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const handleCreateEvent = async (eventData) => {
		if (!user?.token) throw new Error("Authentification requise");
		setLoading(true);
		setError(null);
		try {
			return await createEvent(eventData, user.token);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { handleCreateEvent, loading, error };
}

export default useCreateEvent;