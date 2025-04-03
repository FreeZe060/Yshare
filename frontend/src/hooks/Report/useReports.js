import { useState, useEffect } from "react";
import { getReports } from "../services/reportService";

function useReports() {
	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchReports = async () => {
			setLoading(true);
			try {
				const data = await getReports();
				setReports(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchReports();
	}, []);

	return { reports, loading, error };
}

export default useReports;