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
        emoji: '🎖️',
        date: '2025-09-03',
        abbr: '九'
      },
      {
        title: '苹果发布会',
        emoji: '🍎',
        date: '2025-09-10',
        abbr: '苹'
      }
    ]
  }
})
