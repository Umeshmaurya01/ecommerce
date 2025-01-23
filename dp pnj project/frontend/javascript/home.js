class HeroSlider {
    constructor() {
        // Main elements
        this.section = document.querySelector('.sld-hero-section');
        this.container = document.querySelector('.sld-slider-container');
        this.slider = document.querySelector('.sld-slider');
        this.slides = [...document.querySelectorAll('.sld-slide')];
        
        // Navigation elements
        this.prevBtn = document.querySelector('.sld-nav-prev');
        this.nextBtn = document.querySelector('.sld-nav-next');
        this.dotsContainer = document.querySelector('.sld-dots');
        this.progressBar = document.querySelector('.sld-progress-bar');

        // State management
        this.currentSlide = 0;
        this.slideCount = this.slides.length;
        this.isAnimating = false;
        this.autoplayTimer = null;
        this.autoplayDelay = 5000; // 5 seconds
        
        // Touch handling
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.minSwipeDistance = 50;

        // Initialize slider
        if (this.slides.length > 0) {
            this.init();
        }
    }

    init() {
        this.setupSlides();
        this.createDots();
        this.bindEvents();
        this.startAutoplay();
        this.updateProgress();
    }

    setupSlides() {
        // Set initial positions and states
        this.slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${index * 100}%)`;
            if (index === 0) {
                slide.classList.add('active');
            }
        });
    }

    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `sld-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            this.dotsContainer.appendChild(dot);
        });
    }

    bindEvents() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Dot navigation
        this.dotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('sld-dot')) {
                const index = [...this.dotsContainer.children].indexOf(e.target);
                this.goToSlide(index);
            }
        });

        // Touch events
        this.container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.pauseAutoplay();
        }, { passive: true });

        this.container.addEventListener('touchmove', (e) => {
            if (this.isAnimating) return;
            
            const currentX = e.touches[0].clientX;
            const diff = this.touchStartX - currentX;
            const movePercent = (diff / this.container.offsetWidth) * 100;
            
            // Prevent overscroll
            if (
                (this.currentSlide === 0 && diff < 0) || 
                (this.currentSlide === this.slideCount - 1 && diff > 0)
            ) {
                return;
            }
            
            // Apply transform to slides
            this.slides.forEach((slide, index) => {
                const basePosition = (index - this.currentSlide) * 100;
                slide.style.transform = `translateX(${basePosition - movePercent}%)`;
            });
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            const diff = this.touchStartX - this.touchEndX;

            if (Math.abs(diff) > this.minSwipeDistance) {
                if (diff > 0 && this.currentSlide < this.slideCount - 1) {
                    this.nextSlide();
                } else if (diff < 0 && this.currentSlide > 0) {
                    this.prevSlide();
                } else {
                    this.resetSlides();
                }
            } else {
                this.resetSlides();
            }
            
            this.startAutoplay();
        }, { passive: true });

        // Pause autoplay on hover/focus
        this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
        this.container.addEventListener('focusin', () => this.pauseAutoplay());
        this.container.addEventListener('focusout', () => this.startAutoplay());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else {
                this.startAutoplay();
            }
        });

        // Resize handling
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.handleResize(), 100);
        });
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        
        this.isAnimating = true;
        
        // Update classes
        this.slides[this.currentSlide].classList.remove('active');
        this.slides[index].classList.add('active');

        // Animate slides
        this.slides.forEach((slide, i) => {
            slide.style.transition = 'transform 0.8s ease-in-out';
            slide.style.transform = `translateX(${(i - index) * 100}%)`;
        });

        // Update state
        this.currentSlide = index;
        this.updateDots();
        this.updateProgress();

        // Reset animation flag
        setTimeout(() => {
            this.slides.forEach(slide => {
                slide.style.transition = '';
            });
            this.isAnimating = false;
        }, 800);
    }

    nextSlide() {
        if (this.currentSlide < this.slideCount - 1) {
            this.goToSlide(this.currentSlide + 1);
        } else {
            this.goToSlide(0); // Loop back to first slide
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        } else {
            this.goToSlide(this.slideCount - 1); // Loop to last slide
        }
    }

    resetSlides() {
        this.slides.forEach((slide, index) => {
            slide.style.transition = 'transform 0.3s ease-out';
            slide.style.transform = `translateX(${(index - this.currentSlide) * 100}%)`;
        });
    }

    updateDots() {
        const dots = [...this.dotsContainer.children];
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    updateProgress() {
        if (this.progressBar) {
            const progress = ((this.currentSlide + 1) / this.slideCount) * 100;
            this.progressBar.style.width = `${progress}%`;
        }
    }

    startAutoplay() {
        if (this.autoplayTimer) return;
        
        this.autoplayTimer = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }

    pauseAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }

    handleResize() {
        this.resetSlides();
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const slider = new HeroSlider();

    // Optional: Performance optimization with Intersection Observer
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        slider.startAutoplay();
                    } else {
                        slider.pauseAutoplay();
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (slider.section) {
            observer.observe(slider.section);
        }
    }
});

