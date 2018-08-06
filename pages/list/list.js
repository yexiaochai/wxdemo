//获取公共ui操作类实例
const _page = require('../../utils/abstract-page.js');
let modCalendar = require('../mod/calendar.js');

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


  },
  onLoad: function () {
    // this.setPageMethods();
  }
}, {
  modCalendar: modCalendar
}))