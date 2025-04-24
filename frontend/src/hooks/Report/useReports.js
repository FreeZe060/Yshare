import { useState, useEffect, useCallback } from 'react';
import { getReports } from '../../services/reportService';
import { useAuth } from '../../config/authHeader';

function useReports() {
	const { user } = useAuth();
	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchReports = useCallback(async () => {
		if (!user?.token) return;
		setLoading(true);
		try {
			const data = await getReports(user.token);
			setReports(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [user]);

	useEffect(() => {
		fetchReports();
	}, [fetchReports]);

	return { reports, setReports, fetchReports, loading, error };
}

export default useReports;