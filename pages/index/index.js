//获取公共ui操作类实例
const _page = require('../../utils/abstract-page.js');
let modCalendar = require('../mod/calendar.js');
let modCity = require('../mod/city.js');


//获取应用实例
const app = getApp()

Page(_page.initPage({
  data: {
  },
  // methods: uiUtil.getPageMethods(),
  methods: {
  },
  goList: function () {
    if(!this.data.cityStartId) {
      this.showToast('请选择出发城市');
      return;
    }
    if(!this.data.cityArriveId) {
      this.showToast('请选择到达城市');
      return;
    }

    wx.navigateTo({
      url: '../list/list?sid=' + this.data.cityStartId + '&aid=' + this.data.cityArriveId + '&date=' + new Date(this.data.calendarSelectedDate).getTime()
    })

  },
  onShow: function () {
    global.sss = this;
    let scope = this;
  },
  onLoad: function () {
    // this.setPageMethods();
  }
}, {
  modCalendar: modCalendar,
  modCity: modCity
}))