/**
 * Logic and Animations for "Do You Love Me?" Proposal Website
 */

// --- DOM ELEMENTS ---
const musicToggle = document.getElementById('music-toggle');
const proposalCard = document.getElementById('proposal-card');
const celebrationCard = document.getElementById('celebration-card');
const yesBtn = document.getElementById('yes-btn');
const yesBtnWrapper = document.getElementById('yes-btn-wrapper');
const noBtn = document.getElementById('no-btn');
const againBtn = document.getElementById('again-btn');
const questionText = document.getElementById('question-text');
const subQuestionText = document.getElementById('sub-question-text');
const heartsCanvas = document.getElementById('hearts-canvas');
const confettiCanvas = document.getElementById('confetti-canvas');
const orbitingHeartsContainer = document.getElementById('orbiting-hearts');
const proposalHeart = document.getElementById('proposal-heart');
const noPhotoContainer = document.getElementById('no-photo-container');

// --- STATE VARIABLES ---
let noClickCount = 0;
let soundEnabled = false;
let audioCtx = null;
let musicInterval = null;
let currentMelodyStep = 0;

// Text sequences when clicking 'NO'
const proposalTitles = [
    "Are you sure? 🥺",
    "Think again 😢",
    "Please don't do this 💔",
    "I'll buy you food 🍕❤️",
    "You know you love me 😏",
    "Still no?? 😭",
    "The YES button looks better 😎",
    "Just press YES already 😂",
    "Okay... last chance 😭❤️"
];

const proposalSubtitles = [
    "Think of all our memories... ❤️",
    "Don't break my heart like this...",
    "I promise I will be the best!",
    "Infinite pizza, tacos, and boba, deal? 😋",
    "Stop playing hard to get!",
    "My heart is literally crying...",
    "Look at how big and shiny it is!",
    "There's literally no other way out.",
    "I'm holding my breath! 😤"
];

// Cute/funny quotes that appear randomly during the celebration screen
const loveQuotes = [
    "You are my favorite notification! 📱❤️",
    "I love you more than pizza. 🍕",
    "Are you a magician? Everyone else disappears! ✨",
    "You're the cream to my coffee. ☕",
    "I love you to the moon and back! 🌙",
    "You stole my heart, but I'll let you keep it. 🕵️‍♂️❤️",
    "My favorite place is inside your hug. 🫂",
    "You are my sunshine on a cloudy day! ☀️",
    "I'm yours. No refunds. 😂❤️",
    "We go together like milk and cookies! 🥛🍪"
];

// --- SOUND SYNTHESIS SYSTEM (Web Audio API) ---
// Using pure mathematical synthesis to stay offline and avoid CORS issues.

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Play a cute bubble pop sound (used for hover and clicks)
function playPopSound(freq = 400, type = 'sine') {
    if (!soundEnabled) return;
    initAudio();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    // Quick sweep up in frequency for a pop sound
    osc.frequency.exponentialRampToValueAtTime(freq * 2, audioCtx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
}

// Play a sparkling, happy arpeggio when YES is clicked
function playCelebrationSound() {
    if (!soundEnabled) return;
    initAudio();

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C major arpeggio
    const now = audioCtx.currentTime;

    notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0, now + index * 0.08);
        gain.gain.linearRampToValueAtTime(0.15, now + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.3);
    });
}

// Cute little music box box music loop
const melodyNotes = [
    523.25, 587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 587.33,
    523.25, 659.25, 880.00, 783.99, 523.25, 587.33, 659.25, 392.00
];

function playNextMelodyNote() {
    if (!soundEnabled) return;
    initAudio();

    const freq = melodyNotes[currentMelodyStep % melodyNotes.length];
    currentMelodyStep++;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
}

function startBackgroundMusic() {
    if (musicInterval) clearInterval(musicInterval);
    // Play a note every 600ms
    musicInterval = setInterval(playNextMelodyNote, 600);
}

