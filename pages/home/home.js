// pages/home/home.js
Page({
	/**
	 * Page initial data
	 */
	data: {
		calendars: [],
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad(options) {
		this.generateCalendars();
	},

	/**
	 * Generate three month calendars
	 */
	generateCalendars() {
		const calendars = [];
		const today = new Date();

		// Generate calendar for current month and next two months
		for (let i = 0; i < 3; i++) {
			const currentDate = new Date(
				today.getFullYear(),
				today.getMonth() + i,
				1
			);
			calendars.push(this.generateSingleCalendar(currentDate));
		}

		this.setData({
			calendars: calendars,
		});
	},

	/**
	 * Generate single month calendar
	 */
	generateSingleCalendar(date) {
		const year = date.getFullYear();
		const month = date.getMonth();
		const today = new Date();

		// Get first day of month and number of days
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startWeekDay = firstDay.getDay(); // 0 = Sunday

		// Month names
		const monthNames = [
			"一月",
			"二月",
			"三月",
			"四月",
			"五月",
			"六月",
			"七月",
			"八月",
			"九月",
			"十月",
			"十一月",
			"十二月",
		];

		// Generate calendar days
		const days = [];

		// Add empty cells for days before month starts
		for (let i = 0; i < startWeekDay; i++) {
			days.push({
				day: "",
				isEmpty: true,
				isToday: false,
			});
		}

		// Add days of the month
		for (let day = 1; day <= daysInMonth; day++) {
			const isToday =
				year === today.getFullYear() &&
				month === today.getMonth() &&
				day === today.getDate();

			days.push({
				day: day,
				isEmpty: false,
				isToday: isToday,
			});
		}

		// Fill remaining cells to complete the last week (total should be multiple of 7)
		while (days.length % 7 !== 0) {
			days.push({
				day: "",
				isEmpty: true,
				isToday: false,
			});
		}

		// Group days into weeks (7 days per week)
		const weeks = [];
		for (let i = 0; i < days.length; i += 7) {
			weeks.push(days.slice(i, i + 7));
		}

		return {
			year: year,
			month: month,
			monthName: monthNames[month],
			weeks: weeks,
		};
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
