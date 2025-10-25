// ============================================
// Openverse Search App - Interactive Scripts
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all features
    initImageLazyLoading();
    initSearchEnhancements();
    initFormValidation();
    initAnimations();
    initAccessibility();
    
    console.log('✨ Openverse Search App loaded successfully!');
});

// ============================================
// Image Lazy Loading with Fade-in Effect
// ============================================
function initImageLazyLoading() {
    const images = document.querySelectorAll('.media-preview');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add loading state
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s ease-in-out';
                    
                    // Load image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    
                    img.onload = function() {
                        img.style.opacity = '1';
                    };
                    
                    img.onerror = function() {
                        img.style.opacity = '1';
                        img.alt = 'Image failed to load';
                    };
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ============================================
// Search Enhancements
// ============================================
function initSearchEnhancements() {
    const searchInput = document.querySelector('input[name="q"]');
    const searchForm = document.querySelector('form[action*="search"]');
    
    if (searchInput) {
        // Add search icon
        searchInput.setAttribute('placeholder', '🔍 Search for images...');
        
        // Auto-focus on search page
        if (window.location.pathname.includes('search')) {
            searchInput.focus();
        }
        
        // Clear button
        addClearButton(searchInput);
        
        // Character counter
        addCharacterCounter(searchInput);
        
        // Search suggestions from history
        addSearchSuggestions(searchInput);
    }
    
    if (searchForm) {
        // Prevent empty searches
        searchForm.addEventListener('submit', function(e) {
            const query = searchInput.value.trim();
            if (query === '') {
                e.preventDefault();
                showNotification('Please enter a search term', 'warning');
                searchInput.focus();
            }
        });
        
        // Show loading state
        searchForm.addEventListener('submit', function() {
            const button = searchForm.querySelector('button[type="submit"]');
            if (button && searchInput.value.trim() !== '') {
                button.innerHTML = '<span class="loading"></span> Searching...';
                button.disabled = true;
            }
        });
    }
}

// Add clear button to search input
function addClearButton(input) {
    if (!input.value) return;
    
    const clearBtn = document.createElement('button');
    clearBtn.innerHTML = '×';
    clearBtn.type = 'button';
    clearBtn.className = 'clear-search-btn';
    clearBtn.style.cssText = `
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        font-size: 1.5rem;
        color: #64748b;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: none;
    `;
    
    clearBtn.addEventListener('click', function() {
        input.value = '';
        input.focus();
        clearBtn.style.display = 'none';
    });
    
    input.addEventListener('input', function() {
        clearBtn.style.display = input.value ? 'block' : 'none';
    });
    
    // Make input wrapper relative
    input.parentElement.style.position = 'relative';
    input.parentElement.appendChild(clearBtn);
    
    if (input.value) clearBtn.style.display = 'block';
}

// Add character counter
function addCharacterCounter(input) {
    const counter = document.createElement('small');
    counter.className = 'char-counter';
    counter.style.cssText = `
        display: block;
        margin-top: 0.25rem;
        color: #64748b;
        font-size: 0.75rem;
    `;
    
    function updateCounter() {
        const length = input.value.length;
        counter.textContent = `${length} characters`;
        
        if (length > 100) {
            counter.style.color = '#ef4444';
        } else {
            counter.style.color = '#64748b';
        }
    }
    
    input.addEventListener('input', updateCounter);
    input.parentElement.appendChild(counter);
    updateCounter();
}

// Add search suggestions
function addSearchSuggestions(input) {
    const historyItems = document.querySelectorAll('.bg-gray-100 a, .bg-gray-200 a');
    if (historyItems.length === 0) return;
    
    const suggestions = Array.from(historyItems)
        .map(item => item.textContent.trim())
        .filter((value, index, self) => self.indexOf(value) === index)
        .slice(0, 5);
    
    const datalist = document.createElement('datalist');
    datalist.id = 'search-suggestions';
    
    suggestions.forEach(suggestion => {
        const option = document.createElement('option');
        option.value = suggestion;
        datalist.appendChild(option);
    });
    
    input.setAttribute('list', 'search-suggestions');
    document.body.appendChild(datalist);
}

// ============================================
// Form Validation
// ============================================
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(input);
            });
            
            input.addEventListener('input', function() {
                if (input.classList.contains('error')) {
                    validateInput(input);
                }
            });
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    const isValid = input.checkValidity();
    
    if (!isValid || value === '') {
        input.classList.add('error');
        input.style.borderColor = '#ef4444';
    } else {
        input.classList.remove('error');
        input.style.borderColor = '#10b981';
    }
}

// ============================================
// Animations
// ============================================
function initAnimations() {
    // Animate media items on scroll
    const mediaItems = document.querySelectorAll('.media-item');
    
    if ('IntersectionObserver' in window) {
        const itemObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 50);
                    itemObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        mediaItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            itemObserver.observe(item);
        });
    }
    
    // Smooth scroll to results
    const searchButton = document.querySelector('button[type="submit"]');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            setTimeout(() => {
                const results = document.querySelector('.media-list');
                if (results) {
                    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        });
    }
}

// ============================================
// Accessibility Enhancements
// ============================================
function initAccessibility() {
    // Add ARIA labels
    const searchInput = document.querySelector('input[name="q"]');
    if (searchInput) {
        searchInput.setAttribute('aria-label', 'Search for images');
    }
    
    const licenseSelect = document.querySelector('select[name="license"]');
    if (licenseSelect) {
        licenseSelect.setAttribute('aria-label', 'Filter by license type');
    }
    
    // Add role to media grid
    const mediaList = document.querySelector('.media-list');
    if (mediaList) {
        mediaList.setAttribute('role', 'list');
        
        const mediaItems = mediaList.querySelectorAll('.media-item');
        mediaItems.forEach(item => {
            item.setAttribute('role', 'listitem');
        });
    }
    
    // Keyboard navigation for delete buttons
    const deleteButtons = document.querySelectorAll('a[href*="delete"]');
    deleteButtons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (confirm('Are you sure you want to delete this item?')) {
                    window.location.href = button.href;
                }
            }
        });
    });
}

// ============================================
// Notification System
// ============================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        background: white;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
        border-left: 4px solid;
    `;
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#2563eb'
    };
    
    notification.style.borderLeftColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Utility Functions
// ============================================

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Copy to clipboard helper
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy', 'error');
        });
    } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Copied to clipboard!', 'success');
    }
}

// Export for global use
window.openverseApp = {
    showNotification,
    copyToClipboard,
    debounce,
    throttle
};