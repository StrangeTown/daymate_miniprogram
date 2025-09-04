// utils/storage.js

/**
 * Get user ID from storage
 * @returns {string|null} User ID or null if not found
 */
function getUserId() {
  try {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.id) {
      return userInfo.id;
    }
    return null;
  } catch (error) {
    console.error('Error getting user ID from storage:', error);
    return null;
  }
}

/**
 * Persist userInfo object to storage. Only the known fields will be written.
 * Allowed fields: id, isVip, lang, nickname, openId, registerTime, targetLang
 * @param {Object} info
 * @returns {boolean} true on success, false on failure
 */
function setUserInfo(info) {
  if (!info || typeof info !== 'object') return false;
  try {
    const existing = wx.getStorageSync('userInfo') || {};
    const allowed = ['id', 'isVip', 'lang', 'nickname', 'openId', 'registerTime', 'targetLang'];
    allowed.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(info, key)) {
        existing[key] = info[key];
      }
    });
    wx.setStorageSync('userInfo', existing);
    return true;
  } catch (err) {
    console.error('Error setting userInfo in storage:', err);
    return false;
  }
}

/**
 * Persist token object to storage under the 'token' key.
 * Expected shape: { accessToken: string, expireIn: number }
 * @param {Object} token
 * @returns {boolean} true on success, false on failure
 */
function setToken(token) {
  if (!token || typeof token !== 'object') return false;
  try {
    wx.setStorageSync('token', token);
    return true;
  } catch (err) {
    console.error('Error setting token in storage:', err);
    return false;
  }
}

/**
 * Set both userInfo and token together.
 * Accepts partial objects and uses existing helpers to persist them.
 * @param {Object|null} userInfo
 * @param {Object|null} token
 * @returns {boolean} true if at least one of the operations succeeded
 */
function setUserInfoAndToken(userInfo, token) {
  let okUser = false;
  let okToken = false;
  try {
    if (userInfo && typeof userInfo === 'object') {
      okUser = setUserInfo(userInfo);
    }
    if (token && typeof token === 'object') {
      okToken = setToken(token);
    }
    return okUser || okToken;
  } catch (err) {
    console.error('Error setting userInfo and token:', err);
    return false;
  }
}

/**
 * Set GIF icons with expiration time (24 hours from now)
 * @param {Array} gifData - Array of GIF icon objects
 * @returns {boolean} true on success, false on failure
 */
function setGifIconsWithExpiration(gifData) {
  if (!Array.isArray(gifData)) return false;
  try {
    const expirationTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now
    const gifCache = {
      data: gifData,
      expiration: expirationTime
    };
    wx.setStorageSync('gifIcons', gifCache);
    console.log('GIF icons saved with expiration:', new Date(expirationTime));
    return true;
  } catch (err) {
    console.error('Error setting GIF icons in storage:', err);
    return false;
  }
}

/**
 * Get GIF icons if they're still available (not expired)
 * @returns {Array|null} Array of GIF icons or null if expired/not found
 */
function getGifIcons() {
  try {
    const gifCache = wx.getStorageSync('gifIcons');
    if (!gifCache || !gifCache.data || !gifCache.expiration) {
      return null;
    }

    const now = Date.now();
    if (now > gifCache.expiration) {
      console.log('GIF icons expired, clearing cache');
      clearExpiredGifIcons();
      return null;
    }

    console.log('GIF icons loaded from cache, expires at:', new Date(gifCache.expiration));
    return gifCache.data;
  } catch (err) {
    console.error('Error getting GIF icons from storage:', err);
    return null;
  }
}

/**
 * Check if GIF icons are available and not expired
 * @returns {boolean} true if available, false if expired or not found
 */
function isGifIconsAvailable() {
  try {
    const gifCache = wx.getStorageSync('gifIcons');
    if (!gifCache || !gifCache.data || !gifCache.expiration) {
      return false;
    }

    const now = Date.now();
    return now <= gifCache.expiration;
  } catch (err) {
    console.error('Error checking GIF icons availability:', err);
    return false;
  }
}

/**
 * Clear expired GIF icons from storage
 * @returns {boolean} true on success, false on failure
 */
function clearExpiredGifIcons() {
  try {
    wx.removeStorageSync('gifIcons');
    console.log('Expired GIF icons cleared from storage');
    return true;
  } catch (err) {
    console.error('Error clearing expired GIF icons:', err);
    return false;
  }
}

module.exports = {
  getUserId,
  setUserInfo,
  setToken,
  setUserInfoAndToken,
  setGifIconsWithExpiration,
  getGifIcons,
  isGifIconsAvailable,
  clearExpiredGifIcons
};
