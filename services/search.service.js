const request = require('../utils/request');
const app = getApp();

module.exports = {
  getSearchList(search, page, num) {
    if (!search) {
      throw Error('Search content can not be empty');
    } 
    page = page || 1;
    let path = `/Search.aspx?isSearchPage=1&key=${search}&page=${page}`;

    return request('GET', path).then(res => {
      return res.data || [];
    }).then(function (list) {
      list = list.slice(0, num);
      list.map(function (item, index) {
        if (!/^http/.test(item.Img)) {
          item.Img = app.globalData.imagePath + item.Img;
        }
      });
      return list;
    }).catch(e => { throw e })
  },
}