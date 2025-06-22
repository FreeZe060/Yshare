import { useState, useEffect } from "react";
import { getMyReports } from "../../services/reportService";
import { useAuth } from "../../config/authHeader";

function useMyReports() {
	const { user } = useAuth();
	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!user?.token) return;

		const fetchReports = async () => {
			setLoading(true);
			try {
				const data = await getMyReports(user.token);
				setReports(data);
				setError(null);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchReports();
	}, [user]);

	return { reports, loading, error };
}

export default useMyReports;