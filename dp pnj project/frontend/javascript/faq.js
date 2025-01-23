//banner code
  document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  });




//   section 3

document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        offset: 100,
        once: true
    });
});













//<!-- Section 2: Product FAQs -->
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                }
            });

            // Toggle current item
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // Keyboard accessibility
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
});












//contact form

document.addEventListener('DOMContentLoaded', function() {
    // Form validation and submission
    const conttsContactForm = document.getElementById('conttsContactForm');
    
    if (conttsContactForm) {
        conttsContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = document.getElementById('conttsName');
            const email = document.getElementById('conttsEmail');
            const message = document.getElementById('conttsMessage');
            
            let isValid = true;
            
            // Validate name
            if (!name.value.trim()) {
                showConttsError(name, 'Name is required');
                isValid = false;
            } else {
                removeConttsError(name);
            }
            
            // Validate email
            if (!isValidConttsEmail(email.value)) {
                showConttsError(email, 'Please enter a valid email');
                isValid = false;
            } else {
                removeConttsError(email);
            }
            
            // Validate message
            if (!message.value.trim()) {
                showConttsError(message, 'Message is required');
                isValid = false;
            } else {
                removeConttsError(message);
            }
            
            if (isValid) {
                // Show loading state
                const submitBtn = conttsContactForm.querySelector('.contts-submit-btn');
                submitBtn.innerHTML = '<span class="contts-loading"></span>';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    // Reset form
                    conttsContactForm.reset();
                    submitBtn.innerHTML = `
                        <span class="contts-btn-text">Message Sent!</span>
                        <span class="contts-btn-icon">✓</span>
                    `;
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = `
                            <span class="contts-btn-text">Send Message</span>
                            <span class="contts-btn-icon">→</span>
                        `;
                        submitBtn.disabled = false;
                    }, 3000);
                }, 2000);
            }
        });
    }
    
    // Email validation helper
    function isValidConttsEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Error handling helpers
    function showConttsError(input, message) {
        input.classList.add('contts-error');
        const errorDiv = input.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('contts-error-message')) {
            errorDiv.textContent = message;
            errorDiv.classList.add('visible');
        } else {
            const error = document.createElement('div');
            error.className = 'contts-error-message visible';
            error.textContent = message;
            input.parentNode.insertBefore(error, input.nextSibling);
        }
    }
    
    function removeConttsError(input) {
        input.classList.remove('contts-error');
        const errorDiv = input.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('contts-error-message')) {
            errorDiv.classList.remove('visible');
        }
    }
    
    // Live chat functionality
    window.startConttsChat = function() {
        // Implement your chat functionality here
        console.log('Starting chat...');
        // This could open a chat widget or redirect to a chat page
    };
});