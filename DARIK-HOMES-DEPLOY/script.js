// DARIK HOMES property data - Premium Properties
const properties = [
    {
        id: 1,
        title: "Luxury 3-Bedroom Unit",
        location: "Maitama, Abuja",
        price: 85000000,
        type: "3-bedroom",
        bedrooms: 3,
        area: 1200,
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Premium 3-bedroom unit in Maitama with modern finishes, private balcony, and access to luxury amenities including gym, pool, and 24/7 security.",
        features: ["Private Balcony", "Modern Kitchen", "Parking Space", "24/7 Security"],
        status: "for-sale"
    },
    {
        id: 2,
        title: "Executive Penthouse Unit",
        location: "Asokoro, Abuja",
        price: 150000000,
        type: "penthouse",
        bedrooms: 4,
        area: 2000,
        image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80",
        description: "Exclusive penthouse unit in Asokoro with panoramic city views, private elevator access, and rooftop terrace. Perfect for executive living.",
        features: ["City Views", "Private Elevator", "Rooftop Terrace", "Concierge", "Gym", "Study Room"],
        status: "for-sale"
    },
    {
        id: 3,
        title: "2-Bedroom Garden Unit",
        location: "Garki, Abuja",
        price: 45000000,
        type: "2-bedroom",
        bedrooms: 2,
        area: 900,
        image: "https://images.unsplash.com/photo-1600566753190-17f63ba4b6bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80",
        description: "Beautiful 2-bedroom unit with garden views, modern amenities, and access to community facilities including pool and gym.",
        features: ["Garden Views", "Modern Kitchen", "Balcony", "Pool Access", "Gym", "24/7 Security"],
        status: "for-sale"
    },
    {
        id: 4,
        title: "4-Bedroom Duplex Unit",
        location: "Wuse 2, Abuja",
        price: 120000000,
        type: "duplex",
        bedrooms: 4,
        area: 1800,
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Spacious 4-bedroom duplex unit with modern finishes, private garden, and premium amenities in the heart of Wuse 2.",
        features: ["Private Garden", "Modern Kitchen", "Parking", "24/7 Security", "Gym"],
        status: "for-sale"
    },
    {
        id: 5,
        title: "Luxury Studio Unit",
        location: "Utako, Abuja",
        price: 25000000,
        type: "studio",
        bedrooms: 1,
        area: 500,
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Modern studio unit perfect for young professionals, featuring smart home technology, modern finishes, and access to luxury amenities.",
        features: ["Smart Home", "Modern Kitchen", "Balcony", "Gym Access", "24/7 Security", "Parking"],
        status: "for-sale"
    },
    {
        id: 6,
        title: "1-Bedroom Executive Unit",
        location: "Central Area, Abuja",
        price: 35000000,
        type: "1-bedroom",
        bedrooms: 1,
        area: 700,
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Stylish 1-bedroom unit with modern finishes, high ceilings, and premium amenities in the heart of Abuja's Central Area.",
        features: ["High Ceilings", "Modern Kitchen", "City Views", "Gym Access", "24/7 Security", "Parking"],
        status: "for-sale"
    }
];

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const propertiesGrid = document.getElementById('propertiesGrid');
const searchInput = document.getElementById('searchInput');
const propertyType = document.getElementById('propertyType');
const priceRange = document.getElementById('priceRange');
const bedrooms = document.getElementById('bedrooms');
const contactForm = document.getElementById('contactForm');

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Format price in Nigerian Naira
function formatPrice(price) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Create property card
function createPropertyCard(property) {
    return `
        <div class="property-card property-card-3d" onclick="openPropertyModal(${property.id})">
            <div class="property-image property-image-3d">
                <img src="${property.image}" alt="${property.title}">
                <div class="property-badge">${property.status.replace('-', ' ').toUpperCase()}</div>
                <div class="property-price">${formatPrice(property.price)}</div>
            </div>
            <div class="property-details property-details-3d">
                <h3 class="property-title">${property.title}</h3>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.location}
                </div>
                <div class="property-features">
                    <div class="feature">
                        <i class="fas fa-bed"></i>
                        ${property.bedrooms} beds
                    </div>
                    <div class="feature">
                        <i class="fas fa-ruler-combined"></i>
                        ${property.area} sq ft
                    </div>
                </div>
                <p class="property-description">${property.description}</p>
                <div class="property-actions">
                    <button class="btn-primary" onclick="event.stopPropagation(); contactAboutProperty(${property.id})">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                    <button class="btn-secondary" onclick="event.stopPropagation(); openPropertyModal(${property.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Display properties
function displayProperties(propertiesToShow = properties) {
    if (propertiesToShow.length === 0) {
        propertiesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <h3>No properties found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }

    propertiesGrid.innerHTML = propertiesToShow.map(property => createPropertyCard(property)).join('');
}

// Search functionality
function searchProperties() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProperties = properties.filter(property => 
        property.title.toLowerCase().includes(searchTerm) ||
        property.location.toLowerCase().includes(searchTerm) ||
        property.description.toLowerCase().includes(searchTerm)
    );
    displayProperties(filteredProperties);
}

// Filter functionality
function applyFilters() {
    const typeFilter = propertyType.value;
    const priceFilter = priceRange.value;
    const bedroomFilter = bedrooms.value;

    let filteredProperties = properties;

    // Filter by type
    if (typeFilter) {
        filteredProperties = filteredProperties.filter(property => property.type === typeFilter);
    }

    // Filter by price
    if (priceFilter) {
        const [minPrice, maxPrice] = priceFilter.split('-').map(Number);
        filteredProperties = filteredProperties.filter(property => {
            if (maxPrice === 999999999) {
                return property.price >= minPrice;
            }
            return property.price >= minPrice && property.price <= maxPrice;
        });
    }

    // Filter by bedrooms
    if (bedroomFilter) {
        filteredProperties = filteredProperties.filter(property => property.bedrooms >= parseInt(bedroomFilter));
    }

    displayProperties(filteredProperties);
}

// Property modal
function openPropertyModal(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <img src="${property.image}" alt="${property.title}" class="modal-image">
            <div class="modal-details">
                <h2 class="modal-title">${property.title}</h2>
                <div class="modal-price">${formatPrice(property.price)}</div>
                <p class="modal-description">${property.description}</p>
                <div class="modal-features">
                    ${property.features.map(feature => `
                        <div class="modal-feature">
                            <i class="fas fa-check"></i>
                            ${feature}
                        </div>
                    `).join('')}
                </div>
                <div class="modal-actions">
                    <button class="btn-primary" onclick="contactAboutProperty(${property.id})">
                        <i class="fas fa-phone"></i> Contact Agent
                    </button>
                    <button class="btn-secondary" onclick="scheduleViewing(${property.id})">
                        <i class="fas fa-calendar"></i> Schedule Viewing
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Close modal functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => {
        document.body.removeChild(modal);
    };

    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
}

// Contact about property
function contactAboutProperty(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    alert(`Thank you for your interest in "${property.title}"! Our team will contact you soon to discuss this property.`);
}

// Schedule viewing
function scheduleViewing(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    alert(`Viewing scheduled for "${property.title}"! We'll contact you to confirm the appointment.`);
}

// Contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
        };

        // Simulate form submission
        alert('Thank you for your message! DARIK HOMES LTD will get back to you within 24 hours.');
        contactForm.reset();
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Search input event listener
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchProperties();
    }
});

// Real-time search
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm.length > 2) {
        const filteredProperties = properties.filter(property => 
            property.title.toLowerCase().includes(searchTerm) ||
            property.location.toLowerCase().includes(searchTerm) ||
            property.description.toLowerCase().includes(searchTerm)
        );
        displayProperties(filteredProperties);
    } else if (searchTerm.length === 0) {
        displayProperties(properties);
    }
});

// Hero slider functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Auto-advance slides every 5 seconds
setInterval(nextSlide, 5000);

// Simple Animation System
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

function setupCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Smooth scroll
function smoothScrollTo(target) {
    const targetElement = document.querySelector(target);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 3D Mouse Tracking for Interactive Elements
function init3DMouseTracking() {
    const cards = document.querySelectorAll('.property-card-3d, .service-card-3d');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// 3D Parallax Scrolling Effect
function init3DParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-building, .floating-icon');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// 3D Building Animation Controller
function init3DBuildingAnimation() {
    const buildings = document.querySelectorAll('.floating-building');
    
    buildings.forEach((building, index) => {
        // Add random rotation and scale variations
        const randomRotation = Math.random() * 10 - 5;
        const randomScale = 0.8 + Math.random() * 0.4;
        
        building.style.transform = `rotateZ(${randomRotation}deg) scale(${randomScale})`;
        
        // Add click interaction
        building.addEventListener('click', () => {
            building.style.animation = 'none';
            building.style.transform += ' scale(1.2) rotateY(180deg)';
            
            setTimeout(() => {
                building.style.animation = 'buildingFloat 8s ease-in-out infinite';
                building.style.transform = `rotateZ(${randomRotation}deg) scale(${randomScale})`;
            }, 1000);
        });
    });
}

// 3D Card Stack Effect
function init3DCardStack() {
    const propertyCards = document.querySelectorAll('.property-card-3d');
    
    propertyCards.forEach((card, index) => {
        // Stagger the cards with different z-depths
        card.style.transform = `translateZ(${index * -5}px)`;
        card.style.transitionDelay = `${index * 0.1}s`;
        
        // Add hover depth effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = `translateZ(${index * -5 + 20}px) rotateX(5deg) rotateY(5deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `translateZ(${index * -5}px)`;
        });
    });
}

