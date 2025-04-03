import { useState, useEffect } from "react";
import { getFavorisById } from "../services/favorisService";
import { useAuth } from "../context/AuthContext";

function useFavorisById(eventId) {
	const [favori, setFavori] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	useEffect(() => {
		if (!eventId || !user?.token) return;

		const fetchFavori = async () => {
			setLoading(true);
			try {
				const data = await getFavorisById(eventId, user.token);
				setFavori(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchFavori();
	}, [eventId, user?.token]);

	return { favori, loading, error };
}

export default useFavorisById;