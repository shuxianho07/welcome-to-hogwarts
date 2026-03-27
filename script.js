/*
  Welcome to Hogwarts — Interactive Portfolio Game Engine
  DOM-based scene system with physics, camera, and interactive hotspots.
  
  Scenes:
    - outside: Hogwarts grounds (CSS gradient bg). Walk to the door to enter.
    - inside:  Common room. Explore to find portfolio items (Skills, Experience, Projects, About).
*/

// =============================================
// CONFIG
// =============================================
const CONFIG = {
    reference: { width: 1440, height: 900 },
    character: {
        width: 160,
        height: 260,
        speed: 360,        // gentler: px per second
        jumpSpeed: 700,
        spawnOutside: { xPct: 25, yPct: 85 },
        spawnInside: { xPct: 25, yPct: 85 }
    },
    physics: {
        gravity: 1400,
        groundOffsetOutside: 30,
        groundOffsetInside: 70
    },
    outside: {
        widthMultiplier: 1.3,   // world is 1.3x viewport width
        door: { xPct: 75, radius: 120 }
    },
    inside: {
        widthMultiplier: 1.3,
        exit: { xPct: 75, radius: 120 },
        hotspots: [
            // bgImg* = pixel coords in corridor.jpg (1600×475).
            // World position is derived at runtime: worldPos = bgImg* × (worldH / 475).
            { id: 'skills',
              label: 'Skills & Spells',
              iconSrc: 'assets/icons/skills.png',
              bgImgX: 282, bgImgY: 52, bgImgW: 70,  bgImgH: 120 }, // Positioned over the white wall sconce
            { id: 'experience',
              label: 'Work Experience',
              iconSrc: 'assets/icons/experience.png',
              bgImgX: 429, bgImgY: 100, bgImgW: 195, bgImgH: 305 }, // Exact size of center-left frame
            { id: 'projects',
              label: 'Project Archives',
              iconSrc: 'assets/icons/projects.png',
              bgImgX: 1114, bgImgY: 168, bgImgW: 120, bgImgH: 288 }, // Exact size of right narrow frame
            { id: 'about',
              label: 'About Me',
              iconSrc: 'assets/icons/about.png',
              bgImgX: 850, bgImgY: 290, bgImgW: 120,  bgImgH: 150 } // Sitting on wainscoting ledge (y=440)
        ],
        hotspotRadius: 100
    },
    // How far horizontally the character is allowed to move (as % of world width)
    // Lowering the maxPct “shrinks” the walkable area.
    bounds: {
        outside: { minPct: 17, maxPct: 75 },
        inside: { minPct: 10, maxPct: 90 }
    },
    transitionMs: 400
};

// =============================================
// STATE
// =============================================
let scene = 'outside';
let keys = new Set();
let lastTime = 0;
let worldW = 0, worldH = 0;
let corridorScale = 1; // worldH / 475 — converts corridor.jpg px → world px
let charX = 0, charY = 0;
let cameraX = 0;
let vx = 0;
let vy = 0;
let onGround = false;
let lastFacing = 1;     // 1 = right, -1 = left
let isMoving = false;
let canInteract = false;
let currentInteraction = null;
let overlayOpen = false;
let chatTimerId = null;
let idleChatTimerId = null;
let hasStartedMoving = false;
let sceneTransitioning = false;
let enterAnimRunning = false;

const IDLE_CHAT_LINES = [
    "The castle is watching...",
    "Did you know the portraits talk when you're not looking?",
    "A good wizard never reveals their secrets...",
    "The stairs move when you're not paying attention...",
    "Keep exploring — there are hidden paths everywhere."
];

// Sprite animation state
let walkFrame = 0;
let walkFrameTimer = 0;
const WALK_FRAME_INTERVAL = 0.15; // seconds between walk frames

// =============================================
// DOM ELEMENTS
// =============================================
const loadingScreen = document.getElementById('loading-screen');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const enterBtn = document.getElementById('enter-btn');

