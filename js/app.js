const products = [
    { id: 1, name: "Camiseta Básica Premium", price: 15.00, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80" },
    { id: 2, name: "Gorra de Béisbol Classic", price: 20.00, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80" },
    { id: 3, name: "Zapatillas Urban Style", price: 55.00, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80" },
    { id: 4, name: "Mochila de Viaje", price: 40.00, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80" },
    { id: 5, name: "Gafas de Sol Retro", price: 25.00, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80" },
    { id: 6, name: "Reloj Minimalista Negro", price: 80.00, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80" },
    { id: 7, name: "Taza de Cerámica", price: 12.00, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80" },
    { id: 8, name: "Cuaderno de Notas", price: 8.50, image: "https://images.unsplash.com/photo-1531346878377-a541e4ab6947?w=400&q=80" }
];

let cart = [];
const PHONE_NUMBER = "1234567890"; 

// SVG icons as strings to replace the generic fetch
const icons = {
    emptyCart: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
    plus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
    minus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`,
    trash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`
};

const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(amount);
};

function renderProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = products.map(p => `
        <div class="card">
            <div class="card-img-wrap">
                <img src="${p.image}" alt="${p.name}" loading="lazy" />
            </div>
            <div class="card-body">
                <h3 class="card-title">${p.name}</h3>
                <p class="card-price">${formatMoney(p.price)}</p>
                <button onclick="addToCart(${p.id})" class="btn btn-primary" style="width: 100%; margin-top: auto;">
                    Añadir
                </button>
            </div>
        </div>
    `).join('');
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    if (totalItems > 0) {
        badge.textContent = totalItems > 99 ? '99+' : totalItems;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }

    const cartItemsContainer = document.getElementById('cart-items');
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">${icons.emptyCart}</div>
                <p style="font-weight: 500; font-size: 1rem; color: var(--foreground);">Tu carrito está vacío</p>
                <p style="font-size: 0.875rem;">Agrega productos para comenzar tu pedido.</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" />
                <div class="cart-item-info">
                    <p class="cart-item-title">${item.name}</p>
                    <p class="cart-item-price">${formatMoney(item.price)}</p>
                    
                    <div class="cart-qty">
                        <button onclick="updateQty(${item.id}, -1)" class="${item.quantity === 1 ? 'warn' : ''}">
                            ${item.quantity === 1 ? icons.trash : icons.minus}
                        </button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQty(${item.id}, 1)">
                            ${icons.plus}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = formatMoney(total);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(c => c.id === productId);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    showToast();
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    
    if(window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

function updateQty(productId, delta) {
    const item = cart.find(c => c.id === productId);
    if (!item) return;
    
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(c => c.id !== productId);
    }
    updateCartUI();
}

// Drawer logic
const cartDrawer = document.getElementById('cart-drawer');
const openBtn = document.getElementById('cart-btn');
const closeBtn = document.getElementById('close-cart-btn');

function openDrawer() {
    cartDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    cartDrawer.classList.remove('open');
    document.body.style.overflow = '';
}

openBtn.addEventListener('click', openDrawer);
closeBtn.addEventListener('click', closeDrawer);
cartDrawer.addEventListener('click', (e) => {
    if (e.target === cartDrawer) closeDrawer();
});

// Checkout logic
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) return;
    
    let text = "¡Hola! Quisiera realizar el siguiente pedido:%0A%0A";
    cart.forEach(item => {
        text += `🔹 ${item.quantity}x ${item.name} (${formatMoney(item.price * item.quantity)})%0A`;
    });
    
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    text += `%0A💰 *Total: ${formatMoney(total)}*%0A%0A¡Muchas gracias!`;
    
    window.location.href = `https://wa.me/${PHONE_NUMBER}?text=${text}`;
});

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});
