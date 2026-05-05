/**
 * Aqtive Water - Premium Redesign Script
 * Handles Animations, Navbar, Cart, and Interactivity
 */

// 1. Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
});

// 2. Navbar Scroll Behavior
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to Top Visibility
    const backToTop = document.getElementById('backToTop');
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

// 3. Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    // Prevent body scroll when menu is open
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// 4. Cart Drawer Logic
const cartToggle = document.getElementById('cartToggle');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');

function toggleCart() {
    cartDrawer.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartDrawer.classList.contains('active') ? 'hidden' : '';
}

if (cartToggle) cartToggle.addEventListener('click', toggleCart);
if (closeCart) closeCart.addEventListener('click', toggleCart);
if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

// 5. Shopping Cart State & UI
let cart = JSON.parse(localStorage.getItem('aqtive_cart')) || [];

function updateCartUI() {
    // Update count badge
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) cartCount.innerText = totalQty;
    
    // Update drawer body
    const cartBody = document.getElementById('cartItemsList');
    if (!cartBody) return;
    
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="empty-cart" style="text-align:center; padding: 50px 20px;">
                <p style="color:#666; margin-bottom:20px;">Your hydration bag is empty.</p>
                <a href="#products" class="btn-primary" onclick="toggleCart()">Browse Products</a>
            </div>
        `;
        document.querySelector('.cart-total span:last-child').innerText = '₹0.00';
    } else {
        cartBody.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price} x ${item.qty}</p>
                    <span class="cart-item-remove" onclick="removeFromCart(${index})">Remove Item</span>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const totalDisplay = document.getElementById('cartTotalAmount');
        if (totalDisplay) totalDisplay.innerText = `₹${total.toFixed(2)}`;
    }
    
    localStorage.setItem('aqtive_cart', JSON.stringify(cart));
}

window.addToCart = function(name, price, img) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price: parseFloat(price), img, qty: 1 });
    }
    updateCartUI();
    if (!cartDrawer.classList.contains('active')) toggleCart();
};

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
};

// Bind Add to Cart buttons
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const { name, price, img } = e.target.dataset;
        window.addToCart(name, price, img);
    });
});

// 6. CountUp.js Initialization
function initCounters() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        // Robust initialization
        let counterInstance;
        if (typeof countUp !== 'undefined' && countUp.CountUp) {
            counterInstance = new countUp.CountUp(stat, target, {
                duration: 2.5,
                useEasing: true,
                useGrouping: true,
                suffix: '+'
            });
        } else if (typeof CountUp !== 'undefined') {
            counterInstance = new CountUp(stat, target, {
                duration: 2.5,
                useEasing: true,
                useGrouping: true,
                suffix: '+'
            });
        }
        
        // Start when in view
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (counterInstance) {
                    counterInstance.start();
                } else {
                    stat.innerText = target + '+';
                }
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        
        observer.observe(stat);
    });
}

// Back to Top Action
const btt = document.getElementById('backToTop');
if (btt) {
    btt.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 8. Carousel Infinite Loop logic
function initCarouselLoop() {
    const track = document.getElementById('carouselTrack');
    if (track) {
        // Clone the content to create seamless infinite loop
        const content = track.innerHTML;
        track.innerHTML = content + content;
    }
}

// 7. Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    initCarouselLoop();
    initCounters();
});
