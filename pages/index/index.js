//获取公共ui操作类实例
const _page = require('../../utils/abstract-page.js');
let modCalendar = require('./mod/calendar.js');

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

    return;
    this.showMessage({
      message: '我是一个确定框',
      ok: {
        name: '确定',
        callback: function () {
          scope.hideMessage();
          scope.showMessage('我选择了确定');
        }
      },
      cancel: {
        name: '取消',
        callback: function () {
          scope.hideMessage();
          scope.showToast('我选择了取消');
        }
      }
    });

  },
  onLoad: function () {
    // this.setPageMethods();
  }
}, {
  modCalendar: modCalendar

}))