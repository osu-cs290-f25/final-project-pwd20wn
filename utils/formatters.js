function extractPrice(title) {
  const priceMatch = title.match(/\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/); //thanks gemini
  return priceMatch ? priceMatch[0] : 'Price not listed';
}

function determineCategory(postData) {
  return postData.link_flair_text || 'General';
}

function getPhotoUrl(thumbnail) {
  return thumbnail || 'https://picsum.photos/200';
}

module.exports = { extractPrice, determineCategory, getPhotoUrl };
