import { useEffect, useState } from 'react';
import { getUserEventHistory } from '../../services/participantService';
import { useAuth } from '../../config/authHeader';

export default function useUserEventHistory(userId) {
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { user } = useAuth();

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				setLoading(true);
				const data = await getUserEventHistory(userId, user?.token);
				setHistory(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		if (userId && user?.token) {
			fetchHistory();
		}
	}, [userId, user]);

	return { history, loading, error };
}
