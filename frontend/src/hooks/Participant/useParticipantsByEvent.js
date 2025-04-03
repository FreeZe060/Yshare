import { useState, useEffect } from "react";
import { getParticipantsByEvent } from "../services/participantService";

function useParticipantsByEvent(eventId) {
	const [participants, setParticipants] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!eventId) return;
		const fetchParticipants = async () => {
			setLoading(true);
			try {
				const data = await getParticipantsByEvent(eventId);
				setParticipants(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchParticipants();
	}, [eventId]);

	return { participants, loading, error };
}

export default useParticipantsByEvent;