const gameEl = document.getElementById('game');
const worldEl = document.getElementById('world');
const bgEl = document.getElementById('bg');
const charEl = document.getElementById('character');

const spotlightEl = document.getElementById('spotlight-overlay');
const interactBtn = document.getElementById('interact');
const chatEl = document.getElementById('chat');
const fadeEl = document.getElementById('fade');
const backButton = document.getElementById('back-button');
const instructionsEl = document.getElementById('movement-instructions');
const touchControlsEl = document.getElementById('touch-controls');

// Theme toggle (Luminus / Nox)
const themeToggleBtn = document.getElementById('theme-toggle');
const THEME_KEY = 'hogwarts.theme';
let themeMode = 'light';

function applyTheme(mode) {
    themeMode = mode === 'nox' ? 'nox' : 'light';

    // Only apply UI background theme when outside.
    if (bgEl.classList.contains('scene-outside')) {
        bgEl.dataset.theme = themeMode;
    }

    if (themeToggleBtn) {
        themeToggleBtn.textContent = themeMode === 'nox' ? 'Luminus' : 'Nox';
    }

    try {
        localStorage.setItem(THEME_KEY, themeMode);
    } catch (e) {
        // Ignore if storage is unavailable.
    }
}

function toggleTheme() {
    applyTheme(themeMode === 'nox' ? 'light' : 'nox');
}

function initTheme() {
    const saved = (function () {
        try {
            return localStorage.getItem(THEME_KEY);
        } catch (e) {
            return null;
        }
    })();
    applyTheme(saved === 'nox' ? 'nox' : 'light');
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
}

// =============================================
// SPRITES
// =============================================
const SPRITES = {
    idle: 'assets/front.png',
    back: 'assets/back.png',
    walkRight1: 'assets/walking.png',
    walkRight2: 'assets/right_facing.png',
    // Use the same right-facing sprite for left movement and mirror it via CSS.
    walkLeft1: 'assets/walking.png',
    walkLeft2: 'assets/right_facing.png',
    jumpLeft: 'assets/left jump.png',
    // Use the right-facing stop sprite for the mirrored left stop.
    stopLeft: 'assets/right_facing.png',
    stopRight: 'assets/right_facing.png',
    loading: 'assets/loading.png',
    door: 'assets/door.png',
    corridor: 'assets/corridor.png'
};

// Preload all sprites and remove white backgrounds via canvas
const spriteCache = {};
const processedSprites = {}; // stores data URLs with white removed

function removeWhiteBackground(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const isJumpSprite = img.src.includes('jump');

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;
            const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];

            if (a === 0) continue;

            // Specifically for the jump sprite: the drawn grey shadow is at the bottom of the image.
            // Since she's jumping, her feet are higher up. We can just erase the bottom 40 pixels!
            if (isJumpSprite && y > canvas.height - 40) {
                data[i + 3] = 0;
                continue;
            }

            // Safe, conservative white removal (protects skin/hair/leggings).
            // Only strip fully pure white, and only lightly fade values that are very close to white.
            // This avoids removing light-colored pixels like highlights that are part of the sprite.
            if (r === 255 && g === 255 && b === 255) {
                data[i + 3] = 0;
            } else if (r >= 252 && g >= 252 && b >= 252) {
                data[i + 3] =0;
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
}

function preloadSprites() {
    return new Promise((resolve) => {
        // Only preload character sprites (not loading image)
        const entries = Object.entries(SPRITES).filter(([k]) => k !== 'loading');
        const uniquePaths = [...new Set(entries.map(([, v]) => v))];
        let loaded = 0;
        uniquePaths.forEach(src => {
            const img = new Image();
            img.onload = () => {
                spriteCache[src] = img;
                // Process white background removal
                processedSprites[src] = removeWhiteBackground(img);
                loaded++;
                updateLoadingProgress(Math.round((loaded / uniquePaths.length) * 100));
                if (loaded === uniquePaths.length) resolve();
            };
            img.onerror = () => {
                loaded++;
                updateLoadingProgress(Math.round((loaded / uniquePaths.length) * 100));
                if (loaded === uniquePaths.length) resolve();
            };
            img.src = src;
        });
    });
}

