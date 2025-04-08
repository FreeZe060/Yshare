import { useEffect, useState } from "react";
import { getParticipantsByEvent } from "../../services/participantService";
import { formatAvatars } from "../../utils/format";

export default function useParticipantAvatars(eventId) {
	const [avatars, setAvatars] = useState([]);

	useEffect(() => {
		const fetch = async () => {
			try {
				const participants = await getParticipantsByEvent(eventId);
				setAvatars(formatAvatars(participants));
			} catch (err) {
				console.error("Erreur participants:", err.message);
				setAvatars(formatAvatars([]));
			}
		};
		if (eventId) fetch();
	}, [eventId]);

	return avatars;
}
