import { useState } from 'react';
import { addImagesToEvent } from '../../services/eventService';
import { useAuth } from '../../config/authHeader';

export default function useAddEventImages() {
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const addImages = async (eventId, files) => {
		setLoading(true);
		setError(null);
		try {
			const result = await addImagesToEvent(eventId, files, user.token);
			return result;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { addImages, loading, error };
}