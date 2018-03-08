const pageUrl = require('../../utils/pageUrl');
const storage = require('../../utils/storage');

Component({
  
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    
  },

  ready() {
    this.setData({
      source: storage.getDataSource()
    })
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    checkSource(event) {
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 1];
      let val = event.currentTarget.dataset.val;
      storage.setDataSource(val);
      this.setData({
        source: val
      })
      currentPage.onShow();
    }
  }
})