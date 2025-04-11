import { useState } from "react";
import { createReport } from "../../services/reportService";

function useCreateReport() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const create = async (reportData) => {
		setLoading(true);
		setError(null);
		try {
			const result = await createReport(reportData);
			return result;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { create, loading, error };
}

export default useCreateReport;
