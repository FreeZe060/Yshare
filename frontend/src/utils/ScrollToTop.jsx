import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0, behavior: 'instant' });
        } else {
            const id = hash.replace('#', '');
            const scrollToHash = () => {
                const el = document.getElementById(id);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    setTimeout(scrollToHash, 100);
                }
            };
            scrollToHash();
        }
    }, [pathname, hash]);

    return null;
}
