let View = require('behavior-view');
const util = require('../utils/util.js');

// const dateUtil = util.dateUtil;

Component({
  externalClasses: ['ex-class'],
  behaviors: [
    View
  ],
  properties: {
    displayMonthNum: {
      type: Number
    },
    displayTime: {
      type: String
    },
    selectedDate: {
      type: String
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
    onDayTap: function (e) {
      this.triggerEvent('onDayTap', e.currentTarget.dataset)
    }
  }
})