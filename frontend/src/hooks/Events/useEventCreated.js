import { useState, useEffect } from 'react';
import { getCreatedEventsStats } from '../../services/eventService';
import { useAuth } from '../../config/authHeader';

export default function useEventCreated() {
    const [createdEvents, setEvent] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) return;

        const fetchEvent = async () => {
            setLoading(true);
            try {
                const data = await getCreatedEventsStats(user.id);
                setEvent(Array.isArray(data.events) ? data.events : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [user?.id]);

    return { createdEvents, loading, error };
}