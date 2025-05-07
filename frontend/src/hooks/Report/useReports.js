import { useState, useEffect, useCallback } from 'react';
import { getReports } from '../../services/reportService';
import { useAuth } from '../../config/authHeader';

function useReports() {
	const { user } = useAuth();
	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchReports = useCallback(async () => {
		if (!user?.token) {
			console.log("⏳ Token not ready, fetch aborted");
			return;
		}

		console.log("✅ Fetching reports with token:", user.token);

		setLoading(true);
		try {
			const data = await getReports(user.token);
			console.log("📦 Reports fetched:", data);
			setReports(data);
		} catch (err) {
			console.error("❌ Error while fetching reports:", err.message);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [user?.token]);

	useEffect(() => {
		console.log("👀 useEffect triggered - user:", user);
		if (user?.token) {
			fetchReports();
		}
	}, [user?.token, fetchReports]);

	return { reports, setReports, refetch: fetchReports, loading, error };
}

export default useReports;