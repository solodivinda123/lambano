// Services Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize services page components
    initServicesAnimations();
    initServicesInteractions();
    initScrollReveal();
    initServiceCounters();
});

// Services scroll reveal animations
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate service list items with stagger
                const listItems = entry.target.querySelectorAll('.service-list li');
                listItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(-30px)';
                        item.style.transition = 'all 0.5s ease';
                        
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, 100);
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe all service sections
    const serviceSections = document.querySelectorAll('.service-section');
    serviceSections.forEach(section => {
        observer.observe(section);
    });
}

// Services interactive animations
function initServicesAnimations() {
    // Floating shapes animation enhancement
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        // Add random movement
        setInterval(() => {
            const randomX = Math.random() * 20 - 10;
            const randomY = Math.random() * 20 - 10;
            shape.style.transform += ` translate(${randomX}px, ${randomY}px)`;
        }, 3000 + index * 1000);
    });
    
    // Service icon hover effects
    const serviceIcons = document.querySelectorAll('.service-icon');
    serviceIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Enhanced interactions
function initServicesInteractions() {
    // Service image parallax effect
    window.addEventListener('scroll', function() {
        const serviceImages = document.querySelectorAll('.service-image');
        serviceImages.forEach(image => {
            const rect = image.getBoundingClientRect();
            const speed = 0.1;
            const yPos = -(rect.top * speed);
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                image.style.transform = `translateY(${yPos}px)`;
            }
        });
    });
    
    // Service buttons magnetic effect
    const serviceButtons = document.querySelectorAll('.service-btn, .cta-primary, .cta-secondary');
    serviceButtons.forEach(button => {
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
    
    // Service list items hover animation
    const listItems = document.querySelectorAll('.service-list li');
    listItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.background = '#f1f5f9';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.background = 'transparent';
        });
    });
}

// Animated counters for stats
function initServiceCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target, suffix = '') => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 50);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                if (text.includes('+100')) {
                    animateCounter(entry.target, 100, '+');
                } else if (text.includes('360')) {
                    animateCounter(entry.target, 360, '°');
                } else if (text.includes('6')) {
                    animateCounter(entry.target, 6);
                }
                observer.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Add service section reveal animation on scroll
function revealOnScroll() {
    const sections = document.querySelectorAll('.service-section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        
        if (isVisible) {
            section.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Enhanced service image effects
document.querySelectorAll('.service-image').forEach(image => {
    image.addEventListener('click', function() {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: 100px;
            height: 100px;
            background: rgba(249, 115, 22, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.8s ease-out;
            top: 50%;
            left: 50%;
            margin: -50px 0 0 -50px;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 800);
    });
});

// Add typing effect to service descriptions
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when service sections come into view
const typingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const description = entry.target.querySelector('.service-description');
            if (description && !description.classList.contains('typed')) {
                const originalText = description.textContent;
                description.classList.add('typed');
                setTimeout(() => {
                    typeWriter(description, originalText, 30);
                }, 500);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.service-header').forEach(header => {
    typingObserver.observe(header);
});

// Add smooth scroll behavior for service navigation
function smoothScrollToService(serviceId) {
    const serviceElement = document.querySelector(`[data-service="${serviceId}"]`);
    if (serviceElement) {
        serviceElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add service quick navigation (if needed)
function createServiceNavigation() {
    const services = [
        { id: 'communication', name: 'Communication' },
        { id: 'events', name: 'Événementiel' },
        { id: 'community', name: 'Mobilisation' },
        { id: 'branding', name: 'Branding' },
        { id: 'content', name: 'Contenus' },
        { id: 'consulting', name: 'Conseil' }
    ];
    
    // This can be used to create a floating navigation menu if needed
    // Implementation would go here based on specific requirements
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    revealOnScroll(); // Initial check
    createServiceNavigation();
});

// Add CSS for additional animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .service-list li {
        opacity: 0;
        transform: translateX(-30px);
    }
    
    .service-section.visible .service-list li {
        opacity: 1;
        transform: translateX(0);
    }
    
    .stat-badge {
        animation: bounceIn 0.8s ease;
    }
    
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            opacity: 1;
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .shape {
        transition: transform 0.3s ease;
    }
`;

document.head.appendChild(additionalStyles);
