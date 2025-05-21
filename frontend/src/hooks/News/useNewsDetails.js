import { useEffect, useState } from "react";
import { fetchNewsWithDetails } from "../../services/newsService";

function useNewsDetails(newsId) {
    const [newsDetails, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!newsId) return;

        const getNews = async () => {
            setLoading(true);
            try {
                const data = await fetchNewsWithDetails(newsId);
                setNews(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getNews();
    }, [newsId]);

    return { newsDetails, loading, error };
}

export default useNewsDetails;