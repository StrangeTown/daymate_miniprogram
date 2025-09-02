const { request } = require('./request');

/**
 * Fetch user's event list
 * @param {Object} params - Parameters for the request
 * @param {string} params.startDate - Start date in YYYY-MM-DD format
 * @param {string} params.endDate - End date in YYYY-MM-DD format
 * @param {Function} success - Success callback function
 * @param {Function} fail - Fail callback function
 */
function fetchEventList({ startDate, endDate }, success, fail) {
	const url = `/user/events/mine?startDate=${startDate}&endDate=${endDate}`;

	request({
		url: url,
		method: 'GET',
		data: {},
		success: (res) => {
			if (res.data.code === 0) {
				if (typeof success === 'function') {
					success(res.data.data); // Return the events array
				}
			} else {
				if (typeof fail === 'function') {
					fail(new Error(res.data.msg || '获取事件列表失败'));
				}
			}
		},
		fail: (err) => {
			if (typeof fail === 'function') {
				fail(err);
			}
		}
	});
}

module.exports = {
	fetchEventList
};