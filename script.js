// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = mobileMenu.querySelectorAll('a');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[1].style.transform = 'translateX(20px)';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -7px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[1].style.transform = 'none';
        spans[2].style.transform = 'none';
    }
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[1].style.transform = 'none';
        spans[2].style.transform = 'none';
    });
});

// Scroll Reveal Animation
const reveals = document.querySelectorAll('.reveal');
const observerOptions = {
    threshold: 0.1
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            if (entry.target.querySelector('.stat-number')) {
                startCounter(entry.target.querySelector('.stat-number'));
            }
        }
    });
}, observerOptions);

reveals.forEach(reveal => {
    revealObserver.observe(reveal);
});

// Stat Counter Animation
function startCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = "true";
    
    const target = +el.dataset.target;
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCount = () => {
        current += increment;
        if (current < target) {
            el.innerHTML = Math.floor(current) + '<span>+</span>';
            requestAnimationFrame(updateCount);
        } else {
            el.innerHTML = target + '<span>+</span>';
        }
    };
    updateCount();
}

// Active Nav Link & Scroll Behavior
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    // Nav background on scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });

    // Back to top visibility
    const backToTop = document.getElementById('backToTop');
    if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Shopping Cart Logic
let cart = JSON.parse(localStorage.getItem('aqtive_cart')) || [];
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const cartItemsList = document.getElementById('cartItemsList');
const cartCount = document.getElementById('cartCount');
const cartTotalAmount = document.getElementById('cartTotalAmount');
const checkoutBtn = document.getElementById('checkoutBtn');

function updateCartUI() {
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;
    
    // Update list
    if (cart.length === 0) {
        cartItemsList.innerHTML = `<div style="text-align: center; margin-top: 50px; color: var(--text-muted);">Your cart is empty</div>`;
        cartTotalAmount.innerText = `₹ 0.00`;
    } else {
        cartItemsList.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹ ${item.price} x ${item.quantity}</p>
                    <span class="cart-item-remove" onclick="removeFromCart(${index})">Remove</span>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalAmount.innerText = `₹ ${total.toFixed(2)}`;
    }
    
    localStorage.setItem('aqtive_cart', JSON.stringify(cart));
}

function addToCart(name, price, img) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price: parseFloat(price), img, quantity: 1 });
    }
    updateCartUI();
    openCart();
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
};

function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
}

function closeCartDrawer() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
}

cartToggle.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartDrawer);
cartOverlay.addEventListener('click', closeCartDrawer);

// Add to Cart Button Listeners
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const price = btn.dataset.price;
        const img = btn.dataset.img;
        addToCart(name, price, img);
    });
});

// Checkout via WhatsApp
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return alert('Your cart is empty');
    
    let message = `*New Order from Aqtive Water Website*%0A%0A`;
    cart.forEach(item => {
        message += `- ${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}%0A`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `%0A*Total Amount: ₹${total.toFixed(2)}*%0A%0APlease confirm my order.`;
    
    const whatsappUrl = `https://wa.me/916291212441?text=${message}`;
    window.open(whatsappUrl, '_blank');
});

// Initial UI Update
updateCartUI();

// Carousel Infinite Duplicate (ensure smooth loop)
const track = document.getElementById('carouselTrack');
if (track) {
    const items = track.innerHTML;
    track.innerHTML += items;
}

const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
    const marqueeItems = marqueeTrack.innerHTML;
    marqueeTrack.innerHTML += marqueeItems;
}
