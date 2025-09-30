// Dashboard JavaScript - Funcionalidades profesionales
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar automáticamente cada 30 segundos
    setInterval(() => {
        window.location.reload();
    }, 30000);

    // Cálculo de compra en tiempo real
    const stockSelect = document.getElementById('stockSelect');
    const quantityInput = document.getElementById('quantityInput');
    const purchaseSummary = document.getElementById('purchaseSummary');
    const totalUsd = document.getElementById('totalUsd');
    const totalMxn = document.getElementById('totalMxn');
    const exchangeRate = parseFloat(document.getElementById('exchangeRate')?.value || 17.50);

    function updatePurchaseSummary() {
        const selectedOption = stockSelect.options[stockSelect.selectedIndex];
        const price = parseFloat(selectedOption.getAttribute('data-price')) || 0;
        const quantity = parseInt(quantityInput.value) || 0;
        
        if (price > 0 && quantity > 0) {
            const usdTotal = price * quantity;
            const mxnTotal = usdTotal * exchangeRate;
            
            totalUsd.textContent = '$' + usdTotal.toFixed(2);
            totalMxn.textContent = '$' + mxnTotal.toFixed(2);
            purchaseSummary.style.display = 'block';
        } else {
            purchaseSummary.style.display = 'none';
        }
    }

    if (stockSelect && quantityInput) {
        stockSelect.addEventListener('change', updatePurchaseSummary);
        quantityInput.addEventListener('input', updatePurchaseSummary);
    }

    // Efectos hover en filas
    const stockRows = document.querySelectorAll('.stock-row, .market-row');
    stockRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Refresh con animación
    const refreshBtn = document.getElementById('refreshPortfolio');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.classList.add('rotating');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    }

    // Animación de números para estadísticas
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Animar valores de estadísticas cuando sean visibles
    const statValues = document.querySelectorAll('.stat-value');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const finalValue = parseInt(element.textContent);
                if (!isNaN(finalValue)) {
                    animateValue(element, 0, finalValue, 1500);
                }
                observer.unobserve(element);
            }
        });
    });

    statValues.forEach(value => {
        observer.observe(value);
    });

    // Iniciar animaciones de entrada cuando son visibles
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    });

    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .fade-in-up').forEach(el => {
        animationObserver.observe(el);
    });

    // Validación de formularios de venta
    const sellForms = document.querySelectorAll('.sell-form');
    sellForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const quantityInput = this.querySelector('.quantity-input');
            const maxQuantity = parseInt(quantityInput.getAttribute('max'));
            const quantity = parseInt(quantityInput.value);
            
            if (quantity > maxQuantity) {
                e.preventDefault();
                alert(`No puedes vender más de ${maxQuantity} acciones.`);
                quantityInput.value = maxQuantity;
            }
            
            if (quantity <= 0) {
                e.preventDefault();
                alert('La cantidad debe ser mayor a 0.');
                quantityInput.value = 1;
            }
        });
    });

    // Efectos de realce en cambios de precios
    function highlightPriceChanges() {
        const priceCells = document.querySelectorAll('.stock-price, .market-price');
        priceCells.forEach(cell => {
            const currentPrice = parseFloat(cell.textContent.replace('$', ''));
            const originalPrice = parseFloat(cell.getAttribute('data-original-price') || currentPrice);
            
            if (currentPrice !== originalPrice) {
                cell.style.backgroundColor = currentPrice > originalPrice ? 
                    'rgba(0, 210, 106, 0.1)' : 'rgba(255, 71, 87, 0.1)';
                cell.setAttribute('data-original-price', currentPrice);
                
                // Remover el highlight después de 2 segundos
                setTimeout(() => {
                    cell.style.backgroundColor = '';
                }, 2000);
            }
        });
    }

    // Ejecutar highlight al cargar (para cambios entre recargas)
    setTimeout(highlightPriceChanges, 100);
});

// Función global para scroll suave a sección de compra
function scrollToBuy() {
    const buySection = document.getElementById('buySection');
    if (buySection) {
        buySection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Efecto de focus en el select
        setTimeout(() => {
            const stockSelect = document.getElementById('stockSelect');
            if (stockSelect) {
                stockSelect.focus();
                stockSelect.style.borderColor = '#667eea';
                stockSelect.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)';
                
                setTimeout(() => {
                    stockSelect.style.boxShadow = '';
                }, 2000);
            }
        }, 500);
    }
}

// Función para formatear números de bolsa
function formatStockNumber(number, decimals = 2) {
    return parseFloat(number).toFixed(decimals);
}

function setupMobileOptimizations() {
    // Mejorar inputs en móviles
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('touchstart', function(e) {
            this.focus();
        });
    });
    
    // Prevenir zoom en inputs
    const formInputs = document.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('touchstart', function() {
            this.style.fontSize = '16px'; // Previene zoom en iOS
        });
    });
}

// Llama a la función cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setupMobileOptimizations();
    
    // Tu código existente aquí...
});

// Función para calcular ganancias/pérdidas
function calculateProfitLoss(purchasePrice, currentPrice, quantity) {
    const difference = (currentPrice - purchasePrice) * quantity;
    const percentage = ((currentPrice - purchasePrice) / purchasePrice) * 100;
    return {
        amount: difference,
        percentage: percentage,
        isProfit: difference >= 0
    };
}