let currentSpriteSrc = '';
function setCharacterSprite(src) {
    if (currentSpriteSrc === src) return;
    currentSpriteSrc = src;
    // Use processed (white-removed) version if available
    charEl.src = processedSprites[src] || src;
}

// =============================================
// LOADING SCREEN
// =============================================
function updateLoadingProgress(pct) {
    progressFill.style.width = pct + '%';
    progressText.textContent = pct + '%';
}

async function runLoadingScreen() {
    // Animate loading phrases
    const phrases = [
        'Summoning house elves...',
        'Polishing wands...',
        'Brewing potions...',
        'Consulting the Marauder\'s Map...'
    ];
    let phraseIdx = 0;
    const subtitle = document.querySelector('.loading-subtitle');
    const phraseInterval = setInterval(() => {
        if (phraseIdx < phrases.length) {
            subtitle.textContent = phrases[phraseIdx++];
        }
    }, 600);

    await preloadSprites();
    clearInterval(phraseInterval);
    subtitle.textContent = 'Come in and find out what I\'ve been up to!';

    // Show enter button
    enterBtn.classList.remove('hidden');
}

enterBtn.addEventListener('click', () => {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        startGame();
        // Grab keyboard focus so WASD/arrow keys work immediately
        gameEl.focus();
    }, 800);
});

// =============================================
// SCENE SETUP
// =============================================
function viewportSize() {
    return { w: window.innerWidth, h: window.innerHeight };
}

function getGroundY() {
    if (scene === 'outside') return worldH - CONFIG.physics.groundOffsetOutside;
    return worldH - CONFIG.physics.groundOffsetInside;
}

function setupScene(sceneName) {
    scene = sceneName;
    const { w, h } = viewportSize();

    // Clear existing world decorations
    worldEl.querySelectorAll('.hotspot-marker, .door-marker, .ground-outside, .ground-inside, .torch, .castle-decor, .greeting-text, .instruction-text').forEach(el => el.remove());

    if (sceneName === 'outside') {
        worldW = Math.max(w, h * 1.77); // Ensure it fills the screen width at minimum
        worldH = h;
        bgEl.className = 'scene-outside';
        applyTheme(themeMode);
        bgEl.style.width = worldW + 'px';
        bgEl.style.height = worldH + 'px';
        worldEl.style.width = worldW + 'px';
        worldEl.style.height = worldH + 'px';

        // Add ground
        const ground = document.createElement('div');
        ground.className = 'ground-outside';
        worldEl.appendChild(ground);

        // Add door hotspot over the background illustration
        // In the provided image, the door is perfectly centered
        const doorX = (50 / 100) * worldW;
        const door = document.createElement('div');
        door.className = 'door-marker';
        door.style.left = doorX + 'px';
        door.style.width = '300px';
        // door rests exactly on the ground
        door.style.bottom = CONFIG.physics.groundOffsetOutside + 'px';
        worldEl.appendChild(door);

        // Add castle decorations
        addOutsideDecorations();

        // Hide back button
        backButton.classList.add('hidden');

        // Spawn character
        charX = (CONFIG.character.spawnOutside.xPct / 100) * worldW;
        charY = getGroundY();

    } else if (sceneName === 'inside') {
        const { h } = viewportSize();
        worldH = h;
        corridorScale = worldH / 475;
        // Set the world width strictly to the width of the scaled corridor background
        // The background image is 1600px wide naturally
        worldW = Math.max(1600 * corridorScale, window.innerWidth);
        
        bgEl.className = 'scene-inside';
        applyTheme(themeMode);
        bgEl.style.width = worldW + 'px';
        bgEl.style.height = worldH + 'px';
        worldEl.style.width = worldW + 'px';
        worldEl.style.height = worldH + 'px';

        // Add floor
        const floor = document.createElement('div');
        floor.className = 'ground-inside';
        worldEl.appendChild(floor);

        // Add torches
        addInsideDecorations();

        // Add hotspot markers
        corridorScale = worldH / 475;

        CONFIG.inside.hotspots.forEach(hs => {
            const marker = document.createElement('div');
            marker.className = 'hotspot-marker';
            marker.dataset.id = hs.id;

            // Place marker exactly over the corridor.jpg background item
            const hsWorldX = hs.bgImgX * corridorScale;
            const hsWorldY = hs.bgImgY * corridorScale;
            const iconW     = hs.bgImgW * corridorScale;
            const iconH     = hs.bgImgH * corridorScale;

            marker.style.left      = hsWorldX + 'px';
            marker.style.top       = hsWorldY + 'px';
            marker.style.transform = 'none'; // no centering — top-left anchored to item position

            // Icon sized to match the background item
            const iconHtml = hs.iconSrc
                ? `<img class="hotspot-icon-img" src="${hs.iconSrc}" alt="${hs.label}" style="width:${iconW}px;height:${iconH}px;">`
                : '';
            marker.innerHTML = `
        ${iconHtml}
        <span class="hotspot-label">${hs.label}</span>
      `;
            worldEl.appendChild(marker);
        });

        // Show back button
        backButton.classList.remove('hidden');

        // Spawn character
        charX = (CONFIG.character.spawnInside.xPct / 100) * worldW;
        charY = getGroundY();
    }

    vy = 0;
    onGround = true;
    lastFacing = 1;
    charEl.style.setProperty('--facing', '1');
    setCharacterSprite(SPRITES.idle);

    // Half-body mode for the corridor scene
    if (sceneName === 'inside') {
        charEl.classList.add('half-body');
    } else {
        charEl.classList.remove('half-body');
    }

    placeCharacter();
    centerCamera();
}

