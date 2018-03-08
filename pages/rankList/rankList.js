const storage = require('../../utils/storage');
const rankService = require('../../services/rank.service');
const STORAGE_KEY = 'rankListData';

const navList = [
  {
    name: '周榜',
  },
  {
    name: '月榜',
  },
  {
    name: '总榜',
  }
];

const navConfig = ['week', 'month', 'total'];

let dataInit = () => {
  let data = storage.getStorage(STORAGE_KEY);

  if (!data || data.length == 0) {
    data = {
      rankList: []
    }
  }
  data.navList = navList;
  return data;
};

Page({

  params: {
    genre: '',
    cycle: ''
  },

  page: 1,
  
  /**
   * 页面的初始数据
   */
  data: dataInit(),

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.params.genre = options.genre;
    this.params.cycle = options.cycle;
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
    this.page = 1;
    this._init();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.page++;
    this._init(true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  _init(isPush = false) {
    let self = this;
    this.getRankList().then(function (list) {
      let data = {
        rankList: list
      };
      isPush && (data.rankList = self.data.rankList.concat(list));
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      storage.setStorage(STORAGE_KEY, data);
      data.currentIndex = navConfig.indexOf(self.params.cycle);
      self.setData(data);
    });
  },

  getRankList() {
    return rankService.getRankList(this.params.genre, this.params.cycle, this.page);
  },

  onClick(event) {
    var key = event.currentTarget.dataset.key;
    this.params.cycle = navConfig[key];
    this.page = 1;
    this._init();
  }

})