import html from './index.html.js'
import data from '../../components/ui-calendar.js'
import data1 from '../../components/ui-container.js'

Vue.component(data.name, data.data);
Vue.component(data1.name, data1.data);

function preMonth(d) {
  if(typeof d === 'number') d = new Date(d);
  else d = new Date();
  let date = new Date(d.getFullYear(), d.getMonth() - 1)
  return date;
}

function nextMonth(d) {
  if(typeof d === 'number') d = new Date(d);
  else d = new Date();
  let date = new Date(d.getFullYear(), d.getMonth() + 1)
  return date;
}

export default {
  name: 'page-index',
  data: {
    template: html,
    methods: {
			showCitylist: function(e) {
				console.log('showCitylist')
			},
			onContainerHide: function() {
				this.isCalendarShow = 'none';
			},
			showCalendar: function(e) {
				this.isCalendarShow = '';
			},
			preMonth: function() {
				this.displayTime = preMonth(this.displayTime).getTime();
			},
			nextMonth: function () {
				this.displayTime = nextMonth(this.displayTime).getTime();
        // this.displayTime = new Date(2018, 11, 13).getTime()

			},
			goList: function(e) {
				console.log('goList')
			},
      onDayClick: function (data) {
        this.selectedDate = new Date(data.year, data.month, data.day).getTime();
        this.calendarSelectedDateStr = new Date(this.selectedDate).toLocaleDateString();
				this.isCalendarShow = 'none';
//        debugger;
      }
    },
    data: function() {
      return {
      	isCalendarShow: 'none',
      	cityStartName: '请选择出发地',
        cityArriveName: '请选择到达地',
        calendarSelectedDateStr: '请选择出发日期',
        selectedDate: new Date(2018, 8, 13).getTime(),
        displayTime: new Date(2018, 9, 13).getTime(),
        displayMonthNum: 1
			};
    }
  }
}