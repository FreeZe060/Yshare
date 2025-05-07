import { useState } from "react";
import { updateParticipantStatus } from "../../services/participantService";

function useUpdateParticipantStatus() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const updateStatus = async (eventId, id, status) => {
		setLoading(true);
		setError(null);
		try {
			const result = await updateParticipantStatus(eventId, id, status);
			return result;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { updateStatus, loading, error };
}

export default useUpdateParticipantStatus;