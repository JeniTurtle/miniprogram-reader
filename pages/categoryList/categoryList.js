const storage = require('../../utils/storage');
const categoryService = require('../../services/category.service');
const STORAGE_KEY = 'categoryListData';

const navList = [
  {
    name: '热门',
  },
  {
    name: '新书',
  },
  {
    name: '好评',
  },
  {
    name: '完结',
  }
];

const navConfig = ['hot', 'new', 'vote', 'over'];

let dataInit = () => {
  let data = storage.getStorage(STORAGE_KEY);

  if (!data || data.length == 0) {
    data = {
      bookList: []
    }
  }
  data.navList = navList;
  return data;
};

Page({

  params: {
    genre: 'hot',
    categoryId: 1,
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
    this.params.categoryId = options.categoryId;
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
    this.getBookList().then(list => {
      let data = {
        bookList: list
      };
      isPush && (data.bookList = self.data.bookList.concat(list));
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      storage.setStorage(STORAGE_KEY, data);
      data.currentIndex = navConfig.indexOf(self.params.genre);
      self.setData(data);
    });
  },

  getBookList() {
    return categoryService.getBookList(this.params.categoryId, this.params.genre, this.page);
  },

  onClick(event) {
    var key = event.currentTarget.dataset.key;
    this.params.genre = navConfig[key];
    this.page = 1;
    this._init();
  }

})