const { EVENT_IMAGES } = require('../constants/index');

/**
 * Get the URL of an icon by its icon value (name or URL).
 * If the icon starts with 'http', it's already a URL and returned directly.
 * Otherwise, it's treated as a name and looked up in EVENT_IMAGES.
 * @param {string} icon - The icon value (name or URL) to look up.
 * @returns {string|null} The URL to the icon or null if not found.
 */
function getIconUrlByIcon(icon) {
  // If icon is already a URL (starts with http), return it directly
  if (icon && typeof icon === 'string' && icon.startsWith('http')) {
    return icon;
  }

  // Otherwise, look up the icon by name in EVENT_IMAGES
  const iconObj = EVENT_IMAGES.find(img => img.name === icon);
  return iconObj ? iconObj.url : null;
}

module.exports = {
  getIconUrlByIcon
};