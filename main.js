/* ==========================================================================
   .orologio - Luxury Watch Store Interaction Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initAccordions();
    initTestimonials();
    initFilters();
    initCustomizer();
    initPricingToggle();
    initBookingForm();
    initLoginTabs();
    initCartCounter();
    initScrollToTop();
    initAOS();
    initGSAPAnimations();
    initHeroCanvas();
    initHeroParallax();
    initBackgroundGears();
    init3DTiltCards();
    initRoleSelector();
    initDashboardTabs();
    loadUserProfile();
    initMobileMenu();
    initDashboardMobileMenu();
});

/* --------------------------------------------------------------------------
   Header scroll background transition
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* --------------------------------------------------------------------------
   Accordion component (Craftsmanship & FAQ)
   -------------------------------------------------------------------------- */
function initAccordions() {
    const accordions = document.querySelectorAll('.accordion-item');

    accordions.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (!header) return;

        header.addEventListener('click', () => {
            const parent = item.parentElement;
            const activeItem = parent.querySelector('.accordion-item.active');

            if (activeItem && activeItem !== item) {
                activeItem.classList.remove('active');
            }

            item.classList.toggle('active');
        });
    });
}

/* --------------------------------------------------------------------------
   Testimonials Slider
   -------------------------------------------------------------------------- */
function initTestimonials() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        currentSlide = index;
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetTimer();
        });
    });

    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function startTimer() {
        slideInterval = setInterval(nextSlide, 6000);
    }

    function resetTimer() {
        clearInterval(slideInterval);
        startTimer();
    }

    startTimer();
}

/* --------------------------------------------------------------------------
   Collection Filtering & Sorting
   -------------------------------------------------------------------------- */
function initFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const watchCards = document.querySelectorAll('.watch-card');
    const sortSelect = document.querySelector('.sort-select');
    
    if (watchCards.length === 0) return;

    // Filter Logic
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            watchCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Trigger reflow for animation
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Simple sorting mockup
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const grid = document.querySelector('.featured-grid');
            const cardsArray = Array.from(watchCards);
            const sortBy = sortSelect.value;

            if (sortBy === 'price-low') {
                cardsArray.sort((a, b) => getPrice(a) - getPrice(b));
            } else if (sortBy === 'price-high') {
                cardsArray.sort((a, b) => getPrice(b) - getPrice(a));
            } else {
                // Default sorting (Featured)
                cardsArray.sort((a, b) => a.getAttribute('data-id') - b.getAttribute('data-id'));
            }

            // Re-append items sorted
            cardsArray.forEach(card => grid.appendChild(card));
        });
    }

    function getPrice(cardElement) {
        const priceStr = cardElement.querySelector('.price').textContent;
        return parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    }
}

/* --------------------------------------------------------------------------
   Interactive Watch Customizer
   -------------------------------------------------------------------------- */
function initCustomizer() {
    const colorDots = document.querySelectorAll('.color-dot');
    const customizerImage = document.querySelector('.customizer-base');
    const accentElements = document.querySelectorAll('.customizer-accent-text');

    if (!customizerImage || colorDots.length === 0) return;

    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');

            const color = dot.getAttribute('data-color');
            let imageSrc = 'assets/model-classic.webp';
            let colorName = 'Classic Gold';
            let description = 'Crafted in 18k gold with hand-finished black leather strap.';

            if (color === 'silver') {
                imageSrc = 'assets/model-chrono.webp';
                colorName = 'Chronograph Steel';
                description = 'Premium brush-finished oystersteel with water-resistant dial.';
            } else if (color === 'black') {
                imageSrc = 'assets/model-eclipse.webp';
                colorName = 'Eclipse Matte Black';
                description = 'Coated in DLC (Diamond-Like Carbon) matte finish on grade 5 titanium.';
            } else if (color === 'bronze') {
                imageSrc = 'assets/model-minimalist.webp';
                colorName = 'Minimalist Rose Gold';
                description = 'Polished 18k rose gold casing combined with a hand-stitched beige calfskin.';
            }

            // Animate transition
            customizerImage.style.opacity = '0';
            customizerImage.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                customizerImage.src = imageSrc;
                customizerImage.style.opacity = '1';
                customizerImage.style.transform = 'scale(1)';
                
                if (accentElements[0]) accentElements[0].textContent = colorName;
                if (accentElements[1]) accentElements[1].textContent = description;
            }, 350);
        });
    });
}

/* --------------------------------------------------------------------------
   Service Rates Toggle (Packages)
   -------------------------------------------------------------------------- */
