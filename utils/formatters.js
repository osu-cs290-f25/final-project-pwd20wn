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

function determineCategory(postData) {
  return postData.link_flair_text || 'General';
}

function getPhotoUrl(thumbnail) {
  return thumbnail || 'https://picsum.photos/200';
}

module.exports = {
  extractPrice,
  extractSavings,
  calculateOriginalPrice,
  determineCategory,
  getPhotoUrl,
};
