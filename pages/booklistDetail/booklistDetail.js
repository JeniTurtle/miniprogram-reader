const booklistService = require('../../services/booklist.service');

Page({

  params: {
    booklistId: 0,
  },

  /**
   * 页面的初始数据
   */
  data: {
    booklistDetail: {},
    moreDesc: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.params.booklistId = options.booklistId || 227;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this._init()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  _init() {
    var self = this;
    this.getBookListDetail().then(res => {
      wx.setNavigationBarTitle({
        title: '书单详情 - ' + res.Title
      });

      let data = {
        booklistDetail: res
      };
      self.setData(data);
    })
  },

  getBookListDetail() {
    return booklistService.getBookListDetail(this.params.booklistId);
  },

  showMoreDesc(event) {
    let bool = !this.data.moreDesc;
    this.setData({
      moreDesc: bool
    })
  },

})