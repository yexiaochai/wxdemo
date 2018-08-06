//获取公共ui操作类实例
const _page = require('../../utils/abstract-page.js');
let modCalendar = require('../mod/calendar.js');
const models = require('../../data/demo-model.js')

//获取应用实例
const app = getApp()

Page(_page.initPage({
  data: {
    listData: []
  },
  // methods: uiUtil.getPageMethods(),
  methods: {
  },

  goIndex: function () {

    wx.navigateTo({
      url: '../index/index'
    })
  },
  onShow: function () {
    global.sss = this;
    let scope = this;
  },

  _appendList: function (data) {

  },

  onLoad: function (data) {
    let scope = this;

    if(!data || !data.sid || !data.aid || !data.date) {
      this.showToast('参数错误');
      return
    }

    this.index = 0;
    let listModel = models.listModel;

    listModel.setParam({
      startcityid: data.sid,
      arrivalcityid: data.aid,
      startdatetime: data.date / 1000,
      page: this.index + 1
    });

    this.showLoading();
    listModel.execute(function(data) {
      scope.hideLoading();
      scope._appendList(data.schedules);

    });

  }
}, {
  modCalendar: modCalendar
}))