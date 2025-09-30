// Funcionalidades principales
class MainApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupCounters();
        this.setupFlashMessages();
        this.setupNavbarEffects();
        this.setupUserDropdown();
        this.setupThemeToggle();
        this.setupFormInteractions();
    }

    // Menú móvil mejorado con animaciones
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                const isOpening = !mobileMenu.classList.contains('active');
                
                if (isOpening) {
                    mobileMenu.style.display = 'flex';
                    // Pequeño delay para la animación
                    setTimeout(() => {
                        mobileMenu.classList.add('active');
                    }, 10);
                } else {
                    mobileMenu.classList.remove('active');
                    // Esperar a que termine la animación para ocultar
                    setTimeout(() => {
                        mobileMenu.style.display = 'none';
                    }, 300);
                }
                
                // Animación de hamburguesa a X
                this.animateMenuBars(mobileMenuBtn, isOpening);
            });

            // Cerrar menú al hacer clic en un enlace
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    this.animateMenuBars(mobileMenuBtn, false);
                    
                    setTimeout(() => {
                        mobileMenu.style.display = 'none';
                    }, 300);
                });
            });

            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    this.animateMenuBars(mobileMenuBtn, false);
                    
                    setTimeout(() => {
                        mobileMenu.style.display = 'none';
                    }, 300);
                }
            });
        }
    }

    // Animación de barras del menú hamburguesa
    animateMenuBars(menuBtn, isOpening) {
        const bars = menuBtn.querySelectorAll('.menu-bar');
        
        if (isOpening) {
            bars[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    }

    // Scroll suave mejorado
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                
                // Solo aplicar scroll suave para anclas internas
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    
                    if (target) {
                        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80; // Ajuste para navbar fijo
                        
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Contadores animados para estadísticas
    setupCounters() {
        const counters = document.querySelectorAll('.stats [style*="font-size: 2.5rem"]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const target = parseInt(text.replace(/[^0-9]/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target.toLocaleString() + (hasPlus ? '+' : '');
                clearInterval(timer);
                
                // Efecto de finalización
                element.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 150);
            } else {
                element.textContent = Math.floor(current).toLocaleString() + (hasPlus ? '+' : '');
            }
        }, 16);
    }

    // Sistema de mensajes flash mejorado
    setupFlashMessages() {
        const flashMessages = document.getElementById('flashMessages');
        
        if (flashMessages) {
            const messages = flashMessages.querySelectorAll('.flash-message');
            
            messages.forEach(message => {
                // Auto-remover después de 5 segundos
                const autoRemove = setTimeout(() => {
                    this.removeFlashMessage(message);
                }, 5000);
                
                // Pausar animación al hacer hover
                message.addEventListener('mouseenter', () => {
                    const progress = message.querySelector('.flash-progress');
                    if (progress) {
                        progress.style.animationPlayState = 'paused';
                    }
                    clearTimeout(autoRemove);
                });
                
                message.addEventListener('mouseleave', () => {
                    const progress = message.querySelector('.flash-progress');
                    if (progress) {
                        progress.style.animationPlayState = 'running';
                    }
                    setTimeout(() => {
                        this.removeFlashMessage(message);
                    }, 5000);
                });
                
                // Botón de cerrar
                const closeBtn = message.querySelector('.flash-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        this.removeFlashMessage(message);
                    });
                }
            });
        }
    }

    removeFlashMessage(message) {
        message.style.animation = 'fadeOut 0.5s ease-in forwards';
        setTimeout(() => {
            if (message.parentElement) {
                message.remove();
            }
        }, 500);
    }

    // Efectos para el navbar
    setupNavbarEffects() {
        const navbar = document.querySelector('.navbar');
        
        if (navbar) {
            // Efecto de scroll en navbar
            let lastScrollY = window.scrollY;
            
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                    navbar.style.backdropFilter = 'blur(20px) saturate(180%)';
                    navbar.style.boxShadow = 'var(--shadow-md)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                    navbar.style.backdropFilter = 'blur(20px) saturate(180%)';
                    navbar.style.boxShadow = 'var(--shadow-sm)';
                }
                
                // Efecto de hide/show en scroll
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
                
                lastScrollY = window.scrollY;
            });

            // Efectos hover en items del menú
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.transform = 'translateY(-2px)';
                });
                
                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'translateY(0)';
                });
            });
        }
    }

    // Dropdown de usuario
    setupUserDropdown() {
        const userProfile = document.querySelector('.user-profile');
        
        if (userProfile) {
            let closeTimeout;
            
            userProfile.addEventListener('mouseenter', () => {
                clearTimeout(closeTimeout);
            });
            
            userProfile.addEventListener('mouseleave', () => {
                closeTimeout = setTimeout(() => {
                    // El dropdown se cierra automáticamente por CSS
                }, 300);
            });
            
            // Cerrar dropdown al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!userProfile.contains(e.target)) {
                    // El dropdown se cierra automáticamente por CSS
                }
            });
        }
    }

    // Toggle de tema mejorado
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                // Agregar efecto de click
                themeToggle.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    themeToggle.style.transform = 'scale(1)';
                }, 150);
            });
        }
    }

    // Interacciones con formularios - CORREGIDO
    setupFormInteractions() {
        // Efectos en inputs
        const formInputs = document.querySelectorAll('.form-input');
        
        formInputs.forEach(input => {
            // Efecto focus
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (input.value === '') {
                    input.parentElement.classList.remove('focused');
                }
            });
            
            // Verificar estado inicial
            if (input.value !== '') {
                input.parentElement.classList.add('focused');
            }
        });

        // Toggle de contraseña - VERSIÓN CORREGIDA
        const passwordToggles = document.querySelectorAll('.password-toggle');
        
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                // Buscar el input de contraseña dentro del mismo grupo
                const inputGroup = this.closest('.input-group');
                const passwordInput = inputGroup.querySelector('input[type="password"], input[type="text"]');
                
                if (passwordInput) {
                    // Cambiar el tipo de input
                    const isPassword = passwordInput.type === 'password';
                    passwordInput.type = isPassword ? 'text' : 'password';
                    
                    // Cambiar el ícono
                    const icon = this.querySelector('i');
                    if (icon) {
                        if (isPassword) {
                            // Mostrar que está visible
                            icon.classList.remove('bi-eye');
                            icon.classList.add('bi-eye-slash');
                        } else {
                            // Mostrar que está oculta
                            icon.classList.remove('bi-eye-slash');
                            icon.classList.add('bi-eye');
                        }
                    }
                    
                    // Efecto visual de feedback
                    this.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 150);
                }
            });
        });

        // Validación de confirmación de contraseña en tiempo real
        this.setupPasswordValidation();
    }

    // Validación de contraseñas
    setupPasswordValidation() {
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        
        passwordInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validatePasswordMatch();
            });
        });
    }

    validatePasswordMatch() {
        const password = document.querySelector('input[name="password"]');
        const confirmPassword = document.querySelector('input[name="confirm_password"]');
        
        if (password && confirmPassword && confirmPassword.value !== '') {
            const match = password.value === confirmPassword.value;
            const inputGroup = confirmPassword.closest('.input-group');
            
            if (inputGroup) {
                if (match) {
                    inputGroup.classList.remove('invalid');
                    inputGroup.classList.add('valid');
                } else {
                    inputGroup.classList.remove('valid');
                    inputGroup.classList.add('invalid');
                }
            }
        }
    }

    // Utilidad para detectar si un elemento está en viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Debounce para optimizar eventos de scroll
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Efectos globales y inicialización
class GlobalEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupPageLoader();
        this.setupSmoothAnimations();
        this.setupKeyboardShortcuts();
    }

    // Loader de página (opcional)
    setupPageLoader() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            // Remover loader después de la carga
            const loader = document.getElementById('pageLoader');
            if (loader) {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.remove(), 500);
                }, 500);
            }
        });
    }

    // Animaciones suaves para elementos al hacer scroll
    setupSmoothAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .float');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // Atajos de teclado
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K para focus en búsqueda (si existe)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[type="search"]');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Escape para cerrar menús
            if (e.key === 'Escape') {
                this.closeAllMenus();
            }
        });
    }

    closeAllMenus() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            setTimeout(() => {
                mobileMenu.style.display = 'none';
            }, 300);
        }
        
        // Reset menu bars
        const menuBtn = document.getElementById('mobileMenuBtn');
        if (menuBtn) {
            const bars = menuBtn.querySelectorAll('.menu-bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        }
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new MainApp();
    new GlobalEffects();
    
    // Agregar clase loaded al body para transiciones
    setTimeout(() => {
        document.body.classList.add('dom-loaded');
    }, 100);
});

// Manejar errores globalmente
window.addEventListener('error', (e) => {
    console.error('Error global:', e.error);
});

// Exportar para uso global (si es necesario)
window.MainApp = MainApp;
window.GlobalEffects = GlobalEffects;