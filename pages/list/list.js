// pages/list/list.js
const { fetchPagedEventList, deleteEvent } = require("../../utils/api");
const { getIconLocalAddressByName } = require("../../utils/icons");
Page({

  /**
   * Page initial data
   */
  data: {
    events: [],
    currentPage: 1,
    pageSize: 10,
    total: 0,
    hasMore: true,
    loading: false,
    refreshing: false,
    showModal: false,
    selectedItem: null
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
   * Load events with pagination
   */
  loadEvents(pageNum = 1, isLoadMore = false) {
    if (this.data.loading) return;
    
    this.setData({ loading: true });

    fetchPagedEventList(
      {
        startDate: '2025-09-01',
        endDate: '',
        pageNum: pageNum,
        pageSize: this.data.pageSize
      },
      (data) => {
        const newEvents = (data.list || [])
          .map(event => ({
            ...event,
            daysLeft: this.calculateDaysLeft(event.eventDate.split("T")[0]),
            image: getIconLocalAddressByName(event.icon) || "",
            formattedDate: event.eventDate.split("T")[0] // Format date to YYYY-MM-DD
          }));
        
        let events;
        if (isLoadMore) {
          // Append new events to existing list
          events = [...this.data.events, ...newEvents];
        } else {
          // Replace existing events (initial load or refresh)
          events = newEvents;
        }

        // Sort by date: most recent (closest to today) first
        events.sort((a, b) => {
          const dateA = new Date(a.eventDate);
          const dateB = new Date(b.eventDate);
          return dateA - dateB;
        });

        const hasMore = pageNum * this.data.pageSize < data.total;
        
        console.log('Events loaded:', events.length, 'Total:', data.total, 'HasMore:', hasMore);
        
        this.setData({
          events: events,
          currentPage: pageNum,
          total: data.total,
          hasMore: hasMore,
          loading: false
        });
      },
      (error) => {
        console.error("Failed to fetch events:", error);
        wx.showToast({
          title: "获取事件列表失败",
          icon: "none",
          duration: 2000,
        });
        this.setData({ loading: false });
      }
    );
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // Uncomment the line below to test with dummy data if API is not working
    // this.generateTestData();
    this.loadEvents(1, false);
  },

  /**
   * Generate test data for debugging (remove in production)
   */
  generateTestData() {
    const testEvents = [];
    for (let i = 1; i <= 15; i++) {
      const dateStr = `2025-09-${10 + i}`;
      testEvents.push({
        id: i,
        title: `测试事件 ${i}`,
        eventDate: `${dateStr}T00:00:00+08:00`,
        formattedDate: dateStr,
        daysLeft: this.calculateDaysLeft(dateStr),
        icon: 'apple',
        image: ''
      });
    }
    
    this.setData({
      events: testEvents,
      currentPage: 1,
      total: 50, // Simulate more data available
      hasMore: true,
      loading: false
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
    this.setData({ refreshing: true });
    this.loadEvents(1, false);
    setTimeout(() => {
      this.setData({ refreshing: false });
    }, 1000);
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {
    console.log('onReachBottom triggered, hasMore:', this.data.hasMore, 'loading:', this.data.loading);
    if (this.data.hasMore && !this.data.loading) {
      this.loadEvents(this.data.currentPage + 1, true);
    }
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },

  /**
   * Handle item tap to show modal
   */
  onItemTap(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      selectedItem: item,
      showModal: true
    });
  },

  /**
   * Close modal
   */
  onModalClose() {
    this.setData({
      showModal: false,
      selectedItem: null
    });
  },

  /**
   * Handle copy action
   */
  onCopyAction() {
    if (this.data.selectedItem && this.data.selectedItem.title) {
      const formattedContent = `距离 ${this.data.selectedItem.title}(${this.data.selectedItem.formattedDate}) 还有${this.data.selectedItem.daysLeft}天`;
      
      wx.setClipboardData({
        data: formattedContent,
        success: () => {
          wx.showToast({
            title: '已复制到剪贴板',
            icon: 'success',
            duration: 2000
          });
          this.onModalClose();
        },
        fail: () => {
          wx.showToast({
            title: '复制失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
    }
  },

  /**
   * Handle remove action
   */
  onRemoveAction() {
    const selectedItem = this.data.selectedItem;
    if (!selectedItem) return;

    wx.showModal({
      title: '确认删除',
      content: `确定要删除"${selectedItem.title}"吗？`,
      confirmText: '删除',
      cancelText: '取消',
      confirmColor: '#E96354',
      success: (res) => {
        if (res.confirm) {
          // User confirmed deletion
          this.deleteEventById(selectedItem.id);
        }
        // Close modal regardless of choice
        this.onModalClose();
      }
    });
  },

  /**
   * Delete event by ID
   */
  deleteEventById(eventId) {
    wx.showLoading({
      title: '删除中...'
    });

    deleteEvent(
      eventId,
      (data) => {
        wx.hideLoading();
        wx.showToast({
          title: '已删除',
          icon: 'success',
          duration: 2000
        });
        
        // Remove the item from local data
        const updatedEvents = this.data.events.filter(event => event.id !== eventId);
        this.setData({
          events: updatedEvents,
          total: this.data.total - 1
        });
      },
      (error) => {
        wx.hideLoading();
        console.error("Failed to delete event:", error);
        wx.showToast({
          title: error.message || "删除失败",
          icon: "none",
          duration: 2000,
        });
      }
    );
  }
})