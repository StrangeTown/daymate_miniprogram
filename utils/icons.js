const { EVENT_IMAGES } = require('../constants/index');

/**
 * Get the local address of an icon by its name.
 * @param {string} name - The name of the icon.
 * @returns {string|null} The local path to the icon or null if not found.
 */
function getIconLocalAddressByName(name) {
  const icon = EVENT_IMAGES.find(img => img.name === name);
  return icon ? icon.localAddress : null;
}

module.exports = {
  getIconLocalAddressByName
};