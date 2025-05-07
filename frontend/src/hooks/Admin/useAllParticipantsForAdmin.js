import { useState, useEffect, useCallback } from "react";
import { getAllParticipantsForAdmin } from "../../services/participantService";
import { useAuth } from "../../config/authHeader";

function useAllParticipantsForAdmin() {
	const [participants, setParticipants] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const fetchParticipants = useCallback(async () => {
		setLoading(true);
		try {
			const data = await getAllParticipantsForAdmin(user.token);
			setParticipants(data);
			setError(null);
		} catch (err) {
			setError(err.message);
			console.error("❌ useAllParticipantsForAdmin - fetchParticipants:", err.message);
		} finally {
			setLoading(false);
		}
	}, [user.token]);

	useEffect(() => {
		fetchParticipants();
	}, [fetchParticipants]);

	return { participants, loading, error, refetch: fetchParticipants };
}

export default useAllParticipantsForAdmin;