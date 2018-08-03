let View = require('behavior-view');
const util = require('../utils/util.js');

// const dateUtil = util.dateUtil;

Component({
  behaviors: [
    View
  ],
  properties: {
    
  },
  data: {
    weekDayArr: ['日', '一', '二', '三', '四', '五', '六'],
    displayMonthNum: 1,

    //当前显示的时间
    displayTime: null,
    //可以选择的最早时间
    startTime: null,
    //最晚时间
    endTime: null,

    //当前时间，有时候是读取服务器端
    curTime: new Date()
    

  },

  attached: function () { 
    //console.log(this)
  },
  methods: {
   
  }
})