import { useState } from 'react';
import { rateEvent } from '../../services/ratingService';
import { useAuth } from '../../config/authHeader';

export default function usePostRate() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const rate = async (ratingData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await rateEvent(ratingData, user?.token);
            return result;
        } catch (err) {
            setError(err.message || 'Erreur lors de l\'enregistrement de la note');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { rate, loading, error };
}