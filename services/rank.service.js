const request = require('../utils/request');
const dataSource = require('../utils/storage').getDataSource;

const app = getApp();

const cycleType = {
  week: 'week',
  month: 'month',
  total: 'total',
};

const genreList = {
  hot: 'hot',
  new: 'new',
  over: 'over',
  commend: 'commend',
  collect: 'collect',
  vote: 'vote',
};

module.exports = {
  getRankIndex() {
    return request('GET', `/top/${dataSource()}/index.html`).then(res => {
      return res.data || [];
    }).then(data => {
      for (let index in data) {
        data[index].map(item => {
          if (!/^http/.test(item.Img)) {
            item.Img = app.globalData.imagePath + item.Img;
          }
        })
      }
      return data;
    }).catch(e => { throw e })
  }, 

  getRankList(genre, cycle, page, num) {
    genre = genreList[genre] || genreList.hot
    cycle = cycleType[cycle] || cycleType.week;
    page = page || 1;
    let path = `/top/${dataSource()}/top/${genre}/${cycle}/${page}.html`;

    return request('GET', path).then(res => {
      return res.data.BookList || [];
    }).then(function (list) {
      list = list.slice(0, num);
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