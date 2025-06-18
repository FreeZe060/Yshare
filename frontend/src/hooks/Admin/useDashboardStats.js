import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../services/eventService';

const useDashboardStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem('token'); 
                if (!token) throw new Error("Token manquant");

                const data = await getDashboardStats(token);
                console.log('[useDashboardStats] ✅ Statistiques récupérées :', data);
                setStats(data);
            } catch (err) {
                console.error('[useDashboardStats] ❌ Erreur :', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading, error };
};

export default useDashboardStats;