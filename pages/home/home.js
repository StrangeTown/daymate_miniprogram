// pages/home/home.js
Page({
	/**
	 * Page initial data
	 */
	data: {
		calendars: [],
		countdownDays: 0
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad(options) {
		this.generateCalendars();
		this.calculateCountdown();
	},

	/**
	 * Calculate countdown days to 9.3 parade
	 */
	calculateCountdown() {
		const today = new Date();
		const currentYear = today.getFullYear();
		
		// 9.3 parade date (September 3rd)
		let paradeDate = new Date(currentYear, 8, 3); // Month is 0-indexed, so 8 = September
		
		// If 9.3 has already passed this year, calculate for next year
		if (today > paradeDate) {
			paradeDate = new Date(currentYear + 1, 8, 3);
		}
		
		// Calculate difference in days
		const timeDiff = paradeDate.getTime() - today.getTime();
		const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
		
		console.log(`Days until 9.3 parade: ${daysDiff}`);
		
		this.setData({
			countdownDays: daysDiff
		});
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
			const isCurrentMonth = i === 0;
			calendars.push(this.generateSingleCalendar(currentDate, isCurrentMonth));
		}

		this.setData({
			calendars: calendars,
		});
	},

	/**
	 * Generate single month calendar
	 */
	generateSingleCalendar(date, isCurrentMonth = false) {
		const year = date.getFullYear();
		const month = date.getMonth();
		const today = new Date();

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

		if (isCurrentMonth) {
			// For current month, start from the Sunday of current week
			const todayDayOfWeek = today.getDay(); // 0 = Sunday
			const currentWeekStart = new Date(today);
			currentWeekStart.setDate(today.getDate() - todayDayOfWeek);
			
			// Calculate how many days to show (from current week Sunday to end of month)
			const lastDay = new Date(year, month + 1, 0);
			const startDate = currentWeekStart.getDate();
			const endDate = lastDay.getDate();
			
			// Add empty cells for days before current week starts (should be 0 since we start on Sunday)
			const startWeekDay = 0; // Always start on Sunday
			for (let i = 0; i < startWeekDay; i++) {
				days.push({
					day: "",
					isEmpty: true,
					isToday: false,
				});
			}

			// Add days from current week Sunday to end of month
			for (let day = startDate; day <= endDate; day++) {
				const isToday = day === today.getDate();

				days.push({
					day: day,
					isEmpty: false,
					isToday: isToday,
				});
			}
		} else {
			// For future months, show full month
			const firstDay = new Date(year, month, 1);
			const lastDay = new Date(year, month + 1, 0);
			const daysInMonth = lastDay.getDate();
			const startWeekDay = firstDay.getDay(); // 0 = Sunday

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
				days.push({
					day: day,
					isEmpty: false,
					isToday: false, // Future months won't have today
				});
			}
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
	 * Handle create button tap
	 */
	onCreateTap() {
		console.log('Create button tapped');
		// Navigate to create page
		wx.navigateTo({
			url: '/pages/create/create'
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
