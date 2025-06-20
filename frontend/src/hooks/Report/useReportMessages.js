import { useState, useEffect } from 'react';
import { getReportMessages } from '../../services/reportService';
import { useAuth } from '../../config/authHeader';

function useReportMessages(reportId) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMessages = async () => {
        try {
            const data = await getReportMessages(reportId, user.token);
            setMessages(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!reportId || !user?.token) return;
        fetchMessages();
    }, [reportId, user]);

    return { messages, loading, error, refetch: fetchMessages };
}

export default useReportMessages;