function addOutsideDecorations() {
    // Fiona Fang style greeting title
    const greeting = document.createElement('div');
    greeting.className = 'greeting-text';
    greeting.innerHTML = `I'm <span class="highlight">Shuxian</span>,<br>Come in ➔`;
    worldEl.appendChild(greeting);

    // Instructional text at the bottom
    const instruction = document.createElement('div');
    instruction.className = 'instruction-text';
    instruction.innerHTML = `Use arrow or WASD keys to move & press E to interact ✨`;
    worldEl.appendChild(instruction);
}

function addInsideDecorations() {
    // Corridor background already has paintings, sconces, and decor — no overlaid emoji needed.
}

// =============================================
// CHARACTER PLACEMENT & CAMERA
// =============================================
function placeCharacter() {
    charEl.style.left = charX + 'px';
    charEl.style.top = charY + 'px';
}

function centerCamera() {
    const { w, h } = viewportSize();
    const targetX = clamp(charX - w / 2, 0, Math.max(0, worldW - w));
    cameraX = targetX;
    worldEl.style.transform = `translateX(${-cameraX}px)`;
}

function smoothCamera(dt) {
    const { w } = viewportSize();
    const targetX = clamp(charX - w / 2, 0, Math.max(0, worldW - w));
    cameraX = lerp(cameraX, targetX, Math.min(1, dt * 5));
    worldEl.style.transform = `translateX(${-cameraX}px)`;
}

// =============================================
// UTILITIES
// =============================================
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function dist(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); }
function show(el) { if (el) el.classList.remove('hidden'); }
function hide(el) { if (el) el.classList.add('hidden'); }

// =============================================
// INPUT
// =============================================
const touchState = { left: false, right: false, up: false };
let touchJumpTriggered = false;

window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (['a', 'arrowleft', 'd', 'arrowright', 'w', 'arrowup', ' ', 'enter', 'e'].includes(key)) {
        e.preventDefault();
        keys.add(key);
        resetIdleChatTimer();
    }
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    keys.delete(key);
});

