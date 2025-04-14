import { useState, useEffect } from "react";
import { useAuth } from "../../config/authHeader"; 
import { getReports } from "../../services/reportService";

function useReports() {
	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	useEffect(() => {
		if (!user?.token) return;

		const fetchReports = async () => {
			setLoading(true);
			try {
				const data = await getReports(user.token);
				setReports(data);
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

export default useReports;