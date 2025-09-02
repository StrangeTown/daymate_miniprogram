// pages/create/create.js
const { request } = require("../../utils/request");
const { EVENT_IMAGES } = require("../../constants/index");
Page({
	/**
	 * Page initial data
	 */
	data: {
		eventTitle: "",
		eventDate: "",
		minDate: "",
		letters: [],
		selectedLetter: "",
		isSubmitting: false,
		availableImages: EVENT_IMAGES,
		selectedImage: null,
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad(options) {
		// Set minimum date to today
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const day = String(today.getDate()).padStart(2, "0");
		const todayStr = `${year}-${month}-${day}`;

		this.setData({
			minDate: todayStr,
			eventDate: todayStr,
		});
	},

	/**
	 * Handle title input
	 */
	onTitleInput(e) {
		const title = e.detail.value;
		this.setData({
			eventTitle: title,
			letters: title.split("").filter((char) => char.trim() !== ""), // Split into characters, remove spaces
			selectedLetter: "", // Reset selection when title changes
		});
	},

	/**
	 * Handle date picker change
	 */
	onDateChange(e) {
		this.setData({
			eventDate: e.detail.value,
		});
	},

	/**
	 * Handle letter selection
	 */
	onLetterSelect(e) {
		// Add short vibration for feedback
		wx.vibrateShort({
			type: "light",
		});

		const letter = e.currentTarget.dataset.letter;
		this.setData({
			selectedLetter: letter,
			selectedImage: null, // Clear image selection for mutual exclusivity
		});
	},

	/**
	 * Handle image selection
	 */
	onImageSelect(e) {
		// Add short vibration for feedback
		wx.vibrateShort({
			type: "light",
		});

		const imageName = e.currentTarget.dataset.image;
		this.setData({
			selectedImage: imageName,
			selectedLetter: null, // Clear letter selection for mutual exclusivity
		});
	},

	/**
	 * Save event and navigate back
	 */
	onSaveEvent() {
		const { eventTitle, eventDate, isSubmitting } = this.data;

		// Prevent repeated clicks
		if (isSubmitting) {
			return;
		}

    // vibrate
    wx.vibrateShort({
      type: "light",
    });

		// Validate inputs
		if (!eventTitle.trim()) {
			wx.showToast({
				title: "请输入活动名称",
				icon: "none",
				duration: 2000,
			});
			return;
		}

		if (!eventDate) {
			wx.showToast({
				title: "请选择活动日期",
				icon: "none",
				duration: 2000,
			});
			return;
		}

		// Add new event
		const newEvent = {
			title: eventTitle.trim(),
			date: eventDate,
			abbr: this.data.selectedLetter || eventTitle.trim().charAt(0), // Use selected letter or first character as default
			...(this.data.selectedImage && { image: this.data.selectedImage }), // Add image only if selected
		};

		// Set submitting state and call the API
		this.setData({ isSubmitting: true });
		this.doCreateRequest(eventTitle.trim(), eventDate);
	},

	/**
	 * Create event via API
	 */
	doCreateRequest(title, eventDate) {
		// Get icon name from EVENT_IMAGES objects
		let icon = this.data.selectedImage || "";

		const body = {
			title: title,
			eventDate: eventDate,
			abbr: this.data.selectedLetter || title.charAt(0),
			icon: icon,
		};

		console.log("Sending request with data:", body);

		request({
			url: "/user/events",
			method: "POST",
			data: body,
			success: (res) => {
				console.log("Request success:", res);
				this.setData({ isSubmitting: false });
				if (res.data && res.data.code === 0) {
					wx.navigateBack(
            {
              delta: 1
            }
          );
				} else {
					wx.showToast({
						title: res.data?.msg || "创建失败",
						icon: "none",
						duration: 2000,
					});
				}
			},
			fail: (err) => {
				console.error("Request failed:", err);
				this.setData({ isSubmitting: false });
				wx.showToast({
					title: "网络错误",
					icon: "none",
					duration: 2000,
				});
			},
		});
	},

	/**
	 * Lifecycle function--Called when page is initially rendered
	 */
	onReady() {},

	/**
	 * Lifecycle function--Called when page show
	 */
	onShow() {},

	/**
	 * Lifecycle function--Called when page hide
	 */
	onHide() {},

	/**
	 * Lifecycle function--Called when page unload
	 */
	onUnload() {},

	/**
	 * Page event handler function--Called when user drop down
	 */
	onPullDownRefresh() {},

	/**
	 * Called when page reach bottom
	 */
	onReachBottom() {},

	/**
	 * Called when user click on the top right corner to share
	 */
	onShareAppMessage() {},
});