function isLeft() { return keys.has('a') || keys.has('arrowleft') || touchState.left; }
function isRight() { return keys.has('d') || keys.has('arrowright') || touchState.right; }
function isJump() { return keys.has('w') || keys.has('arrowup') || keys.has(' ') || touchState.up; }
function isAction() { return keys.has('enter') || keys.has('e'); }

// =============================================
// TOUCH CONTROLS
// =============================================
function setupTouchControls() {
    if (!('ontouchstart' in window)) return;
    show(touchControlsEl);

    touchControlsEl.querySelectorAll('.touch-btn').forEach(btn => {
        const key = btn.dataset.key;

        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchState[key] = true;
            btn.classList.add('active');
            if (key === 'up' && onGround && !touchJumpTriggered) {
                vy = -CONFIG.character.jumpSpeed;
                onGround = false;
                touchJumpTriggered = true;
            }
        }, { passive: false });

        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            touchState[key] = false;
            btn.classList.remove('active');
            if (key === 'up') touchJumpTriggered = false;
        });

        btn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            touchState[key] = false;
            btn.classList.remove('active');
            if (key === 'up') touchJumpTriggered = false;
        });

        btn.addEventListener('contextmenu', (e) => e.preventDefault());
    });
}

// =============================================
// SCENE TRANSITIONS
// =============================================
function fadeOutIn(callback) {
    if (sceneTransitioning) return;
    sceneTransitioning = true;
    show(fadeEl);

    requestAnimationFrame(() => {
        fadeEl.classList.add('show');

        const doTransition = async () => {
            if (callback) await callback();

            requestAnimationFrame(() => {
                fadeEl.classList.remove('show');

                // Rely on timeout purely instead of transitionend for game state stability
                setTimeout(() => {
                    hide(fadeEl);
                    sceneTransitioning = false;
                }, 450); // 400ms CSS transition + 50ms buffer
            });
        };

        // Rely on timeout for the fade-in half too
        setTimeout(doTransition, 450);
    });
}

function enterHouse() {
    playEnterAnimation(() => {
        fadeOutIn(() => {
            setupScene('inside');
            showChat('Welcome to the Common Room! Explore to find my portfolio...');
        });
    });
}

function exitHouse() {
    fadeOutIn(() => {
        setupScene('outside');
        showChat('I see you coming back. Want to take another look around?');
    });
}

// =============================================
// INTERACTIONS
// =============================================
function showChat(text, duration = 3000) {
    chatEl.textContent = text;
    show(chatEl);
    positionChatAboveCharacter();

    if (chatTimerId) clearTimeout(chatTimerId);
    chatTimerId = setTimeout(() => {
        hide(chatEl);
        chatTimerId = null;
    }, duration);
}

function resetIdleChatTimer() {
    if (idleChatTimerId) clearTimeout(idleChatTimerId);
    // Only start when game is running and not in a transition/overlay
    if (overlayOpen || sceneTransitioning) return;

    idleChatTimerId = setTimeout(() => {
        const line = IDLE_CHAT_LINES[Math.floor(Math.random() * IDLE_CHAT_LINES.length)];
        showChat(line, 2500);
        resetIdleChatTimer();
    }, 10000);
}

function positionChatAboveCharacter() {
    const { w } = viewportSize();
    const screenX = charX - cameraX;
    const screenY = charY - CONFIG.character.height - 120;
    chatEl.style.left = (screenX - chatEl.offsetWidth / 2-10) + 'px';
    chatEl.style.top = screenY + 'px';
}

// Vertical offset for the interact prompt (higher = more negative)
const INTERACT_BUTTON_VERTICAL_OFFSET = 140;

function positionInteractButton(worldX, worldY) {
    const screenX = worldX - cameraX;
    const screenY = worldY;
    interactBtn.style.left = (screenX - interactBtn.offsetWidth / 2) + 'px';
    interactBtn.style.top = (screenY - INTERACT_BUTTON_VERTICAL_OFFSET) + 'px';
}

