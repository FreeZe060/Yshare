import { useState } from "react";
import { rateEvent } from "../services/ratingService";

function useRateEvent() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const rate = async (ratingData) => {
		setLoading(true);
		setError(null);
		try {
			const result = await rateEvent(ratingData);
			return result;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { rate, loading, error };
}

export default useRateEvent;