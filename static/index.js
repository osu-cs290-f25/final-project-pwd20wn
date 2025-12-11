// TODO: Add your client-side JavaScript here
console.log('Client-side JS loaded');


// index.js

// --- 1. Element References ---
const toggleButton = document.querySelector('.light-mode-toggle');
const body = document.body;
const searchBar = document.querySelector('.search-bar');
const storeFilter = document.getElementById('store-filter');
const typeFilter = document.getElementById('type-filter');
const priceFilter = document.getElementById('price-filter');
const dealsContainer = document.querySelector('.deals');

// --- 2. Utility Function ---

/**
 * Converts a price string (like "$49.99" or "Price not listed") to a number.
 */
function getPriceValue(priceStr) {
    if (!priceStr || priceStr.includes('not listed')) {
        return Infinity;
    }
    const cleanPrice = priceStr.replace('$', '').replace(/,/g, '');
    const price = parseFloat(cleanPrice);
    
    return isNaN(price) ? Infinity : price; 
}


// --- 3. Rendering and Population Functions ---

function renderDeals(dealsToRender) {
    // Clear the container
    dealsContainer.innerHTML = ''; 

    if (dealsToRender.length === 0) {
        dealsContainer.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; margin-top: 50px;">No deals match your current filters.</p>';
        return;
    }

    // This client-side rendering is simplified because EJS is server-side.
    // In a final setup, this would use a client-side template engine or dedicated API endpoint.
    dealsToRender.forEach(deal => {
        const dealCardHTML = `
            <div class="deal-card" data-deal-id="${deal.id}">
                <div class="card-image-container">
                    <img src="${deal.photoUrl || 'https://picsum.photos/200'}" alt="${deal.title}" class="card-image">
                    <span class="deal-badge">${deal.category}</span> 
                </div>
                <div class="card-content">
                    <h3 class="card-title"><a href="/deals/${deal.id}">${deal.title}</a></h3>
                    <p class="card-details">
                        <span class="card-store">Reddit Deals</span> | 
                        <span class="card-rating">⭐ N/A</span>
                    </p>
                    <div class="card-footer">
                        <span class="card-price">${deal.price}</span>
                        <a href="${deal.externalUrl || '#'}" class="view-deal-btn" target="_blank">View Deal</a>
                    </div>
                </div>
            </div>
        `;
        dealsContainer.innerHTML += dealCardHTML;
    });
}

function populateFilter(filterElement, deals) {
    // Both 'Store' and 'Type' use the same underlying data (category)
    const categories = new Set();
    deals.forEach(deal => {
        if (deal.category) {
            categories.add(deal.category);
        }
    });

    filterElement.innerHTML = `<option value="">${filterElement.id.includes('store') ? 'Stores' : 'Types'}</option>`;

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.replace(/[\[\]]/g, '');
        filterElement.appendChild(option);
    });
}


// --- 4. Master Filter Logic ---

function applyFilters() {
    // DEALS_DATA is injected globally by the server in index.ejs
    let filteredDeals = DEALS_DATA;

    // 1. Apply Search Filter
    const searchTerm = searchBar.value.toLowerCase().trim();
    if (searchTerm) {
        filteredDeals = filteredDeals.filter(deal => 
            deal.title.toLowerCase().includes(searchTerm)
        );
    }
    
    // 2. Apply Store/Category Filter
    const selectedStore = storeFilter.value;
    if (selectedStore) {
        filteredDeals = filteredDeals.filter(deal => 
            deal.category === selectedStore
        );
    }
    
    // 3. Apply Types Filter
    const selectedType = typeFilter.value;
    if (selectedType) {
        filteredDeals = filteredDeals.filter(deal => 
            deal.category === selectedType
        );
    }

    // 4. Apply Price Range Filter
    const selectedPriceValue = parseInt(priceFilter.value); 
    if (selectedPriceValue > 0) {
        filteredDeals = filteredDeals.filter(deal => {
            const dealPrice = getPriceValue(deal.price);

            if (selectedPriceValue === 101) {
                // Over $100
                return dealPrice > 100 && dealPrice !== Infinity;
            } else {
                // Under $N (25, 50, 100)
                return dealPrice < selectedPriceValue;
            }
        });
    }

    // Final result
    renderDeals(filteredDeals);
}


// --- 5. Event Listeners and Initial Setup ---

// Dark Mode Toggle
if (toggleButton) {
    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        toggleButton.textContent = body.classList.contains('dark-mode') ? '🌙' : '💡';
    });
}

// Attach Master Filter to all inputs
searchBar.addEventListener('input', applyFilters);
storeFilter.addEventListener('change', applyFilters);
typeFilter.addEventListener('change', applyFilters);
priceFilter.addEventListener('change', applyFilters);

// Initial Setup
// Wait for the DEALS_DATA variable to be defined by the EJS script tag
window.addEventListener('load', () => {
    // Populate filters and render the initial full list
    if (typeof DEALS_DATA !== 'undefined' && DEALS_DATA.length > 0) {
        populateFilter(storeFilter, DEALS_DATA);
        populateFilter(typeFilter, DEALS_DATA);
        applyFilters(); // Renders the initial list
    }
});


