//获取公共ui操作类实例
const _page = require('../../utils/abstract-page.js');
let modCalendar = require('../mod/calendar.js');
let modCity = require('../mod/city.js');


//获取应用实例
const app = getApp()

Page(_page.initPage({
  data: {
    sss: 'sss'
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
  // onReady: function () {
  //   debugger;

  // },
  // onShow: function () {
  //   debugger;
    
  //   global.sss = this;
  //   let scope = this;
  // },
  onLoad: function () {
    this.setData({sss: 222})
    // this.setPageMethods();
  }
}, {
  modCalendar: modCalendar,
  modCity: modCity
}))