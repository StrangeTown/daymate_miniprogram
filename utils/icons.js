const { EVENT_IMAGES } = require('../constants/index');

/**
 * Get the URL of an icon by its name.
 * @param {string} name - The name of the icon.
 * @returns {string|null} The URL to the icon or null if not found.
 */
function getIconUrlByName(name) {
  const icon = EVENT_IMAGES.find(img => img.name === name);
  return icon ? icon.url : null;
}

module.exports = {
  getIconUrlByName
};