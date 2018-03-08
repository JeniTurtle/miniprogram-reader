const storage = require('../../utils/storage');
const searchService = require('../../services/search.service');
const rankService = require('../../services/rank.service');

Page({

  params: {
    search: ''
  },

  page: 1,

  /**
   * 页面的初始数据
   */
  data: {
    commendRank: [],
    searchList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.params.search = options.search;
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
    this._init();
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
    if (this.data.searchList.length < 1) {
      return false;
    }

    this.page++;
    this._init(true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  _init(isPush = false) {
    let self = this;

    if (!this.params.search) {
      this.showCommendList();
      return ;
    }

    this.getSearchList().then(function (list) {
      let data = {
        searchVal: self.params.search,
        searchList: list,
        commendRank: [],
      };
      
      isPush && (data.searchList = self.data.searchList.concat(list));
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      self.setData(data);
    });
  },

  showCommendList() {
    let self = this;
    this.getCommendRank(6).then(data => {
      self.setData({
        commendRank: data
      })
    })
  },

  getSearchList() {
    let search = this.params.search.replace(/(^\s*)|(\s*$)/g, "");
    return searchService.getSearchList(search, this.page);
  },

  getCommendRank(num) {
    return rankService.getRankList('commend', 'week', 1, num);
  },

  onInputChange(event) {
    this.params.search = event.detail.value;
  },

  onSearch() {
    this.page = 1;
    this._init();
  }
})