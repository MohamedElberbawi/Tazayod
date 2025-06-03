/**
 * Tazayed Investment Platform
 * Main JavaScript File
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initNavigation();
    initSearchToggle();
    initAnimations();
    initCarousels();
    initVideoThumbnails();
});

/**
 * Mobile Navigation
 */
function initNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            // Toggle menu icon
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close mobile menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

/**
 * Search Toggle
 */
function initSearchToggle() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchDropdown = document.querySelector('.search-dropdown');
    
    if (searchToggle && searchDropdown) {
        searchToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            searchDropdown.classList.toggle('active');
            
            if (searchDropdown.classList.contains('active')) {
                const searchInput = searchDropdown.querySelector('input');
                if (searchInput) {
                    setTimeout(() => {
                        searchInput.focus();
                    }, 100);
                }
            }
        });
        
        // Close search dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchDropdown.contains(e.target) && !searchToggle.contains(e.target)) {
                searchDropdown.classList.remove('active');
            }
        });
    }
}

/**
 * Animations
 */
function initAnimations() {
    // Animate metrics numbers
    const metricNumbers = document.querySelectorAll('.metric-number');
    
    if (metricNumbers.length > 0) {
        const options = { threshold: 0.5 };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    // FIX: Use a default value if data-count is not present or invalid
                    const countTo = parseInt(target.getAttribute('data-count')) || 0;
                    
                    // FIX: Set fixed values for metrics if data-count is missing
                    let finalValue = countTo;
                    if (countTo === 0) {
                        // Use the text content to determine which metric this is
                        const metricText = target.nextElementSibling ? 
                            target.nextElementSibling.textContent.trim().toLowerCase() : '';
                        
                        if (metricText.includes('مستثمر')) {
                            finalValue = 10000; // 10K+ investors
                        } else if (metricText.includes('استثمارات')) {
                            finalValue = 250000000; // $250M+ investments
                        } else if (metricText.includes('شركة')) {
                            finalValue = 500; // 500+ startups
                        }
                    }
                    
                    // FIX: Use a more controlled animation with reasonable increments
                    let currentCount = 0;
                    const steps = 50; // Number of steps for the animation
                    const increment = Math.ceil(finalValue / steps);
                    const duration = 1500; // Animation duration in ms
                    const interval = duration / steps;
                    
                    // FIX: Format the number properly with suffix
                    const formatNumber = (num) => {
                        if (num >= 1000000) {
                            return Math.floor(num / 1000000) + 'M+';
                        } else if (num >= 1000) {
                            return Math.floor(num / 1000) + 'K+';
                        }
                        return num.toString();
                    };
                    
                    // FIX: Handle currency prefix for investment amounts
                    const isCurrency = metricText => metricText && metricText.includes('استثمارات');
                    const metricText = target.nextElementSibling ? 
                        target.nextElementSibling.textContent.trim().toLowerCase() : '';
                    
                    const counter = setInterval(() => {
                        currentCount += increment;
                        
                        if (currentCount >= finalValue) {
                            // FIX: Format the final number correctly
                            target.textContent = isCurrency(metricText) ? 
                                '$' + formatNumber(finalValue) : 
                                formatNumber(finalValue);
                            clearInterval(counter);
                        } else {
                            // FIX: Format the intermediate numbers correctly
                            target.textContent = isCurrency(metricText) ? 
                                '$' + formatNumber(currentCount) : 
                                formatNumber(currentCount);
                        }
                    }, interval);
                    
                    observer.unobserve(target);
                }
            });
        }, options);
        
        metricNumbers.forEach(number => {
            observer.observe(number);
        });
    }
    
    // Fade-in animations for sections
    const sections = document.querySelectorAll('section');
    
    if (sections.length > 0) {
        const fadeOptions = { threshold: 0.1 };
        
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, fadeOptions);
        
        sections.forEach(section => {
            section.classList.add('fade-target');
            fadeObserver.observe(section);
        });
    }
}

/**
 * Carousels
 */
function initCarousels() {
    // Simple scrolling for mobile
    const carousels = document.querySelectorAll('.companies-carousel');
    
    if (carousels.length > 0 && window.innerWidth <= 768) {
        carousels.forEach(carousel => {
            carousel.style.display = 'flex';
            carousel.style.overflowX = 'auto';
            carousel.style.scrollSnapType = 'x mandatory';
            carousel.style.webkitOverflowScrolling = 'touch';
            carousel.style.scrollBehavior = 'smooth';
            
            const cards = carousel.querySelectorAll('.company-card');
            cards.forEach(card => {
                card.style.flex = '0 0 85%';
                card.style.scrollSnapAlign = 'center';
                card.style.marginRight = '15px';
            });
        });
    }
}

/**
 * Video Thumbnails
 */
function initVideoThumbnails() {
    const videoCards = document.querySelectorAll('.video-card');
    
    if (videoCards.length > 0) {
        videoCards.forEach(card => {
            const thumbnail = card.querySelector('.video-thumbnail');
            const link = card.querySelector('a[href*="youtube"]');
            
            if (thumbnail && link) {
                thumbnail.addEventListener('click', function() {
                    window.open(link.href, '_blank');
                });
            }
        });
    }
}

/**
 * Form Validation
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            showError(input, 'هذا الحقل مطلوب');
        } else {
            clearError(input);
            
            // Email validation
            if (input.type === 'email' && !validateEmail(input.value)) {
                isValid = false;
                showError(input, 'يرجى إدخال بريد إلكتروني صحيح');
            }
            
            // Phone validation
            if (input.type === 'tel' && !validatePhone(input.value)) {
                isValid = false;
                showError(input, 'يرجى إدخال رقم هاتف صحيح');
            }
        }
    });
    
    return isValid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[+]?[\s./0-9]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    return re.test(phone);
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    
    if (formGroup) {
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.textContent = message;
        } else {
            const error = document.createElement('div');
            error.className = 'error-message';
            error.textContent = message;
            formGroup.appendChild(error);
        }
        
        input.classList.add('error');
    }
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    
    if (formGroup) {
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        input.classList.remove('error');
    }
}

/**
 * Meeting Request Form
 * This will be connected to Google Sheets via Apps Script
 */
function initMeetingForm() {
    const meetingForm = document.getElementById('meeting-form');
    
    if (meetingForm) {
        meetingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm(this)) {
                return;
            }
            
            const formData = new FormData(this);
            const data = {};
            
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'جاري الإرسال...';
            
            // Send data to Google Sheets via Apps Script
            submitToGoogleSheets(data)
                .then(response => {
                    // Show success message
                    const formContainer = document.querySelector('.form-container');
                    formContainer.innerHTML = `
                        <div class="success-message">
                            <h3>تم إرسال طلبك بنجاح!</h3>
                            <p>سنتواصل معك قريباً لترتيب موعد الاجتماع.</p>
                            <a href="index.html" class="btn btn-primary">العودة للرئيسية</a>
                        </div>
                    `;
                })
                .catch(error => {
                    // Show error message
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
                    console.error('Error submitting form:', error);
                });
        });
    }
}

/**
 * Submit form data to Google Sheets
 */
function submitToGoogleSheets(data) {
    const scriptURL = 'GOOGLE_APPS_SCRIPT_URL'; // Replace with actual URL when deployed
    
    return fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });
}

// Initialize meeting form if on the meeting page
if (document.getElementById('meeting-form')) {
    initMeetingForm();
}
