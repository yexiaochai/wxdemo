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
    //引入计算属性概念
    computed: {
      // 计算属性的 getter
      year: function () {
        let date = new Date(this.displayTime);
        return date.getFullYear();
      },
      month: function () {
        let date = new Date(this.displayTime);
        return date.getMonth();
      }
      
  },
    data: function() {
      return {
        scope: this, //点击日历的时候需要厨房的事件
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
      <ui-calendar-month :scope="scope" :selectedDate="selectedDate" :year="year" :month="month+m-1" ></ui-calendar-month>
    </template>
</ul>
`
  }
}
