import { useState, useEffect, useCallback } from 'react';
import { fetchEvents } from '../../services/eventService';

function useEvents(filters, page, limit) {
	const [events, setEvents] = useState([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			const data = await fetchEvents(filters, page, limit);
			setEvents(data.events);
			setTotal(data.total);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [filters, page, limit]);

	useEffect(() => {
		fetchData(); 
	}, [fetchData]);

	return {
		events,
		total,
		loading,
		error,
		fetchData 
	};
}

export default useEvents;