// utils/share.js
const storage = require("./storage.js");

/**
 * Get share path
 * @param {string} targetPage - The target page path (e.g., 'pages/home/home')
 * @returns {string} Share path
 */
function getSharePath(targetPage = "pages/home/home") {
	return targetPage;
}

/**
 * Get random share image path
 * @returns {string} Random share image path from share_1.png to share_5.png
 */
function getShareImagePath() {
	// Generate random number between 1 and 5
	const randomNum = Math.floor(Math.random() * 5) + 1;
	return `/assets/images/share/share_${randomNum}.png`;
}

/**
 * Get query string fragment for sharing that includes refererId when available
 * Returns e.g. 'refererId=abc123' or an empty string when no user id is present
 */
function getShareQuery() {
	try {
		const userId = storage.getUserId();
		if (userId) {
			return `refererId=${userId}`;
		}
		return "";
	} catch (err) {
		console.error("Error getting share query:", err);
		return "";
	}
}

module.exports = {
	getSharePath,
	getShareImagePath,
	getShareQuery,
};
