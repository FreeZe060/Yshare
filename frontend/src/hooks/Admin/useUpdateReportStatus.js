import { useState } from "react";
import { updateReportStatus } from "../services/reportService";

function useUpdateReportStatus() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const updateStatus = async (reportId, status) => {
		setLoading(true);
		setError(null);
		try {
			const result = await updateReportStatus(reportId, status);
			return result;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { updateStatus, loading, error };
}

export default useUpdateReportStatus;