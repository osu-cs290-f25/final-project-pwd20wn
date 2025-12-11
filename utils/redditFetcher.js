const path = require("path");
const { writeData } = require("./fileOps");
const {
  extractPrice,
  extractSavings,
  calculateOriginalPrice,
  determineCategory,
  getPhotoUrl,
} = require("./formatters");

const OUTPUT_FILE = path.join(__dirname, "../data/deals.json");

async function fetchDeals(limit = 25) {
  const REDDIT_URL = `https://www.reddit.com/r/deals/new.json?limit=${limit}`;
  console.log(`Fetching ${limit} deals from ${REDDIT_URL}...`);

  try {
    const response = await fetch(REDDIT_URL, {
      headers: {
        "User-Agent": "DealFinder/1.0 (Educational Project)",
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
      const savings =
        extractSavings(p.title) || extractSavings(p.selftext || "");
      const originalPrice = calculateOriginalPrice(price, savings);

      return {
        id: index.toString(),
        title: p.title,
        price: price,
        originalPrice: originalPrice,
        savings: savings ? `${savings}%` : null,
        photoUrl: getPhotoUrl(p.thumbnail),
        category: determineCategory(p),
        externalUrl: p.url,
        description: p.selftext || "No description.",
      };
    });

    await writeData(OUTPUT_FILE, deals);
    console.log(`Successfully wrote ${deals.length} deals to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Error fetching deals:", error);
  }
}

// Get limit from command line args, default to 25
const limitArg = process.argv[2] ? parseInt(process.argv[2]) : 25;
fetchDeals(limitArg);
