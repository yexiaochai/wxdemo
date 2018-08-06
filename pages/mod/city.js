/*
事实上一个mod就只是一个对象,只不过为了方便拆分,将对象分拆成一个个的mod
一个mod对应一个wxml,但是共享外部的css,暂时如此设计
所有日历模块的需求全部再此实现
*/
const util = require('../../utils/util.js')
const models = require('../../data/demo-model.js')

let selectedDate = new Date().toString();

module.exports = {
  showCitylist: function(e) {
    let flag = e.currentTarget.dataset.flag;
    let model ;
    let scope = this;

    if (flag === 'start') {
      model = models.cityModel;
    } else {

      if(!this.data.cityStartId) {
        this.showToast('请先选择出发城市');
        return;
      }

      model = models.city2Model;
      model.setParam({
        startcityid: this.data.cityStartId
      });
    }
    this.showLoading();
    model.execute(function(data) {
      scope.hideLoading();
      scope.setCityData(data, flag);
    });

  },
  //用于设置城市数据
  setCityData: function(data, flag) {
    data = data.cities;
    let citys = {}, sortCitys = [], arrData = [];
    let k, gname, name, i, tmp = {}, index, len;

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
      cityFlag: flag,
      cityData: this._getSortData(sortCitys),
      isCityShow: ''
    });
  },

  _getSortData: function (sortCitys) {
    let i, len, arrData = [], tmp = {}, key;
    for(i = 0, len = sortCitys.length; i < len; i++) {
      tmp = sortCitys[i];
      key = Object.keys(tmp)[0];
      if(sortCitys[i][key].length > 0) {
        arrData.push(sortCitys[i]);
      }
    }
    return arrData;
  },

  onCityTap: function(e) {
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.cnname;

    if(!this.data.cityFlag) {
      this.showToast('请您刷新页面');
      return;
    }

    if(this.data.cityFlag === 'start') {
      this.setData({
        cityStartName: name,
        cityStartId: id,
        isCityShow: 'none'
      });
    } else {
      this.setData({
        cityArriveName: name,
        cityArriveId: id,
        isCityShow: 'none'
      });
    }
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
    cityFlag: null,
    cityStartId: null,
    cityStartName: '请选择出发地',
    cityArriveId: null,
    cityArriveName: '请选择到达地',
    isCityShow: 'none'
  }
}