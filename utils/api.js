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
  console.log('fetchEventList', 1)

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

/**
 * Fetch user's event list with pagination
 * @param {Object} params - Parameters for the request
 * @param {string} params.startDate - Start date in YYYY-MM-DD format
 * @param {string} params.endDate - End date in YYYY-MM-DD format
 * @param {number} params.pageNum - Page number
 * @param {number} params.pageSize - Page size
 * @param {Function} success - Success callback function
 * @param {Function} fail - Fail callback function
 */
function fetchPagedEventList({ startDate, endDate, pageNum, pageSize }, success, fail) {
	const url = `/user/events/list?startDate=${startDate}&endDate=${endDate}&pageNum=${pageNum}&pageSize=${pageSize}`;

	request({
		url: url,
		method: 'GET',
		data: {},
		success: (res) => {
			if (res.data.code === 0) {
				if (typeof success === 'function') {
					success(res.data.data); // Return the data object with list
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

/**
 * Delete an event
 * @param {number} eventId - Event ID to delete
 * @param {Function} success - Success callback function
 * @param {Function} fail - Fail callback function
 */
function deleteEvent(eventId, success, fail) {
	const url = `/user/events/${eventId}`;

	request({
		url: url,
		method: 'DELETE',
		data: {},
		success: (res) => {
			if (res.data.code === 0) {
				if (typeof success === 'function') {
					success(res.data.data); // Return the result
				}
			} else {
				if (typeof fail === 'function') {
					fail(new Error(res.data.msg || '删除事件失败'));
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
	fetchEventList,
	fetchPagedEventList,
	deleteEvent
};