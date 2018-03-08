const storage = require('../../utils/storage');
const rankService = require('../../services/rank.service');

const STORAGE_KEY = 'rankData';

let dataInit = () => {
  let data = storage.getStorage(STORAGE_KEY);

  if (!data || data.length == 0) {
    data = {
      newRank: [],
      hotRank: [],
      collectRank: [],
      voteRank: [],
      commendRank: [],
      overRank: []
    }
  }
  return data;
};

Page({
  /**
   * 页面的初始数据
   */
  data: dataInit(),

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this._init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this._init();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  _init() {
    this.getRankIndexData().then(res => {
      let data = {
        newRank: res['new'],
        hotRank: res['hot'],
        commendRank: res['commend'],
        overRank: res['over'],
        collectRank: res['collect'],
        voteRank: res['vote']
      };
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      storage.setStorage(STORAGE_KEY, data);
      this.setData(data);
    })
  },

  getRankIndexData() {
    return rankService.getRankIndex();
  },

  getNewRank(num) {
    return rankService.getRankList('new', 'week', 1, num);
  },

  getHotRank(num) {
    return rankService.getRankList('hot', 'week', 1, num);
  },

  getCommendRank(num) {
    return rankService.getRankList('commend', 'week', 1, num);
  },

  getOverRank(num) {
    return rankService.getRankList('over', 'week', 1, num);
  },

  getCollectRank(num) {
    return rankService.getRankList('collect', 'week', 1, num);
  },

  getVoteRank(num) {
    return rankService.getRankList('vote', 'week', 1, num);
  },

})