function openOverlay(id) {
    const overlay = document.getElementById('overlay-' + id);
    if (!overlay) return;
    overlayOpen = true;
    show(overlay);
}

function closeOverlay(id) {
    const overlay = document.getElementById('overlay-' + id);
    if (!overlay) return;
    hide(overlay);
    overlayOpen = false;
    canInteract = false;
    currentInteraction = null;
    // Consume key so it doesn't re-trigger
    keys.delete('enter');
    keys.delete('e');

    // Re-grab keyboard focus after overlay closes
    gameEl.focus();
    resetIdleChatTimer();
}

// Close overlay on backdrop/close button click
document.querySelectorAll('.overlay-backdrop, .overlay-close').forEach(el => {
    el.addEventListener('click', () => {
        const closeId = el.dataset.close;
        if (closeId) closeOverlay(closeId);
    });
});

// Open secondary overlays (from inner items like Suitcase icons)
document.querySelectorAll('[data-open]').forEach(el => {
    el.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent clicking suitcase items from closing things
        const openId = el.dataset.open;
        if (openId) openOverlay(openId);
    });
});

// Interact button click
interactBtn.addEventListener('click', () => {
    if (currentInteraction === 'door') {
        enterHouse();
    } else if (currentInteraction === 'exit') {
        exitHouse();
    } else if (currentInteraction) {
        openOverlay(currentInteraction);
    }
});

// Back button
backButton.addEventListener('click', () => {
    if (!overlayOpen && !sceneTransitioning) exitHouse();
});

// =============================================
// GAME LOOP
// =============================================
function tick(timestamp) {
    if (!lastTime) { lastTime = timestamp; requestAnimationFrame(tick); return; }
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;

    // Pause normal movement/sprite updates during the enter animation
    if (!overlayOpen && !sceneTransitioning && !enterAnimRunning) {
        updatePhysics(dt);
        updateCharacterSprite(dt);
        updateInteractions();
    }

    smoothCamera(dt);
    updateSpotlight();

    // Keep chat following character
    if (!chatEl.classList.contains('hidden')) {
        positionChatAboveCharacter();
    }

    requestAnimationFrame(tick);
}

function updatePhysics(dt) {
    // Faster movement inside the corridor for smoother traversal
    const speed = scene === 'inside' ? 500 : CONFIG.character.speed;
    let moving = false;

    // Horizontal movement
    if (isLeft()) {
        charX -= speed * dt;
        lastFacing = -1;
        moving = true;
    } else if (isRight()) {
        charX += speed * dt;
        lastFacing = 1;
        moving = true;
    }

    isMoving = moving;

    // Show instructions on first move
    if (moving && !hasStartedMoving) {
        hasStartedMoving = true;
        hide(instructionsEl);
    }

    // Jump
    if (isJump() && onGround) {
        vy = -CONFIG.character.jumpSpeed;
        onGround = false;
    }

    // Gravity
    vy += CONFIG.physics.gravity * dt;
    charY += vy * dt;

    // Ground collision
    const groundY = getGroundY();
    if (charY >= groundY) {
        charY = groundY;
        vy = 0;
        onGround = true;
    }

    // Clamp to constructed bounds (allows tuning movement range independent of world width)
    const sceneBounds = CONFIG.bounds && CONFIG.bounds[scene];
    if (sceneBounds) {
        const minX = (sceneBounds.minPct / 100) * worldW;
        const maxX = (sceneBounds.maxPct / 100) * worldW;
        charX = clamp(charX, minX, maxX);
    } else {
        charX = clamp(charX, CONFIG.character.width / 2, worldW - CONFIG.character.width / 2);
    }

    // Apply facing — only flip for jump-right (since we have dedicated left/right sprites)
    // For all other sprites, --facing stays 1 (no flip) because each direction has its own art
    placeCharacter();
}