// 3D Navigation Tilt Effect
function init3DNavigation() {
    const navbar = document.querySelector('.navbar-3d');
    
    if (navbar) {
        navbar.addEventListener('mousemove', (e) => {
            const rect = navbar.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            navbar.style.transform = `translateY(-2px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        navbar.addEventListener('mouseleave', () => {
            navbar.style.transform = '';
        });
    }
}

// 3D Service Icon Rotation
function init3DServiceIcons() {
    const serviceIcons = document.querySelectorAll('.service-icon-3d');
    
    serviceIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'translateZ(20px) rotateY(360deg) scale(1.2)';
            icon.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = '';
        });
    });
}



// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DARIK HOMES 3D Website Initializing...');
    
    displayProperties();
    
    // Initialize hero slider
    if (slides.length > 0) {
        showSlide(0);
    }
    
    // Setup simple animations
    setupScrollAnimations();
    setupCounterAnimations();
    
    // Debug 3D elements
    console.log('🏗️ Checking 3D elements...');
    const floatingBuildings = document.querySelectorAll('.floating-building');
    const propertyCards = document.querySelectorAll('.property-card-3d');
    const serviceCards = document.querySelectorAll('.service-card-3d');
    
    console.log(`Found ${floatingBuildings.length} floating buildings`);
    console.log(`Found ${propertyCards.length} 3D property cards`);
    console.log(`Found ${serviceCards.length} 3D service cards`);
    
    // Initialize 3D effects
    console.log('🎨 Initializing 3D effects...');
    try {
        init3DMouseTracking();
        console.log('✅ 3D Mouse tracking initialized');
        
        init3DParallax();
        console.log('✅ 3D Parallax initialized');
        
        init3DBuildingAnimation();
        console.log('✅ 3D Building animation initialized');
        
        init3DCardStack();
        console.log('✅ 3D Card stack initialized');
        
        init3DNavigation();
        console.log('✅ 3D Navigation initialized');
        
        init3DServiceIcons();
        console.log('✅ 3D Service icons initialized');
        
        console.log('🎉 All 3D effects initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing 3D effects:', error);
    }
    
    // Add smooth scroll to navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            smoothScrollTo(target);
        });
    });
    
    // Test 3D support
    const testEl = document.createElement('div');
    testEl.style.transform = 'translateZ(0)';
    const supports3D = testEl.style.transform !== '';
    console.log(`3D Support: ${supports3D ? '✅ Supported' : '❌ Not supported'}`);
    
    if (!supports3D) {
        console.warn('⚠️ 3D transforms may not be supported in this browser');
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.property-card, .about-content, .contact-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Property comparison functionality
let comparisonList = [];

function addToComparison(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (comparisonList.length < 3 && !comparisonList.find(p => p.id === propertyId)) {
        comparisonList.push(property);
        updateComparisonUI();
    } else if (comparisonList.length >= 3) {
        alert('You can compare up to 3 properties at once.');
    } else {
        alert('This property is already in your comparison list.');
    }
}

function removeFromComparison(propertyId) {
    comparisonList = comparisonList.filter(p => p.id !== propertyId);
    updateComparisonUI();
}

function updateComparisonUI() {
    // This would update a comparison panel if implemented
    console.log('Comparison list updated:', comparisonList);
}

// Favorites functionality
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function toggleFavorite(propertyId) {
    const index = favorites.indexOf(propertyId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(propertyId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButtons();
}

function updateFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const propertyId = parseInt(btn.dataset.propertyId);
        if (favorites.includes(propertyId)) {
            btn.innerHTML = '<i class="fas fa-heart"></i>';
            btn.classList.add('favorited');
        } else {
            btn.innerHTML = '<i class="far fa-heart"></i>';
            btn.classList.remove('favorited');
        }
    });
}

// Initialize favorites on page load
document.addEventListener('DOMContentLoaded', () => {
    updateFavoriteButtons();
});

// Advanced search with multiple criteria
function advancedSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const typeFilter = propertyType.value;
    const priceFilter = priceRange.value;
    const bedroomFilter = bedrooms.value;

    let filteredProperties = properties;

    // Text search
    if (searchTerm) {
        filteredProperties = filteredProperties.filter(property => 
            property.title.toLowerCase().includes(searchTerm) ||
            property.location.toLowerCase().includes(searchTerm) ||
            property.description.toLowerCase().includes(searchTerm)
        );
    }

    // Apply other filters
    if (typeFilter) {
        filteredProperties = filteredProperties.filter(property => property.type === typeFilter);
    }

    if (priceFilter) {
        const [minPrice, maxPrice] = priceFilter.split('-').map(Number);
        filteredProperties = filteredProperties.filter(property => {
            if (maxPrice === 999999999) {
                return property.price >= minPrice;
            }
            return property.price >= minPrice && property.price <= maxPrice;
        });
    }

    if (bedroomFilter) {
        filteredProperties = filteredProperties.filter(property => property.bedrooms >= parseInt(bedroomFilter));
    }

    displayProperties(filteredProperties);
}

// Update the search and filter functions to use advanced search
searchInput.addEventListener('input', advancedSearch);
propertyType.addEventListener('change', advancedSearch);
priceRange.addEventListener('change', advancedSearch);
bedrooms.addEventListener('change', advancedSearch);

// Newsletter subscription functions
function subscribeFooterNewsletter() {
    const email = document.getElementById('footerNewsletterEmail').value;
    if (email) {
        alert('Thank you for subscribing to our newsletter! You\'ll receive the latest Abuja real estate updates from DARIK HOMES LTD.');
        document.getElementById('footerNewsletterEmail').value = '';
    } else {
        alert('Please enter a valid email address.');
    }
}

function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmailCta').value;
    if (email) {
        alert('Thank you for subscribing to our newsletter! You\'ll receive the latest Abuja real estate updates from DARIK HOMES LTD.');
        document.getElementById('newsletterEmailCta').value = '';
    } else {
        alert('Please enter a valid email address.');
    }
}

// About Us Page Interactive Functions
function showConstructionProcess() {
    alert('🚧 Construction Process:\n\n1. Planning & Design\n2. Foundation & Structure\n3. Finishing & Details\n\nContact us to learn more about our construction process!');
}

function showProjectGallery() {
    alert('📸 Project Gallery:\n\nView our completed projects and ongoing construction sites. Contact us to schedule a site visit!');
}

function changeShowcase(index) {
    const showcaseItems = document.querySelectorAll('.showcase-item');
    const controlBtns = document.querySelectorAll('.control-btn');
    
    showcaseItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    controlBtns.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
}

function animateValueCard(card) {
    card.style.transform = 'scale(1.05)';
    card.style.boxShadow = '0 20px 40px rgba(230, 126, 34, 0.3)';
    
    setTimeout(() => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    }, 300);
}

function showProcessDetail(stepIndex) {
    const steps = ['Planning & Design', 'Foundation & Structure', 'Finishing & Details'];
    const details = [
        'Our planning phase includes site analysis, architectural design, and permit acquisition.',
        'We build strong foundations with quality materials and structural engineering expertise.',
        'Final touches include electrical work, plumbing, and interior/exterior finishing.'
    ];
    
    alert(`🔨 ${steps[stepIndex]}:\n\n${details[stepIndex]}\n\nContact us to learn more about this phase!`);
}

function animateStat(statElement) {
    const statNumber = statElement.querySelector('.stat-number');
    const target = parseInt(statNumber.getAttribute('data-target'));
    const progressBar = statElement.querySelector('.progress-bar');
    
    let current = 0;
    const increment = target / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        statNumber.textContent = Math.floor(current);
    }, 30);
    
    // Animate progress bar
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 500);
}

// Counter animation for hero stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 30);
    });
}

// Company Profile Interactive Functions
function showCompanyDetails() {
    alert('🏢 Company Details:\n\n• Founded: 2019\n• Registration: RC: 1633288\n• 7+ Years of Excellence\n• 50+ Projects Completed\n• Leading Real Estate Developer in Nigeria\n\nContact us to learn more about our company history!');
}

function showLocationDetails() {
    alert('📍 Headquarters Location:\n\nPlot 797 Cadastral Zone B11\nKaura District, FCT Abuja\nNigeria\n\nRegistration: RC: 1633288\n\nVisit our headquarters or contact us for directions!');
}

function showContactOptions() {
    alert('📞 Contact Options:\n\n📱 Phone: +2348063264491\n📱 Phone: +2348057857418\n📧 Email: bldrbabs309@gmail.com\n\nChoose your preferred contact method!');
}

function animateStat(element) {
    const statNumber = element.querySelector('.stat-number');
    const target = parseInt(statNumber.getAttribute('data-target'));
    const statDetails = element.querySelector('.stat-details');
    
    // Animate the number
    let current = 0;
    const increment = target / 30;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        statNumber.textContent = Math.floor(current);
    }, 50);
    
    // Show details
    if (statDetails) {
        statDetails.style.opacity = '1';
        statDetails.style.transform = 'translateY(0)';
    }
    
    // Add hover effect
    element.style.transform = 'scale(1.05)';
    element.style.boxShadow = '0 15px 35px rgba(230, 126, 34, 0.3)';
}

function resetStat(element) {
    const statDetails = element.querySelector('.stat-details');
    
    // Hide details
    if (statDetails) {
        statDetails.style.opacity = '0';
        statDetails.style.transform = 'translateY(10px)';
    }
    
    // Reset hover effect
    element.style.transform = 'scale(1)';
    element.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
}

// Professional Interactive Functions
function bounceTitle(element) {
    element.style.animation = 'subtleBounce 0.4s ease-in-out';
    element.style.color = '#e67e22';
    setTimeout(() => {
        element.style.animation = '';
        element.style.color = '';
    }, 400);
}

function stopBounce(element) {
    element.style.animation = '';
    element.style.color = '';
}

function wiggleButton(element) {
    element.style.animation = 'gentleHover 0.3s ease-in-out';
    element.style.transform = 'translateY(-2px)';
}

function stopWiggle(element) {
    element.style.animation = '';
    element.style.transform = '';
}

function professionalHover(element) {
    element.style.animation = 'gentleHover 0.3s ease-in-out';
    element.style.color = '#e67e22';
}

function stopProfessionalHover(element) {
    element.style.animation = '';
    element.style.color = '';
}

function pulseElement(element) {
    element.style.animation = 'professionalPulse 0.6s ease-in-out';
}

function stopPulse(element) {
    element.style.animation = '';
}

// Professional hover effects for cards
function addFunHover() {
    const cards = document.querySelectorAll('.property-card, .info-card, .overview-card');
    cards.forEach(card => {
        card.classList.add('fun-card');
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

// Fun click effects
function addClickEffects() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Fun scroll animations
function addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'pulse 0.6s ease-in-out';
                setTimeout(() => {
                    entry.target.style.animation = '';
                }, 600);
            }
        });
    });
    
    const elements = document.querySelectorAll('.property-card, .info-card, .stat-card');
    elements.forEach(el => observer.observe(el));
}

// Initialize About Us page animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate hero counters on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
    
    // Auto-rotate showcase
    let currentShowcase = 0;
    const showcaseItems = document.querySelectorAll('.showcase-item');
    const controlBtns = document.querySelectorAll('.control-btn');
    
    if (showcaseItems.length > 0) {
        setInterval(() => {
            currentShowcase = (currentShowcase + 1) % showcaseItems.length;
            changeShowcase(currentShowcase);
        }, 5000);
    }
    
    // Initialize interactive stats
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        const statDetails = card.querySelector('.stat-details');
        if (statDetails) {
            statDetails.style.opacity = '0';
            statDetails.style.transform = 'translateY(10px)';
            statDetails.style.transition = 'all 0.3s ease';
        }
    });
    
    // Initialize fun interactive features
    addFunHover();
    addClickEffects();
    addScrollAnimations();
    
    // Add professional hover effects to titles
    const titles = document.querySelectorAll('h1, h2, h3');
    titles.forEach(title => {
        title.addEventListener('mouseenter', function() {
            if (!this.classList.contains('fun-title')) {
                professionalHover(this);
            }
        });
        title.addEventListener('mouseleave', function() {
            stopProfessionalHover(this);
        });
    });
    
    // Add floating particles effect
    createFloatingParticles();
});

// Professional floating elements
function createFloatingParticles() {
    const particles = ['🏗️', '🏠', '🔨', '🏡'];
    const hero = document.querySelector('.hero');
    
    if (hero) {
        for (let i = 0; i < 4; i++) {
            const particle = document.createElement('div');
            particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
            particle.style.position = 'absolute';
            particle.style.fontSize = '1.2rem';
            particle.style.opacity = '0.3';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animation = `subtleFloat ${6 + Math.random() * 4}s ease-in-out infinite`;
            particle.style.animationDelay = Math.random() * 3 + 's';
            
            hero.appendChild(particle);
        }
    }
}