// Add hover effects to buttons
document.querySelectorAll('.sld-btn').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
    });
});


















//shopping by category
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize image loading optimization
    initializeImageLoading();
    
    // Initialize hover effects
    initializeHoverEffects();
    
    // Initialize scroll animations
    initializeScrollAnimations();
});

// Image Loading Optimization
function initializeImageLoading() {
    const images = document.querySelectorAll('.category-image img');
    
    // Create Intersection Observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px', // Start loading images 50px before they enter viewport
        threshold: 0.1
    });

    // Observe each image
    images.forEach(img => {
        imageObserver.observe(img);
        
        // Add loading animation class
        img.closest('.category-image-container').classList.add('loading');
    });

    // Function to handle image loading
    function loadImage(img) {
        // Add loading class
        img.classList.add('loading');
        
        // Create a temporary image to preload
        const tempImage = new Image();
        
        tempImage.onload = function() {
            img.src = this.src;
            img.classList.add('loaded');
            img.classList.remove('loading');
            img.closest('.category-image-container').classList.remove('loading');
        };
        
        tempImage.onerror = function() {
            // If image fails to load, show placeholder
            img.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
            img.classList.remove('loading');
            img.closest('.category-image-container').classList.remove('loading');
        };
        
        tempImage.src = img.dataset.src || img.src;
    }
}

