import { useEffect, useState } from 'react';
import { getTotalEventCount } from '../../services/eventService'; 

export default function useEventCount() {
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchCount = async () => {
			try {
				const total = await getTotalEventCount();
				setCount(total);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchCount();
	}, []);

	return { count, loading, error };
}