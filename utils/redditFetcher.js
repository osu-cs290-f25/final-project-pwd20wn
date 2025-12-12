const path = require('path');
const { writeData } = require('./fileOps');
const {
  extractPrice,
  extractSavings,
  calculateOriginalPrice,
  determineCategory,
  getPhotoUrl,
} = require('./formatters');

const OUTPUT_FILE = path.join(__dirname, '../data/deals.json');

async function fetchDeals(limit = 25) {
  const REDDIT_URL = `https://www.reddit.com/r/deals/new.json?limit=${limit}`;
  console.log(`Fetching ${limit} deals from ${REDDIT_URL}...`);

  try {
    const response = await fetch(REDDIT_URL, {
      headers: {
        'User-Agent': 'DealFinder/1.0 (Educational Project)',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const posts = data.data.children;

    const deals = posts.map((post, index) => {
      const p = post.data;
      const price = extractPrice(p.title);
      // shows up in either title or selftext
      const savings =
        extractSavings(p.title) || extractSavings(p.selftext || '');
      const originalPrice = calculateOriginalPrice(price, savings);

      // No store property so infer from url
      let store = null;
      if (p.domain) {
        store = p.domain.replace(/^www\./, '').split('.')[0];
        store = store.charAt(0).toUpperCase() + store.slice(1);
      }

      // not something we can easily get from reddit posts, so just +7 day placehodler for now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const dealScore = 1000; // placeholder

      return {
        id: index.toString(),
        title: p.title,
        photoUrl: getPhotoUrl(p.thumbnail),
        price: price || 'Price not listed',
        originalPrice: originalPrice,
        externalUrl: p.url,
        store: store || 'Various',
        category: determineCategory(p) || 'Misc',
        dealScore: dealScore,
        unitPrice: null, // not sure what this is yet
        percentOff: savings ? `${savings}%` : null,
        expiresAt: expiresAt.toISOString(),
        description: p.selftext || 'No description.',
      };
    });

    await writeData(OUTPUT_FILE, deals);
    console.log(`Successfully wrote ${deals.length} deals to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Error fetching deals:', error);
  }
}

// Get limit from command line args, default to 25
const limitArg = process.argv[2] ? parseInt(process.argv[2]) : 25;
fetchDeals(limitArg);
