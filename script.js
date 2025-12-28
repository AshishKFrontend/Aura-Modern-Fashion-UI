// Note: "DOMContentLoaded" ki jagah "load" use kiya hai taaki
// images load hone ke baad hi animation start ho.
window.addEventListener("load", () => {
    gsap.registerPlugin(ScrollTrigger);

    // ===========================================
    // SMOOTH SCROLL SETUP (Fixed)
    // ===========================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Initialization ab safe hai
    initApp();
});

function initApp() {
    initHeroSection();
    initNavbarScroll();
    initMobileMenu(); // <--- NEW: Mobile Menu Logic Added
    initWorkoutSection();
    initTopPicks();
    initFreshSection();
    initProductGrid();
    initRunway();
    initFooter();
}

// ===========================================
// 0. MOBILE MENU LOGIC (NEW)
// ===========================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu-overlay');
    const links = document.querySelectorAll('.mobile-links a');

    if (menuToggle && mobileMenu) {
        // Open Menu
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            // Menu open hone par background scroll band karein
            document.body.style.overflow = 'hidden'; 
        });

        // Close Menu Function
        const closeMenuFunc = () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        // Close on X button click
        if (closeMenu) {
            closeMenu.addEventListener('click', closeMenuFunc);
        }

        // Close when clicking any link
        links.forEach(link => {
            link.addEventListener('click', closeMenuFunc);
        });
    }
}

// ===========================================
// 1. HERO SECTION ANIMATIONS (Enhanced)
// ===========================================
function initHeroSection() {
    const imageContainer = document.querySelector('.image-wrapper');
    const image = document.querySelector('.hero-image');

    if (!imageContainer || !image) return;

    // Force visibility and initial state immediately
    gsap.set(imageContainer, { autoAlpha: 1, y: 50 });
    gsap.set(image, { scale: 1.4, yPercent: -15, filter: "brightness(50%)" });

    const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });

    tl.fromTo(imageContainer, 
        // Start State (Clip Path Closed)
        { clipPath: "inset(100% 0% 0% 0% round 200px 200px 0 0)", y: 50 },
        // End State (Clip Path Open)
        { clipPath: "inset(0% 0% 0% 0% round 200px 200px 0 0)", y: 0, duration: 2, clearProps: "transform" } 
    )
    .fromTo(image, 
        { scale: 1.4, yPercent: -15, filter: "brightness(50%)" },
        { scale: 1, yPercent: 0, filter: "brightness(100%)", duration: 2 }, 
        "<" 
    )
    .from(".headline .line", { y: "100%", duration: 1.2, stagger: 0.1, ease: "power3.out" }, "-=1.2") 
    .to([".cta-buttons", ".float-left", ".float-right"], { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.5");

    // Mouse Move Effect
    imageContainer.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 1024) return;
        const { left, top, width, height } = imageContainer.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        gsap.to(image, { x: x * 30, y: y * 30, scale: 1.05, duration: 0.5, ease: "power2.out" });
    });

    imageContainer.addEventListener('mouseleave', () => {
        gsap.to(image, { x: 0, y: 0, scale: 1, duration: 0.8, ease: "power2.out" });
    });
}

// ===========================================
// 2. NAVBAR SCROLL LOGIC
// ===========================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar-container');
    
    ScrollTrigger.create({
        start: 'top top',
        end: 99999,
        onUpdate: (self) => {
            if (self.scroll() > window.innerHeight - 100) { 
                if (self.direction === 1) {
                    gsap.to(navbar, { y: -150, duration: 0.5, ease: "power2.out", overwrite: true });
                } else if (self.direction === -1) {
                    gsap.to(navbar, { y: 0, duration: 0.5, ease: "power2.out", overwrite: true });
                }
            } else {
                gsap.to(navbar, { y: 0, duration: 0.5, ease: "power2.out", overwrite: true });
            }
        }
    });
}