function stopBackgroundMusic() {
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
}

// Music toggle listener
musicToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        musicToggle.classList.add('active');
        musicToggle.innerHTML = `<span class="music-icon">🎵</span> <span class="music-text">Sound: On</span>`;
        initAudio();
        startBackgroundMusic();
        playPopSound(500);
    } else {
        musicToggle.classList.remove('active');
        musicToggle.innerHTML = `<span class="music-icon">🎵</span> <span class="music-text">Sound: Off</span>`;
        stopBackgroundMusic();
    }
});

// --- FLOATING HEARTS BACKGROUND CANVAS ANIMATION ---
const heartCtx = heartsCanvas.getContext('2d');
let hearts = [];

function resizeHeartsCanvas() {
    heartsCanvas.width = window.innerWidth;
    heartsCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeHeartsCanvas);
resizeHeartsCanvas();

class Heart {
    constructor() {
        this.reset();
        // Distribute initially so they don't all rise from the bottom together at startup
        this.y = Math.random() * heartsCanvas.height;
    }

    reset() {
        this.x = Math.random() * heartsCanvas.width;
        this.y = heartsCanvas.height + 20;
        this.size = Math.random() * 15 + 10;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = Math.sin(Math.random() * 2) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.scale = Math.random() * 0.5 + 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        // Warm romantic colors
        const colors = ['#ff85a1', '#ffccd5', '#ff477e', '#ffe5ec', '#ff758f'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        heartCtx.save();
        heartCtx.translate(this.x, this.y);
        heartCtx.rotate(this.rotation);
        heartCtx.scale(this.scale, this.scale);
        heartCtx.beginPath();
        heartCtx.fillStyle = this.color;
        heartCtx.globalAlpha = this.opacity;

        // Draw perfect SVG-like heart path
        const size = this.size;
        heartCtx.moveTo(0, -size / 4);
        heartCtx.bezierCurveTo(-size / 2, -size * 0.75, -size, -size / 3, -size, 0);
        heartCtx.bezierCurveTo(-size, size / 2, -size / 4, size * 0.8, 0, size);
        heartCtx.bezierCurveTo(size / 4, size * 0.8, size, size / 2, size, 0);
        heartCtx.bezierCurveTo(size, -size / 3, size / 2, -size * 0.75, 0, -size / 4);
        
        heartCtx.fill();
        heartCtx.restore();
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        // Add soft swaying motion
        this.speedX += Math.sin(this.y / 30) * 0.02;

        if (this.y < -30 || this.x < -30 || this.x > heartsCanvas.width + 30) {
            this.reset();
        }
    }
}

// Initialize floating background hearts
for (let i = 0; i < 40; i++) {
    hearts.push(new Heart());
}

function animateHearts() {
    heartCtx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);
    hearts.forEach(heart => {
        heart.update();
        heart.draw();
    });
    requestAnimationFrame(animateHearts);
}
animateHearts();


// --- CONFETTI CELEBRATION CANVAS ANIMATION ---
const confettiCtx = confettiCanvas.getContext('2d');
let confettis = [];
let celebrationActive = false;

function resizeConfettiCanvas() {
    // Keep internal resolution matching card/bounding box
    confettiCanvas.width = celebrationCard.clientWidth;
    confettiCanvas.height = celebrationCard.clientHeight;
}

class Confetti {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 6;
        // Explode outward in all directions
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 10 + 5;
        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity - 3; // Upward bias
        this.color = `hsl(${Math.random() * 360}, 90%, 65%)`;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.opacity = 1;
        this.gravity = 0.25;
        this.friction = 0.96;
        this.shape = Math.random() > 0.5 ? 'circle' : 'rect';
    }

    draw() {
        confettiCtx.save();
        confettiCtx.translate(this.x, this.y);
        confettiCtx.rotate(this.rotation);
        confettiCtx.fillStyle = this.color;
        confettiCtx.globalAlpha = this.opacity;
        confettiCtx.beginPath();
        if (this.shape === 'circle') {
            confettiCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        } else {
            confettiCtx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
        }
        confettiCtx.fill();
        confettiCtx.restore();
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.opacity -= 0.01;
    }
}

