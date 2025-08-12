// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initParallaxEffects();
    initCounterAnimations();
    initHeroSlider();
    initPortfolioGallery();
    initLoadingAnimation();
    initServiceTabs();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active nav link highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animateElements = document.querySelectorAll('.service-card, .realization-card, .team-member, .testimonial-card, .stat-card, .about-content, .section-header');
    
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Staggered animations for grids
    const serviceCards = document.querySelectorAll('.service-card');
    const realizationCards = document.querySelectorAll('.realization-card');
    const teamMembers = document.querySelectorAll('.team-member');

    [serviceCards, realizationCards, teamMembers].forEach(cards => {
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
        });
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateForm(data)) {
                // Show loading state
                const submitBtn = contactForm.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Envoi en cours...';
                submitBtn.disabled = true;
                
                // Send data to Google Sheets
                fetch(contactForm.action, {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.text())
                .then(result => {
                    // Show success message
                    showFormMessage('Votre message a été envoyé avec succès!', 'success');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Remove focus from all inputs
                    const inputs = contactForm.querySelectorAll('input, textarea');
                    inputs.forEach(input => input.blur());
                })
                .catch(error => {
                    console.error('Error:', error);
                    showFormMessage('Une erreur est survenue. Veuillez réessayer.', 'error');
                })
                .finally(() => {
                    // Reset button state
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
            }
        });

        // Enhanced form validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

// Form validation
function validateForm(data) {
    let isValid = true;
    const requiredFields = ['name', 'organization', 'email', 'subject', 'message'];
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!data[field] || data[field].trim() === '') {
            showFieldError(input, 'Ce champ est requis');
            isValid = false;
        } else if (field === 'email' && !isValidEmail(data[field])) {
            showFieldError(input, 'Veuillez entrer une adresse email valide');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    return isValid;
}

function validateField(input) {
    const value = input.value.trim();
    
    if (!value) {
        showFieldError(input, 'Ce champ est requis');
        return false;
    }
    
    if (input.type === 'email' && !isValidEmail(value)) {
        showFieldError(input, 'Veuillez entrer une adresse email valide');
        return false;
    }
    
    clearFieldError(input);
    return true;
}

function showFieldError(input, message) {
    input.classList.add('error');
    
    // Remove existing error message
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'color: #e74c3c; font-size: 0.8rem; margin-top: 0.5rem;';
    input.parentNode.appendChild(errorDiv);
}

function clearFieldError(input) {
    input.classList.remove('error');
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(message, type = 'success') {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    const styles = {
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        textAlign: 'center',
        fontWeight: '500'
    };
    
    if (type === 'success') {
        styles.backgroundColor = '#d4edda';
        styles.color = '#155724';
        styles.border = '1px solid #c3e6cb';
    } else {
        styles.backgroundColor = '#f8d7da';
        styles.color = '#721c24';
        styles.border = '1px solid #f5c6cb';
    }
    
    Object.assign(messageDiv.style, styles);
    
    // Insert message at the top of the form
    const form = document.getElementById('contactForm');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Parallax effects
function initParallaxEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Hero background parallax
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Counter animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const countUp = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        if (isNaN(target)) return;
        
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.ceil(current);
            }
        }, 20);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Add enhanced scroll effects
window.addEventListener('scroll', debounce(function() {
    // Add floating animation to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + card.offsetHeight);
            const translateY = Math.sin(scrollProgress * Math.PI) * 10;
            card.style.transform = `translateY(${translateY}px)`;
        }
    });
}, 10));

// Add hover effects for better interactivity
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.service-card, .realization-card, .team-member');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
    });
});

// Add smooth transitions when mouse leaves cards
document.querySelectorAll('.service-card, .realization-card, .team-member').forEach(card => {
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
});

// Loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Hero Slider functionality
function initHeroSlider() {
    const slides = document.querySelectorAll('.bg-slide');
    const navDots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        navDots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        navDots[index].classList.add('active');
        
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }

    // Auto-slide every 5 seconds
    setInterval(nextSlide, 5000);

    // Manual navigation
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // Navigation buttons
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const prev = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(prev);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
        });
    }
}

// Portfolio Gallery functionality
function initPortfolioGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(button => button.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hide');
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                    item.classList.add('hide');
                }
            });
        });
    });

    // Initialize gallery animation on scroll
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    galleryItems.forEach(item => {
        galleryObserver.observe(item);
    });
}

