/*
事实上一个mod就只是一个对象,只不过为了方便拆分,将对象分拆成一个个的mod
一个mod对应一个wxml,但是共享外部的css,暂时如此设计
所有日历模块的需求全部再此实现
*/
const util = require('../../../utils/util.js')
const models = require('../../../data/demo-model.js')

let selectedDate = new Date().toString();

module.exports = {
  showCitylist: function(e) {
    let flag = e.currentTarget.dataset.flag;
    let model = models.cityModel;
    model.setParam({
      type: 1
    });
    model.execute(function(data) {
      console.log(data);
      debugger;
    });

    return;

    if (flag === 'start') {

    } else {

    }
  },
  //用于设置城市数据
  setCityData: function(data) {

  },
  showCity: function() {
    this.setData({
      isCityShow: ''
    });
  },
  shideCity: function() {
    this.setData({
      isCityShow: 'none'
    });
  },
  data: {
    isCityShow: 'none'
  }
}