function initPricingToggle() {
    const toggleBtn = document.querySelector('.toggle-switch');
    const pricingToggleBtns = document.querySelectorAll('.pricing-toggle-btn');
    const priceElements = document.querySelectorAll('.pricing-price-val');
    const pricingCycle = document.querySelectorAll('.pricing-cycle');

    if (!toggleBtn) return;

    function togglePricing(isAnnual) {
        if (isAnnual) {
            toggleBtn.classList.add('active');
            pricingToggleBtns[1].classList.add('active');
            pricingToggleBtns[0].classList.remove('active');
            
            // Mock annual discount rates
            priceElements[0].textContent = '$280';
            priceElements[1].textContent = '$590';
            priceElements[2].textContent = '$1,190';
            
            pricingCycle.forEach(el => el.textContent = '/ annual care');
        } else {
            toggleBtn.classList.remove('active');
            pricingToggleBtns[0].classList.add('active');
            pricingToggleBtns[1].classList.remove('active');
            
            priceElements[0].textContent = '$350';
            priceElements[1].textContent = '$750';
            priceElements[2].textContent = '$1,500';
            
            pricingCycle.forEach(el => el.textContent = '/ single service');
        }
    }

    toggleBtn.addEventListener('click', () => {
        const isAnnual = !toggleBtn.classList.contains('active');
        togglePricing(isAnnual);
    });

    pricingToggleBtns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            togglePricing(idx === 1);
        });
    });
}

/* --------------------------------------------------------------------------
   Service Booking Form & Modal
   -------------------------------------------------------------------------- */
function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic inputs
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const watchModel = document.getElementById('watch-model').value;
        const serviceType = document.getElementById('service-type').value;

        if (!name || !email || !watchModel || !serviceType) {
            return;
        }

        // Transition booking form inline to show success instead of popup modal
        const wrapper = bookingForm.closest('.booking-form-wrapper');
        if (wrapper) {
            bookingForm.style.opacity = '0';
            bookingForm.style.transition = 'opacity 0.4s ease';
            
            setTimeout(() => {
                wrapper.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px; animation: fadeIn 0.6s ease forwards;">
                        <div style="font-size: 3.5rem; color: var(--accent-gold); margin-bottom: 25px;"><i class="fa-solid fa-circle-check"></i></div>
                        <h3 style="margin-bottom: 15px; font-size: 1.8rem; font-family: var(--font-heading);">Reservation Confirmed</h3>
                        <p style="margin-bottom: 30px; font-size: 0.95rem; color: var(--text-secondary); max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.6;">
                            Dear ${name}, your booking request for the <strong>${serviceType}</strong> on your <strong>${watchModel}</strong> has been received. A courier link and instructions have been sent to <strong>${email}</strong>.
                        </p>
                        <button class="btn-primary" id="resetBookingBtn" style="padding: 12px 35px;">Book Another Service</button>
                    </div>
                `;
                
                document.getElementById('resetBookingBtn').addEventListener('click', () => {
                    location.reload();
                });
            }, 400);
        }
    });
}

/* --------------------------------------------------------------------------
   Login & Signup Switcher
   -------------------------------------------------------------------------- */
function initLoginTabs() {
    const tabBtns = document.querySelectorAll('.login-tab-btn');
    const formContainers = document.querySelectorAll('.login-form-container');

    if (tabBtns.length === 0) return;

    tabBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            formContainers.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            formContainers[index].classList.add('active');
        });
    });

    // Check for registration success parameters and display inline notice
    if (window.location.search.includes('registered=true')) {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'inline-alert success';
            alertDiv.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
            alertDiv.style.border = '1px solid var(--accent-gold)';
            alertDiv.style.color = 'var(--accent-gold)';
            alertDiv.style.padding = '12px 15px';
            alertDiv.style.borderRadius = '6px';
            alertDiv.style.fontSize = '0.9rem';
            alertDiv.style.marginBottom = '20px';
            alertDiv.style.textAlign = 'center';
            alertDiv.style.width = '100%';
            alertDiv.textContent = 'Account created successfully! Please sign in below.';
            
            loginForm.insertBefore(alertDiv, loginForm.firstChild);
        }
    }
}

/* --------------------------------------------------------------------------
   Interactive Cart Drawer System
   -------------------------------------------------------------------------- */
let cart = [];

function initCartCounter() {
    const cartIcon = document.querySelector('.cart-badge');
    const addToCartBtns = document.querySelectorAll('.btn-add-to-cart');

    // Inject drawer html layout
    injectCartDrawer();
    loadCart();
    updateCartUI();
    initCartDrawerEvents();

    if (addToCartBtns.length === 0) return;

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const item = resolveItemDetails(btn);
            const priceVal = parseFloat(item.priceStr.replace(/[^0-9.]/g, ''));

            const existingItem = cart.find(i => i.id === item.id);
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({
                    id: item.id,
                    title: item.title,
                    collection: item.collection,
                    priceStr: item.priceStr,
                    priceVal: priceVal,
                    imgSrc: item.imgStyleSrc,
                    qty: 1
                });
            }

            saveCart();
            updateCartUI();

            // Small pop animation for cart icon
            if (cartIcon) {
                cartIcon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    cartIcon.style.transform = 'scale(1)';
                }, 200);
            }

            // Open the drawer automatically
            const overlay = document.getElementById('cartDrawerOverlay');
            if (overlay) {
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            // Temporarily change button state to show added
            const originalText = btn.textContent;
            btn.textContent = 'Added to Selection';
            btn.style.borderColor = 'var(--accent-gold)';
            btn.style.color = 'var(--accent-gold)';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.borderColor = 'var(--border-light)';
                btn.style.color = 'var(--text-primary)';
                btn.disabled = false;
            }, 1500);
        });
    });
}

function injectCartDrawer() {
    if (document.getElementById('cartDrawerOverlay')) return;

    const drawerHTML = `
        <div class="cart-drawer-overlay" id="cartDrawerOverlay">
            <div class="cart-drawer">
                <div class="cart-drawer-header">
                    <h3>Your Selection</h3>
                    <button class="cart-drawer-close" id="cartDrawerClose">&times;</button>
                </div>
                <div class="cart-drawer-body" id="cartDrawerBody">
                    <!-- Dynamic Cart Items -->
                </div>
                <div class="cart-drawer-footer">
                    <div class="cart-subtotal">
                        <span>Subtotal</span>
                        <span class="cart-subtotal-val">$0.00</span>
                    </div>
                    <button class="btn-primary checkout-btn" id="checkoutBtn" disabled>Proceed to Secure Checkout</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', drawerHTML);
}

function initCartDrawerEvents() {
    const cartIcon = document.querySelector('.cart-badge');
    const overlay = document.getElementById('cartDrawerOverlay');
    const closeBtn = document.getElementById('cartDrawerClose');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cartIcon) {
        cartIcon.style.cursor = 'pointer';
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            window.location.href = '404.html';
        });
    }
}

