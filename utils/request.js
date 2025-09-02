const IS_PROD = false; // Set to true for production

const BASE_URL = IS_PROD
	? "https://www.itwork.club/daymate"
	: "https://www.itwork.club/daymate_test";

function getToken() {
	const token = wx.getStorageSync("token");
	return token && token.accessToken ? "Bearer " + token.accessToken : "";
}

function request({ url, method = "GET", data = {}, success, fail }) {
	const requestData = method === "GET" ? {} : data; // Don't send body data for GET requests
	
	wx.request({
		url: BASE_URL + url,
		method,
		data: requestData,
		header: {
			Authorization: getToken(),
		},
		success: (res) => {
			if (typeof success === "function") success(res);
		},
		fail: (err) => {
			console.error("Request failed:", err);
			wx.showToast({ title: "网络错误", icon: "none" });
			if (typeof fail === "function") fail(err);
		},
	});
}

module.exports = {
	request,
};
