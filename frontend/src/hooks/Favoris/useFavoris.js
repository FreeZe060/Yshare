import { useState, useEffect } from "react";
import { getAllFavoris } from "../../services/favorisService";
import { useAuth } from "../../context/AuthContext";

function useFavoris() {
	const [favoris, setFavoris] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	useEffect(() => {
		if (!user?.token) return;

		const fetchFavoris = async () => {
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

		fetchFavoris();
	}, [user?.token]);

	return { favoris, loading, error };
}

export default useFavoris;