// ===========================================
// 3. WORKOUT SECTION
// ===========================================
function initWorkoutSection() {
    const textElement = document.querySelector('.bg-text span');
    if(textElement) {
        const textContent = textElement.textContent;
        const letters = textContent.split("");
        textElement.textContent = ""; 
        letters.forEach(letter => {
            const span = document.createElement("span");
            span.textContent = letter;
            span.style.display = "inline-block";
            span.style.position = "relative"; 
            textElement.appendChild(span);
        });

        gsap.from(".bg-text span span", {
            scrollTrigger: {
                trigger: ".workout-section",
                start: "top 60%",
                toggleActions: "play none none reverse"
            },
            opacity: 0, scale: 4, filter: "blur(20px)", y: 50,
            duration: 1.5, stagger: 0.08, ease: "circ.out"   
        });
    }

    const centerCard = document.querySelector('.center-card');
    const centerImg = document.querySelector('.center-card img');

    if(centerCard && centerImg) {
        gsap.fromTo(centerCard, 
            { opacity: 0, y: 200, rotationX: 45, scale: 0.8, transformPerspective: 1000 },
            {
                opacity: 1, y: 0, rotationX: 0, scale: 1, transformPerspective: 1000,
                duration: 2, ease: "elastic.out(1, 0.6)", 
                scrollTrigger: {
                    trigger: ".workout-section",
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        gsap.fromTo(centerImg,
            { scale: 1.5, filter: "brightness(150%)" },
            { 
                scale: 1, filter: "brightness(100%)", duration: 2, ease: "power2.out",
                scrollTrigger: { trigger: ".workout-section", start: "top 70%" }
            }
        );

        centerCard.addEventListener("mousemove", (e) => {
            if (window.innerWidth < 1024) return;
            const { left, top, width, height } = centerCard.getBoundingClientRect();
            const xVal = (e.clientX - left) / width - 0.5; 
            const yVal = (e.clientY - top) / height - 0.5;

            gsap.to(centerCard, {
                rotationY: xVal * 20, rotationX: -yVal * 20, transformPerspective: 1000,
                ease: "power1.out", duration: 0.5
            });
            gsap.to(centerImg, { x: -xVal * 30, y: -yVal * 30, scale: 1.1, duration: 0.5 });
        });

        centerCard.addEventListener("mouseleave", () => {
            gsap.to(centerCard, { rotationY: 0, rotationX: 0, ease: "elastic.out(1, 0.5)", duration: 1 });
            gsap.to(centerImg, { x: 0, y: 0, scale: 1, duration: 1 });
        });
    }
}

// ===========================================
// 4. TOP PICKS SECTION
// ===========================================
function initTopPicks() {
    gsap.from(".tp-header .sub-label, .tp-header .tp-headline, .tp-header .tp-subtext", {
        scrollTrigger: { trigger: ".tp-header", start: "top 80%" },
        y: 60, opacity: 0, duration: 1.2, stagger: 0.15, ease: "power3.out"
    });

    gsap.from(".tp-card", {
        scrollTrigger: { trigger: ".tp-grid", start: "top 70%" },
        y: 100, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out"
    });

    gsap.utils.toArray(".tp-card img").forEach(img => {
        gsap.from(img, {
            scrollTrigger: { trigger: img.parentElement, start: "top 70%" },
            scale: 1.6, filter: "blur(10px)", duration: 1.5, ease: "power2.out"
        });
    });
}

// ===========================================
// 5. FRESH SECTION
// ===========================================
function initFreshSection() {
    gsap.to(".scrolling-text", {
        scrollTrigger: {
            trigger: ".fresh-section", start: "top bottom", end: "bottom top", scrub: 1
        },
        xPercent: -20, ease: "none"
    });

    gsap.from(".fresh-card", {
        scrollTrigger: { trigger: ".fresh-section", start: "top 75%" },
        scale: 0.5, y: 100, opacity: 0, duration: 1.5, ease: "elastic.out(1, 0.5)"
    });

    gsap.from(".fresh-card img", {
        scrollTrigger: { trigger: ".fresh-section", start: "top 75%" },
        scale: 1.4, duration: 1.5, ease: "power2.out"
    });
}

// ===========================================
// 6. PRODUCT GRID SECTION
// ===========================================
function initProductGrid() {
    gsap.from(".pg-header > *", {
        scrollTrigger: { trigger: ".product-section", start: "top 80%" },
        y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: "power2.out"
    });

    gsap.from(".pg-card", {
        scrollTrigger: { trigger: ".pg-grid", start: "top 75%" },
        y: 100, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out"
    });

    gsap.from(".pg-footer", {
        scrollTrigger: { trigger: ".pg-grid", start: "bottom 90%" },
        y: 30, opacity: 0, duration: 1, ease: "power2.out"
    });

    const heartButtons = document.querySelectorAll(".badge-heart");
    heartButtons.forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.stopPropagation();
            this.classList.toggle("liked");
            const icon = this.querySelector("i");
            if (this.classList.contains("liked")) {
                icon.classList.remove("fa-regular");
                icon.classList.add("fa-solid");
                gsap.fromTo(this, { scale: 0.8 }, { scale: 1.1, duration: 0.3, ease: "back.out(1.7)" });
            } else {
                icon.classList.remove("fa-solid");
                icon.classList.add("fa-regular");
                gsap.to(this, { scale: 1, duration: 0.2 });
            }
        });
    });
}

// ===========================================
// 7. INFINITE RUNWAY SECTION
// ===========================================
function initRunway() {
    gsap.to(".track-left", {
        xPercent: -50, ease: "none", duration: 20, repeat: -1
    });

    gsap.fromTo(".track-right", 
        { xPercent: -50 }, 
        { xPercent: 0, ease: "none", duration: 18, repeat: -1 }
    );

    gsap.from(".runway-header", {
        scrollTrigger: { trigger: ".runway-section", start: "top 80%" },
        y: 50, opacity: 0, duration: 1, ease: "power2.out"
    });
}

// ===========================================
// 8. FOOTER SECTION
// ===========================================
function initFooter() {
    gsap.to(".footer-line", {
        scrollTrigger: { trigger: ".clean-footer", start: "top 85%" },
        width: "100%", duration: 1.5, ease: "power3.inOut"
    });

    gsap.from(".cf-container > *", {
        scrollTrigger: { trigger: ".clean-footer", start: "top 80%" },
        y: 40, opacity: 0, duration: 1, stagger: 0.2, ease: "power2.out"
    });

    const magBtn = document.querySelector('.magnetic-btn');
    if(magBtn) {
        magBtn.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 1024) return;
            const { left, top, width, height } = magBtn.getBoundingClientRect();
            const x = e.clientX - left - width / 2;
            const y = e.clientY - top - height / 2;
            gsap.to(magBtn, { x: x * 0.5, y: y * 0.5, duration: 0.3, ease: "power2.out" });
        });

        magBtn.addEventListener('mouseleave', () => {
            gsap.to(magBtn, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
        });
    }
}