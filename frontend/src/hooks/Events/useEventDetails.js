import { useState, useEffect } from 'react';
import { getEventById } from '../../services/eventService';

export default function useEventDetails(eventId) {
	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!eventId) return;

		const fetchEvent = async () => {
			setLoading(true);
			try {
				const data = await getEventById(eventId);
				setEvent(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchEvent();
	}, [eventId]);

	return { event, loading, error };
}
