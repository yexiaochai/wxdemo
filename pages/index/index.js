//获取公共ui操作类实例
const uiUtil = require('../../utils/ui-util.js');
//获取应用实例
const app = getApp()
Page({
  data: uiUtil.getPageData(),
  // methods: uiUtil.getPageMethods(),
  methods: {
  },
  onShow: function() {
    let scope= this;
    uiUtil.showToast(this, '我是美丽可爱的toast');
    //3秒后关闭loading
    // setTimeout(function () {
    //   uiUtil.hideToast(scope);
    // }, 3000);
  },
  onLoad: function () {
    uiUtil.setPageMethods(this);
  }
})

