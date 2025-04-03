import { useState, useEffect } from "react";
import { getParticipantByIndex } from "../services/participantService";

function useParticipant(eventId, index) {
	const [participant, setParticipant] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!eventId || !index) return;
		const fetchParticipant = async () => {
			setLoading(true);
			try {
				const data = await getParticipantByIndex(eventId, index);
				setParticipant(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchParticipant();
	}, [eventId, index]);

	return { participant, loading, error };
}

export default useParticipant;