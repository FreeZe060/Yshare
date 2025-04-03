import { useState, useEffect } from "react";
import { getAllParticipantsForAdmin } from "../services/participantService";

function useAllParticipantsForAdmin() {
	const [participants, setParticipants] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchParticipants = async () => {
			setLoading(true);
			try {
				const data = await getAllParticipantsForAdmin();
				setParticipants(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchParticipants();
	}, []);

	return { participants, loading, error };
}

export default useAllParticipantsForAdmin;