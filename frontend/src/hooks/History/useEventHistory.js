import { useEffect, useState } from 'react';
import { getEventHistory } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';

export function useEventHistory() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await getEventHistory(user?.token);
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchHistory();
  }, [user]);

  return { events, loading, error };
}

export default useEventHistory;