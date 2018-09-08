import html from './index.html.js'

export default {
  name: 'page-index',
  data: {
    template: html,
    methods: {
		showCitylist: function(e) {
			console.log('showCitylist')
		},
		showCalendar: function(e) {
			console.log('showCalendar')
		},
		goList: function(e) {
			console.log('goList')
		}
    },
    data: function() {
      return {
      	cityStartName: '请选择出发地',
        cityArriveName: '请选择到达地',
        calendarSelectedDateStr: '请选择出发日期'}
    }
  }
}