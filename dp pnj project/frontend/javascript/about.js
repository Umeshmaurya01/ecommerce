        // Initialize libraries
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize AOS
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100
            });

            // Initialize Vanilla-tilt
            VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
                max: 15,
                speed: 400,
                glare: true,
                "max-glare": 0.2
            });

            // Initialize GSAP animations
            gsap.from(".text-content", {
                duration: 1,
                y: 100,
                opacity: 0,
                stagger: 0.2,
                ease: "power4.out"
            });

            gsap.from(".product-showcase-wrapper", {
                duration: 1.2,
                x: 100,
                opacity: 0,
                ease: "power4.out",
                delay: 0.5
            });
        });