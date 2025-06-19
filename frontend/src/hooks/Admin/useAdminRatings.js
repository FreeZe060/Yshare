import { useState, useEffect } from "react";
import { getAllRatings } from "../../services/ratingService";
import { useAuth } from "../../config/authHeader";

function useAdminRatings() {
	const [ratings, setRatings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const fetchRatings = async () => {
		if (!user?.token) return;
		setLoading(true);
		try {
			const data = await getAllRatings(user.token);
			setRatings(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRatings();
	}, [user?.token]);

	return { ratings, loading, error, refetch: fetchRatings };
}

export default useAdminRatings;