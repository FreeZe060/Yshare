import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent");
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleConsent = (choice) => {
        localStorage.setItem("cookieConsent", choice);
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ duration: 0.4 }}
                    className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 flex flex-col sm:flex-row items-center justify-between shadow-lg"
                >
                    <p className="text-sm mb-2 sm:mb-0">
                        Ce site utilise des cookies pour améliorer votre expérience et mesurer l’audience.
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleConsent("accepted")}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                            Accepter
                        </button>
                        <button
                            onClick={() => handleConsent("declined")}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                        >
                            Refuser
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
