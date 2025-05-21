import { useState } from "react";
import { addParticipant } from "../../services/participantService";

function useAddParticipant() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const addNewParticipant = async (eventId, message, guests = []) => {
		setLoading(true);
		setError(null);

		try {
			const token = localStorage.getItem("token"); 
			const result = await addParticipant(eventId, token, message, guests);
			return result;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { addNewParticipant, loading, error };
}

export default useAddParticipant;