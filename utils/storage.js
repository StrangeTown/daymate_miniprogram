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

module.exports = {
  getUserId,
  setUserInfo,
  setToken,
  setUserInfoAndToken
};