function triggerConfettiBurst() {
    resizeConfettiCanvas();
    confettis = [];
    
    // Spawn confettis in center of celebration card
    const startX = confettiCanvas.width / 2;
    const startY = confettiCanvas.height / 2;
    
    for (let i = 0; i < 150; i++) {
        confettis.push(new Confetti(startX, startY));
    }
}

function animateConfetti() {
    if (!celebrationActive) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    // Periodically spawn minor bursts during celebration
    if (Math.random() < 0.05 && confettis.length < 100) {
        const randX = Math.random() * confettiCanvas.width;
        const randY = Math.random() * (confettiCanvas.height / 2);
        for(let i=0; i<15; i++) {
            confettis.push(new Confetti(randX, randY));
        }
    }

    confettis = confettis.filter(c => c.opacity > 0);
    confettis.forEach(c => {
        c.update();
        c.draw();
    });

    requestAnimationFrame(animateConfetti);
}

// --- ORBITING HEARTS IN CELEBRATION CARD ---
function spawnOrbitingHearts() {
    orbitingHeartsContainer.innerHTML = '';
    const heartEmojis = ['💖', '❤️', '💕', '🥺', '💞', '🥰'];
    
    // Create 4 orbiting hearts
    for (let i = 0; i < 4; i++) {
        const h = document.createElement('span');
        h.className = 'orbiting-heart';
        h.innerText = heartEmojis[i % heartEmojis.length];
        
        // Arrange rotation delays and offsets
        const delay = i * 1.5;
        h.style.animationDelay = `${delay}s`;
        
        orbitingHeartsContainer.appendChild(h);
    }
}

// --- RANDOM LOVE QUOTES SYSTEM ---
let quoteTimer = null;
function startLoveQuotes() {
    if (quoteTimer) clearInterval(quoteTimer);
    
    // Function to spawn single quote
    const spawnQuote = () => {
        if (!celebrationActive) return;
        const quoteText = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
        
        const quoteEl = document.createElement('div');
        quoteEl.className = 'love-quote';
        quoteEl.innerText = quoteText;
        
        // Random placement avoiding borders
        const padding = 60;
        const x = Math.random() * (window.innerWidth - padding * 2) + padding;
        const y = Math.random() * (window.innerHeight - padding * 2) + padding;
        
        quoteEl.style.left = `${x}px`;
        quoteEl.style.top = `${y}px`;
        
        document.body.appendChild(quoteEl);
        
        // Clean up elements when they fade out
        setTimeout(() => {
            quoteEl.remove();
        }, 4000);
    };

    // Spawn first one immediately, then every 3.5s
    spawnQuote();
    quoteTimer = setInterval(spawnQuote, 3500);
}

function stopLoveQuotes() {
    clearInterval(quoteTimer);
    quoteTimer = null;
    document.querySelectorAll('.love-quote').forEach(el => el.remove());
}


// --- INTERACTIVE BUTTON BEHAVIOR: "NO" ---
function handleNoClick() {
    noClickCount++;
    playPopSound(300 + noClickCount * 40, 'triangle');

    // Show girlfriend's picture on the first NO click
    if (noClickCount === 1) {
        proposalHeart.style.display = 'none';
        noPhotoContainer.style.display = 'block';
    }

    // 1. Update text based on click count
    const textIndex = Math.min(noClickCount - 1, proposalTitles.length - 1);
    questionText.innerText = proposalTitles[textIndex];
    subQuestionText.innerText = proposalSubtitles[textIndex];

    // 2. Scale YES button wrapper (compound sizing)
    const newYesScale = Math.pow(1.22, noClickCount);
    yesBtnWrapper.style.transform = `scale(${newYesScale})`;
    
    // Ensure YES button wrapper takes more layout prominence or overlay
    // If NO click count gets very high, YES button wrapper spans to cover container
    if (noClickCount >= 8) {
        yesBtnWrapper.style.zIndex = "99";
    }

    // 3. Scale NO button down
    const newNoScale = Math.max(0.4, Math.pow(0.88, noClickCount));
    noBtn.style.transform = `scale(${newNoScale})`;

    // 4. Move NO button to a random location inside the proposal card
    moveNoButton();

    // 5. If clicks are high enough, make it super run-away!
    if (noClickCount >= 4) {
        enableNoRunaway();
    }
}

