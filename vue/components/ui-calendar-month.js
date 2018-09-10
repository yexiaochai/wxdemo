import data from './ui-calendar-day.js'

Vue.component(data.name, data.data);

//公共方法抽离,输入年月日判断在今天前还是今天后
function isLeapYear(year) {
    if ((typeof year == 'object') && (year instanceof Date)) year = year.getFullYear()
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) return true;
    return false;
}

// @description 获取一个月份1号是星期几，注意此时保留开发习惯,月份传入时需要自主减一
// @param year {num} 可能是年份或者为一个date时间
// @param year {num} 月份
// @return {num} 当月一号为星期几0-6
function getBeginDayOfMouth(year, month) {
  //自动减一以便操作
  month--;
  if ((typeof year == 'object') && (year instanceof Date)) {
    month = year.getMonth();
    year = year.getFullYear();
  }
  var d = new Date(year, month, 1);
  return d.getDay();
}

export default {
  name: 'ui-calendar-month',
  data: {
    props: {
      year: {
        type: Number
      },
      month: {
        type: Number
      },
      selectedDate: {
        type: Number
      },
      scope: Object
    },
    methods: {

    },
    computed: {
        // 计算属性的 getter
        days: function () {
          return [31, isLeapYear(this.year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][this.month];
        },
        beforeDays: function () {
         return getBeginDayOfMouth(this.year, parseInt(this.month) + 1);
        }
        
    },
    data: function() {
      return {
      }
    },
    template: 
    `
<ul class="cm-calendar-bd ">
  <h3  class="cm-month calendar-cm-month js_month">{{year + '-' + month}}</h3>
  <ul class="cm-day-list">
  <template v-for="n in beforeDays" >
    <li class="cm-item--disabled"></li>
  </template>
  <template v-for="num in days" >
    <ui-calendar-day :scope="scope" :selectedDate="selectedDate" :year="year" :month="month" v-bind:day="num" ></ui-calendar-day>
  </template>
  </ul>
</ul>
    `
  }
}