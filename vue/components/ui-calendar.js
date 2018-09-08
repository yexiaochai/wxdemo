import data from './ui-calendar-day.js'

Vue.component(data.name, data.data);

export default {
  name: 'ui-calendar',
  data: {
    methods: {
    },
    data: function() {
      return {
      }
    },
    template:
`
<ul>
<template v-for="num in 30" >
  <ui-calendar-day year="2018" month="8" v-bind:day="num" ></ui-calendar-day>
</template>
</ul>
`
  }
}
