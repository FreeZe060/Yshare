import { useEffect, useState } from "react";
import { fetchNewsWithDetails } from "../../services/newsService";

function useNewsDetails(newsId) {
    const [newsDetails, setNewsDetails] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDetails = async () => {
        if (!newsId) return;
        setLoading(true);
        try {
            const data = await fetchNewsWithDetails(newsId);
            setNewsDetails(data); 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [newsId]);

    return { newsDetails, setNewsDetails, loading, error, refetchNewsDetails: fetchDetails };
}

export default useNewsDetails;  