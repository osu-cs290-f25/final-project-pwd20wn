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
var dealsContainer

function renderDeals(dealsToRender) {
    if (!dealsContainer) return;

    dealsContainer.textContent = '';
    dealsContainer.className = 'deals grid'; // Add grid class for layout

    if (dealsToRender.length === 0) {
        dealsContainer.className = 'deals'; // Remove grid when empty
        var noDeals = document.createElement('p');
        noDeals.style.textAlign = 'center';
        noDeals.style.marginTop = '40px';
        noDeals.style.color = 'var(--muted)';
        noDeals.textContent = 'No deals match your current filters.';
        dealsContainer.appendChild(noDeals);
        return;
    }

    dealsToRender.forEach(function(deal) {
        // Create card section
        var card = document.createElement('section');
        card.className = 'card';

        // Watchlist button
        var favBtn = document.createElement('button');
        favBtn.className = 'icon fav';
        favBtn.setAttribute('aria-label', 'Add to watchlist');
        favBtn.textContent = '♡';
        card.appendChild(favBtn);

        // Thumbnail container
        var thumb = document.createElement('div');
        thumb.className = 'thumb';
        
        var img = document.createElement('img');
        img.src = deal.image || 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(deal.title);
        img.alt = deal.title;
        thumb.appendChild(img);
        
        var status = document.createElement('span');
        status.className = 'status';
        status.textContent = deal.stock || 'In stock';
        thumb.appendChild(status);
        
        card.appendChild(thumb);

        // Title
        var title = document.createElement('h3');
        title.className = 'title';
        title.textContent = deal.title;
        card.appendChild(title);

        // Meta (store • category)
        var meta = document.createElement('div');
        meta.className = 'meta';
        meta.textContent = (deal.store || 'N/A') + ' • ' + (deal.category || 'N/A');
        card.appendChild(meta);

        // Price
        var priceDiv = document.createElement('div');
        priceDiv.className = 'price';
        
        var currentPrice = document.createElement('b');
        currentPrice.textContent = '$' + (deal.price || '0.00');
        priceDiv.appendChild(currentPrice);
        
        if (deal.originalPrice && deal.originalPrice > deal.price) {
            var strike = document.createElement('span');
            strike.className = 'strike';
            strike.textContent = '$' + deal.originalPrice;
            priceDiv.appendChild(strike);
        }
        card.appendChild(priceDiv);

        // Badges
        var badges = document.createElement('div');
        badges.className = 'badges';
        
        if (deal.dealScore) {
            var scorePill = document.createElement('span');
            scorePill.className = 'pill score';
            scorePill.textContent = 'Score ' + deal.dealScore;
            badges.appendChild(scorePill);
        }
        
        if (deal.rating) {
            var starPill = document.createElement('span');
            starPill.className = 'pill star';
            var fullStars = Math.floor(deal.rating);
            var emptyStars = 5 - Math.ceil(deal.rating);
            var halfStar = (deal.rating % 1 >= 0.5) ? '½' : '';
            var stars = '★'.repeat(fullStars) + halfStar + '☆'.repeat(emptyStars);
            starPill.textContent = stars + ' ' + deal.rating;
            badges.appendChild(starPill);
        }
        
        if (deal.timeLeft) {
            var timePill = document.createElement('span');
            timePill.className = 'pill';
            timePill.textContent = '⏳ ' + deal.timeLeft;
            badges.appendChild(timePill);
        }
        
        card.appendChild(badges);

        // Actions
        var actions = document.createElement('div');
        actions.className = 'actions';
        
        var viewBtn = document.createElement('a');
        viewBtn.className = 'btn primary';
        viewBtn.href = '/deals/' + deal.id;
        viewBtn.textContent = 'View Deal';
        actions.appendChild(viewBtn);
        
        var watchlistBtn = document.createElement('button');
        watchlistBtn.className = 'btn';
        watchlistBtn.textContent = 'Add to Watchlist';
        actions.appendChild(watchlistBtn);
        
        card.appendChild(actions);

        dealsContainer.appendChild(card);
    });
}

function applyFilters() {
    if (typeof DEALS_DATA === 'undefined') {
        console.error("DEALS_DATA is not defined.");
        renderDeals([]);
        return;
    }

    var filteredDeals = DEALS_DATA.slice(); // Create a copy

    // Store Filter
    const selectedStore = storeFilter.value;
    if (selectedStore) {
        filteredDeals = filteredDeals.filter(function(deal) {
            return deal.store === selectedStore;
        });
    }

    // Category Filter
    const selectedCategory = categoryFilter.value;
    if (selectedCategory) {
        filteredDeals = filteredDeals.filter(function(deal) {
            return deal.category === selectedCategory;
        });
    }

    // Rating Filter
    const selectedRating = ratingFilter.value;
    if (selectedRating) {
        var minRating = parseFloat(selectedRating);
        filteredDeals = filteredDeals.filter(function(deal) {
            return deal.rating && deal.rating >= minRating;
        });
    }

    // Price Filter
    const selectedPrice = priceFilter.value;
    if (selectedPrice && selectedPrice !== '0') {
        var maxPrice = parseInt(selectedPrice);
        if (maxPrice === 101) {
            filteredDeals = filteredDeals.filter(function(deal) {
                return deal.price > 100;
            });
        } else {
            filteredDeals = filteredDeals.filter(function(deal) {
                return deal.price <= maxPrice;
            });
        }
    }

    // Search Bar Filter
    const searchTerm = searchBar.value.trim().toLowerCase();
    if (searchTerm) {
        filteredDeals = filteredDeals.filter(function(deal) {
            return deal.title.toLowerCase().includes(searchTerm) ||
                   (deal.category && deal.category.toLowerCase().includes(searchTerm)) ||
                   (deal.store && deal.store.toLowerCase().includes(searchTerm));
        });
    }

    // Sorting
    const sortBy = sortOrder.value;
    if (sortBy === 'price') {
        filteredDeals.sort(function(a, b) {
            return (a.price || 0) - (b.price || 0);
        });
    } else if (sortBy === 'dealScore') {
        filteredDeals.sort(function(a, b) {
            return (b.dealScore || 0) - (a.dealScore || 0);
        });
    } else if (sortBy === 'endingSoon') {
        // You'll need to implement this based on your time data format
        filteredDeals.sort(function(a, b) {
            // Example: if timeLeft is in hours
            return parseFloat(a.timeLeft || 999) - parseFloat(b.timeLeft || 999);
        });
    }

    renderDeals(filteredDeals);
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
    dealsContainer = document.querySelector('.deals');


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
    if (toggleButton) { // Added conditional check
        toggleButton.addEventListener('click', () => {
            // Toggle the 'dark-mode' class on the body element
            body.classList.toggle('dark-mode');
            // Save or Remove the setting in localStorage
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                // When in Dark Mode, show Light emoji 💡
                toggleButton.textContent = '💡';
            } else {
                // Clear the preference for light mode
                localStorage.removeItem('theme'); 
                // When in Light Mode, show Moon emoji 🌙
                toggleButton.textContent = '🌙';
            }
        });
    }
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
