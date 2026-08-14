<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Carrito - García</title>
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#2e7d32">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- HEADER -->
    <header class="header">
        <div class="header-top">
            <a href="index.html" class="back-btn">← Volver</a>
            <div class="logo">
                <h1>🛒 Carrito</h1>
            </div>
            <div class="header-actions">
                <button id="themeToggle" class="theme-btn" aria-label="Cambiar tema">🌙</button>
            </div>
        </div>
    </header>

    <!-- CONTENIDO -->
    <main class="main-content carrito-content">
        <div id="carritoVacio" class="empty-cart">
            <p>🛒 Tu carrito está vacío</p>
            <a href="index.html" class="btn-continuar">Seguir comprando</a>
        </div>
        
        <div id="carritoLleno" class="cart-items hidden">
            <div id="cartList" class="cart-list">
                <!-- Items renderizados aquí -->
            </div>
            
            <div class="cart-summary">
                <div class="total-row">
                    <span>TOTAL</span>
                    <span id="cartTotal">$0.00</span>
                </div>
                <button id="whatsappBtn" class="btn-whatsapp">
                    📱 Enviar por WhatsApp
                </button>
                <a href="index.html" class="btn-continuar">Seguir comprando</a>
            </div>
        </div>
    </main>

    <script src="js/db.js"></script>
    <script src="js/carrito.js"></script>
</body>
</html>
