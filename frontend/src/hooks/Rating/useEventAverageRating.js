import { useState, useEffect } from "react";
import { getEventAverageRating } from "../../services/ratingService";

function useEventAverageRating(eventId) {
    const [averageRating, setAverageRating] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAverageRating = async () => {
            setLoading(true);
            setError(null);
            try {
                const { avgRating, ratings } = await getEventAverageRating(eventId);
                setAverageRating(avgRating);
                setRatings(ratings);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchAverageRating();
        }
    }, [eventId]);

    return { averageRating, ratings, loading, error };
}

export default useEventAverageRating;