// Hover Effects
function initializeHoverEffects() {
    const cards = document.querySelectorAll('.category-card');
    
    cards.forEach(card => {
        // Mouse enter animation
        card.addEventListener('mouseenter', (e) => {
            const cardRect = card.getBoundingClientRect();
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        // Smooth hover transition
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;
            
            const rotateX = (y - cardRect.height / 2) / 20;
            const rotateY = -(x - cardRect.width / 2) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        // Reset card position
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const categories = document.querySelector('.categories-section');
    const cards = document.querySelectorAll('.category-card');
    
    // Create Intersection Observer for section animation
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCards();
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe the categories section
    sectionObserver.observe(categories);

    // Function to animate cards
    function animateCards() {
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 100); // Stagger the animation
        });
    }
}

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation CSS
const style = document.createElement('style');
style.textContent = `
    .category-image-container.loading::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, #f3f4f6, #e5e7eb, #f3f4f6);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
    }

    @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }

    .category-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .category-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);










//new arrival

class DDKProductManager {
    constructor() {
        this.init();
        this.wishlistItems = new Set(this.loadWishlistFromStorage());
    }

    init() {
        // Initialize all components
        this.initTabs();
        this.initWishlist();
        this.initQuickView();
        this.initCartSystem();
        this.initProductAnimations();
        this.initResponsiveHandling();

        // Show New Arrivals by default
        const newArrivalsContent = document.getElementById('new-arrivals');
        this.animateProducts(newArrivalsContent);
    }

    // Tab System
    initTabs() {
        const tabButtons = document.querySelectorAll('.ddk-tab-btn');
        const tabContents = document.querySelectorAll('.ddk-tab-content');

        // Set initial state
        const newArrivalsTab = document.getElementById('new-arrivals');
        newArrivalsTab.classList.add('ddk-active');
        this.animateProducts(newArrivalsTab);

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('ddk-active')) return;
                this.switchTab(button, tabButtons, tabContents);
            });
        });
    }

    switchTab(selectedButton, allButtons, allContents) {
        // Deactivate all tabs
        allButtons.forEach(btn => {
            btn.classList.remove('ddk-active');
            btn.setAttribute('aria-selected', 'false');
        });

        // Hide all content with animation
        allContents.forEach(content => {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            setTimeout(() => {
                content.classList.remove('ddk-active');
                content.setAttribute('aria-hidden', 'true');
            }, 300);
        });

        // Activate selected tab
        selectedButton.classList.add('ddk-active');
        selectedButton.setAttribute('aria-selected', 'true');
        
        // Show selected content with animation
        const targetContent = document.getElementById(selectedButton.dataset.tab);
        setTimeout(() => {
            targetContent.classList.add('ddk-active');
            targetContent.setAttribute('aria-hidden', 'false');
            targetContent.style.opacity = '1';
            targetContent.style.transform = 'translateY(0)';
            this.animateProducts(targetContent);
        }, 300);
    }

    // Product Animations
    initProductAnimations() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateProducts(entry.target.closest('.ddk-tab-content'));
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.ddk-product-grid').forEach(grid => {
            observer.observe(grid);
        });
    }

    animateProducts(container) {
        if (!container) return;

        const products = container.querySelectorAll('.ddk-product-card');
        products.forEach((product, index) => {
            product.style.opacity = '0';
            product.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                product.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                product.style.opacity = '1';
                product.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Wishlist System
    initWishlist() {
        document.addEventListener('click', e => {
            const wishlistBtn = e.target.closest('.ddk-wishlist-btn');
            if (!wishlistBtn) return;

            e.preventDefault();
            e.stopPropagation();
            this.toggleWishlist(wishlistBtn);
        });

        // Initialize wishlist state
        this.loadWishlistState();
    }

    toggleWishlist(button) {
        const productCard = button.closest('.ddk-product-card');
        const productId = productCard.dataset.id;
        const isActive = !button.classList.contains('active');

        button.classList.toggle('active');
        const icon = button.querySelector('i');
        icon.className = isActive ? 'fas fa-heart' : 'far fa-heart';

        if (isActive) {
            this.wishlistItems.add(productId);
            this.showNotification('Added to Wishlist', 'success');
        } else {
            this.wishlistItems.delete(productId);
            this.showNotification('Removed from Wishlist', 'info');
        }

        this.saveWishlistToStorage();
    }

    loadWishlistState() {
        this.wishlistItems.forEach(productId => {
            const productCard = document.querySelector(`.ddk-product-card[data-id="${productId}"]`);
            if (productCard) {
                const wishlistBtn = productCard.querySelector('.ddk-wishlist-btn');
                wishlistBtn.classList.add('active');
                wishlistBtn.querySelector('i').className = 'fas fa-heart';
            }
        });
    }

    loadWishlistFromStorage() {
        const stored = localStorage.getItem('ddk-wishlist');
        return stored ? new Set(JSON.parse(stored)) : new Set();
    }

    saveWishlistToStorage() {
        localStorage.setItem('ddk-wishlist', JSON.stringify([...this.wishlistItems]));
    }

    // Cart System
    initCartSystem() {
        document.addEventListener('click', e => {
            const cartBtn = e.target.closest('.ddk-cart-btn');
            if (!cartBtn) return;

            e.preventDefault();
            e.stopPropagation();
            this.addToCart(cartBtn);
        });
    }

    addToCart(button) {
        const productCard = button.closest('.ddk-product-card');
        const productId = productCard.dataset.id;
        const productName = productCard.querySelector('.ddk-product-title').textContent;
        const productPrice = productCard.querySelector('.ddk-current-price').textContent;

        // Add animation to button
        button.classList.add('ddk-adding');
        setTimeout(() => button.classList.remove('ddk-adding'), 1500);

        // Show success notification
        this.showNotification(`${productName} added to cart`, 'success');

        // Trigger cart update animation
        this.updateCartCounter();
    }

    // Quick View System
    initQuickView() {
        document.addEventListener('click', e => {
            const quickViewBtn = e.target.closest('.ddk-quick-view-btn');
            if (!quickViewBtn) return;

            e.preventDefault();
            e.stopPropagation();
            this.showQuickView(quickViewBtn);
        });
    }

    showQuickView(button) {
        const productCard = button.closest('.ddk-product-card');
        const productData = this.getProductData(productCard);
        const modal = this.createQuickViewModal(productData);

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('ddk-show'), 10);

        this.initQuickViewEvents(modal);
    }

    getProductData(productCard) {
        return {
            id: productCard.dataset.id,
            title: productCard.querySelector('.ddk-product-title').textContent,
            price: productCard.querySelector('.ddk-current-price').textContent,
            originalPrice: productCard.querySelector('.ddk-original-price').textContent,
            image: productCard.querySelector('.ddk-product-image').src,
            category: productCard.querySelector('.ddk-product-category').textContent,
            rating: productCard.querySelector('.ddk-stars').innerHTML,
            ratingCount: productCard.querySelector('.ddk-rating-count').textContent
        };
    }

    createQuickViewModal(data) {
        const modal = document.createElement('div');
        modal.className = 'ddk-quick-view-modal';
        modal.innerHTML = `
            <div class="ddk-modal-content">
                <button class="ddk-modal-close" aria-label="Close">×</button>
                <div class="ddk-modal-body">
                    <div class="ddk-modal-image">
                        <img src="${data.image}" alt="${data.title}">
                    </div>
                    <div class="ddk-modal-info">
                        <span class="ddk-modal-category">${data.category}</span>
                        <h3>${data.title}</h3>
                        <div class="ddk-modal-rating">
                            ${data.rating}
                            <span>${data.ratingCount}</span>
                        </div>
                        <div class="ddk-modal-price">
                            <span class="ddk-current">${data.price}</span>
                            <span class="ddk-original">${data.originalPrice}</span>
                        </div>
                        <div class="ddk-modal-actions">
                            <button class="ddk-add-to-cart">Add to Cart</button>
                            <button class="ddk-add-to-wishlist">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    initQuickViewEvents(modal) {
        const closeModal = () => {
            modal.classList.remove('ddk-show');
            setTimeout(() => modal.remove(), 300);
        };

        modal.querySelector('.ddk-modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });

        // Handle Escape key
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeModal();
        });

        // Add to cart action
        modal.querySelector('.ddk-add-to-cart').addEventListener('click', () => {
            this.showNotification('Product added to cart', 'success');
            closeModal();
        });
    }

    // Utility Functions
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `ddk-notification ddk-${type}`;
        notification.innerHTML = `
            <div class="ddk-notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);
        requestAnimationFrame(() => notification.classList.add('ddk-show'));

        setTimeout(() => {
            notification.classList.remove('ddk-show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        return icons[type] || icons.info;
    }

    updateCartCounter() {
        const counter = document.querySelector('.ddk-cart-counter');
        if (counter) {
            const currentCount = parseInt(counter.textContent) || 0;
            counter.textContent = currentCount + 1;
            counter.classList.add('ddk-bounce');
            setTimeout(() => counter.classList.remove('ddk-bounce'), 300);
        }
    }

    // Responsive Handling
    initResponsiveHandling() {
        const handleResize = () => {
            const isMobile = window.innerWidth <= 768;
            document.documentElement.style.setProperty(
                '--ddk-grid-columns',
                isMobile ? '2' : '4'
            );
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DDKProductManager();
});














//how to design custiom tshirt

document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // For step items
                const steps = entry.target.querySelectorAll('.step-item');
                steps.forEach((step, index) => {
                    setTimeout(() => {
                        step.classList.add('visible');
                    }, index * 200);
                });
            }
        });
    }, {
        threshold: 0.2
    });

    // Observe the section
    const section = document.querySelector('.custom-tshirt-section');
    observer.observe(section);
});













// Testimonials Slider JavaScript
class TestimonialSlider {
    constructor() {
        // Core elements initialization
        this.initializeElements();
        
        // State management
        this.state = {
            currentIndex: 0,
            isAnimating: false,
            autoplayInterval: null,
            touchStartX: 0,
            touchEndX: 0,
            swipeThreshold: 50,
            autoplayDelay: 8000, // 8 seconds
        };

        // Initialize slider
        this.init();
    }

    initializeElements() {
        // Main elements
        this.slider = document.querySelector('.testi-track');
        this.slides = Array.from(document.querySelectorAll('.testi-card'));
        this.slidesLength = this.slides.length;

        // Navigation elements
        this.prevBtn = document.querySelector('.testi-prev');
        this.nextBtn = document.querySelector('.testi-next');
        this.dots = Array.from(document.querySelectorAll('.testi-pagination .dot'));

        // Progress elements
        this.progressFill = document.querySelector('.progress-fill');
        this.currentNum = document.querySelector('.progress-nums .current');
        this.totalNum = document.querySelector('.progress-nums .total');

        // Error handling for required elements
        if (!this.slider || !this.slides.length) {
            throw new Error('Required slider elements not found');
        }
    }

    init() {
        try {
            this.setupInitialState();
            this.bindEvents();
            this.setupIntersectionObserver();
            this.startAutoplay();
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    setupInitialState() {
        // Set total slides number
        if (this.totalNum) {
            this.totalNum.textContent = String(this.slidesLength).padStart(2, '0');
        }

        // Initialize first slide
        this.slides[0].classList.add('active');
        this.updateProgress(0);
        this.updateNavigationState();
    }

    bindEvents() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.navigate('prev'));
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.navigate('next'));
        }

        // Touch events
        this.slider.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.slider.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.slider.addEventListener('touchend', () => this.handleTouchEnd());

        // Mouse events for autoplay control
        this.slider.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.slider.addEventListener('mouseleave', () => this.startAutoplay());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Pagination dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else {
                this.startAutoplay();
            }
        });

        // Window resize handling with debounce
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.handleResize(), 250);
        });
    }

    navigate(direction) {
        if (this.state.isAnimating) return;

        const nextIndex = direction === 'next'
            ? (this.state.currentIndex + 1) % this.slidesLength
            : (this.state.currentIndex - 1 + this.slidesLength) % this.slidesLength;

        this.goToSlide(nextIndex);
    }

    goToSlide(index) {
        if (index === this.state.currentIndex || this.state.isAnimating) return;

        this.state.isAnimating = true;
        this.pauseAutoplay();

        // Update slides with smooth transition
        requestAnimationFrame(() => {
            this.slides.forEach((slide, i) => {
                slide.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                slide.style.transform = `translateX(${(i - index) * 100}%)`;
                slide.classList.toggle('active', i === index);
            });

            // Update state and UI
            this.state.currentIndex = index;
            this.updateUI();

            // Reset animation state
            setTimeout(() => {
                this.state.isAnimating = false;
                this.startAutoplay();
            }, 800);
        });
    }

    updateUI() {
        // Update progress
        this.updateProgress(this.state.currentIndex);
        
        // Update current slide number
        if (this.currentNum) {
            this.currentNum.textContent = String(this.state.currentIndex + 1).padStart(2, '0');
        }

        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.state.currentIndex);
        });

        // Update navigation state
        this.updateNavigationState();
    }

    updateProgress(index) {
        if (this.progressFill) {
            const progress = ((index + 1) / this.slidesLength) * 100;
            this.progressFill.style.width = `${progress}%`;
        }
    }

    updateNavigationState() {
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.classList.toggle('disabled', this.state.currentIndex === 0);
            this.nextBtn.classList.toggle('disabled', this.state.currentIndex === this.slidesLength - 1);
        }
    }

    // Touch handling
    handleTouchStart(e) {
        this.state.touchStartX = e.touches[0].clientX;
        this.pauseAutoplay();
    }

    handleTouchMove(e) {
        if (!this.state.touchStartX) return;

        const currentX = e.touches[0].clientX;
        const diff = this.state.touchStartX - currentX;

        // Prevent vertical scrolling when swiping
        if (Math.abs(diff) > 5) {
            e.preventDefault();
        }
    }

    handleTouchEnd() {
        const diff = this.state.touchStartX - this.state.touchEndX;

        if (Math.abs(diff) > this.state.swipeThreshold) {
            if (diff > 0) {
                this.navigate('next');
            } else {
                this.navigate('prev');
            }
        }

        this.state.touchStartX = 0;
        this.state.touchEndX = 0;
    }

    // Keyboard navigation
    handleKeyboard(e) {
        if (e.key === 'ArrowLeft') {
            this.navigate('prev');
        } else if (e.key === 'ArrowRight') {
            this.navigate('next');
        }
    }

    // Autoplay controls
    startAutoplay() {
        if (this.state.autoplayInterval) {
            this.pauseAutoplay();
        }

        this.state.autoplayInterval = setInterval(() => {
            if (this.state.currentIndex < this.slidesLength - 1) {
                this.navigate('next');
            } else {
                this.goToSlide(0);
            }
        }, this.state.autoplayDelay);
    }

    pauseAutoplay() {
        if (this.state.autoplayInterval) {
            clearInterval(this.state.autoplayInterval);
            this.state.autoplayInterval = null;
        }
    }

    // Resize handling
    handleResize() {
        this.slides.forEach((slide, i) => {
            slide.style.transition = 'none';
            slide.style.transform = `translateX(${(i - this.state.currentIndex) * 100}%)`;
        });
    }

    // Intersection Observer for performance
    setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.startAutoplay();
                    } else {
                        this.pauseAutoplay();
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(this.slider);
    }

    // Cleanup method
    destroy() {
        this.pauseAutoplay();
        // Additional cleanup if needed
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.testimonialSlider = new TestimonialSlider();
    } catch (error) {
        console.error('Error initializing TestimonialSlider:', error);
    }
});



















