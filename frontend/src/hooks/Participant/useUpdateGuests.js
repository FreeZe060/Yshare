import { useState } from 'react';
import { updateParticipantGuests } from '../../services/participantService';

function useUpdateGuests() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateGuests = async (eventId, userId, guests) => {
        setLoading(true);
        setError(null);
        try {
            const res = await updateParticipantGuests(eventId, userId, guests);
            return res;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateGuests, loading, error };
}

export default useUpdateGuests;