function playEnterAnimation(callback) {
    if (enterAnimRunning) return;
    enterAnimRunning = true;

    const origX = charX;
    const origY = charY;

    // Determine a short walk path toward the door (left/up)
    const targetY = Math.max(0, charY - 50);
    const targetX = Math.max(CONFIG.character.width / 2, charX - 40);

    // Turn back (face left/back) immediately
    lastFacing = -1;
    setCharacterSprite(SPRITES.back || SPRITES.idle);

    const duration = 500;
    const turnDuration = 120;
    const walkDuration = duration - turnDuration;

    let start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;

        if (elapsed < turnDuration) {
            // still “turning back” — hold the back sprite
            requestAnimationFrame(step);
            return;
        }

        const walkElapsed = elapsed - turnDuration;
        const t = Math.min(1, walkElapsed / walkDuration);

        charY = origY + (targetY - origY) * t;
        charX = origX + (targetX - origX) * t;
        placeCharacter();

        if (t < 1) {
            requestAnimationFrame(step);
            return;
        }

        // Finished walking; keep the back view briefly then continue
        setTimeout(() => {
            enterAnimRunning = false;
            if (typeof callback === 'function') callback();
        }, 150);
    }

    requestAnimationFrame(step);
}

function updateCharacterSprite(dt) {
    // Toggle jumping class for CSS (e.g. shadow removal)
    charEl.classList.toggle('jumping', !onGround);

    if (!onGround) {
        // Jumping — use the side-profile jump sprite and mirror for left-facing movement.
        setCharacterSprite(SPRITES.jumpLeft);
        charEl.style.setProperty('--facing', lastFacing);
    } else if (isMoving) {
        // Corridor uses a slower frame interval for a gentler animation
        const interval = scene === 'inside' ? 0.3 : WALK_FRAME_INTERVAL;
        walkFrameTimer += dt;
        if (walkFrameTimer >= interval) {
            walkFrame = (walkFrame + 1) % 2;
            walkFrameTimer = 0;
        }
        const sprite = walkFrame === 0 ? SPRITES.walkRight1 : SPRITES.walkRight2;
        setCharacterSprite(sprite);
        charEl.style.setProperty('--facing', lastFacing);
    } else {
        // Idle — in the corridor show a side-facing sprite that mirrors based on
        // the last movement direction; outside show the front-facing sprite.
        if (scene === 'inside') {
            setCharacterSprite(SPRITES.walkRight2); // side-facing pose
            charEl.style.setProperty('--facing', lastFacing);
        } else {
            setCharacterSprite(SPRITES.idle);
            charEl.style.setProperty('--facing', '1');
        }
        walkFrameTimer = 0;
        walkFrame = 0;
    }
}

function updateInteractions() {
    canInteract = false;
    currentInteraction = null;

    if (scene === 'outside') {
        // Check door proximity over the painted center door
        const doorX = (50 / 100) * worldW;
        const doorDist = Math.abs(charX - doorX);

        if (doorDist < CONFIG.outside.door.radius) {
            canInteract = true;
            currentInteraction = 'door';
            show(interactBtn);
            interactBtn.textContent = 'Enter Castle ⏎';
            positionInteractButton(doorX, getGroundY() - CONFIG.character.height);
        }
    } else if (scene === 'inside') {
        // Check exit proximity
        const exitX = (CONFIG.inside.exit.xPct / 100) * worldW;
        const exitDist = Math.abs(charX - exitX);

        if (exitDist < CONFIG.inside.exit.radius) {
            canInteract = true;
            currentInteraction = 'exit';
            show(interactBtn);
            interactBtn.textContent = '⬅ Exit Castle ⏎';
            positionInteractButton(exitX + 60, getGroundY() - CONFIG.character.height);
        }

        // Check hotspot proximity
        CONFIG.inside.hotspots.forEach(hs => {
            const hsX    = hs.bgImgX * corridorScale;
            const hsDist = Math.abs(charX - hsX);

            // Update marker glow state
            const marker = worldEl.querySelector(`.hotspot-marker[data-id="${hs.id}"]`);
            if (marker) {
                marker.classList.toggle('near', hsDist < CONFIG.inside.hotspotRadius);
            }

            if (hsDist < CONFIG.inside.hotspotRadius && !canInteract) {
                canInteract = true;
                currentInteraction = hs.id;
                show(interactBtn);
                interactBtn.textContent = `${hs.label} ⏎`;
                // Show interact button just below the background item
                const hsScreenY = hs.bgImgY * corridorScale + hs.bgImgH * corridorScale;
                positionInteractButton(hsX, hsScreenY);
            }
        });
    }

    // Hide interact button if nothing nearby
    if (!canInteract) {
        hide(interactBtn);
    }

    // Handle action key
    if (isAction() && canInteract && !overlayOpen) {
        keys.delete('enter');
        keys.delete('e');
        if (currentInteraction === 'door') {
            enterHouse();
        } else if (currentInteraction === 'exit') {
            exitHouse();
        } else {
            openOverlay(currentInteraction);
        }
    }
}

