import { useState, useCallback } from 'react';
import { useAuth } from '../../config/authHeader';
import { updateReportStatus } from '../../services/reportService'; 

export default function useUpdateReportStatus() {
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	const updateStatus = useCallback(async (reportId, status) => {
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const result = await updateReportStatus(reportId, status, user?.token);
			setSuccess(true);
			return result;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, [user?.token]);

	return { updateStatus, loading, error, success };
}