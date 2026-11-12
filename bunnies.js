// Juego de Conejitos - JavaScript
// Funcionalidad principal del juego

document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

function initializeGame() {
    // Seleccionar todos los checkboxes de los conejitos
    const bunnyCheckboxes = document.querySelectorAll('.bunny input[type="checkbox"]');
    
    // Agregar event listeners a cada conejito
    bunnyCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', handleBunnyClick);
        
        // Agregar eventos de hover para mejor interactividad
        const bunnyElement = checkbox.closest('.bunny');
        bunnyElement.addEventListener('mouseenter', handleBunnyHover);
        bunnyElement.addEventListener('mouseleave', handleBunnyLeave);
    });
    
    // Inicializar efectos adicionales
    initializeParticleSystem();
    startBackgroundAnimations();
}

function handleBunnyClick(event) {
    const checkbox = event.target;
    const bunnyElement = checkbox.closest('.bunny');
    
    if (checkbox.checked) {
        // Crear efecto de partículas
        createParticleEffect(bunnyElement);
        
        // Agregar efecto de sonido (opcional)
        playClickSound();
        
        // Efecto de vibración en dispositivos móviles
        vibrateDevice();
        
        // Auto-resetear el checkbox después de la animación
        setTimeout(() => {
            checkbox.checked = false;
        }, 300);
        
        // Actualizar estadísticas del juego
        updateGameStats();
    }
}

function handleBunnyHover(event) {
    const bunnyElement = event.target;
    bunnyElement.style.transform = 'scale(1.05)';
    bunnyElement.style.filter = 'brightness(1.1)';
}

function handleBunnyLeave(event) {
    const bunnyElement = event.target;
    bunnyElement.style.transform = '';
    bunnyElement.style.filter = '';
}

function createParticleEffect(bunnyElement) {
    const rect = bunnyElement.getBoundingClientRect();
    const phoneElement = bunnyElement.closest('.phone');
    const phoneRect = phoneElement.getBoundingClientRect();
    
    // Crear múltiples partículas
    const particleCount = 8;
    const colors = ['#ff69b4', '#87ceeb', '#98e4ff', '#ffffff'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Configurar propiedades de la partícula
        const size = Math.random() * 6 + 4; // 4-10px
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = Math.random() * 30 + 20;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = color;
        particle.style.left = `${rect.left - phoneRect.left + rect.width / 2}px`;
        particle.style.top = `${rect.top - phoneRect.top + rect.height / 2}px`;
        
        // Agregar animación personalizada
        particle.style.setProperty('--end-x', `${Math.cos(angle) * velocity}px`);
        particle.style.setProperty('--end-y', `${Math.sin(angle) * velocity}px`);
        particle.style.animation = `particle-burst-${i} 0.6s ease-out forwards`;
        
        // Crear keyframes dinámicos
        createParticleKeyframes(i, angle, velocity);
        
        phoneElement.appendChild(particle);
        
        // Remover partícula después de la animación
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 600);
    }
}

function createParticleKeyframes(index, angle, velocity) {
    const keyframeName = `particle-burst-${index}`;
    const endX = Math.cos(angle) * velocity;
    const endY = Math.sin(angle) * velocity;
    
    const keyframes = `
        @keyframes ${keyframeName} {
            0% {
                opacity: 1;
                transform: translate(0, 0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translate(${endX}px, ${endY}px) scale(0);
            }
        }
    `;
    
    // Agregar keyframes al DOM
    const styleElement = document.createElement('style');
    styleElement.textContent = keyframes;
    document.head.appendChild(styleElement);
    
    // Limpiar después de usar
    setTimeout(() => {
        if (styleElement.parentNode) {
            styleElement.remove();
        }
    }, 1000);
}

function playClickSound() {
    // Crear efecto de sonido usando Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        console.log('Audio no disponible:', e);
    }
}

function vibrateDevice() {
    // Vibración en dispositivos móviles compatibles
    if ('vibrate' in navigator) {
        navigator.vibrate(50); // 50ms de vibración
    }
}

function updateGameStats() {
    // Aquí podrías agregar lógica para guardar estadísticas
    // Por ejemplo, en localStorage (si estuviera disponible)
    console.log('Punto anotado!');
}

function initializeParticleSystem() {
    // Sistema de partículas de fondo (opcional)
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% de probabilidad cada segundo
            createBackgroundParticle();
        }
    }, 1000);
}

function createBackgroundParticle() {
    const phoneElement = document.querySelector('.phone');
    const particle = document.createElement('div');
    
    particle.style.position = 'absolute';
    particle.style.width = '3px';
    particle.style.height = '3px';
    particle.style.background = 'rgba(255, 255, 255, 0.6)';
    particle.style.borderRadius = '50%';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = '100%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '50';
    particle.style.animation = 'float-up 3s linear forwards';
    
    phoneElement.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, 3000);
}

function startBackgroundAnimations() {
    // Agregar variaciones aleatorias a las animaciones de los conejitos
    const bunnies = document.querySelectorAll('.bunny-animated');
    
    bunnies.forEach((bunny, index) => {
        // Variación aleatoria en la duración de la animación
        const baseDuration = 2000; // 2 segundos
        const variation = Math.random() * 500 - 250; // ±250ms
        const newDuration = baseDuration + variation;
        
        bunny.style.animationDuration = `${newDuration}ms`;
        
        // Agregar pausa aleatoria ocasional
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% de probabilidad
                bunny.style.animationPlayState = 'paused';
                setTimeout(() => {
                    bunny.style.animationPlayState = 'running';
                }, Math.random() * 1000 + 500); // 0.5-1.5 segundos de pausa
            }
        }, 5000);
    });
}

// Funciones de utilidad adicionales
function resetGame() {
    // Resetear el contador de puntos
    const style = document.createElement('style');
    style.textContent = 'body { counter-reset: score; }';
    document.head.appendChild(style);
    
    setTimeout(() => {
        style.remove();
    }, 100);
}

function pauseGame() {
    const bunnies = document.querySelectorAll('.bunny-animated');
    bunnies.forEach(bunny => {
        bunny.style.animationPlayState = 'paused';
    });
}

function resumeGame() {
    const bunnies = document.querySelectorAll('.bunny-animated');
    bunnies.forEach(bunny => {
        bunny.style.animationPlayState = 'running';
    });
}

// Manejo de visibilidad de la página
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        pauseGame();
    } else {
        resumeGame();
    }
});

// Optimización de rendimiento
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Exportar funciones para uso externo (opcional)
window.BunnyGame = {
    reset: resetGame,
    pause: pauseGame,
    resume: resumeGame
};