
//公共方法抽离,输入年月日判断在今天前还是今天后
function isOverdue(year, month, day) {
  let date = new Date(year, month, day);
  let now = new Date();
  now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return date.getTime() < now.getTime();
}

function isToday(year, month, day, selectedDate) {
  let date = new Date(year, month, day);
  return date.getTime() == selectedDate;
}

export default {
  name: 'ui-calendar-day',
  data: {
    props: {
      year: {
        type: Number
      },
      month: {
        type: Number
      },
      day: {
        type: Number
      },
      selectedDate: {
        type: Number
      },
      scope: {
        type: Object
      },
      
    },
    methods: {
    	onDayClick: function (e) {
		  let data = e.currentTarget.dataset;
		  this.scope.$emit('dayclick', data);
    	}
    },
	//引入计算属性概念
    computed: {
	    // 计算属性的 getter
	    klass: function () {
	       //是否过期了
      	let klass = isOverdue(this.year, this.month, this.day) ? 'cm-item--disabled' : '';

      	if(isToday(this.year, this.month, this.day, this.selectedDate)) klass += 'active'
	      return klass;
	    }
	},
    data: function() {
      return {

      }
    },
    template: 
    `
<li :selectedDate="selectedDate" @click="onDayClick" :class="klass" v-bind:data-year="year" v-bind:data-month="month" v-bind:data-day="day">
	<div class="cm-field-wrapper "><div class="cm-field-title">{{day}}</div></div>
</li>
    `
  }
}