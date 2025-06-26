import { useState } from 'react';
import { deleteEventImage } from '../../services/eventService';
import { useAuth } from '../../config/authHeader';

export default function useDeleteEventImage() {
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const deleteImage = async (imageId) => {
		setLoading(true);
		setError(null);
		try {
			await deleteEventImage(imageId, user.token);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { deleteImage, loading, error };
}