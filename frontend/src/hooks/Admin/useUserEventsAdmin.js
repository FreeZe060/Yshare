import { useState, useEffect } from "react";
import { getUserEventsAdmin } from "../services/participantService";

function useUserEventsAdmin(userId) {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!userId) return;
		const fetchEvents = async () => {
			setLoading(true);
			try {
				const data = await getUserEventsAdmin(userId);
				setEvents(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchEvents();
	}, [userId]);

	return { events, loading, error };
}

export default useUserEventsAdmin;