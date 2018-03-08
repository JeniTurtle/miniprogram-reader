const bookService = require('../../services/book.service');
const storage = require('../../utils/storage');

const READ_BOOK_LIST_STORAGE_KEY = 'readBookList';
const BOOKSHELF_STORAGE_KEY = 'bookshelf';

Page({

  sameUserBooks: [],

  limitSameUserBooks: [],

  params: {
    bookId: 0,
  },

  /**
   * 页面的初始数据
   */
  data: {
    bookInfo: {},
    moreDesc: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.params.bookId = options.bookId || 86745;
    let bookshelf = storage.getStorage(BOOKSHELF_STORAGE_KEY) || {};

    this.setData({
      hasBookshelf: !!bookshelf[this.params.bookId]
    })
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
    this.getBookInfo().then(res => {
      self.sameUserBooks = res.SameUserBooks;
      self.limitSameUserBooks = res.SameUserBooks.slice(0, 3);
      res.SameUserBooks = self.limitSameUserBooks;

      wx.setNavigationBarTitle({
        title: '书籍详情 - ' + res.Name
      });

      let data = {
        bookInfo: res
      };
      self.setData(data);
    })
  },

  getBookInfo() {
    return bookService.getBookInfo(this.params.bookId);
  },

  showMoreDesc(event) {
    let bool = !this.data.moreDesc;
    this.setData({
      moreDesc: bool
    })
  },

  showMoreBooks(event) {
    this.data.moreBooks = !this.data.moreBooks;
    this.data.bookInfo.SameUserBooks = this.data.moreBooks
      ? this.sameUserBooks
      : this.limitSameUserBooks;
    this.setData(this.data);
  },

  jumpChapter() {
    let readBookList = storage.getStorage(READ_BOOK_LIST_STORAGE_KEY) || {};
    let firstChapterId = this.data.bookInfo.FirstChapterId;

    if (readBookList[this.data.bookInfo.Id]) {
      firstChapterId = readBookList[this.data.bookInfo.Id];
    }

    wx.navigateTo({
      url: `../chapter/chapter?bookId=${this.data.bookInfo.Id}&chapterId=${firstChapterId}`,
    })
  },

  pullBookshelf() {
    let bookshelf = storage.getStorage(BOOKSHELF_STORAGE_KEY) || {};
    delete bookshelf[this.params.bookId];
    storage.setStorage(BOOKSHELF_STORAGE_KEY, bookshelf);

    this.setData({
      hasBookshelf: false
    })
  },

  pushBookshelf() {
    let bookshelf = storage.getStorage(BOOKSHELF_STORAGE_KEY) || {};

    bookshelf[this.params.bookId] = this.data.bookInfo;
    storage.setStorage(BOOKSHELF_STORAGE_KEY, bookshelf);

    this.setData({
      hasBookshelf: true
    })
  }
})