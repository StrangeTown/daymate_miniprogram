// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })

    // 处理用户登录
    this.loginPromise = this.handleUserLogin();
  },

  /**
   * Handle user login with token validation and refresh
   * @returns {Promise<boolean>} Promise that resolves to true if login successful, false otherwise
   */
  handleUserLogin() {
    return new Promise((resolve) => {
      // 登录优化：仅在无token或token过期时请求
      const token = wx.getStorageSync('token');
      const now = Math.floor(Date.now() / 1000);
      if (!token || !token.expireIn || token.expireIn < now) {
        const { request } = require('./utils/request.js');
        wx.login({
          success: res => {
            if (res.code) {
              console.log('jscode:', res.code);
              request({
                url: `/user/login/${res.code}`,
                method: 'GET',
                success: response => {
                  if (response.data && response.data.code === 0) {
                    try {
                      const storage = require('./utils/storage.js');
                      const token = response.data.data.token || null;
                      const userInfo = response.data.data.userInfo || null;
                      storage.setUserInfoAndToken(userInfo, token);
                    } catch (err) {
                      console.warn('Failed to persist login data via storage helper', err);
                    }
                    console.log('Login success:', response.data.data);
                    
                    resolve(true);
                  } else {
                    console.log('Login failed:', response.data.msg);
                    resolve(false);
                  }
                },
                fail: err => {
                  console.log('Request failed:', err);
                  resolve(false);
                }
              });
            } else {
              console.log('登录失败：', res.errMsg);
              resolve(false);
            }
          },
          fail: err => {
            console.log('wx.login failed:', err);
            resolve(false);
          }
        })
      } else {
        console.log('Token is valid, skip login request.');
        resolve(true);
      }
    });
  },
  globalData: {
    userInfo: null,
  }
})