// Loading Animation
function initLoadingAnimation() {
    // Create loading screen
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-animation';
    loadingDiv.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loadingDiv);

    // Remove loading screen after page load
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingDiv.classList.add('fade-out');
            setTimeout(() => {
                if (loadingDiv.parentNode) {
                    loadingDiv.parentNode.removeChild(loadingDiv);
                }
            }, 500);
        }, 1000);
    });
}

// Enhanced counter animations with dynamic counting
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');

    const countUp = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        if (isNaN(target)) return;
        
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.ceil(current);
            }
        }, 20);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Enhanced parallax effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.float-element, .hero-content');
    
    window.addEventListener('scroll', debounce(function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        // Hero background parallax
        const heroBackground = document.querySelector('.hero-slider');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }

        // Floating elements parallax
        const floatingElements = document.querySelectorAll('.float-element');
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 10));
}

// Add enhanced scroll effects with motion blur
window.addEventListener('scroll', debounce(function() {
    const scrollSpeed = Math.abs(window.pageYOffset - (window.lastScrollTop || 0));
    window.lastScrollTop = window.pageYOffset;

    // Add motion blur effect during fast scrolling
    if (scrollSpeed > 10) {
        document.body.style.filter = 'blur(1px)';
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 100);
    }

    // Floating service cards
    const serviceCards = document.querySelectorAll('.service-card, .gallery-item');
    serviceCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + card.offsetHeight);
            const translateY = Math.sin(scrollProgress * Math.PI) * 5;
            const rotateX = Math.sin(scrollProgress * Math.PI * 2) * 2;
            card.style.transform = `translateY(${translateY}px) rotateX(${rotateX}deg)`;
        }
    });
}, 5));

// Add magnetic effect to buttons
document.querySelectorAll('.cta-button, .submit-btn, .filter-btn').forEach(button => {
    button.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
    });
});

// Add ripple effect to gallery items
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 10;
        `;
        
        this.style.position = 'relative';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation keyframes
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .form-group input.error,
    .form-group textarea.error {
        border-color: #ef4444;
        background-color: #fef2f2;
    }
    
    .form-group input.error:focus,
    .form-group textarea.error:focus {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .animate-on-scroll {
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .service-card,
    .realization-card,
    .team-member,
    .gallery-item {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;
document.head.appendChild(rippleStyle);

// Service tabs functionality
function initServiceTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    if (tabButtons.length === 0) return; // Exit if no tabs found
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding panel
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
                
                // Animate feature list items
                const featureItems = targetPanel.querySelectorAll('.feature-list li');
                featureItems.forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, index * 100 + 200);
                });
                
                // Animate visual card
                const visualCard = targetPanel.querySelector('.visual-card');
                if (visualCard) {
                    visualCard.style.transform = 'scale(0.8)';
                    visualCard.style.opacity = '0.5';
                    
                    setTimeout(() => {
                        visualCard.style.transform = 'scale(1)';
                        visualCard.style.opacity = '1';
                    }, 300);
                }
            }
            
            // Add ripple effect to button
            createRipple(this, event);
        });
    });
    
    // Auto-rotate tabs every 8 seconds
    let currentTabIndex = 0;
    setInterval(() => {
        if (document.querySelector('.services-tabs:hover')) return; // Don't auto-rotate if user is interacting
        
        currentTabIndex = (currentTabIndex + 1) % tabButtons.length;
        tabButtons[currentTabIndex].click();
    }, 8000);
}

// Create ripple effect
function createRipple(element, event) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(249, 115, 22, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 100;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Enhanced service animations
function initServiceAnimations() {
    // Intersection observer for service sections
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const serviceSection = entry.target;
                
                // Animate tab buttons
                const tabButtons = serviceSection.querySelectorAll('.tab-btn');
                tabButtons.forEach((btn, index) => {
                    setTimeout(() => {
                        btn.style.opacity = '0';
                        btn.style.transform = 'translateY(30px)';
                        btn.style.transition = 'all 0.5s ease';
                        
                        setTimeout(() => {
                            btn.style.opacity = '1';
                            btn.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 100);
                });
                
                // Animate summary cards
                const summaryCards = serviceSection.querySelectorAll('.summary-card');
                summaryCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(30px)';
                        card.style.transition = 'all 0.6s ease';
                        
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 150 + 500);
                });
            }
        });
    }, { threshold: 0.3 });
    
    const servicesSection = document.querySelector('.services');
    if (servicesSection) {
        serviceObserver.observe(servicesSection);
    }
}

// Initialize service animations
document.addEventListener('DOMContentLoaded', function() {
    initServiceAnimations();
});

// Add magnetic effect to service links
document.querySelectorAll('.service-link').forEach(link => {
    link.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
    });
});
