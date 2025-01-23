// Main JavaScript for Privacy Policy and Terms & Conditions
document.addEventListener('DOMContentLoaded', function() {
    initStickyNav();
    initAccordions();
    initScrollSpy();
    initAnimations();
    initSearchFeature();
    initPrintFunction();
    initCopyLinks();
    initThemeToggle();
    initTooltips();
});

// Sticky Navigation with Intersection Observer
function initStickyNav() {
    const nav = document.querySelector('.priv-quick-nav');
    const header = document.querySelector('.priv-legal-header');
    
    const navObserver = new IntersectionObserver((entries) => {
        const [entry] = entries;
        nav.classList.toggle('priv-nav-sticky', !entry.isIntersecting);
        
        // Add slide animation
        if (!entry.isIntersecting) {
            nav.style.transform = 'translateY(0)';
            nav.style.transition = 'transform 0.3s ease';
        } else {
            nav.style.transform = 'translateY(-100%)';
        }
    }, {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px'
    });

    if (header) navObserver.observe(header);
}

// Enhanced Accordion Functionality
function initAccordions() {
    const accordionTriggers = document.querySelectorAll('.priv-accordion-trigger');
    
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const content = this.nextElementSibling;
            const parent = this.parentElement;
            const icon = this.querySelector('i');
            const allAccordions = document.querySelectorAll('.priv-accordion-item');
            
            // Close other accordions
            allAccordions.forEach(accordion => {
                if (accordion !== parent && accordion.classList.contains('active')) {
                    accordion.classList.remove('active');
                    accordion.querySelector('.priv-accordion-content').style.maxHeight = '0px';
                    accordion.querySelector('i').style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle active state
            parent.classList.toggle('active');
            
            // Animate content height
            if (parent.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            } else {
                content.style.maxHeight = '0px';
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

// Enhanced Scroll Spy
function initScrollSpy() {
    const sections = document.querySelectorAll('.priv-content-section');
    const navLinks = document.querySelectorAll('.priv-nav-links a');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '-20% 0px -79% 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.id;
                updateActiveNavLink(activeId);
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    function updateActiveNavLink(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === activeId) {
                link.classList.add('active');
                link.style.color = getComputedStyle(document.documentElement)
                    .getPropertyValue('--primary-dark-yellow');
            }
        });
    }
}

// Enhanced Animations
function initAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Add custom animations based on element type
                if (entry.target.classList.contains('priv-info-card')) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                } else if (entry.target.classList.contains('priv-timeline-item')) {
                    entry.target.style.animation = 'slideInLeft 0.6s ease forwards';
                }
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => animationObserver.observe(element));
}

// Enhanced Search Functionality
function initSearchFeature() {
    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.placeholder = 'Search policies...';
    searchInput.classList.add('priv-policy-search');
    
    const searchContainer = document.createElement('div');
    searchContainer.classList.add('priv-search-container');
    searchContainer.appendChild(searchInput);
    
    document.querySelector('.priv-nav-container').prepend(searchContainer);

    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase();
            searchContent(searchTerm);
        }, 300);
    });
}

function searchContent(term) {
    const sections = document.querySelectorAll('.priv-content-section');
    let hasResults = false;
    
    sections.forEach(section => {
        const text = section.textContent.toLowerCase();
        const match = text.includes(term);
        
        section.style.display = match || term === '' ? 'block' : 'none';
        
        if (match) {
            hasResults = true;
            highlightText(section, term);
        } else {
            removeHighlight(section);
        }
    });

    // Show no results message
    const noResults = document.querySelector('.priv-no-results');
    if (!hasResults && term !== '') {
        if (!noResults) {
            const message = document.createElement('div');
            message.classList.add('priv-no-results');
            message.textContent = 'No matching content found';
            document.querySelector('.priv-legal-content').appendChild(message);
        }
    } else if (noResults) {
        noResults.remove();
    }
}

function highlightText(element, term) {
    const regex = new RegExp(`(${term})`, 'gi');
    element.querySelectorAll('p, li, h3').forEach(textElement => {
        const originalText = textElement.textContent;
        if (originalText.toLowerCase().includes(term)) {
            textElement.innerHTML = originalText.replace(
                regex, 
                '<span class="priv-highlight">$1</span>'
            );
        }
    });
}

function removeHighlight(element) {
    element.querySelectorAll('.priv-highlight').forEach(highlight => {
        const parent = highlight.parentNode;
        parent.textContent = parent.textContent;
    });
}

// Enhanced Print Functionality
function initPrintFunction() {
    const printButton = document.createElement('button');
    printButton.classList.add('priv-print-button');
    printButton.innerHTML = '<i class="fas fa-print"></i> Print';
    
    printButton.addEventListener('click', () => {
        // Add print-specific styles
        const style = document.createElement('style');
        style.textContent = `
            @media print {
                .priv-quick-nav, .priv-print-button { display: none; }
                .priv-content-section { break-inside: avoid; }
            }
        `;
        document.head.appendChild(style);
        
        window.print();
        
        // Remove print-specific styles after printing
        setTimeout(() => style.remove(), 1000);
    });
    
    document.querySelector('.priv-nav-container').appendChild(printButton);
}

// Enhanced Copy Link Functionality
function initCopyLinks() {
    const sections = document.querySelectorAll('.priv-content-section');
    
    sections.forEach(section => {
        const copyButton = document.createElement('button');
        copyButton.classList.add('priv-copy-link-button');
        copyButton.innerHTML = '<i class="fas fa-link"></i>';
        copyButton.setAttribute('title', 'Copy link to section');
        
        copyButton.addEventListener('click', async () => {
            const sectionId = section.id;
            const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
            
            try {
                await navigator.clipboard.writeText(url);
                showToast('Link copied to clipboard!');
                
                // Animate button
                copyButton.classList.add('copied');
                setTimeout(() => copyButton.classList.remove('copied'), 1000);
            } catch (err) {
                showToast('Failed to copy link', 'error');
            }
        });
        
        section.querySelector('.priv-section-title').appendChild(copyButton);
    });
}

// Enhanced Toast Notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.classList.add('priv-toast', `priv-toast-${type}`);
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate toast
    requestAnimationFrame(() => {
        toast.classList.add('priv-toast-show');
        
        setTimeout(() => {
            toast.classList.remove('priv-toast-show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    });
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.classList.add('priv-theme-toggle');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    
    document.querySelector('.priv-nav-container').appendChild(themeToggle);
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('priv-dark-theme');
        localStorage.setItem('priv-theme', 
            document.body.classList.contains('priv-dark-theme') ? 'dark' : 'light'
        );
        
        themeToggle.innerHTML = document.body.classList.contains('priv-dark-theme') 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    });
    
    // Check saved theme
    const savedTheme = localStorage.getItem('priv-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('priv-dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Initialize Tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', createTooltip);
        element.addEventListener('mouseleave', removeTooltip);
    });
}

function createTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.classList.add('priv-tooltip');
    tooltip.textContent = e.target.getAttribute('title');
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
    tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
    
    requestAnimationFrame(() => tooltip.classList.add('priv-tooltip-show'));
}

function removeTooltip() {
    const tooltip = document.querySelector('.priv-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}