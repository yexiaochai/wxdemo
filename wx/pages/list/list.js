//获取公共ui操作类实例
const _page = require('../../utils/abstract-page.js');
let modCalendar = require('../mod/calendar.js');
const models = require('../../data/demo-model.js')
const util = require('../../utils/util.js')
let selectedDate = new Date().toString();

console.log('list');

//获取应用实例
const app = getApp()

Page(_page.initPage({
  data: {
    listData: [],
    calendarSelectedDate: selectedDate,
    calendarSelectedDateStr: util.dateUtil.format(new Date(selectedDate), 'Y年M月D日')
  },
  // methods: uiUtil.getPageMethods(),
  methods: {
  },

  preDay: function () {
    let date = util.dateUtil.preDay(this.data.calendarSelectedDate);

    this.index = 0;
    this.data.listData = [];

    this.setData({
      calendarSelectedDate: date.toString(),
      calendarSelectedDateStr: util.dateUtil.format(date, 'Y年M月D日')
    })
    this._initData({
      date: date.getTime()
    });
  },

  nextDay: function () {
    let date = util.dateUtil.nextDay(this.data.calendarSelectedDate);

    this.index = 0;
    this.data.listData = [];

    this.setData({
      calendarSelectedDate: date.toString(),
      calendarSelectedDateStr: util.dateUtil.format(date, 'Y年M月D日')
    })
    this._initData({
      date: date.getTime()
    });
  },

  calendarHook: function (date) {
    this.index = 0;
    this.data.listData = [];
    this._initData({
      date: date.getTime()
    });
  },

  onShow: function () {
    global.sss = this;
    let scope = this;
  },

  _setDateInfo: function (date) {
    let selectedDate = new Date(date * 1);
    this.setData({
      calendarSelectedDate: selectedDate.toString(),
      calendarSelectedDateStr: util.dateUtil.format(selectedDate, 'Y年M月D日')
    });
  },

  _appendList: function (data) {

    for(let i = 0, len = data.length; i < len; i++) {
      data[i].dateStr = util.dateUtil.format(new Date(data[i].datetime * 1000), 'H:F' )
    }

    this.setData({
      listData: this.data.listData.concat(data)
    });
  },
  _initData: function (data) {
    let scope = this;
    let listModel = models.listModel;

    listModel.setParam({
      startcityid: this._sid,
      arrivalcityid: this._aid,
      startdatetime: data.date / 1000,
      page: this.index + 1
    });

    this.showLoading();
    listModel.execute(function(data) {
      scope.hideLoading();

      if(!data.schedules) return;
      scope._appendList(data.schedules);

    });
  },
  onLoad: function (data) {

    if(!data || !data.sid || !data.aid || !data.date) {
      this.showToast('参数错误');
      return
    }
    this.index = 0;
    this._aid = data.aid;
    this._sid = data.sid;

    this._setDateInfo(data.date);
    this._initData(data);

  },

  onReady: function () {

  },
  onShow: function () {

    global.sss = this;
    let scope = this;
  }
  
}, {
  modCalendar: modCalendar
}))