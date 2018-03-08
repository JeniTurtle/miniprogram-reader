const request = require('../utils/request');
const dataSource = require('../utils/storage').getDataSource;

const app = getApp();

const genreList = {
  hot: 'hot',
  new: 'new',
  collect: 'collect',
};

module.exports = {
  getBookList(genre, page, num) {
    genre = genreList[genre] || genreList.hot
    page = page || 1;
    let path = `/shudan/${dataSource()}/all/${genre}/${page}.html`;

    return request('GET', path).then(res => {
      return res.data || [];
    }).then(function (list) {
      list = list.slice(0, num);
      list.map(function (item, index) {
        if (!/^http/.test(item.Cover)) {
          item.Cover = app.globalData.imagePath + item.Cover;
        }
        item.UpdateTime = item.UpdateTime.split(' ')[0]
      });
      return list;
    }).catch(e => { throw e })
  },

  getBookListDetail(booklistId) {
    return request('GET', `/shudan/detail/${booklistId}.html`).then(res => {
      return res.data || {};
    }).then(data => {
      if (!/^http/.test(data.Cover)) {
        data.Cover = app.globalData.imagePath + data.Cover;
      }
   
      data.BookList.map((item) => {
        item.Score = item.Score.toFixed(1);
        item.Id = item.BookId;
        item.Name = item.BookName;
        item.CName = item.CategoryName;
        item.Desc = item.Description;
        if (!/^http/.test(item.BookImage)) {
          item.Img = app.globalData.imagePath + item.BookImage;
        }
      });
      return data;
    }).catch(e => { throw e })
  },
}