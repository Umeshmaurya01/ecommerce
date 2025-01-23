document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const filterToggle = document.querySelector('.cpr-filter-toggle');
    const filterSidebar = document.querySelector('.cpr-filter-sidebar');
    const filterOverlay = document.querySelector('.cpr-filter-overlay');
    const closeFilters = document.querySelector('.cpr-close-filters');
    const productGrid = document.querySelector('.cpr-product-grid');
    const activeFiltersContainer = document.querySelector('.cpr-active-filters');
    const resetFiltersBtn = document.querySelector('.cpr-reset-filters');
    const priceSlider = document.querySelector('.cpr-price-slider');

    // State Management
    let activeFilters = {
        product: [],
        color: [],
        price: { min: 0, max: 1000 },
        theme: []
    };

    // Mobile Filter Toggle
    function toggleFilters() {
        filterSidebar.classList.toggle('active');
        filterOverlay.classList.toggle('active');
        document.body.style.overflow = filterSidebar.classList.contains('active') ? 'hidden' : '';
    }

    // Event Listeners for Filter Toggle
    if(filterToggle) filterToggle.addEventListener('click', toggleFilters);
    if(closeFilters) closeFilters.addEventListener('click', toggleFilters);
    if(filterOverlay) filterOverlay.addEventListener('click', toggleFilters);

    // Filter Section Accordion
    const filterSections = document.querySelectorAll('.cpr-filter-section');
    filterSections.forEach(section => {
        const header = section.querySelector('.cpr-filter-section-header');
        const options = section.querySelector('.cpr-filter-options');
        const icon = header.querySelector('.cpr-toggle-icon i');

        if(header) {
            header.addEventListener('click', () => {
                const isExpanded = options.style.maxHeight;
                
                // Close all other sections
                filterSections.forEach(otherSection => {
                    if (otherSection !== section) {
                        const otherOptions = otherSection.querySelector('.cpr-filter-options');
                        const otherIcon = otherSection.querySelector('.cpr-toggle-icon i');
                        if(otherOptions && otherIcon) {
                            otherOptions.style.maxHeight = null;
                            otherIcon.className = 'fas fa-chevron-down';
                        }
                    }
                });

                // Toggle current section
                if(options && icon) {
                    options.style.maxHeight = isExpanded ? null : `${options.scrollHeight}px`;
                    icon.className = isExpanded ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
                }
            });
        }
    });

    // Initialize Price Range Slider
    if (priceSlider) {
        noUiSlider.create(priceSlider, {
            start: [0, 1000],
            connect: true,
            step: 1,
            range: {
                'min': 0,
                'max': 1000
            },
            format: {
                to: value => Math.round(value),
                from: value => Math.round(value)
            }
        });

        const minInput = document.getElementById('cpr-price-min-input');
        const maxInput = document.getElementById('cpr-price-max-input');

        // Update inputs when slider changes
        priceSlider.noUiSlider.on('update', (values, handle) => {
            const value = values[handle];
            if (handle === 0 && minInput) {
                minInput.value = value;
                activeFilters.price.min = parseInt(value);
            } else if (maxInput) {
                maxInput.value = value;
                activeFilters.price.max = parseInt(value);
            }
            updateActiveFilters();
        });

        // Update slider when inputs change
        [minInput, maxInput].forEach((input, index) => {
            if(input) {
                input.addEventListener('change', () => {
                    let value = parseInt(input.value);
                    const isMin = index === 0;
                    
                    if (isNaN(value)) {
                        value = isMin ? 0 : 1000;
                    }
                    
                    if (isMin) {
                        value = Math.min(value, parseInt(maxInput.value));
                    } else {
                        value = Math.max(value, parseInt(minInput.value));
                    }
                    
                    input.value = value;
                    priceSlider.noUiSlider.setHandle(index, value);
                    activeFilters.price[isMin ? 'min' : 'max'] = value;
                    updateActiveFilters();
                });
            }
        });
    }

    // Color Buttons
    const colorButtons = document.querySelectorAll('.cpr-color-btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const color = btn.dataset.color;
            updateFilters('color', color);
        });
    });

    // Checkbox Filters
    const checkboxFilters = document.querySelectorAll('input[type="checkbox"][data-filter-type]');
    checkboxFilters.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const type = checkbox.dataset.filterType;
            const value = checkbox.value;
            updateFilters(type, value);
        });
    });
    
        // Update Filters
        function updateFilters(type, value) {
            if (!activeFilters[type].includes(value)) {
                activeFilters[type].push(value);
            } else {
                activeFilters[type] = activeFilters[type].filter(item => item !== value);
            }
            updateActiveFilters();
        }
    
        // Update Active Filters Display
        function updateActiveFilters() {
            if (!activeFiltersContainer) return;
            
            activeFiltersContainer.innerHTML = '';
            let hasActiveFilters = false;
    
            // Process each filter type
            Object.entries(activeFilters).forEach(([type, values]) => {
                if (Array.isArray(values) && values.length > 0) {
                    values.forEach(value => {
                        createActiveFilterTag(type, value);
                        hasActiveFilters = true;
                    });
                } else if (type === 'price' && (values.min > 0 || values.max < 1000)) {
                    createActiveFilterTag('price', `₹${values.min} - ₹${values.max}`);
                    hasActiveFilters = true;
                }
            });
    
            // Show/hide reset button
            if (resetFiltersBtn) {
                resetFiltersBtn.style.display = hasActiveFilters ? 'flex' : 'none';
            }
    
            filterProducts();
        }
    
        // Create Active Filter Tags
        function createActiveFilterTag(type, value) {
            const tag = document.createElement('div');
            tag.className = 'cpr-active-filter-tag';
            
            // Format display text
            let displayText = value;
            if (type === 'price') {
                displayText = `Price: ${value}`;
            } else if (type === 'product') {
                displayText = `Product: ${value}`;
            } else if (type === 'color') {
                displayText = `Color: ${value}`;
            } else if (type === 'theme') {
                displayText = `Theme: ${value}`;
            }
    
            tag.innerHTML = `
                <span>${displayText}</span>
                <i class="fas fa-times cpr-remove-filter"></i>
            `;
            
            // Add click handler for remove button
            const removeBtn = tag.querySelector('.cpr-remove-filter');
            removeBtn.addEventListener('click', () => {
                removeFilter(type, value);
            });
            
            activeFiltersContainer.appendChild(tag);
        }
    
        // Remove Filter
        function removeFilter(type, value) {
            if (type === 'price') {
                activeFilters.price = { min: 0, max: 1000 };
                if (priceSlider) {
                    priceSlider.noUiSlider.reset();
                }
            } else {
                activeFilters[type] = activeFilters[type].filter(item => item !== value);
                
                // Uncheck corresponding checkbox or button
                if (type === 'color') {
                    const colorBtn = document.querySelector(`.cpr-color-btn[data-color="${value}"]`);
                    if (colorBtn) colorBtn.classList.remove('active');
                } else {
                    const checkbox = document.querySelector(`input[type="checkbox"][data-filter-type="${type}"][value="${value}"]`);
                    if (checkbox) checkbox.checked = false;
                }
            }
            updateActiveFilters();
        }
    
        // Reset All Filters
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                activeFilters = {
                    product: [],
                    color: [],
                    price: { min: 0, max: 1000 },
                    theme: []
                };
    
                // Reset UI elements
                checkboxFilters.forEach(checkbox => checkbox.checked = false);
                colorButtons.forEach(btn => btn.classList.remove('active'));
                
                if (priceSlider) {
                    priceSlider.noUiSlider.reset();
                }
    
                updateActiveFilters();
            });
        }
    
        // Filter Products
        function filterProducts() {
            const products = document.querySelectorAll('.cpr-product-card');
            
            products.forEach(product => {
                let shouldShow = true;
                
                // Check product type
                if (activeFilters.product.length > 0) {
                    const productType = product.dataset.productType;
                    shouldShow = activeFilters.product.includes(productType);
                }
                
                // Check color
                if (shouldShow && activeFilters.color.length > 0) {
                    const productColor = product.dataset.color;
                    shouldShow = activeFilters.color.includes(productColor);
                }
                
                // Check price
                if (shouldShow) {
                    const priceElement = product.querySelector('.cpr-current-price');
                    if (priceElement) {
                        const price = parseFloat(priceElement.textContent.replace('₹', ''));
                        shouldShow = price >= activeFilters.price.min && price <= activeFilters.price.max;
                    }
                }
                
                // Check theme
                if (shouldShow && activeFilters.theme.length > 0) {
                    const productTheme = product.dataset.theme;
                    shouldShow = activeFilters.theme.includes(productTheme);
                }
                
                // Apply animation
                if (shouldShow) {
                    product.style.display = 'block';
                    setTimeout(() => {
                        product.style.opacity = '1';
                        product.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    product.style.opacity = '0';
                    product.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        product.style.display = 'none';
                    }, 300);
                }
            });
        }
    
        // Wishlist Functionality
        document.querySelectorAll('.cpr-heart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const icon = btn.querySelector('i');
                
                // Toggle heart icon with animation
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = '#ff4444';
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '';
                }
                
                // Add animation
                btn.classList.add('clicked');
                setTimeout(() => {
                    btn.classList.remove('clicked');
                }, 300);
            });
        });
    
        // Add to Cart Functionality
        document.querySelectorAll('.cpr-add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const btnText = btn.querySelector('span');
                const btnIcon = btn.querySelector('i');
                
                if (!btn.classList.contains('adding')) {
                    // Add animation and change text
                    btn.classList.add('adding');
                    btnText.textContent = 'Added!';
                    btnIcon.className = 'fas fa-check';
                    btn.style.backgroundColor = '#4CAF50';
                    
                    // Revert back after delay
                    setTimeout(() => {
                        btn.classList.remove('adding');
                        btnText.textContent = 'Add to Cart';
                        btnIcon.className = 'fas fa-shopping-cart';
                        btn.style.backgroundColor = '';
                    }, 2000);
                }
            });
        });
    
        // Initialize
        updateActiveFilters();
    });