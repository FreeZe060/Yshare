import { useState, useEffect } from 'react';
import { getReportDetails } from '../../services/reportService';
import { useAuth } from '../../config/authHeader';

function useReportDetails(reportId) {
	const { user } = useAuth();
	const [report, setReport] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!reportId || !user?.token) return;

		const fetchReport = async () => {
			try {
				const data = await getReportDetails(reportId, user.token);
				setReport(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchReport();
	}, [reportId, user]);

	return { report, loading, error };
}

export default useReportDetails;