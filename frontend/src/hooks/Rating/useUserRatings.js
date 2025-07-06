import { useEffect, useState } from 'react';
import { getAllRatingsByUser } from '../../services/ratingService';
import { useAuth } from '../../config/authHeader';

export default function useUserRatings() {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { token } = useAuth();

    useEffect(() => {
        const fetchRatings = async () => {
            setLoading(true);
            try {
                const data = await getAllRatingsByUser(token);
                setRatings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRatings();
    }, [token]);

    return { ratings, loading, error };
}