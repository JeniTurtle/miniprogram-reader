const config = require('../config/host.config')
const Promise = require('../vendor/promise')

module.exports = function (method, url, data) {
  return new Promise(function (resolve, reject) {

    if (!/^http/.test(url)) {
      url = config.requestURL + url;
    }
  
    wx.request({
      url: url,
      data: data,
      method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: { Authorization: 'Bearer ' + wx.getStorageSync('token') }, // 设置请求的 header
      success: function (res) {
        resolve(res.data)
      },
      fail: function (res) {
        reject(res)
      }
    })
  })
}