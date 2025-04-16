import { useState } from 'react';
import { replyToReport } from '../../services/reportService';
import { useAuth } from '../../config/authHeader';

function useReplyToReport() {
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const sendReply = async (reportId, message) => {
		if (!user?.token) return;
		setLoading(true);
		try {
			await replyToReport(reportId, message, user.token);
			setError(null);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendReply, loading, error };
}

export default useReplyToReport;