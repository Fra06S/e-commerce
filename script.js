// script.js

// 1. Dati dei prodotti
const products = [
    { id: 1, name: "T-Shirt Bianca", price: 19.99, image: "https://placehold.co/300x300/e2e8f0/475569?text=T-Shirt" },
    { id: 2, name: "Jeans Slim", price: 49.99, image: "https://placehold.co/300x300/e2e8f0/475569?text=Jeans" },
    { id: 3, name: "Sneakers Sportive", price: 89.90, image: "https://placehold.co/300x300/e2e8f0/475569?text=Sneakers" },
    { id: 4, name: "Giacca in Pelle", price: 120.00, image: "https://placehold.co/300x300/e2e8f0/475569?text=Giacca" }
];

// 2. Inizializza il carrello leggendo il LocalStorage
let cart = JSON.parse(localStorage.getItem('mioshop_cart')) || [];

function saveCart() {
    localStorage.setItem('mioshop_cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.innerText = totalItems;
    }
}

// ==========================================
// LOGICA PER LA PAGINA PRODOTTI (index.html)
// ==========================================

// Modificata: ora accetta un termine di ricerca
function renderProducts(searchTerm = '') {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = '';
    
    // Filtriamo i prodotti ignorando maiuscole/minuscole
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Se la ricerca non produce risultati
    if (filteredProducts.length === 0) {
        container.innerHTML = `<p class="text-gray-500 col-span-full text-lg mt-4">Nessun prodotto trovato per "${searchTerm}".</p>`;
        return;
    }

    // Stampa i prodotti filtrati
    filteredProducts.forEach(product => {
        const productCard = `
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-bold text-gray-800">${product.name}</h3>
                    <p class="text-indigo-600 font-bold mt-1">€ ${product.price.toFixed(2)}</p>
                    <button onclick="addToCart(${product.id})" class="mt-4 w-full bg-indigo-100 text-indigo-700 py-2 rounded-lg hover:bg-indigo-200 transition font-semibold">
                        Aggiungi al Carrello
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    alert(`Hai aggiunto "${product.name}" al carrello!`);
}

// ==========================================
// LOGICA PER LA PAGINA CARRELLO (cart.html)
// ==========================================

function renderCartPage() {
    const cartContainer = document.getElementById('cart-page-items');
    const cartTotal = document.getElementById('cart-page-total');
    
    if (!cartContainer || !cartTotal) return;

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="bg-white p-8 text-center rounded-lg shadow-sm border">
                <p class="text-gray-500 text-lg">Il tuo carrello è tristemente vuoto.</p>
                <a href="index.html" class="inline-block mt-4 text-indigo-600 font-bold hover:underline">Inizia lo shopping</a>
            </div>`;
        cartTotal.innerText = '€ 0.00';
        return;
    }

    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        const cartItemHTML = `
            <div class="flex flex-col md:flex-row justify-between items-center bg-white p-4 mb-4 rounded-lg shadow-sm border">
                <div class="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                    <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
                    <div>
                        <h4 class="font-bold text-gray-800 text-lg">${item.name}</h4>
                        <p class="text-gray-500">€ ${item.price.toFixed(2)} cad.</p>
                    </div>
                </div>
                
                <div class="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div class="flex items-center border rounded-lg overflow-hidden">
                        <button onclick="changeQuantity(${item.id}, -1)" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 font-bold text-lg">-</button>
                        <span class="px-4 font-bold text-gray-700">${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 font-bold text-lg">+</button>
                    </div>
                    
                    <span class="font-bold text-lg w-24 text-right">€ ${(item.price * item.quantity).toFixed(2)}</span>
                    
                    <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded-md transition">
                        Rimuovi
                    </button>
                </div>
            </div>
        `;
        cartContainer.innerHTML += cartItemHTML;
    });

    cartTotal.innerText = `€ ${totalPrice.toFixed(2)}`;
}

function changeQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        saveCart();
        renderCartPage();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartPage();
}

// ==========================================
// INIZIALIZZAZIONE ALL'AVVIO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    renderProducts(); 
    renderCartPage(); 

    // Collega la barra di ricerca all'evento "input" (ogni volta che digiti un carattere)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const testoDigitato = event.target.value;
            renderProducts(testoDigitato); // Ridisegna i prodotti filtrati
        });
    }
});