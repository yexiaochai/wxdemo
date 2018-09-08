
//公共方法抽离,输入年月日判断在今天前还是今天后
function isOverdue(year, month, day) {
  let date = new Date(year, month, day);
  let now = new Date();
  now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return date.getTime() < now.getTime();
}

function isToday(year, month, day) {
  let date = new Date(year, month, day);
  let now = new Date();
  now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return date.getTime() === now.getTime();
}

export default {
  name: 'ui-calendar-day',
  data: {
    props: {
      year: {
        type: String
      },
      month: {
        type: String
      },
      day: {
        type: Number
      }
    },
    methods: {
    },
    data: function() {
      //是否过期了
      let klass = isOverdue(this.year, this.month, this.day) ? 'cm-item--disabled' : '';
      if(isToday(this.year, this.month, this.day)) klass += 'active'

      return {
        klass: klass
      }
    },
    template: 
    `
<li v-bind:class="klass" v-bind:data-year="year" v-bind:data-month="month" v-bind:data-day="day">
	{{day}}
</li>
    `
  }
}