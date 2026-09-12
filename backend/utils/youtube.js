/**
 * YouTube helper functions for extracting IDs, fetching metadata, and getting thumbnails.
 */

/**
 * Extracts an 11-character YouTube video ID from various YouTube URL formats.
 * @param {string} url
 * @returns {string|null}
 */
function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Fetches YouTube video metadata using the oEmbed API endpoint.
 * @param {string} youtubeId
 * @returns {Promise<{title: string, author: string, thumbnail: string}|null>}
 */
async function fetchYouTubeMetadata(youtubeId) {
  if (!youtubeId || typeof youtubeId !== 'string') {
    return null;
  }
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return {
      title: data.title,
      author: data.author_name,
      thumbnail: data.thumbnail_url,
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error.message);
    return null;
  }
}

/**
 * Returns the default high-quality thumbnail URL for a given YouTube video ID.
 * @param {string} youtubeId
 * @returns {string|null}
 */
function getThumbnailUrl(youtubeId) {
  if (!youtubeId) {
    return null;
  }
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

module.exports = {
  extractYouTubeId,
  fetchYouTubeMetadata,
  getThumbnailUrl,
};
