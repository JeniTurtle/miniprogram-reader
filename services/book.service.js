const request = require('../utils/request');
const app = getApp();

module.exports = {
  getBookInfo(bookId) {
    return request('GET', `/info/${bookId}.html`).then(res => {
      return res.data || {};
    }).then(data => {
      data.BookVote.Score = data.BookVote.Score.toFixed(1);
      if (!/^http/.test(data.Img)) {
        data.Img = app.globalData.imagePath + data.Img;
      }
      data.LastTime = data.LastTime.split(' ')[0];
      data.BookStatus = data.BookStatus == '完成' ? '完结' : data.BookStatus;
      data.SameUserBooks.map((item) => {
        if (!/^http/.test(item.Img)) {
          item.Img = app.globalData.imagePath + item.Img;
        }
      });
      data.SameCategoryBooks.map((item) => {
        if (!/^http/.test(item.Img)) {
          item.Img = app.globalData.imagePath + item.Img;
        }
      });
      return data;
    }).catch(e => { throw e })
  },

  getChapterList(bookId) {
    return request('GET', `/book/${bookId}/`).then(res => {
      if (typeof res == 'string') {
        res = JSON.parse(res.replace(/\},\]/g, '}]'));
      }
      return res.data.list || [];
    }).then(list => {
      let res = [];
      list.map(item => {
        if (item.list instanceof Array) {
          res = res.concat(item.list);
        }
      });
      return res;
    }).catch(e => { throw e })
  },

  getChapterInfo(bookId, chapterId) {
    return request('GET', `/book/${bookId}/${chapterId}.html`).then(res => {
      return res.data || {};
    }).then(data => {
      data.content = data.content.replace(/[\r ]/g, '');
      if (!/$( )/.test(data.content)) {
        data.content = '　　' + data.content;
      }
      return data;
    }).catch(e => { throw e })
  }
}