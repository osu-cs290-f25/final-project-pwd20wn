function extractPrice(title) {
  const priceMatch = title.match(/\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/); //thanks gemini
  return priceMatch ? priceMatch[0] : null;
}

function extractSavings(text) {
  // Matches "20% off", "20%", "-20%"
  const savingsMatch = text.match(/(\d+)%\s*(?:off)?/i);
  return savingsMatch ? savingsMatch[1] : null;
}

function calculateOriginalPrice(priceStr, savingsStr) {
  if (!priceStr || !savingsStr || priceStr === 'Price not listed') return null;

  const price = parseFloat(priceStr.replace(/[$,]/g, ''));
  const savings = parseFloat(savingsStr);

  if (isNaN(price) || isNaN(savings) || savings >= 100) return null;

  const originalPrice = price / (1 - savings / 100);
  return '$' + originalPrice.toFixed(2);
}

function determineCategory({ link_flair_text }) {
  return link_flair_text ? link_flair_text.replace(/&amp;|&/g, 'and') : null;
}

function getPhotoUrl(post) {
  // few size options. keeping it simple for the moment
  if (post.preview && post.preview.images && post.preview.images.length > 0) {
    return post.preview.images[0].source.url.replace(/&amp;/g, '&');
  }

  if (post.thumbnail && post.thumbnail.startsWith('http')) {
    return post.thumbnail.replace(/&amp;/g, '&');
  }

  return 'https://placehold.co/300x200?text=No+Image';
}

function calculateDealScore(savings) {
  if (!savings) return 10; // base score...
  return parseInt(savings) * 100;
}

function calculateStarRating(post, dealScore) {
  const ups = post.ups || 0;
  const comments = post.num_comments || 0;

  // using what we can... mix comments, updvotes and score
  const totalScore = ups * 3 + comments * 1 + dealScore;

  if (totalScore > 150) return 5;
  if (totalScore > 100) return 4;
  if (totalScore > 50) return 3;
  if (totalScore > 20) return 2;
  return 1;
}

module.exports = {
  extractPrice,
  extractSavings,
  calculateOriginalPrice,
  determineCategory,
  getPhotoUrl,
  calculateDealScore,
  calculateStarRating,
};
