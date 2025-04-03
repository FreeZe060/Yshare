import { useState } from "react";
import { removeParticipant } from "../services/participantService";

function useRemoveParticipant() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const remove = async (eventId, index) => {
		setLoading(true);
		setError(null);
		try {
			const result = await removeParticipant(eventId, index);
			return result;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { remove, loading, error };
}

export default useRemoveParticipant;