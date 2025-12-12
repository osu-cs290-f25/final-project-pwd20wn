// TODO: Add your client-side JavaScript here
console.log('Client-side JS loaded');

// --- Element References ---
var toggleButton;
var body;
var searchBar;
var searchButton;
var storeFilter;
var categoryFilter;
var ratingFilter;
var priceFilter;
var sortOrder;

//  --- Rendering Function ---
function renderDeals(dealsToRender) {
    if (!dealsContainer) return;

    dealsContainer.innerHTMAL = '';

    if (dealsToRender.length === 0) {
        dealsContainer.innerHTML = '<p style="text-align: center;">No deals match your current filters.</p>';
        return;
    }

    // TEMPORARY rendering logic
    dealsToRender.forEach(deal => {
        dealsContainer.innerHTML += `
            <div class="deal-card" style="border: 1px solid #ccc; padding: 10px; margin: 10px; box-shadow: 2px 2px 5px #ccc;">
                <h4>${deal.title}</h4>
                <p>Price: ${deal.price} | Store: ${deal.category || 'N/A'}</p>
            </div>
        `;
    });
}

// --- Filter Logic ---
function applyFilters() {
    if (typeof DEALS_DATA === 'undefined') {
        console.error("DEALS_DATA in not defined.");
        renderDeals([]);
        return;
    }

    var filteredDeals = DEALS_DATA;

    // --- Store Filter Logic ---
    const selectedStore = storeFilter.value;
    if (selectedStore) {
        filteredDeals = filteredDeals.filter(deal =>
            deal.category === selectedStore
            );
    }

    ////////// Future filter logic goes here ////////////////
    renderDeals(filterDeals);
}

// --- Event Listeners and Initial Setup --- //

document.addEventListener('DOMContentLoaded', () => {

    // Assign Element References *after* the DOM is ready
    toggleButton = document.querySelector('.light-mode-toggle');
    body = document.body;
    searchBar = document.querySelector('.search-bar');
    searchButton = document.querySelector('#search-button');
    storeFilter = document.querySelector('#store-filter');
    categoryFilter = document.querySelector('#category-filter');
    ratingFilter = document.querySelector('#rating-filter');
    priceFilter = document.querySelector('#price-filter');
    sortOrder = document.querySelector('#sort-order')
    dealsContainer = document.querySelector('.deals-grid-container');


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

    // ///////// Dark Mode Toggle Implementation ///////////
        toggleButton.addEventListener('click', () => {
            // Toggle the 'dark-mode' class on the body element
            body.classList.toggle('dark-mode');
            // Save or Remove the setting in localStorage
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                toggleButton.textContent = '💡';
            } else {
                // Clear the preference for light mode
                localStorage.removeItem('theme'); 
                toggleButton.textContent = '🌙';
            }
        });
    
    // Attatch Filter to all inputs
    searchButton.addEventListener('click', applyFilters);
    storeFilter.addEventListener('change', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    ratingFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);
    sortOrder.addEventListener('change', applyFilters);

    // Render: Display all deals on page load
    applyFilters();
});