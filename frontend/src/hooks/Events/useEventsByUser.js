import { useEffect, useState } from 'react';
import { useAuth } from '../../config/authHeader';
import { fetchMyEvents } from '../../services/eventService';

const useMyEvents = () => {
	const { user } = useAuth();
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadEvents = async () => {
			if (!user?.token) return;

			try {
				const data = await fetchMyEvents(user.token);
				setEvents(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadEvents();
	}, [user?.token]);

	return { events, loading, error };
};

export default useMyEvents;