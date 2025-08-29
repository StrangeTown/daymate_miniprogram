// pages/create/create.js
Page({

  /**
   * Page initial data
   */
  data: {
    eventTitle: '',
    eventDate: '',
    minDate: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // Set minimum date to today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    this.setData({
      minDate: todayStr,
      eventDate: todayStr
    });
  },

  /**
   * Handle title input
   */
  onTitleInput(e) {
    this.setData({
      eventTitle: e.detail.value
    });
  },

  /**
   * Handle date picker change
   */
  onDateChange(e) {
    this.setData({
      eventDate: e.detail.value
    });
  },

  /**
   * Save event and navigate back
   */
  onSaveEvent() {
    const { eventTitle, eventDate } = this.data;

    // Validate inputs
    if (!eventTitle.trim()) {
      wx.showToast({
        title: '请输入活动名称',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!eventDate) {
      wx.showToast({
        title: '请选择活动日期',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // Get current app instance to access global data
    const app = getApp();
    if (!app.globalData) {
      app.globalData = {};
    }
    if (!app.globalData.mockData) {
      app.globalData.mockData = [];
    }

    // Add new event
    const newEvent = {
      title: eventTitle.trim(),
      emoji: '📅', // Default emoji for new events
      date: eventDate
    };

    app.globalData.mockData.push(newEvent);

    // Navigate back after a short delay
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      });
    }, 500);
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