// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    mockData: [
      {
        title: '九三阅兵',
        date: '2025-09-03',
        abbr: '九',
        image: 'assets/images/event_images/fighter-jet-solid-svgrepo-com.svg'
      },
      {
        title: '苹果发布会',
        date: '2025-09-10',
        abbr: '苹',
        image: 'assets/images/event_images/apple-svgrepo-com.svg'
      },
      {
        title: '绘画课体验',
        date: '2025-09-15',
        abbr: '绘',
        image: 'assets/images/event_images/painting-palette-hand-drawn-tool-svgrepo-com.svg'
      }
    ]
  }
})
