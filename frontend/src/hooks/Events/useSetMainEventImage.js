import { useState } from 'react';
import { setMainEventImage } from '../../services/eventService';
import { useAuth } from '../../config/authHeader';

export default function useSetMainEventImage() {
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const setMainImage = async (eventId, imageId) => {
		setLoading(true);
		setError(null);
		try {
			await setMainEventImage(eventId, imageId, user.token);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { setMainImage, loading, error };
}