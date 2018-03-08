const request = require('../utils/request');
const dataSource = require('../utils/storage').getDataSource;
const app = getApp();

module.exports = {
  getBanner() {
    return request('GET', `/v4/biquge/banner_${dataSource()}.html`).then(res => {
      return res.data || [];
    }).catch(e => { throw e })
  },
  
  getIndexData() {
    return request('GET', `/v4/biquge/${dataSource()}.html`).then(res => {
      return res.data || [];
    }).then(list => {
      list.map(arr => {
        arr.Books && arr.Books.map(item => {
          if (!/^http/.test(item.Img)) {
            item.Img = app.globalData.imagePath + item.Img;
          }
        })
      });
      return list;
    }).catch(e => { throw e })
  },
}