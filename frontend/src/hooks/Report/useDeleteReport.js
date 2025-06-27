import { useState } from 'react';
import { deleteReport } from '../../services/reportService';
import { useAuth } from '../../config/authHeader';

function useDeleteReport() {
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const removeReport = async (reportId) => {
		setLoading(true);
		setError(null);
		try {
			const result = await deleteReport(reportId, user.token);
			return result;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { removeReport, loading, error };
}

export default useDeleteReport;