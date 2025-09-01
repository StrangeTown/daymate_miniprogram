// pages/list/list.js
Page({

  /**
   * Page initial data
   */
  data: {
    events: []
  },

  /**
   * Get mock data from global or local fallback
   */
  getMockData() {
    const app = getApp();
    if (app.globalData && app.globalData.mockData) {
      return app.globalData.mockData;
    }
    // Fallback to local data
    return [];
  },

  /**
   * Calculate days left until event
   */
  calculateDaysLeft(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(dateStr);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    const events = this.getMockData()
      .map(event => ({
        ...event,
        daysLeft: this.calculateDaysLeft(event.date)
      }))
      .sort((a, b) => {
        // Sort by date: most recent (closest to today) first
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });
    
    this.setData({
      events: events
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})