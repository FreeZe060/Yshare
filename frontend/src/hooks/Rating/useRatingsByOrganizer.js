import { useState, useEffect } from "react";
import { getAllRatingsByOrganizer } from "../../services/ratingService";

function useRatingsByOrganizer(userId, token) {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRatings = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAllRatingsByOrganizer(userId, token);
                setRatings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId && token) {
            fetchRatings();
        }
    }, [userId, token]);

    return { ratings, loading, error };
}

export default useRatingsByOrganizer;