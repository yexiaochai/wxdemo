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
    let scope = this;

    if (flag === 'start') {

    } else {

    }

    model.setParam({
      type: 1
    });
    model.execute(function(data) {
      scope.setCityData(data);
    });

  },
  //用于设置城市数据
  setCityData: function(data) {
    data = data.cities;
    let citys = {}, sortCitys = [];
    let k, gname, name, i, tmp = {}, index;

    //首先处理每个name生成唯一K
    for (k in data) {
      name = data[k].name;
      if (!name) {
        continue;
      }
      gname = name[0].toUpperCase();
      if (!citys[gname]) citys[gname] = [];
      citys[gname].push(data[k]);
    }

    for (i = 65; i < 91; i++) {
      tmp = {};
      tmp[String.fromCharCode(i)] = [];
      sortCitys.push(tmp);
    }

    for (k in citys) {
      index = k.charCodeAt() - 65;
      tmp = {};
      tmp[k] = citys[k];
      sortCitys[index] = tmp;
    }

    this.setData({
      cityData: sortCitys,
      isCityShow: ''
    });
  },
  onCityTap: function(e) {
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.cnname;

    this.setData({
      cityStartName: name,
      cityStartId: id,
      isCityShow: 'none'
    });

  },
  showCity: function() {
    this.setData({
      isCityShow: ''
    });
  },
  shideCity: function() {
    this.setData({
      cityData: [],
      isCityShow: 'none'
    });
  },
  data: {
    cityStartId: null,
    cityStartName: '请选择出发地',
    isCityShow: 'none'
  }
}