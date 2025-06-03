import { useState } from 'react';
import { addParticipantAdmin } from '../../services/participantService';

export default function useAddParticipantAdmin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const assign = async (eventId, userId, token) => {
        setLoading(true);
        setError(null);
        try {
            const result = await addParticipantAdmin(eventId, userId, token);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { assign, loading, error };
}