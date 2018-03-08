const Promise = require('../../vendor/promise')
const storage = require('../../utils/storage');
const indexService = require('../../services/index.service');

const STORAGE_KEY = 'indexData';

let dataInit = () => {
  let data = storage.getStorage(STORAGE_KEY);

  if (!data || data.length == 0) {
    data = {
      banners: [],
      newRank: [],
      hotRank: [],
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
    Promise.all([
      this.getBanner(6),
      this.getIndexData()
    ]).then(arr => {
      let data = {
        banners: arr[0],
        newRank: arr[1][0]['Books'],
        hotRank: arr[1][1]['Books'],
        commendRank: arr[1][2]['Books'],
        overRank: arr[1][3]['Books'],
        searchVal: this.getDefaultSearchVal()
      };
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      storage.setStorage(STORAGE_KEY, data);
      this.setData(data);
    })
  },

  getBanner(num) {
    return indexService.getBanner().then(function(list) {
      return list.slice(0, num);
    });
  },

  getIndexData() {
    return indexService.getIndexData();
  },

  getDefaultSearchVal() {
    let searchConfig = {
      "man": "校花的贴身高手",
      "lady": "大总裁，小娇妻"
    };
    let source = storage.getDataSource();
    return searchConfig[source];
  },

  onSearch(event) {
    let searchVal = this.data.searchVal || event.currentTarget.dataset.defaultVal;
    wx.navigateTo({
      url: '/pages/search/search?search=' + searchVal
    });
  },

  onInputChange(event) {
    this.setData({
      searchVal: event.detail.value
    });
  }

})