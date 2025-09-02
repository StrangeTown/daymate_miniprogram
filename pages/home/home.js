// pages/home/home.js
const { fetchEventList } = require("../../utils/api");
const { getIconLocalAddressByName } = require("../../utils/icons");
Page({
	/**
	 * Page initial data
	 */
	data: {
		calendars: [],
		countdownDays: 0,
		countdownTitle: "",
		showModal: false,
		events: [], // Store fetched events from API
	},

	/**
	 * Get events data from API or global fallback
	 */
	getEventsData() {
    return this.data.events.map((event) => ({
      title: event.title,
      date: event.eventDate.split("T")[0], // Convert ISO date to YYYY-MM-DD format
      abbr: event.abbr || event.title.charAt(0),
      id: event.id,
      image: getIconLocalAddressByName(event.icon) || "",
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      userId: event.userId,
    }));
	},

	/**
	 * Fetch events from API for current period
	 */
	fetchEvents() {
		const today = new Date();
		const startDate = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD

		// Calculate end date of next next month (two months from now)
		const endDateObj = new Date(today.getFullYear(), today.getMonth() + 3, 0); // Last day of next next month
		const endDate = endDateObj.toISOString().split("T")[0];

		fetchEventList(
			{ startDate, endDate },
			(events) => {
				this.setData({ events: events });

				this.generateCalendars();
				this.calculateCountdown();
			},
			(error) => {
				console.error("Failed to fetch events:", error);
				wx.showToast({
					title: "获取事件列表失败",
					icon: "none",
					duration: 2000,
				});
			}
		);
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad(options) {
		// Page initialization - moved to onShow for better refresh behavior
	},

	/**
	 * Calculate countdown days to the most recent upcoming event
	 */
	calculateCountdown() {
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

		// Find all upcoming events
		const upcomingEvents = this.getEventsData()
			.map((event) => {
				const eventDate = new Date(event.date);
				eventDate.setHours(0, 0, 0, 0);
				return {
					...event,
					daysUntil: Math.ceil(
						(eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
					),
				};
			})
			.filter((event) => event.daysUntil >= 0) // Only future events (including today)
			.sort((a, b) => a.daysUntil - b.daysUntil); // Sort by closest date first

		if (upcomingEvents.length > 0) {
			const nextEvent = upcomingEvents[0];
      const displayText = nextEvent.title;
      const displayDays = nextEvent.daysUntil;

			this.setData({
				countdownDays: displayDays,
				countdownTitle: displayText,
				isTodayEvent: nextEvent.daysUntil === 0,
			});
		} else {
			// No upcoming events
			this.setData({
				countdownDays: 0,
				countdownTitle: "",
				isTodayEvent: false,
			});
		}
	},

	/**
	 * Return event object for a specific date (or null)
	 */
	getEventObjectForDate(year, month, day) {
		const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
			day
		).padStart(2, "0")}`;
		const event = this.getEventsData().find((event) => event.date === dateStr);
		return event || null;
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

			// Check if the Sunday is in the current month or previous month
			const isSundayInCurrentMonth =
				currentWeekStart.getMonth() === month &&
				currentWeekStart.getFullYear() === year;

			if (isSundayInCurrentMonth) {
				// Sunday is in current month, start from that day
				const startDate = currentWeekStart.getDate();
				const lastDay = new Date(year, month + 1, 0);
				const endDate = lastDay.getDate();

				// Add days from current week Sunday to end of month
				for (let day = startDate; day <= endDate; day++) {
					const isToday = day === today.getDate();
					const eventObj = this.getEventObjectForDate(year, month, day);
					const eventLetter = eventObj
						? eventObj.abbr
							? eventObj.abbr.charAt(0)
							: eventObj.title.charAt(0)
						: null;

					days.push({
						day: day,
						isEmpty: false,
						isToday: isToday,
						event: eventLetter,
						title: eventObj ? eventObj.title : "",
						image: eventObj ? eventObj.image || "" : "",
						dateStr: eventObj
							? eventObj.date
							: `${year}-${String(month + 1).padStart(2, "0")}-${String(
									day
							  ).padStart(2, "0")}`,
					});
				}
			} else {
				// Sunday is in previous month, show full current month with empty cells at start
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
					const isToday =
						day === today.getDate() &&
						month === today.getMonth() &&
						year === today.getFullYear();
					const eventObj = this.getEventObjectForDate(year, month, day);
					const eventLetter = eventObj
						? eventObj.abbr
							? eventObj.abbr.charAt(0)
							: eventObj.title.charAt(0)
						: null;

					days.push({
						day: day,
						isEmpty: false,
						isToday: isToday,
						event: eventLetter,
						title: eventObj ? eventObj.title : "",
						image: eventObj ? eventObj.image || "" : "",
						dateStr: eventObj
							? eventObj.date
							: `${year}-${String(month + 1).padStart(2, "0")}-${String(
									day
							  ).padStart(2, "0")}`,
					});
				}
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
				const eventObj = this.getEventObjectForDate(year, month, day);
				const eventLetter = eventObj
					? eventObj.abbr
						? eventObj.abbr.charAt(0)
						: eventObj.title.charAt(0)
					: null;

				days.push({
					day: day,
					isEmpty: false,
					isToday: false, // Future months won't have today
					event: eventLetter,
					title: eventObj ? eventObj.title : "",
					image: eventObj ? eventObj.image || "" : "",
					dateStr: eventObj
						? eventObj.date
						: `${year}-${String(month + 1).padStart(2, "0")}-${String(
								day
						  ).padStart(2, "0")}`,
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
	 * Handle countdown container tap
	 */
	onCountdownTap() {
		this.setData({
			showModal: true,
		});
	},

	/**
	 * Handle modal close
	 */
	onModalClose() {
		this.setData({
			showModal: false,
		});
	},

	/**
	 * Handle create button tap
	 */
	onCreateTap() {
		console.log("Create button tapped");
		// Navigate to create page
		wx.navigateTo({
			url: "/pages/create/create",
		});
	},

	/**
	 * Handle list button tap
	 */
	onListTap() {
		console.log("List button tapped");
		// Navigate to list page
		wx.navigateTo({
			url: "/pages/list/list",
		});
	},

	/**
	 * Handle day tap on calendar - if it has an event, update countdown to that event
	 */
	onDayTap(e) {
		// Expect dataset to include event-date and event-title
		const dataset = e.currentTarget.dataset || {};
		const title = dataset.eventTitle || "";
		const dateStr = dataset.eventDate || "";

		if (!title || !dateStr) return;

		// Add short vibration for event tap
		wx.vibrateShort({
			type: "light",
		});

		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const eventDate = new Date(dateStr);
		eventDate.setHours(0, 0, 0, 0);
		const daysUntil = Math.ceil(
			(eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
		);

		// Update calendars to mark in-range days
		const calendars = this.data.calendars.map((month) => {
			const newWeeks = month.weeks.map((week) => {
				return week.map((day) => {
					if (day.isEmpty) return day;
					const cellDate = new Date(day.dateStr);
					cellDate.setHours(0, 0, 0, 0);
					const inRange =
						cellDate.getTime() >= today.getTime() &&
						cellDate.getTime() <= eventDate.getTime();
					const isRangeStart = cellDate.getTime() === today.getTime();
					const isRangeEnd = cellDate.getTime() === eventDate.getTime();
					return {
						...day,
						inRange: !!inRange,
						isRangeStart: !!isRangeStart,
						isRangeEnd: !!isRangeEnd,
					};
				});
			});
			return {
				...month,
				weeks: newWeeks,
			};
		});

		let displayText, displayDays, isToday;
		if (daysUntil === 0) {
			// Event is today
			displayText = title;
			displayDays = 0;
			isToday = true;
		} else {
			// Event is in the future
			displayText = title;
			displayDays = daysUntil >= 0 ? daysUntil : 0;
			isToday = false;
		}

		this.setData({
			calendars: calendars,
			countdownDays: displayDays,
			countdownTitle: displayText,
			isTodayEvent: isToday,
		});
	},

	/**
	 * Handle container tap - clear range selection and reset countdown
	 */
	onContainerTap(e) {
		// Clear all range-related flags from calendar days
		const calendars = this.data.calendars.map((month) => {
			const newWeeks = month.weeks.map((week) => {
				return week.map((day) => {
					if (day.isEmpty) return day;
					return {
						...day,
						inRange: false,
						isRangeStart: false,
						isRangeEnd: false,
					};
				});
			});
			return {
				...month,
				weeks: newWeeks,
			};
		});

		// Reset countdown to default (most recent upcoming event)
		this.calculateCountdown();

		this.setData({
			calendars: calendars,
		});
	},

	/**
	 * Lifecycle function--Called when page is initially rendered
	 */
	onReady() {},

	/**
	 * Lifecycle function--Called when page show
	 */
	onShow() {
		const app = getApp();
		if (app.loginPromise) {
			app.loginPromise.then(() => {
				this.fetchEvents();
			});
		}
	},

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
