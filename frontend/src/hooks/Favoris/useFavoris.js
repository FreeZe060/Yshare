import { useState, useEffect } from "react";
import { getAllFavoris } from "../../services/favorisService";
import { useAuth } from "../../config/authHeader";

function useFavoris() {
	const [favoris, setFavoris] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const fetchFavoris = async () => {
		if (!user?.token) return;
		setLoading(true);
		try {
			const data = await getAllFavoris(user.token);
			setFavoris(data || []);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFavoris();
	}, [user?.token]);

	return { favoris, loading, error, refreshFavoris: fetchFavoris };
}

export default useFavoris;