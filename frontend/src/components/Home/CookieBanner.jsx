import { useEffect, useState } from 'react';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) setShowBanner(true);
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie_consent', 'true');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="right-4 md:right-8 bottom-4 left-4 md:left-8 z-50 fixed bg-white shadow-md p-4 border border-gray-200 rounded-lg">
            <p className="text-gray-700 text-sm">
                Ce site utilise des cookies pour vous garantir la meilleure expérience.{" "}
                <a href="/conditions-utilisation" className="text-blue-600 underline">En savoir plus</a>.
            </p>
            <button
                onClick={acceptCookies}
                className="bg-pink-500 hover:bg-pink-600 mt-3 px-4 py-2 rounded-full text-white text-sm"
            >
                Accepter
            </button>
        </div>
    );
}
