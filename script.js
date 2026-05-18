// Title Animation
let animations = [
    function() {
        let msg = "⚡ popzzi ⚡ ";
        this.pos = this.pos || 0;
        document.title = msg.substring(this.pos) + msg.substring(0, this.pos);
        this.pos = (this.pos + 1) % msg.length;
    },
];
let currentAnim = 0;
let counter = 0;
function runAnimations() {
    animations[currentAnim]();
    counter++;
    if(counter > 20) {
        counter = 0;
        currentAnim = (currentAnim + 1) % animations.length;
    }
    setTimeout(runAnimations, 200);
}
runAnimations();

// Audio Context
let audioContext;
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}
function playClickSound() {
    initAudio();
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
}

function openPopup(url) {
    playClickSound();
    showLoader();
    setTimeout(() => {
        hideLoader();
        window.open(url, '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes');
    }, 800);
}

function showSocials() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('socials').style.display = 'flex';
}

function showHome() {
    document.getElementById('socials').style.display = 'none';
    document.getElementById('home').style.display = 'block';
}

function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// Particle Background System
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 80;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `hsl(${190 + Math.random() * 30}, 100%, ${60 + Math.random() * 20}%)`;
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.globalAlpha = 0.2;
                ctx.strokeStyle = '#00f0ff';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let particle of particles) {
        particle.update();
        particle.draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0;
let dotX = 0, dotY = 0;

// Mouse position eka ganna
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Trail particle hadanawa
  createTrail(mouseX, mouseY);
});

// Smooth follow effect
function animateCursor() {
  dotX += (mouseX - dotX) * 0.15;
  dotY += (mouseY - dotY) * 0.15;
  
  cursorDot.style.left = dotX + 'px';
  cursorDot.style.top = dotY + 'px';
  
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Trail effect hadana function eka
function createTrail(x, y) {
  const trail = document.createElement('div');
  trail.className = 'cursor-trail';
  trail.style.left = x + 'px';
  trail.style.top = y + 'px';
  
  document.body.appendChild(trail);
  
  // Fade out karala ain karanawa
  setTimeout(() => {
    trail.style.transition = 'all 0.6s ease-out';
    trail.style.opacity = '0';
    trail.style.transform = 'scale(0)';
    setTimeout(() => trail.remove(), 600);
  }, 10);
}

const audio = document.getElementById('bgMusic');
const volumeBtn = document.getElementById('volumeBtn');

// meka add karanna ona - initial state
let isMuted = true;

audio.volume = 0.4;

// 1. Page load una gaman try karanawa
window.addEventListener('load', async () => {
  try {
    await audio.play(); // muted nisa block wenne na
    console.log('Autoplay worked');
    audio.muted = false; // play wela passe unmute karanawa
    volumeBtn.textContent = '🔊';
    isMuted = false;
  } catch (err) {
    console.log('Autoplay blocked, showing button');
    volumeBtn.style.display = 'block'; // button eka pennanawa
    volumeBtn.textContent = '🔇';
  }
});

// 2. Volume button click - ekak witharai ona
volumeBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
  }
  
  if (isMuted) {
    audio.muted = false;
    volumeBtn.textContent = '🔊';
    isMuted = false;
  } else {
    audio.muted = true;
    volumeBtn.textContent = '🔇';
    isMuted = true;
  }
});

// 3. User kohom hari click karoth play karanna - optional
document.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
  }
}, { once: true });
