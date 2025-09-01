// pages/create/create.js
Page({

  /**
   * Page initial data
   */
  data: {
    eventTitle: '',
    eventDate: '',
    minDate: '',
    letters: [],
    selectedLetter: '',
    availableImages: [
      'assets/images/event_images/apple-svgrepo-com.svg',
      'assets/images/event_images/birthday-cake-celebration-festival-party-svgrepo-com.svg',
      'assets/images/event_images/birthday-celebration-christmas-festival-party-2-svgrepo-com.svg',
      'assets/images/event_images/cherry-blossom-spring-svgrepo-com.svg',
      'assets/images/event_images/egypt.png',
      'assets/images/event_images/fighter-jet-solid-svgrepo-com.svg',
      'assets/images/event_images/japan-svgrepo-com.svg',
      'assets/images/event_images/painting-palette-hand-drawn-tool-svgrepo-com.svg',
      'assets/images/event_images/palm-island-beach-sun-sea-svgrepo-com.svg',
      'assets/images/event_images/sports-basketball-svgrepo-com.svg',
      'assets/images/event_images/sports-football-svgrepo-com.svg',
      'assets/images/event_images/sports-svgrepo-com.svg',
      'assets/images/event_images/sports-tennis-svgrepo-com.svg',
      'assets/images/event_images/podcast-svgrepo-com.svg',
      'assets/images/event_images/movies_music_videos_icon.svg',
    ],
    selectedImage: ''
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
    const title = e.detail.value;
    this.setData({
      eventTitle: title,
      letters: title.split('').filter(char => char.trim() !== ''), // Split into characters, remove spaces
      selectedLetter: '' // Reset selection when title changes
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
   * Handle letter selection
   */
  onLetterSelect(e) {
    // Add short vibration for feedback
    wx.vibrateShort({
      type: 'light'
    });

    const letter = e.currentTarget.dataset.letter;
    this.setData({
      selectedLetter: letter,
      selectedImage: null  // Clear image selection for mutual exclusivity
    });
  },

  /**
   * Handle image selection
   */
  onImageSelect(e) {
    // Add short vibration for feedback
    wx.vibrateShort({
      type: 'light'
    });

    const image = e.currentTarget.dataset.image;
    this.setData({
      selectedImage: image,
      selectedLetter: null  // Clear letter selection for mutual exclusivity
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
      date: eventDate,
      abbr: this.data.selectedLetter || eventTitle.trim().charAt(0), // Use selected letter or first character as default
      emoji: '📅', // Default emoji for new events
      ...(this.data.selectedImage && { image: this.data.selectedImage }) // Add image only if selected
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