// Main JavaScript file (home.js)

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeSearch();
    initializeNavigation();
    initializeSlider();
    initializeTabs();
    initializeNewsletter();
    initializeBackToTop();
    initializeCookieConsent();
});

// Search Functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchSuggestions = document.querySelector('.search-suggestions');
    const searchTags = document.querySelectorAll('.search-tag');

    if (searchInput && searchSuggestions) {
        searchInput.addEventListener('focus', () => {
            searchSuggestions.classList.remove('hidden');
        });

        searchInput.addEventListener('blur', (e) => {
            // Delay hiding to allow clicking on suggestions
            setTimeout(() => {
                if (!searchSuggestions.contains(document.activeElement)) {
                    searchSuggestions.classList.add('hidden');
                }
            }, 200);
        });

        // Search tags click handling
        searchTags.forEach(tag => {
            tag.addEventListener('click', () => {
                searchInput.value = tag.textContent.trim();
                searchSuggestions.classList.add('hidden');
            });
        });
    }
}

// Navigation and Mobile Menu
function initializeNavigation() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const dropdownButtons = document.querySelectorAll('.menu-dropdown button');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.remove('invisible', 'opacity-0');
            mobileMenu.querySelector('.menu-panel').classList.remove('translate-x-full');
        });

        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.add('invisible', 'opacity-0');
            mobileMenu.querySelector('.menu-panel').classList.add('translate-x-full');
        });

        // Handle dropdown toggles in mobile menu
        dropdownButtons.forEach(button => {
            button.addEventListener('click', () => {
                const submenu = button.nextElementSibling;
                const icon = button.querySelector('.fa-chevron-down');
                
                submenu.classList.toggle('hidden');
                icon.style.transform = submenu.classList.contains('hidden') ? 
                    'rotate(0deg)' : 'rotate(180deg)';
            });
        });
    }
}

// Slider Functionality
function initializeSlider() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    const dotsContainer = document.querySelector('.slider-dots');

    if (slider && slides.length) {
        let currentSlide = 0;
        const slideCount = slides.length;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        function updateSlider() {
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            // Update dots
            document.querySelectorAll('.slider-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slideCount;
            updateSlider();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            updateSlider();
        }

        // Event listeners
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', prevSlide);
            nextBtn.addEventListener('click', nextSlide);
        }

        // Auto-advance slides
        setInterval(nextSlide, 5000);

        // Initial setup
        updateSlider();
    }
}

// Tabs Functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.rk-tab-btn');
    const tabContents = document.querySelectorAll('.rk-tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.tab;

            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('rk-active'));
            tabContents.forEach(content => content.classList.remove('rk-active'));

            button.classList.add('rk-active');
            document.getElementById(target).classList.add('rk-active');
        });
    });
}

// Newsletter Functionality
function initializeNewsletter() {
    const form = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('newsletterEmail');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value;

            try {
                // Add loading state
                form.classList.add('loading');
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Show success message
                showMessage('Successfully subscribed!', 'success');
                emailInput.value = '';
            } catch (error) {
                showMessage('Something went wrong. Please try again.', 'error');
            } finally {
                form.classList.remove('loading');
            }
        });
    }
}

// Back to Top Functionality
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Cookie Consent Functionality
function initializeCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptButton = cookieConsent?.querySelector('.accept-cookies');
    const declineButton = cookieConsent?.querySelector('.decline-cookies');

    if (cookieConsent && !localStorage.getItem('cookieConsent')) {
        cookieConsent.style.display = 'block';

        acceptButton?.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieConsent.style.display = 'none';
        });

        declineButton?.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieConsent.style.display = 'none';
        });
    }
}

// Utility Functions
function showMessage(message, type = 'success') {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type);
    messageElement.textContent = message;

    document.body.appendChild(messageElement);

    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

// Wishlist Functionality
document.querySelectorAll('.rk-wishlist-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const icon = this.querySelector('i');
        icon.classList.toggle('far');
        icon.classList.toggle('fas');
        
        // Update wishlist count
        const wishlistCount = document.querySelector('.nav-link .fa-heart + span');
        if (wishlistCount) {
            const currentCount = parseInt(wishlistCount.textContent);
            wishlistCount.textContent = icon.classList.contains('fas') ? 
                currentCount + 1 : currentCount - 1;
        }
    });
});

// Custom Design Studio Functionality
const uploadZone = document.getElementById('uploadZone');
if (uploadZone) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    uploadZone.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        handleFiles(files);
    }

    function handleFiles(files) {
        ([...files]).forEach(uploadFile);
    }

    function uploadFile(file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function() {
                // Preview the image
                const img = document.createElement('img');
                img.src = reader.result;
                uploadZone.innerHTML = '';
                uploadZone.appendChild(img);
            }
        }
    }
}