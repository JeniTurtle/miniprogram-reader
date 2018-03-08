const bookService = require('../../services/book.service');

Page({

  params: {
    bookId: 0,
  },

  /**
   * 页面的初始数据
   */
  data: {
    sortType: true, // true为正序，false为倒序
    isLoading: true,
    chapterList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.params.bookId = options.bookId || 671;
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
    let self = this;
    this.getChapterList().then(list => {
      let data = {
        sortType: true,
        bookId: self.params.bookId,
        chapterList: list,
        isLoading: false,
      };
      this.setData(data);
    })
  },

  getChapterList() {
    return bookService.getChapterList(this.params.bookId);
  },

  sort() {
    this.setData({
      sortType: !this.data.sortType,
      chapterList: this.data.chapterList.reverse()
    })
  }
})