/*
事实上一个mod就只是一个对象,只不过为了方便拆分,将对象分拆成一个个的mod
一个mod对应一个wxml,但是共享外部的css,暂时如此设计
所有日历模块的需求全部再此实现
*/
const util = require('../../utils/util.js')

let selectedDate = new Date().toString();

module.exports = {
  showCalendar: function () {
    this.setData({
      isCalendarShow: ''
    });
  },
  hideCalendar: function () {
    this.setData({
      isCalendarShow: 'none'
    });
  },
  preMonth: function () {

    this.setData({
      calendarDisplayTime: util.dateUtil.preMonth(this.data.calendarDisplayTime).toString()
    });
  },
  nextMonth: function () {
    this.setData({
      calendarDisplayTime: util.dateUtil.nextMonth(this.data.calendarDisplayTime).toString()
    });
  },
  onCalendarDayTap: function (e) {
    let data = e.detail;
    var date = new Date(data.year, data.month, data.day);
    console.log(date)

    //留下一个钩子函数
    if(this.calendarHook) this.calendarHook(date);
    this.setData({
      isCalendarShow: 'none',
      calendarSelectedDate: date.toString(),
      calendarSelectedDateStr: util.dateUtil.format(date, 'Y年M月D日')
    });
  },
  onContainerHide: function () {
    this.hideCalendar();
  },

  data: {
    isCalendarShow: 'none',
    calendarDisplayMonthNum: 1,
    calendarDisplayTime: selectedDate,
    calendarSelectedDate: selectedDate,
    calendarSelectedDateStr: util.dateUtil.format(new Date(selectedDate), 'Y年M月D日')
  }
}