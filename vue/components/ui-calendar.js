import data from './ui-calendar-month.js'

Vue.component(data.name, data.data);

export default {
  name: 'ui-calendar',
  data: {
    props: {
      displayMonthNum: {
        type: Number
      },
      displayTime: {
        type: Number
      },
      selectedDate: {
        type: Number
      }
    },
    methods: {
    },
    data: function() {
      //要求传入的当前显示时间必须是时间戳
      let date = new Date(this.displayTime);

      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        weekDayArr: ['日', '一', '二', '三', '四', '五', '六']
      }
    },
    template:
`
<ul class="cm-calendar ">
  <ul class="cm-calendar-hd">
    <template v-for="i in 7" >
      <li class="cm-item--disabled">{{weekDayArr[i-1]}}</li>
    </template>
  </ul>
    <template v-for="m in displayMonthNum" >
      <ui-calendar-month :selectedDate="selectedDate" :year="year" :month="month+m-1" ></ui-calendar-month>
    </template>
</ul>
`
  }
}
