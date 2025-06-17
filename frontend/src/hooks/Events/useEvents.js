import { useState, useEffect, useCallback } from 'react';
import { fetchEvents } from '../../services/eventService';

function useEvents(filters, page, limit, autoFetch = true, refreshKey = 0) {
	const [events, setEvents] = useState([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchData = useCallback(async (customFilters = filters, customPage = page, customLimit = limit) => {
		setLoading(true);
		try {
			const data = await fetchEvents(customFilters, customPage, customLimit);
			setEvents(data.events);
			setTotal(data.total);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [filters, page, limit]);

	useEffect(() => {
		if (autoFetch) fetchData();
	}, [fetchData, autoFetch, refreshKey]);

	return {
		events,
		total,
		loading,
		error,
		fetchData,
	};
}
export default useEvents;