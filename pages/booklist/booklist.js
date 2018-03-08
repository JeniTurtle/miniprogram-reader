const storage = require('../../utils/storage');
const booklistService = require('../../services/booklist.service');
const STORAGE_KEY = 'booklistData';

const navList = [
  {
    name: '最新发布',
  },
  {
    name: '本周最热',
  },
  {
    name: '最多收藏',
  }
];

const navConfig = ['new', 'hot', 'collect'];

let dataInit = () => {
  let data = storage.getStorage(STORAGE_KEY);

  if (!data || data.length == 0) {
    data = {
      booklist: []
    }
  }
  data.navList = navList;
  return data;
};

Page({

  params: {
    genre: ''
  },

  page: 1,

  /**
   * 页面的初始数据
   */
  data: dataInit(),

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.params.genre = options.genre || navConfig[0];
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
    wx.showNavigationBarLoading();
    this.page = 1;
    this._init();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
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
    this.getBookList().then(list => {
      let data = {
        booklist: list
      };
      isPush && (data.booklist = self.data.booklist.concat(list));
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      storage.setStorage(STORAGE_KEY, data);
      data.currentIndex = navConfig.indexOf(self.params.genre);
      self.setData(data);
    });
  },

  getBookList() {
    return booklistService.getBookList(this.params.genre, this.page);
  },

  onClick(event) {
    let key = event.currentTarget.dataset.key;
    this.params.genre = navConfig[key];
    this.page = 1;
    this._init();
  }
})