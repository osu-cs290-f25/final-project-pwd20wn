// TODO: Add your client-side JavaScript here
console.log('Client-side JS loaded');

// --- 1. Element References ---
let toggleButton;
let body;

// --- Event Listeners and Initial Setup ---

document.addEventListener('DOMContentLoaded', () => {

    // Assign Element References *after* the DOM is ready
    toggleButton = document.querySelector('.light-mode-toggle');
    body = document.body;

    // Check for Saved Preference on Load
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    // Set initial toggle state (Moon or Sun emoji)
    if (toggleButton) {
        // Set the text content based on the initial class presence
        toggleButton.textContent = body.classList.contains('dark-mode') ? '💡' : '🌙';
    }

    // Dark Mode Toggle Implementation
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            // Toggle the 'dark-mode' class on the body element
            body.classList.toggle('dark-mode');
// Save or Remove the setting in localStorage
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                toggleButton.textContent = '💡';
            } else {
                localStorage.removeItem('theme'); // Clear the preference for light mode
                toggleButton.textContent = '🌙';
            }
        });
    }
    
});