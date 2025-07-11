import { useEffect } from "react";
import { gsap } from "gsap";

function useSlideUpAnimation(selector = ".rev-slide-up", trigger = null) {
    useEffect(() => {
        const elsToSlideUp = document.querySelectorAll(selector);
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.fromTo(entry.target,
                        { y: 50, opacity: 0 },
                        {
                            duration: 1.2,
                            y: 0,
                            opacity: 1,
                            ease: "power3.out"
                        }
                    );
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1
        });

        elsToSlideUp.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [selector, trigger]); // trigger déclenche le recalcul
}

export default useSlideUpAnimation;
