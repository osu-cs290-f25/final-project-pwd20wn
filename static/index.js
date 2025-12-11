// TODO: Add your client-side JavaScript here
console.log('Client-side JS loaded');

// --- 1. Element References ---
let toggleButton;
let body;

// --- Event Listeners and Initial Setup ---

document.addEventListener('DOMContentLoaded', () => {

    // A. Assign Element References *after* the DOM is ready
    toggleButton = document.querySelector('.light-mode-toggle');
    body = document.body;

    // B. Dark Mode Toggle Implementation
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            // 1. Toggle the 'dark-mode' class on the body element
            body.classList.toggle('dark-mode');

            // 2. Change the emoji text based on the current state
            toggleButton.textContent = body.classList.contains('dark-mode') ? '🌙' : '💡';
        });
    }
    
});