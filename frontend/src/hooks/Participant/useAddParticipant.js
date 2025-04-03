import { useState } from "react";
import { addParticipant } from "../services/participantService";

function useAddParticipant() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const add = async (eventId) => {
		setLoading(true);
		setError(null);
		try {
			const result = await addParticipant(eventId);
			return result;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { add, loading, error };
}

export default useAddParticipant;