// =============================================
// SPOTLIGHT
// =============================================
function updateSpotlight() {
    if (!spotlightEl) return;
    const screenX = charX - cameraX;
    const screenY = charY - CONFIG.character.height / 2;
    spotlightEl.style.setProperty('--spotlight-x', screenX + 'px');
    spotlightEl.style.setProperty('--spotlight-y', screenY + 'px');
}

function enableSpotlight() {
    spotlightEl.classList.add('active', 'spotlight');
}

// =============================================
// START GAME
// =============================================
function startGame() {
    show(gameEl);
    setupScene('outside');
    initTheme();
    setupTouchControls();
    enableSpotlight();

    // Make game div focusable and grab focus so keys work on deployed sites
    gameEl.setAttribute('tabindex', '0');
    gameEl.style.outline = 'none';
    gameEl.focus();

    // Re-grab focus any time the user clicks inside the game
    gameEl.addEventListener('click', () => gameEl.focus());

    // Show instructions
    show(instructionsEl);

    // Welcome chat
    setTimeout(() => {
        showChat('Welcome to Susan Ho\'s Personal Space! Use arrow keys to explore.');
        resetIdleChatTimer();
    }, 500);

    // Start game loop
    requestAnimationFrame(tick);
}

// =============================================
// RESIZE HANDLING
// =============================================
window.addEventListener('resize', () => {
    if (gameEl.classList.contains('hidden')) return;
    const { w, h } = viewportSize();

    // Recalculate world size
    if (scene === 'outside') {
        worldW = Math.max(w * CONFIG.outside.widthMultiplier, 1600);
    } else {
        worldW = Math.max(w * CONFIG.inside.widthMultiplier, 3000);
    }
    worldH = h;

    bgEl.style.width = worldW + 'px';
    bgEl.style.height = worldH + 'px';
    worldEl.style.width = worldW + 'px';
    worldEl.style.height = worldH + 'px';

    // Re-ground character
    const groundY = getGroundY();
    if (onGround) charY = groundY;

    // Clamp within bounds (if configured), otherwise use full world bounds
    const sceneBounds = CONFIG.bounds && CONFIG.bounds[scene];
    if (sceneBounds) {
        const minX = (sceneBounds.minPct / 100) * worldW;
        const maxX = (sceneBounds.maxPct / 100) * worldW;
        charX = clamp(charX, minX, maxX);
    } else {
        charX = clamp(charX, CONFIG.character.width / 2, worldW - CONFIG.character.width / 2);
    }

    placeCharacter();
    centerCamera();
});

// =============================================
// KEYBOARD SHORTCUT: ESC to close overlays
// =============================================
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlayOpen) {
        // Find open overlay and close it
        document.querySelectorAll('.overlay:not(.hidden)').forEach(ol => {
            const backdrop = ol.querySelector('.overlay-backdrop');
            const closeId = backdrop?.dataset.close;
            if (closeId) closeOverlay(closeId);
        });
    }
});

// =============================================
// INIT
// =============================================
runLoadingScreen();