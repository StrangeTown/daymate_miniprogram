// pages/create/create.js
const { request } = require("../../utils/request");
const { EVENT_IMAGES, DEFAULT_GIF } = require("../../constants/index");
const { fetchGifIcons } = require("../../utils/api");
const shareBehavior = require("../../behaviors/share");

Page({
	behaviors: [shareBehavior],
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
		enableNotification: false, // Default to disabled
		availableGifs: DEFAULT_GIF,
		selectedGif: null,
		isGifLocked: true, // Control GIF overlay visibility
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
	 * Handle notification switch toggle
	 */
	onNotificationToggle(e) {
		// Add short vibration for feedback
		wx.vibrateShort({
			type: "light",
		});

		this.setData({
			enableNotification: e.detail.value,
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
	 * Handle GIF selection
	 */
	onGifSelect(e) {
		// Add short vibration for feedback
		wx.vibrateShort({
			type: "light",
		});

		const gifName = e.currentTarget.dataset.gif;
		this.setData({
			selectedGif: gifName,
			selectedImage: null, // Clear image selection for mutual exclusivity
			selectedLetter: null, // Clear letter selection for mutual exclusivity
		});
	},

	/**
	 * Handle lock container click to fetch GIF icons
	 */
	onLockContainerTap() {
		// Add short vibration for feedback
		wx.vibrateShort({
			type: "light",
		});

		// Show loading indicator
		wx.showLoading({
			title: '加载中...'
		});

		// Call the API to fetch GIF icons
		fetchGifIcons(
			(data) => {
				// Success callback
				wx.hideLoading();
				console.log('GIF icons fetched successfully:', data);

				// Process the API response and update availableGifs
				if (data && data.values) {
					const gifData = data.values.map(gif => ({
						name: gif.name,
						url: gif.url
					}));

					this.setData({
						availableGifs: gifData,
						isGifLocked: false, // Hide the overlay
					});

					console.log('Available GIFs updated:', gifData);

					wx.showToast({
						title: 'GIF图标已解锁',
						icon: 'success',
						duration: 2000
					});
				} else {
					console.error('Invalid API response structure:', data);
					wx.showToast({
						title: '数据格式错误',
						icon: 'none',
						duration: 2000
					});
				}
			},
			(error) => {
				// Error callback
				wx.hideLoading();
				console.error('Failed to fetch GIF icons:', error);
				wx.showToast({
					title: '获取GIF图标失败',
					icon: 'none',
					duration: 2000
				});
			}
		);
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

		// Set submitting state
		this.setData({ isSubmitting: true });

		// Define the create and navigate callback
		const createAndNavigate = (remindValue = false) => {
			this.doCreateRequest(eventTitle.trim(), eventDate, remindValue, () => {
				// Navigate back after successful creation
				wx.navigateBack({
					delta: 1,
				});
			});
		};

		// Check if notification is enabled
		if (this.data.enableNotification) {
			// Request subscription message permission first
			wx.requestSubscribeMessage({
				tmplIds: ["EAjMZbWoOXN9p4GdjDwT1kLR8lQ1ya4vkrhavLLweiE"],
				success: (res) => {
					console.log("Subscription message request result:", res);
					// Subscription successful, set remind to true
					createAndNavigate(true);
				},
				fail: (err) => {
					console.log("Subscription message request failed:", err);
					// Subscription failed, set remind to false
					createAndNavigate(false);
				},
			});
		} else {
			// No notification requested, set remind to false
			createAndNavigate(false);
		}
	},

	/**
	 * Create event via API
	 */
	doCreateRequest(title, eventDate, remindValue, successCallback) {
		// Get icon name - prioritize GIF over image
		let icon = this.data.selectedGif || this.data.selectedImage || "";

		const body = {
			title: title,
			eventDate: eventDate,
			abbr: this.data.selectedLetter || title.charAt(0),
			icon: icon,
			remind: remindValue, // Use the remind value based on subscription result
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
					// Call success callback if provided
					if (typeof successCallback === "function") {
						successCallback();
					}
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

});
