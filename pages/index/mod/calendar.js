/*
事实上一个mod就只是一个对象,只不过为了方便拆分,将对象分拆成一个个的mod
一个mod对应一个wxml,但是共享外部的css,暂时如此设计
所有日历模块的需求全部再此实现
*/
module.exports = {
  q: 1,
  ddd: function(){},
  onCalendarDayTap: function (e) {
    let data = e.detail;
    var date = new Date(data.year, data.month, data.day);

    console.log(date)

    this.setData({
      calendarSelectedDate: date
    });

  },
  data: {
    isCalendarShow: '',
    calendarDisplayMonthNum: 2,
    calendarDisplayTime: new Date(),
    calendarSelectedDate: null
  }


}