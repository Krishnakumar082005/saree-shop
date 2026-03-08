/* main.js - Silk Sutra v2.0 */
document.addEventListener('DOMContentLoaded', function () {

    // ─── 1. Apply Global Settings from DB ───────────────────────────
    if (typeof DB !== 'undefined') {
        const s = DB.getSettings();

        // Store name
        document.querySelectorAll('.store-name').forEach(el => el.textContent = s.storeName);

        // Phone
        document.querySelectorAll('.store-phone').forEach(el => el.textContent = s.phone);
        document.querySelectorAll('.store-phone-link').forEach(el => el.href = 'tel:' + s.phone.replace(/[^0-9+]/g, ''));

        // Email
        document.querySelectorAll('.store-email').forEach(el => el.textContent = s.email);
        document.querySelectorAll('.store-email-link').forEach(el => el.href = 'mailto:' + s.email);

        // Address
        document.querySelectorAll('.store-address').forEach(el => el.textContent = s.address);

        // Currency
        document.querySelectorAll('.store-currency').forEach(el => el.textContent = s.currency);

        // Page title - prefix with store name
        if (document.title && !document.title.startsWith(s.storeName)) {
            const parts = document.title.split(' - ');
            if (parts.length > 1) {
                document.title = s.storeName + ' - ' + parts.slice(1).join(' - ');
            }
        }
    }

    // ─── 2. Cart Count ───────────────────────────────────────────────
    updateCartCount();

    // ─── 3. Add to Cart buttons (static HTML buttons, shop uses addToCart() directly) ─────
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const id    = this.dataset.id;
            const name  = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            const img   = this.dataset.img;
            addToCart({ id, name, price, img, qty: 1 });
        });
    });

    // ─── 4. Owl Carousel: New Arrivals ───────────────────────────────
    if (typeof $ !== 'undefined') {
        if ($('.new-arrivals-carousel').length) {
            $('.new-arrivals-carousel').owlCarousel({
                loop: true, margin: 20, nav: true, dots: false,
                responsive: { 0: { items: 1 }, 600: { items: 2 }, 1000: { items: 4 } },
                navText: ["<i class='fas fa-chevron-left'></i>", "<i class='fas fa-chevron-right'></i>"]
            });
        }

        // ─── 5. Owl Carousel: Testimonials ───────────────────────────────
        if ($('.testimonial-carousel').length) {
            $('.testimonial-carousel').owlCarousel({
                loop: true, margin: 30, nav: false, dots: true,
                responsive: { 0: { items: 1 }, 768: { items: 2 }, 1000: { items: 3 } }
            });
        }
    }
});

// ─── addToCart: global function used by all pages ─────────────────
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('silkSutraCart')) || [];
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push(product);
    }
    localStorage.setItem('silkSutraCart', JSON.stringify(cart));
    updateCartCount();

    // Toast-style notification
    showCartToast(product.name);
}

// ─── updateCartCount ─────────────────────────────────────────────
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('silkSutraCart')) || [];
    let count = cart.reduce((acc, curr) => acc + curr.qty, 0);
    document.querySelectorAll('.cart-count').forEach(badge => {
        badge.textContent = count;
    });
}

// ─── Toast notification ─────────────────────────────────────────
function showCartToast(productName) {
    // Remove any existing toast
    const existing = document.getElementById('_cartToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = '_cartToast';
    toast.style.cssText = `
        position: fixed; bottom: 30px; right: 30px; z-index: 99999;
        background: #800000; color: #fff; padding: 14px 22px;
        border-radius: 10px; box-shadow: 0 6px 24px rgba(0,0,0,0.25);
        font-family: 'Poppins', sans-serif; font-size: 0.9rem;
        display: flex; align-items: center; gap: 10px;
        animation: slideInRight 0.3s ease;
    `;
    toast.innerHTML = `<i class="fas fa-check-circle"></i> <span><strong>${productName}</strong> added to cart!</span>`;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
}
