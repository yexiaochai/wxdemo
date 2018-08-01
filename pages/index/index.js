//获取公共ui操作类实例
const _page = require('../../utils/abstract-page.js');
//获取应用实例
const app = getApp()


Page(_page.initPage({
  data: {
    ttt: 'ttt'

  },
  // methods: uiUtil.getPageMethods(),
  methods: {
  },
  onShow: function () {
     let scope = this;
     this.showToast('我是美丽可爱的toast');
     // 3秒后关闭loading
    //  setTimeout(function () {
    //    scope.hideToast();
    //  }, 3000);
  },
  onLoad: function () {
    // this.setPageMethods();
  }
}))