// Place NO button randomly within card bounds
function moveNoButton() {
    // Switch to absolute positioning inside card if not already
    noBtn.style.position = 'absolute';
    
    const cardContent = proposalCard.querySelector('.card-content');
    const containerWidth = cardContent.clientWidth;
    const containerHeight = cardContent.clientHeight;
    
    // Button dimensions
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;
    
    // Bounds boundaries to avoid overlapping Title & Subtitle completely
    // We want it to float mostly in the lower 60% of the card
    const minX = 20;
    const maxX = containerWidth - btnWidth - 20;
    const minY = containerHeight * 0.4;
    const maxY = containerHeight - btnHeight - 30;

    const randomX = Math.random() * (maxX - minX) + minX;
    const randomY = Math.random() * (maxY - minY) + minY;
    
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
}

// Hover runoff behavior
function runawayNoBtn(e) {
    if (noClickCount < 4) return;
    
    // Play a tiny bubble warning pop
    playPopSound(800 + Math.random()*200, 'sine');
    
    // Move it to another random position instantly
    moveNoButton();
}

function enableNoRunaway() {
    noBtn.addEventListener('mouseenter', runawayNoBtn);
    noBtn.addEventListener('touchstart', runawayNoBtn);
}

function disableNoRunaway() {
    noBtn.removeEventListener('mouseenter', runawayNoBtn);
    noBtn.removeEventListener('touchstart', runawayNoBtn);
}


// --- INTERACTIVE BUTTON BEHAVIOR: "YES" ---
function handleYesClick() {
    playCelebrationSound();
    
    // Transition card active state
    proposalCard.classList.remove('active');
    
    // Switch celebration state
    celebrationActive = true;
    setTimeout(() => {
        celebrationCard.classList.add('active');
        triggerConfettiBurst();
        spawnOrbitingHearts();
        startLoveQuotes();
        // Trigger confetti loops
        animateConfetti();
    }, 300);
}


// --- RESET AND REPLAY: "AGAIN" ---
function handleAgainClick() {
    playPopSound(450, 'sine');
    
    // Reset state counters
    noClickCount = 0;
    celebrationActive = false;
    
    // Disable escaping listeners
    disableNoRunaway();
    stopLoveQuotes();

    // Reset visual container elements
    proposalHeart.style.display = 'block';
    noPhotoContainer.style.display = 'none';

    // Reset buttons styles & layouts
    yesBtnWrapper.style.transform = 'scale(1)';
    yesBtnWrapper.style.zIndex = '10';
    
    noBtn.style.position = 'relative';
    noBtn.style.left = 'auto';
    noBtn.style.top = 'auto';
    noBtn.style.transform = 'scale(1)';

    // Reset card texts
    questionText.innerText = "❤️ Do You Love Me? ❤️";
    subQuestionText.innerText = "Choose carefully... 😏";

    // Toggle active classes
    celebrationCard.classList.remove('active');
    setTimeout(() => {
        proposalCard.classList.add('active');
    }, 300);
}

// --- EVENT LISTENERS INITIALIZATION ---
noBtn.addEventListener('click', handleNoClick);
yesBtn.addEventListener('click', handleYesClick);
againBtn.addEventListener('click', handleAgainClick);
