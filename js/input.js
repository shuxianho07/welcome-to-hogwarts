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
            if (window.va) va('event', 'enter_castle');
        });
    });
}

function exitHouse() {
    fadeOutIn(() => {
        setupScene('outside');
        showChat('I see you coming back. Want to take another look around?');
        if (window.va) va('event', 'exit_castle');
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
    if (window.va) va('event', 'open_overlay', { id: id });
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

// Global Navigation Links
const navProjectsLink = document.getElementById('nav-projects-link');
const navAboutLink = document.getElementById('nav-about-link');

if (navProjectsLink) {
    navProjectsLink.addEventListener('click', (e) => {
        e.preventDefault();
        openOverlay('projects');
    });
}

if (navAboutLink) {
    navAboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        openOverlay('about');
    });
}

// =============================================