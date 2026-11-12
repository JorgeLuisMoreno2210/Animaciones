// Juego de Conejitos - JavaScript
let score = 0;

document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

function initializeGame() {
    const bunnyCheckboxes = document.querySelectorAll('.bunny input[type="checkbox"]');
    
    bunnyCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', handleBunnyClick);
        
        const bunnyElement = checkbox.closest('.bunny');
        bunnyElement.addEventListener('mouseenter', handleBunnyHover);
        bunnyElement.addEventListener('mouseleave', handleBunnyLeave);
    });
    
    initializeParticleSystem();
    startBackgroundAnimations();
}

function handleBunnyClick(event) {
    const checkbox = event.target;
    const bunnyElement = checkbox.closest('.bunny');
    
    if (checkbox.checked) {
        // 1. Sumar punto y actualizar marcador
        incrementScore();
        
        // 2. Efectos visuales y sonoros
        createParticleEffect(bunnyElement);
        playClickSound();
        vibrateDevice();
        
        // 3. Auto-resetear el checkbox para poder volver a golpear al conejo
        setTimeout(() => {
            checkbox.checked = false;
        }, 300);
    }
}

function incrementScore() {
    score++;
    const scoreDisplay = document.getElementById('score');
    if (scoreDisplay) {
        scoreDisplay.textContent = score;
        
        // Pequeña animación en el número
        scoreDisplay.classList.add('score-pop');
        setTimeout(() => {
            scoreDisplay.classList.remove('score-pop');
        }, 150);
    }
}

function handleBunnyHover(event) {
    const bunnyElement = event.currentTarget;
    bunnyElement.style.filter = 'brightness(1.1)';
}

function handleBunnyLeave(event) {
    const bunnyElement = event.currentTarget;
    bunnyElement.style.filter = '';
}

function createParticleEffect(bunnyElement) {
    const rect = bunnyElement.getBoundingClientRect();
    const phoneElement = bunnyElement.closest('.phone');
    const phoneRect = phoneElement.getBoundingClientRect();
    
    const particleCount = 8;
    const colors = ['#ff69b4', '#ffd700', '#98e4ff', '#ffffff'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 6 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = Math.random() * 30 + 25;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = color;
        particle.style.left = `${rect.left - phoneRect.left + rect.width / 2}px`;
        particle.style.top = `${rect.top - phoneRect.top + 40}px`; // Cerca de la cabeza
        
        createParticleKeyframes(i, angle, velocity);
        particle.style.animation = `particle-burst-${i} 0.6s ease-out forwards`;
        
        phoneElement.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) particle.remove();
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
    
    const styleElement = document.createElement('style');
    styleElement.textContent = keyframes;
    document.head.appendChild(styleElement);
    
    setTimeout(() => {
        if (styleElement.parentNode) styleElement.remove();
    }, 1000);
}

function playClickSound() {
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
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
}

function initializeParticleSystem() {
    setInterval(() => {
        if (Math.random() < 0.2) {
            createBackgroundParticle();
        }
    }, 1000);
}

function createBackgroundParticle() {
    const phoneElement = document.querySelector('.phone');
    if (!phoneElement) return;

    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = 'rgba(255, 255, 255, 0.6)';
    particle.style.borderRadius = '50%';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = '100%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '50';
    particle.style.animation = 'float-up 3s linear forwards';
    
    phoneElement.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) particle.remove();
    }, 3000);
}

function startBackgroundAnimations() {
    const bunnies = document.querySelectorAll('.bunny-animated');
    
    bunnies.forEach((bunny) => {
        // Pausas aleatorias ocasionales para que sea más impredecible
        setInterval(() => {
            if (Math.random() < 0.15) {
                bunny.style.animationPlayState = 'paused';
                setTimeout(() => {
                    bunny.style.animationPlayState = 'running';
                }, Math.random() * 800 + 400);
            }
        }, 4000);
    });
}

function resetGame() {
    score = 0;
    const scoreDisplay = document.getElementById('score');
    if (scoreDisplay) scoreDisplay.textContent = score;
    
    document.querySelectorAll('.bunny input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
}

function pauseGame() {
    document.querySelectorAll('.bunny-animated').forEach(bunny => {
        bunny.style.animationPlayState = 'paused';
    });
}

function resumeGame() {
    document.querySelectorAll('.bunny-animated').forEach(bunny => {
        bunny.style.animationPlayState = 'running';
    });
}

document.addEventListener('visibilitychange', function() {
    if (document.hidden) pauseGame();
    else resumeGame();
});

window.BunnyGame = {
    reset: resetGame,
    pause: pauseGame,
    resume: resumeGame
};
