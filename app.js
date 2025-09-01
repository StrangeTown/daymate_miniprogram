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
        title: '王总请电影',
        date: '2025-09-05',
        abbr: '王',
        image: 'assets/images/event_images/movies_music_videos_icon.svg'
      },
      {
        title: '老罗播客',
        date: '2025-09-01',
        abbr: '罗',
        image: 'assets/images/event_images/podcast-svgrepo-com.svg'
      }
    ]
  }
})
