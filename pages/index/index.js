//获取公共ui操作类实例
const _page = require('../../utils/abstract-page.js');
//获取应用实例
const app = getApp()

Page(_page.initPage({
  data: {
  },
  // methods: uiUtil.getPageMethods(),
  methods: {
  },
  onShow: function () {
     global.sss = this;
     let scope = this;
    this.showToast('我是美丽可爱的toast', function () { console.log('执行回调')} );
     
  },
  onLoad: function () {
    // this.setPageMethods();
  }
}))