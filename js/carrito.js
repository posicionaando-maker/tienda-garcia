// ===== DOM =====
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');
const cartVacio = document.getElementById('carritoVacio');
const cartLleno = document.getElementById('carritoLleno');
const whatsappBtn = document.getElementById('whatsappBtn');

// ===== CARGAR CARRITO =====
document.addEventListener('DOMContentLoaded', () => {
    cargarTema();
    renderizarCarrito();
    setupEventListeners();
});

function getCarrito() {
    return JSON.parse(localStorage.getItem('carrito') || '[]');
}

function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// ===== RENDERIZAR CARRITO =====
function renderizarCarrito() {
    const carrito = getCarrito();
    
    if (carrito.length === 0) {
        cartVacio.style.display = 'block';
        cartLleno.classList.add('hidden');
        return;
    }
    
    cartVacio.style.display = 'none';
    cartLleno.classList.remove('hidden');
    
    let total = 0;
    
    cartList.innerHTML = carrito.map((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        
        return `
            <div class="cart-item">
                <img class="cart-item-image" src="img/productos/${item.imagen || 'default.jpg'}" 
                     alt="${item.nombre}" loading="lazy"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect fill=%22%23ddd%22 width=%2260%22 height=%2260%22/%3E%3Ctext x=%2210%22 y=%2240%22 font-size=%2230%22%3E🛒%3C/text%3E%3C/svg%3E'">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.nombre}</div>
                    <div class="cart-item-price">$${item.precio.toFixed(2)}</div>
                    <div style="font-size:0.7rem;color:var(--color-text-light);">${item.peso || ''}</div>
                    <div class="cart-item-controls">
                        <button onclick="cambiarCantidad(${index}, -1)">−</button>
                        <span class="qty">${item.cantidad}</span>
                        <button onclick="cambiarCantidad(${index}, 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="eliminarItem(${index})">🗑️</button>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// ===== CAMBIAR CANTIDAD =====
function cambiarCantidad(index, delta) {
    const carrito = getCarrito();
    const item = carrito[index];
    
    if (!item) return;
    
    const nuevaCantidad = item.cantidad + delta;
    
    if (nuevaCantidad <= 0) {
        carrito.splice(index, 1);
    } else if (nuevaCantidad <= item.maxStock) {
        item.cantidad = nuevaCantidad;
    } else {
        mostrarNotificacion('⚠️ No hay suficiente stock');
        return;
    }
    
    guardarCarrito(carrito);
    renderizarCarrito();
    actualizarContadorCarrito();
}

// ===== ELIMINAR ITEM =====
function eliminarItem(index) {
    const carrito = getCarrito();
    carrito.splice(index, 1);
    guardarCarrito(carrito);
    renderizarCarrito();
    actualizarContadorCarrito();
}

// ===== ENVIAR POR WHATSAPP =====
function enviarWhatsApp() {
    const carrito = getCarrito();
    if (carrito.length === 0) {
        mostrarNotificacion('⚠️ El carrito está vacío');
        return;
    }
    
    // Obtener datos de la tienda desde el JSON
    fetch('data/productos.json')
        .then(res => res.json())
        .then(data => {
            const tienda = data.tienda || {};
            const nombreTienda = tienda.nombre || 'García - Tu Barrio';
            const telefono = tienda.telefono || '5352715892';
            const direccion = tienda.direccion || 'Calzada y García, Cárdenas';
            
            let total = 0;
            let mensaje = `🛒 *${nombreTienda}*\n`;
            mensaje += `📦 *Nuevo Pedido*\n\n`;
            
            carrito.forEach(item => {
                const subtotal = item.precio * item.cantidad;
                total += subtotal;
                mensaje += `${item.cantidad}x ${item.nombre}`;
                if (item.peso) mensaje += ` (${item.peso})`;
                mensaje += ` - $${(item.precio * item.cantidad).toFixed(2)}\n`;
            });
            
            mensaje += `\n📦 *Total: $${total.toFixed(2)}*\n\n`;
            mensaje += `📍 *Dirección de entrega:* [escribir aquí]\n`;
            mensaje += `📝 *Notas adicionales:* [opcional]`;
            
            const url = `https://wa.me/${telefono.replace(/\s/g, '')}?text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        })
        .catch(() => {
            // Fallback si no carga el JSON
            const telefono = '5352715892';
            let total = 0;
            let mensaje = `🛒 *García - Tu Barrio*\n📦 *Nuevo Pedido*\n\n`;
            
            carrito.forEach(item => {
                const subtotal = item.precio * item.cantidad;
                total += subtotal;
                mensaje += `${item.cantidad}x ${item.nombre} - $${(item.precio * item.cantidad).toFixed(2)}\n`;
            });
            
            mensaje += `\n📦 *Total: $${total.toFixed(2)}*\n\n`;
            mensaje += `📍 *Dirección de entrega:* [escribir aquí]`;
            
            const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        });
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    whatsappBtn.addEventListener('click', enviarWhatsApp);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTema);
    }
}

// ===== FUNCIONES GLOBALES =====
window.cambiarCantidad = cambiarCantidad;
window.eliminarItem = eliminarItem;
window.enviarWhatsApp = enviarWhatsApp;