function resolveItemDetails(btn) {
    let title = "Stackly Timepiece";
    let collection = "Signature Series";
    let priceStr = "$1,200.00";
    let imgStyleSrc = "assets/model-classic.webp";
    let id = "default";

    const watchCard = btn.closest('.watch-card');
    if (watchCard) {
        title = watchCard.querySelector('h4').textContent;
        collection = watchCard.querySelector('.collection-name').textContent;
        priceStr = watchCard.querySelector('.price').textContent;
        imgStyleSrc = watchCard.querySelector('img').getAttribute('src');
        id = watchCard.getAttribute('data-id') || title.replace(/\s+/g, '-').toLowerCase();
        return { id, title, collection, priceStr, imgStyleSrc };
    }

    const spotlight = btn.closest('.spotlight');
    if (spotlight) {
        title = spotlight.querySelector('.section-title').textContent;
        collection = "Limited Edition";
        priceStr = "$2,400.00";
        const img = spotlight.querySelector('.spotlight-watch img');
        if (img) imgStyleSrc = img.getAttribute('src');
        id = "eclipse-spotlight";
        return { id, title, collection, priceStr, imgStyleSrc };
    }

    const customizer = btn.closest('.customizer') || btn.closest('.customizer-workspace');
    if (customizer) {
        const titleEl = customizer.querySelector('.customizer-accent-text');
        title = titleEl ? titleEl.textContent : "Custom Assembly";
        collection = "Customized";
        if (title.includes("Steel")) priceStr = "$1,850.00";
        else if (title.includes("Black") || title.includes("Eclipse")) priceStr = "$2,400.00";
        else if (title.includes("Rose") || title.includes("Minimalist")) priceStr = "$1,200.00";
        else priceStr = "$1,450.00";

        const img = customizer.querySelector('.customizer-base');
        if (img) imgStyleSrc = img.getAttribute('src');
        id = "custom-" + title.replace(/\s+/g, '-').toLowerCase();
        return { id, title, collection, priceStr, imgStyleSrc };
    }

    const combo = btn.closest('.combinations') || btn.closest('.combo-display');
    if (combo) {
        title = combo.querySelector('.combo-total h3').textContent;
        collection = "Special Bundle";
        priceStr = combo.querySelector('.combo-price').textContent;
        const img = combo.querySelector('.combo-part img');
        if (img) imgStyleSrc = img.getAttribute('src');
        id = "bundle-heritage";
        return { id, title, collection, priceStr, imgStyleSrc };
    }

    return { id, title, collection, priceStr, imgStyleSrc };
}

