import { useState, useEffect } from 'react';
import { getReports } from '../../services/reportService';
import { useAuth } from '../../config/authHeader';

function useReports() {
	const { user } = useAuth();
	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchReports = async () => {
			if (!user?.token) return;
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