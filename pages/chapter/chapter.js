const storage = require('../../utils/storage');
const bookService = require('../../services/book.service');

const BACKGROUND_STORAGE_KEY = 'readerBackground';
const FONT_SIZE_STORAGE_KEY = 'readerFontSize';
const READ_BOOK_LIST_STORAGE_KEY = 'readBookList';
const BOOKSHELF_STORAGE_KEY = 'bookshelf';

Page({

  params: {
    bookId: 0,
    chapterId: 0
  },

  /**
   * 页面的初始数据
   */
  data: {
    chapters: [],
    scrollTop: 0,
    fontSize: storage.getStorage(FONT_SIZE_STORAGE_KEY) || 0,
    background: storage.getStorage(BACKGROUND_STORAGE_KEY) || 'default',
    isShowControll: false,
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.params.bookId = options.bookId || 671;
    this.params.chapterId = options.chapterId || 360655;

    let bookshelf = storage.getStorage(BOOKSHELF_STORAGE_KEY) || {};

    this.setData({
      hasBookshelf: !!bookshelf[this.params.bookId],
      fontSize: storage.getStorage(FONT_SIZE_STORAGE_KEY) || 0,
      background: storage.getStorage(BACKGROUND_STORAGE_KEY) || 'default'
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

  getMore() {
    let lastChapter = this.data.chapters[this.data.chapters.length - 1];

    if (this.isLoading || !lastChapter.nid) {
      return false;
    }

    if (lastChapter.nid < 1) {
      wx.showToast({
        title: '已经全部看完啦！',
        icon: 'none'
      });
    } else {
      this._init(lastChapter.nid, true, false)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  _init(chapterId, isPush = false, isReturnTop = true) {
    this.setReadBookList(chapterId);
    
    !!isReturnTop && this.setData({
      isLoading: true
    });

    this.getChapterInfo(chapterId).then(res => {
      wx.setNavigationBarTitle({
        title: res.name + ' - ' + res.cname
      });

      let chapters = this.data.chapters;
      // 这里不能用push？？？fuck！！！
      if (chapters.length == 0) {
        chapters[0] = res;
      } else {
        chapters[chapters.length] = res;
      }

      if (!isPush) {
        chapters = [res];
      }
      
      let data = {
        isLoading: false,
        chapters: chapters
      };

      if (!!isReturnTop) {
        data.scrollTop = 0;
      } 

      this.setData(data);
    })
  },

  setReadBookList(chapterId) {
    chapterId = chapterId || this.params.chapterId;
    let readBookList = storage.getStorage(READ_BOOK_LIST_STORAGE_KEY) || {};
    readBookList[this.params.bookId] = chapterId;
    storage.setStorage(READ_BOOK_LIST_STORAGE_KEY, readBookList);
  },

  getChapterInfo(chapterId) {
    chapterId = chapterId || this.params.chapterId;
    return bookService.getChapterInfo(this.params.bookId, chapterId);
  },

  showControll() {
    this.setData({
      isShowControll: !this.data.isShowControll
    })
  },

  setBackground(event) {
    let background = event.currentTarget.dataset.background || this.data.background;
    this.setData({
      isShowControll: !this.data.isShowControll,
      background: background
    });

    storage.setStorage(BACKGROUND_STORAGE_KEY, background);
  },

  jumpChapter(event) {
    let chapterId = event.currentTarget.dataset.chapterId || -1;

    if (chapterId < 1) {
      wx.showToast({
        title: '已经没有章节啦',
        icon: 'none'
      });
    } else {
      this.setData({
        isShowControll: !this.data.isShowControll
      });
      this._init(chapterId)
    }
  },

  fontResize(fontSize) {
    this.setData({
      fontSize: fontSize
    });

    storage.setStorage(FONT_SIZE_STORAGE_KEY, fontSize);
  },

  fontPlus() {
    let maxSize = 5;
    let fontSize = this.data.fontSize + 1 > maxSize ? maxSize : this.data.fontSize + 1;
    this.fontResize(fontSize);
  },

  fontReduce() {
    let minSize = 0;
    let fontSize = this.data.fontSize - 1 < minSize ? minSize : this.data.fontSize - 1;
    this.fontResize(fontSize);
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

    bookService.getBookInfo(this.params.bookId).then(data => {
      bookshelf[this.params.bookId] = data;
      storage.setStorage(BOOKSHELF_STORAGE_KEY, bookshelf);

      this.setData({
        hasBookshelf: true
      })
    });
  }
})