function saveCart() {
    localStorage.setItem('stackly_cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('stackly_cart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            cart = [];
        }
    }
}

function updateCartUI() {
    const cartBody = document.getElementById('cartDrawerBody');
    const cartBadge = document.querySelector('.cart-badge');
    const subtotalValEl = document.querySelector('.cart-subtotal-val');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (!cartBody) return;

    let totalItems = 0;
    let subtotal = 0;
    cart.forEach(item => {
        totalItems += item.qty;
        subtotal += item.priceVal * item.qty;
    });

    if (cartBadge) {
        cartBadge.setAttribute('data-count', totalItems);
    }

    if (subtotalValEl) {
        subtotalValEl.textContent = `$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }

    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty-message">
                <p>Your cart is empty.</p>
                <a href="collection.html" class="btn-secondary" style="margin-top: 20px;">Explore Collection</a>
            </div>
        `;
        return;
    }

    cartBody.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-img-wrapper">
                <img src="${item.imgSrc}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <span class="cart-item-collection">${item.collection}</span>
                <div class="cart-item-qty-controls">
                    <button class="cart-item-qty-btn qty-decrease" data-id="${item.id}">-</button>
                    <span class="cart-item-qty-val">${item.qty}</span>
                    <button class="cart-item-qty-btn qty-increase" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="cart-item-price-remove">
                <span class="cart-item-price">$${(item.priceVal * item.qty).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span class="cart-item-remove" data-id="${item.id}">Remove</span>
            </div>
        </div>
    `).join('');

    cartBody.querySelectorAll('.qty-decrease').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const item = cart.find(i => i.id === id);
            if (item) {
                item.qty -= 1;
                if (item.qty <= 0) {
                    cart = cart.filter(i => i.id !== id);
                }
                saveCart();
                updateCartUI();
            }
        });
    });

    cartBody.querySelectorAll('.qty-increase').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const item = cart.find(i => i.id === id);
            if (item) {
                item.qty += 1;
                saveCart();
                updateCartUI();
            }
        });
    });

    cartBody.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            cart = cart.filter(i => i.id !== id);
            saveCart();
            updateCartUI();
        });
    });
}

function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (!scrollToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.pointerEvents = 'auto';
            scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.pointerEvents = 'none';
            scrollToTopBtn.style.transform = 'translateY(10px)';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* --------------------------------------------------------------------------
   AOS (Animate on Scroll) Initialization
   -------------------------------------------------------------------------- */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 120,
            delay: 50
        });
    }
}

/* --------------------------------------------------------------------------
   GSAP Transitions and Page Animations
   -------------------------------------------------------------------------- */
function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;

    // Hero Section Entrance Timeline
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroWatch = document.querySelector('.hero-watch-image');
    const heroDesc = document.querySelector('.hero-desc');
    const heroAction = document.querySelector('.hero-action');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (heroSubtitle) {
        tl.fromTo(heroSubtitle, { y: -35, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 });
    }
    if (heroTitle) {
        tl.fromTo(heroTitle, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4 }, "-=0.9");
    }
    if (heroWatch) {
        tl.fromTo(heroWatch, { y: 120, scale: 0.7, rotation: -12, opacity: 0 }, { y: 0, scale: 1, rotation: 0, opacity: 1, duration: 1.8, ease: 'back.out(1.4)' }, "-=1.1");
        
        // Continuous luxury floating animation
        gsap.to(heroWatch, {
            y: -18,
            rotation: 1,
            duration: 4.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });
    }
    if (heroDesc) {
        tl.fromTo(heroDesc, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2 }, "-=1.2");
    }
    if (heroAction) {
        tl.fromTo(heroAction, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2 }, "-=1.2");
    }

    // Pulsating background glows
    const glows = document.querySelectorAll('.hero-bg-glow');
    glows.forEach(glow => {
        gsap.to(glow, {
            scale: 1.15,
            opacity: 0.07,
            duration: 7,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });
    });
}

/* --------------------------------------------------------------------------
   Live Particles Canvas for Hero Section
   -------------------------------------------------------------------------- */
function initHeroCanvas() {
    const canvas = document.getElementById('heroParticles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    function resizeCanvas() {
        const rect = canvas.parentNode.getBoundingClientRect();
        width = canvas.width = rect.width;
        height = canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = 45;
    const colors = [
        'rgba(197, 168, 128, 0.15)', // light gold
        'rgba(212, 175, 55, 0.08)',  // deep gold
        'rgba(255, 255, 255, 0.08)'  // sheer white
    ];

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + Math.random() * 20;
            this.size = Math.random() * 2 + 0.8;
            this.speedY = -(Math.random() * 0.4 + 0.15);
            this.speedX = (Math.random() * 0.3 - 0.15);
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.6 + 0.2;
            this.fadeSpeed = 0.002 + Math.random() * 0.003;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            
            // Subtle fade-in when rising, fade-out near top
            if (this.y < height * 0.2) {
                this.opacity -= 0.005;
            }
            
            if (this.y < 0 || this.opacity <= 0) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(212, 175, 55, 0.3)';
            ctx.fill();
            ctx.restore();
        }
    }

    // Populate particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* --------------------------------------------------------------------------
   Hero Mouse Parallax Effect
   -------------------------------------------------------------------------- */
function initHeroParallax() {
    const hero = document.getElementById('hero');
    const watch = document.querySelector('.hero-watch-image');
    if (!hero || !watch || typeof gsap === 'undefined') return;

    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        const moveX = (clientX / width) - 0.5;
        const moveY = (clientY / height) - 0.5;

        // Animate elements with varying intensity for parallax depth
        gsap.to(watch, {
            x: moveX * 25,
            y: moveY * 25,
            rotation: moveX * 2,
            duration: 1.2,
            ease: "power2.out"
        });

        const title = document.querySelector('.hero-title');
        if (title) {
            gsap.to(title, {
                x: -moveX * 12,
                y: -moveY * 12,
                duration: 1.2,
                ease: "power2.out"
            });
        }
        
        const bgGlow = document.querySelector('.hero-bg-glow');
        if (bgGlow) {
            gsap.to(bgGlow, {
                x: moveX * 15 - (width * 0.25), // retain center offset
                y: moveY * 15 - (height * 0.25),
                duration: 1.8,
                ease: "power1.out"
            });
        }
    });

    hero.addEventListener('mouseleave', () => {
        gsap.to(watch, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 1.5,
            ease: "power3.out"
        });
        const title = document.querySelector('.hero-title');
        if (title) {
            gsap.to(title, {
                x: 0,
                y: 0,
                duration: 1.5,
                ease: "power3.out"
            });
        }
    });
}

/* --------------------------------------------------------------------------
   Scroll-linked Mechanical Gears Rotation
   -------------------------------------------------------------------------- */
function initBackgroundGears() {
    const gears = document.querySelectorAll('.bg-gear');
    if (gears.length === 0) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        gears.forEach((gear, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            const speed = 0.06 + (index * 0.03);
            const rotation = scrollY * speed * direction;
            gear.style.transform = `rotate(${rotation}deg)`;
        });
    });
}

/* --------------------------------------------------------------------------
   3D Tilt Card Interaction using GSAP
   -------------------------------------------------------------------------- */
function init3DTiltCards() {
    const cards = document.querySelectorAll('.watch-card, .care-card');
    if (typeof gsap === 'undefined' || cards.length === 0) return;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // cursor x relative to card
            const y = e.clientY - rect.top;  // cursor y relative to card
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate tilt angle: max 8 degrees tilt
            const rotateX = (centerY - y) / (centerY / 8); 
            const rotateY = (x - centerX) / (centerX / 8);
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                ease: "power2.out",
                duration: 0.4,
                boxShadow: "0 15px 30px rgba(212, 175, 55, 0.12)",
                borderColor: "rgba(212, 175, 55, 0.25)"
            });
            
            // Parallax shift for interior images or icons
            const img = card.querySelector('.watch-card-img-wrapper img, .care-card-icon');
            if (img) {
                gsap.to(img, {
                    x: (x - centerX) / 12,
                    y: (y - centerY) / 12,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                ease: "power3.out",
                duration: 0.6,
                boxShadow: "none",
                borderColor: "var(--border-light)"
            });
            
            const img = card.querySelector('.watch-card-img-wrapper img, .care-card-icon');
            if (img) {
                gsap.to(img, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "power3.out"
                });
            }
        });
    });
}

/* --------------------------------------------------------------------------
   Role Selection UI & Redirection Logic for Dashboards
   -------------------------------------------------------------------------- */
function initRoleSelector() {
    const roleSelectors = document.querySelectorAll('.role-selector');
    roleSelectors.forEach(selector => {
        const options = selector.querySelectorAll('.role-option');
        options.forEach(opt => {
            opt.addEventListener('click', () => {
                options.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                const radio = opt.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
            });
        });
    });

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const checkedRadio = loginForm.querySelector('input[name="login-role"]:checked');
            const selectedRole = checkedRadio ? checkedRadio.value : 'customer';
            const emailInput = loginForm.querySelector('#login-email');
            const email = emailInput ? emailInput.value : '';
            
            localStorage.setItem('stackly_email', email);
            localStorage.setItem('stackly_role', selectedRole);

            if (selectedRole === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'customer-dashboard.html';
            }
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const checkedRadio = registerForm.querySelector('input[name="login-role"]:checked');
            const selectedRole = checkedRadio ? checkedRadio.value : 'customer';
            const emailInput = registerForm.querySelector('#reg-email');
            const email = emailInput ? emailInput.value : '';

            localStorage.setItem('stackly_email', email);
            localStorage.setItem('stackly_role', selectedRole);

            // Redirect without popups
            window.location.href = 'login.html?registered=true';
        });
    }
}

/* --------------------------------------------------------------------------
   Dashboard Single Page Navigation (Tab Content Switcher)
   -------------------------------------------------------------------------- */
function initDashboardTabs() {
    const navLinks = document.querySelectorAll('.db-nav-link');
    if (navLinks.length === 0) return;

    const tabContents = document.querySelectorAll('.db-tab-content');
    if (tabContents.length === 0) return;

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();

                // 1. Set active nav class
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // 2. Hide all tabs, show target tab
                const targetId = href.substring(1); // e.g. "collection"
                tabContents.forEach(tab => {
                    tab.classList.remove('active');
                    if (tab.id === targetId || tab.id === `${targetId}-tab`) {
                        tab.classList.add('active');
                    }
                });

                // 3. Refresh AOS so layout animations play properly on active tabs
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }
        });
    });
}

/* --------------------------------------------------------------------------
   Profile Details Injection from Login Credentials
   -------------------------------------------------------------------------- */
function loadUserProfile() {
    const userPanel = document.querySelector('.db-user-panel');
    if (!userPanel) return;

    // Fallbacks based on layout name if localStorage is blank
    const isDashboardAdmin = window.location.pathname.includes('admin');
    const fallbackEmail = isDashboardAdmin ? 'director@stackly.ch' : 'alexander.vance@vip.com';
    const fallbackRole = isDashboardAdmin ? 'admin' : 'customer';

    const email = localStorage.getItem('stackly_email') || fallbackEmail;
    const role = localStorage.getItem('stackly_role') || fallbackRole;

    // 1. Update Avatar Initials (First 2 characters of email)
    const avatar = userPanel.querySelector('.db-avatar');
    if (avatar) {
        avatar.textContent = email.substring(0, 2).toUpperCase();
    }

    // 2. Update Name Element with Email
    const nameEl = userPanel.querySelector('.db-user-info h5');
    if (nameEl) {
        nameEl.textContent = email;
    }

    // 3. Update Subtitle Role Label
    const roleEl = userPanel.querySelector('.db-user-info span');
    if (roleEl) {
        roleEl.textContent = role === 'admin' ? 'Administrator' : 'Collector Profile';
    }
}

/* --------------------------------------------------------------------------
   Mobile Hamburger Navigation Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

/* --------------------------------------------------------------------------
   Dashboard Mobile Drawer Navigation Menu
   -------------------------------------------------------------------------- */
function initDashboardMobileMenu() {
    const menuToggle = document.querySelector('.db-menu-toggle');
    const sidebar = document.querySelector('.db-sidebar');
    const overlay = document.getElementById('dbSidebarOverlay');
    const closeBtn = document.querySelector('.db-sidebar-close');
    const navLinks = document.querySelectorAll('.db-nav-link');

    if (!menuToggle || !sidebar) return;

    function openMenu() {
        menuToggle.classList.add('active');
        sidebar.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menuToggle.classList.remove('active');
        sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', () => {
        if (sidebar.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }

    // Close sidebar when a dashboard navigation tab is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}


