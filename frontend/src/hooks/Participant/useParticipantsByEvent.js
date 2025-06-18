import { useState, useEffect } from "react";
import { getParticipantsByEvent } from "../../services/participantService";
import { useAuth } from "../../config/authHeader";

function useParticipantsByEvent(eventId) {
	const [participants, setParticipants] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { token } = useAuth(); 

	useEffect(() => {
		if (!eventId) return;

		const fetchParticipants = async () => {
			setLoading(true);
			try {
				const data = await getParticipantsByEvent(eventId, token);
				setParticipants(Array.isArray(data) ? data : []);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchParticipants();
	}, [eventId, token]);

	return { participants, loading, error };
}

export default useParticipantsByEvent;