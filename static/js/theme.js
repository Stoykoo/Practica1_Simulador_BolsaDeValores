// theme.js mejorado
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Cargar tema guardado o detectar preferencia del sistema
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const currentTheme = savedTheme || systemTheme;
    
    // Aplicar tema inicial
    applyTheme(currentTheme);
    
    // Configurar evento del toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const newTheme = htmlElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    }
    
    // Escuchar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Actualizar ícono del toggle
        updateToggleIcon(theme);
        
        // Opcional: Emitir evento personalizado
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
    }
    
    function updateToggleIcon(theme) {
        const icons = themeToggle?.querySelectorAll('.theme-icon');
        if (!icons) return;
        
        icons.forEach(icon => {
            icon.style.transform = theme === 'dark' ? 'scale(0.8)' : 'scale(1)';
            icon.style.opacity = theme === 'dark' ? '0' : '1';
        });
    }
});