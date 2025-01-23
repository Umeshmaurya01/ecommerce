
//footer section js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all footer components
    initializeNewsletterForm();
    initializeBackToTop();
    initializeCookieConsent();
    initializeCurrentYear();
    initializeSocialButtons();
    initializeContactButtons();

    // Newsletter Form Functionality
    function initializeNewsletterForm() {
        const newsletterForm = document.getElementById('newsletterForm');
        const emailInput = document.getElementById('newsletterEmail');
        const subscribeBtn = newsletterForm?.querySelector('.subscribe-btn');
        const formMessage = newsletterForm?.querySelector('.form-message');
        const subscriberCount = document.getElementById('subscriberCount');
        const inputStatus = newsletterForm?.querySelector('.input-status');

        if (!newsletterForm) return;

        // Email Input Validation
        emailInput?.addEventListener('input', function() {
            const email = this.value.trim();
            const isValid = isValidEmail(email);
            
            if (inputStatus) {
                inputStatus.style.display = 'block';
                inputStatus.querySelector('.success').style.display = isValid ? 'block' : 'none';
                inputStatus.querySelector('.error').style.display = isValid ? 'none' : 'block';
            }
        });

        // Form Submission
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address', 'error');
                return;
            }

            // Show loading state
            if (subscribeBtn) {
                subscribeBtn.classList.add('loading');
                subscribeBtn.disabled = true;
            }

            // Simulate API call
            setTimeout(() => {
                // Success scenario
                if (subscribeBtn) {
                    subscribeBtn.classList.remove('loading');
                    subscribeBtn.disabled = false;
                }

                showFormMessage('Thank you for subscribing! Welcome to our community!', 'success');
                
                // Update subscriber count animation
                if (subscriberCount) {
                    const currentCount = parseInt(subscriberCount.textContent.replace(/[^0-9]/g, ''));
                    animateNumber(currentCount, currentCount + 1, subscriberCount);
                }
                
                // Reset form
                newsletterForm.reset();
                if (inputStatus) inputStatus.style.display = 'none';

                // Hide message after delay
                setTimeout(() => {
                    if (formMessage) formMessage.style.display = 'none';
                }, 5000);
            }, 1500);
        });

        // Helper function to show form messages
        function showFormMessage(message, type) {
            if (!formMessage) return;
            
            formMessage.textContent = message;
            formMessage.className = `form-message form-${type}`;
            formMessage.style.display = 'block';
        }
    }

    // Back to Top Button Functionality
    function initializeBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Smooth scroll to top
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Cookie Consent Functionality
    function initializeCookieConsent() {
        const cookieConsent = document.getElementById('cookieConsent');
        const acceptBtn = cookieConsent?.querySelector('.accept-cookies');
        const declineBtn = cookieConsent?.querySelector('.decline-cookies');

        if (!cookieConsent) return;

        // Show cookie consent if not previously handled
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieConsent.style.display = 'block';
            }, 1000);
        }

        // Accept cookies
        acceptBtn?.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            hideCookieConsent();
        });

        // Decline cookies
        declineBtn?.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            hideCookieConsent();
        });

        function hideCookieConsent() {
            cookieConsent.style.opacity = '0';
            setTimeout(() => {
                cookieConsent.style.display = 'none';
            }, 300);
        }
    }

    // Current Year Update
    function initializeCurrentYear() {
        const currentYearElement = document.getElementById('currentYear');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear();
        }
    }

    // Social Buttons Hover Effects
    function initializeSocialButtons() {
        const socialBtns = document.querySelectorAll('.social-btn');
        
        socialBtns.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
            });

            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // Contact Buttons Initialization
    function initializeContactButtons() {
        const contactBtn = document.querySelector('.contact-btn');
        
        if (contactBtn) {
            contactBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // Add custom click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);

                // Show feedback to user
                showNotification('Starting live chat...', 'info');
            });
        }
    }

    // Utility Functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function animateNumber(start, end, element) {
        let current = start;
        const increment = Math.ceil((end - start) / 20);
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                clearInterval(timer);
                current = end;
            }
            element.textContent = `${current}+`;
        }, 50);
    }

    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add to document
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add notification styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 25px;
            background: #333;
            color: white;
            border-radius: 5px;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 1000;
        }
        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }
        .notification-success { background: #4CAF50; }
        .notification-error { background: #f44336; }
        .notification-info { background: #2196F3; }
    `;
    document.head.appendChild(style);
});