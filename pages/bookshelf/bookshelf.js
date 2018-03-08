const storage = require('../../utils/storage');

const READ_BOOK_LIST_STORAGE_KEY = 'readBookList';
const BOOKSHELF_STORAGE_KEY = 'bookshelf';

Page({

  data: {
    bookshelf: [],
    startX: 0, //开始坐标
    startY: 0
  },

  onLoad() {
    
  },

  onShow: function () {
    this._init()
  },

  _init() {
    let bookshelf = this.getBookshelf();

    this.setData({
      bookshelf: bookshelf
    })
  },

  getBookshelf() {
    let index, list = [];
    let bookshelf = storage.getStorage(BOOKSHELF_STORAGE_KEY) || {};

    for (index in bookshelf) {
      list.push(bookshelf[index]);
    }
    return list;
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
  
    //开始触摸时 重置所有删除
    this.data.bookshelf.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      bookshelf: this.data.bookshelf
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.bookshelf.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      bookshelf: that.data.bookshelf
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    let index = e.currentTarget.dataset.index;
    let bookId = this.data.bookshelf[index]['Id'];
    let bookshelf = storage.getStorage(BOOKSHELF_STORAGE_KEY) || {};
    
    this.data.bookshelf[index].isHide = true;
    delete bookshelf[bookId];

    this.setData({
      bookshelf: this.data.bookshelf
    });

    this.data.bookshelf.splice(index, 1);
    this.setData({
      bookshelf: this.data.bookshelf
    })

    storage.setStorage(BOOKSHELF_STORAGE_KEY, bookshelf)
  },

  jumpChapter(event) {
    console.log(event);
    let readBookList = storage.getStorage(READ_BOOK_LIST_STORAGE_KEY) || {};
    let firstChapterId = event.currentTarget.dataset.firstChapterId;
    let bookId = event.currentTarget.dataset.bookId;

    if (readBookList[bookId]) {
      firstChapterId = readBookList[bookId];
    }

    wx.navigateTo({
      url: `../chapter/chapter?bookId=${bookId}&chapterId=${firstChapterId}`,
    })
  }
})