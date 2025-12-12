async function fetchReddit() {
  const REDDIT_URL = `https://www.reddit.com/r/deals/new.json?limit=1`;
  try {
    const response = await fetch(REDDIT_URL, {
      headers: {
        'User-Agent': 'DealFinder/1.0 (Educational Project)',
      },
    });
    const data = await response.json();
    const post = data.data.children[0].data;
    const photo = getPhotoUrl(post);
    console.log('photo :>> ', photo);
  } catch (error) {
    console.error(error);
  }
}

function getPhotoUrl(post) {
  // few size options. keeping it simple for the moment
  if (post.preview && post.preview.images && post.preview.images.length > 0) {
    return post.preview.images[0].source.url.replace(/&amp;/g, '&');
  }

  if (post.thumbnail) {
    return post.thumbnail.replace(/&amp;/g, '&');
  }

  return 'https://placehold.co/300x200?text=No+Image';
}
fetchReddit();
