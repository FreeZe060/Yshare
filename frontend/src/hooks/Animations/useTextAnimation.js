import { useEffect } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";

function useTextAnimation(selector = ".anim-text") {
    useEffect(() => {
        const textsToAnimate = document.querySelectorAll(selector);

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animated = new SplitType(entry.target, { types: 'words,chars' });

                    gsap.from(animated.chars, {
                        opacity: 0,
                        x: "50%",
                        ease: "elastic.out(0.6, 0.3)",
                        duration: 3,
                        stagger: { amount: 0.8 }
                    });

                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -5% 0px',
            threshold: 0.1
        });

        textsToAnimate.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [selector]);
}

export default useTextAnimation;
