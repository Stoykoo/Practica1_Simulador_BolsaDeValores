// Actualizador de tipo de cambio en tiempo real
class ExchangeRateUpdater {
    constructor() {
        this.currentRate = parseFloat(document.getElementById('exchangeRate').value);
        this.lastRate = this.currentRate;
        this.updateInterval = 300000; // 5 minutos
        this.isUpdating = false;
        
        this.init();
    }
    
    init() {
        // Actualizar automáticamente cada 5 minutos
        setInterval(() => this.updateRate(), this.updateInterval);
        
        // Botón de actualización manual
        document.getElementById('refreshExchangeRate').addEventListener('click', () => {
            this.updateRate(true);
        });
        
        // Mostrar hora de última actualización
        this.updateTimestamp();
    }
    
    async updateRate(manual = false) {
        if (this.isUpdating) return;
        
        this.isUpdating = true;
        const refreshBtn = document.getElementById('refreshExchangeRate');
        
        try {
            if (manual) {
                refreshBtn.classList.add('rotating');
            }
            
            // Simular llamada a API (en producción sería una llamada real a tu backend)
            const response = await fetch('/api/exchange-rate');
            const data = await response.json();
            
            if (data.success) {
                this.lastRate = this.currentRate;
                this.currentRate = data.rate;
                this.updateDisplay();
                this.showUpdateAnimation();
            }
            
        } catch (error) {
            console.error('Error updating exchange rate:', error);
            this.showError();
        } finally {
            this.isUpdating = false;
            refreshBtn.classList.remove('rotating');
        }
    }
    
    updateDisplay() {
        const rateElement = document.getElementById('exchangeRateValue');
        const trendElement = document.getElementById('exchangeTrend');
        const trendIcon = document.getElementById('trendIcon');
        const trendText = document.getElementById('trendText');
        
        // Animación de cambio
        rateElement.style.transform = 'scale(1.1)';
        rateElement.style.color = '#667eea';
        
        setTimeout(() => {
            rateElement.textContent = `$${this.currentRate.toFixed(2)}`;
            rateElement.style.transform = 'scale(1)';
            rateElement.style.color = '';
        }, 300);
        
        // Actualizar tendencia
        const change = this.currentRate - this.lastRate;
        const changePercent = (change / this.lastRate) * 100;
        
        if (Math.abs(change) < 0.01) {
            trendElement.className = 'exchange-trend neutral';
            trendIcon.className = 'bi bi-dash';
            trendText.textContent = 'Estable';
        } else if (change > 0) {
            trendElement.className = 'exchange-trend positive';
            trendIcon.className = 'bi bi-arrow-up';
            trendText.textContent = `+${changePercent.toFixed(3)}%`;
        } else {
            trendElement.className = 'exchange-trend negative';
            trendIcon.className = 'bi bi-arrow-down';
            trendText.textContent = `${changePercent.toFixed(3)}%`;
        }
        
        this.updateTimestamp();
    }
    
    showUpdateAnimation() {
        const badge = document.getElementById('exchangeLiveBadge');
        badge.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            badge.style.animation = '';
        }, 500);
    }
    
    showError() {
        const trendElement = document.getElementById('exchangeTrend');
        trendElement.className = 'exchange-trend neutral';
        trendElement.innerHTML = '<i class="bi bi-exclamation-triangle"></i><span>Error de conexión</span>';
    }
    
    updateTimestamp() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-MX', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('updateTime').textContent = timeString;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ExchangeRateUpdater();
});