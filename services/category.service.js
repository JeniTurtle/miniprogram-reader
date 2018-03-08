const request = require('../utils/request');
const app = getApp();

const genreList = {
  hot: 'hot',
  new: 'new',
  over: 'over',
  commend: 'commend',
  collect: 'collect',
  vote: 'vote',
};

module.exports = {
  getCategory() {
    return request('GET', '/BookCategory.html').then(res => {
      return res.data || [];
    }).catch(e => { throw e })
  },

  getBookList(categoryId, genre, page) {
    genre = genreList[genre] || genreList.hot
    page = page || 1;
    let path = `/Categories/${categoryId}/${genre}/${page}.html`;

    return request('GET', path).then(res => {
      return res.data.BookList || [];
    }).then(function (list) {
      list.map(function (item, index) {
        if (!/^http/.test(item.Img)) {
          item.Img = app.globalData.imagePath + item.Img;
        }
        item.Score = item.Score.toFixed(1);
      });
      return list;
    }).catch(e => { throw e })
  },
}