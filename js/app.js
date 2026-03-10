// You can replace these products with your actual inventory
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
// Put the business WhatsApp number here (include country code, without '+' or spaces)
const PHONE_NUMBER = "1234567890"; 

const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(amount);
};

function renderProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = products.map(p => `
        <div class="shadcn-card flex flex-col overflow-hidden group hover:shadow-md transition-shadow duration-200">
            <div class="aspect-[4/5] bg-muted relative overflow-hidden">
                <img src="${p.image}" alt="${p.name}" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            </div>
            <div class="p-4 flex flex-col flex-1 gap-2">
                <h3 class="font-medium text-sm line-clamp-2 leading-tight flex-1">${p.name}</h3>
                <p class="font-bold text-base tracking-tight">${formatMoney(p.price)}</p>
                <button onclick="addToCart(${p.id})" class="shadcn-btn shadcn-btn-primary w-full mt-1 h-9 rounded-lg shadow-sm active:scale-95 transition-transform text-xs font-semibold">
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
        badge.classList.add('animate-in', 'zoom-in', 'duration-200');
    } else {
        badge.classList.add('hidden');
    }

    const cartItemsContainer = document.getElementById('cart-items');
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-muted-foreground/50 py-12 gap-3">
                <div class="bg-muted p-4 rounded-full">
                    <i data-lucide="shopping-cart" class="w-8 h-8"></i>
                </div>
                <p class="font-medium text-foreground">Tu carrito está vacío</p>
                <p class="text-sm text-center px-6">Agrega productos para comenzar tu pedido.</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="flex gap-4 p-3 rounded-xl border border-border/50 bg-background hover:bg-muted/30 transition-colors items-center">
                <img src="${item.image}" class="w-20 h-20 rounded-lg object-cover bg-muted" alt="${item.name}" />
                <div class="flex-1 min-w-0">
                    <p class="font-semibold text-sm leading-tight truncate px-1">${item.name}</p>
                    <p class="text-sm text-muted-foreground mt-1 px-1 font-medium">${formatMoney(item.price)}</p>
                    
                    <div class="flex items-center gap-3 mt-2 bg-muted/50 w-fit rounded-lg p-1 border">
                        <button onclick="updateQty(${item.id}, -1)" class="w-7 h-7 flex items-center justify-center rounded-md bg-background text-foreground shadow-sm hover:bg-muted active:scale-95 transition-all">
                            <i data-lucide="${item.quantity === 1 ? 'trash-2' : 'minus'}" class="w-3.5 h-3.5 ${item.quantity === 1 ? 'text-destructive' : ''}"></i>
                        </button>
                        <span class="text-sm font-semibold w-5 text-center">${item.quantity}</span>
                        <button onclick="updateQty(${item.id}, 1)" class="w-7 h-7 flex items-center justify-center rounded-md bg-background text-foreground shadow-sm hover:bg-muted active:scale-95 transition-all">
                            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    lucide.createIcons();
    
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
    
    const btn = document.getElementById('cart-btn');
    btn.classList.add('ring-2', 'ring-primary/50', 'scale-105');
    setTimeout(() => btn.classList.remove('ring-2', 'ring-primary/50', 'scale-105'), 200);
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
    
    if(window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        toast.classList.remove('opacity-100', 'translate-y-0');
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
const cartDrawerContent = document.getElementById('cart-drawer-content');
const openBtn = document.getElementById('cart-btn');
const closeBtn = document.getElementById('close-cart-btn');

function openDrawer() {
    cartDrawer.classList.remove('hidden');
    // Force reflow
    void cartDrawer.offsetWidth;
    cartDrawer.classList.remove('opacity-0');
    cartDrawer.classList.add('flex', 'opacity-100');
    
    setTimeout(() => {
        cartDrawerContent.classList.remove('translate-y-full');
        cartDrawerContent.classList.add('translate-y-0');
    }, 10);
}

function closeDrawer() {
    cartDrawerContent.classList.remove('translate-y-0');
    cartDrawerContent.classList.add('translate-y-full');
    cartDrawer.classList.remove('opacity-100');
    cartDrawer.classList.add('opacity-0');
    
    setTimeout(() => {
        cartDrawer.classList.add('hidden');
        cartDrawer.classList.remove('flex');
    }, 300);
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});
