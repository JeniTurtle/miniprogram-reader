//app.js
const config = require('./config/host.config');

App({
  onLaunch() {
    
  },

  getUserInfo(callback) {
    let self = this;
    if (!!self.globalData.userInfo) {
      return typeof callback === 'function' && callback(self.globalData.userInfo)
    }
    //调用登录接口
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            self.globalData.userInfo = res.userInfo;
            typeof callback == "function" && callback(self.globalData.userInfo)
          }
        })
      }
    })
  },
  
  globalData: {
    userInfo: null,
    imagePath: config.requestURL + '/BookFiles/BookImages/'
  }
})