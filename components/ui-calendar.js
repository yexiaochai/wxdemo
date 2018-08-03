let View = require('behavior-view');
const util = require('../utils/util.js');

// const dateUtil = util.dateUtil;

Component({
  behaviors: [
    View
  ],
  properties: {
    displayMonthNum: {
      type: Number
    },
    displayTime: {
      type: Date
    },
    selectedDate: {
      type: Date
    }
  },
  data: {
    weekDayArr: ['日', '一', '二', '三', '四', '五', '六'],
  },

  attached: function () { 
    //console.log(this)
    // debugger
  },
  methods: {
   
  }
})