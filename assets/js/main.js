// Main JavaScript for Portfolio Website

// Menu Toggle Functions
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function closeMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const navMenu = document.getElementById('navMenu');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (navMenu && navMenu.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            closeMenu();
        }
    });

    // Close menu with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation
    document.body.classList.add('loaded');

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.fade-in, .slide-in-left').forEach(el => {
        observer.observe(el);
    });

    // Preload background images
    const imageUrls = [
        '/assets/images/portrait.jpg',
        '/assets/images/portrait@2x.jpg'
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });

    // Add hover effects for contact links
    const contactLinks = document.querySelectorAll('.contact-links a');
    contactLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add particle effect on menu open (optional enhancement)
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 200);
        });
    }

    // Performance optimization: throttle scroll events
    let ticking = false;
    function updateScrollPosition() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.background-image');
        
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translate3d(0, ${speed}px, 0)`;
        }
        
        ticking = false;
    }

    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestScrollUpdate);

    // Add touch support for mobile devices
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', e => {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', e => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        // Optional: Add swipe gestures for navigation
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up
                console.log('Swipe up detected');
            } else {
                // Swipe down
                console.log('Swipe down detected');
            }
        }
    }

    // Add resize handler for responsive adjustments
    window.addEventListener('resize', function() {
        // Close menu on resize to prevent layout issues
        if (window.innerWidth > 768) {
            closeMenu();
        }
        
        // Update any size-dependent calculations
        updateLayoutMetrics();
    });

    function updateLayoutMetrics() {
        // Update any calculations that depend on viewport size
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Initial call
    updateLayoutMetrics();

    // Add error handling for image loading
    const backgroundImages = document.querySelectorAll('.background-image, .right-panel');
    backgroundImages.forEach(element => {
        const img = new Image();
        img.onload = function() {
            element.classList.add('image-loaded');
        };
        img.onerror = function() {
            console.warn('Background image failed to load');
            element.classList.add('image-error');
        };
        
        const bgImage = window.getComputedStyle(element).backgroundImage;
        if (bgImage && bgImage !== 'none') {
            const url = bgImage.slice(4, -1).replace(/["']/g, "");
            img.src = url;
        }
    });

    // Add accessibility improvements
    const menuButton = document.querySelector('.menu-toggle');
    if (menuButton) {
        menuButton.setAttribute('aria-label', 'Open navigation menu');
        menuButton.setAttribute('aria-expanded', 'false');
    }

    const closeButton = document.querySelector('.close-menu');
    if (closeButton) {
        closeButton.setAttribute('aria-label', 'Close navigation menu');
    }

    // Update aria-expanded when menu toggles
    const originalToggleMenu = window.toggleMenu;
    window.toggleMenu = function() {
        originalToggleMenu();
        const navMenu = document.getElementById('navMenu');
        const isActive = navMenu.classList.contains('active');
        
        if (menuButton) {
            menuButton.setAttribute('aria-expanded', isActive.toString());
        }
    };
});

// Add CSS class for clicked state
const style = document.createElement('style');
style.textContent = `
    .menu-toggle.clicked {
        transform: scale(0.95);
        background: rgba(0, 0, 0, 0.15) !important;
    }
    
    .image-loaded {
        opacity: 1;
        transition: opacity 0.5s ease;
    }
    
    .image-error {
        background-color: #333;
    }
    
    /* CSS custom properties for viewport height */
    :root {
        --vh: 1vh;
    }
    
    @media (max-height: 600px) {
        .container {
            min-height: calc(var(--vh, 1vh) * 100);
        }
    }
`;
document.head.appendChild(style);