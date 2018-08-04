class Store {
  constructor(opts) {
    if(!opts || !opts.key) return;
    Object.assign(this, opts);
    //for(let k in opts) {
    //  this[k] = opts[k];
    //}

    //如果没有传过期时间,则默认30分钟
    if(!this.lifeTime) this.lifeTime = 30;

    //本地缓存用以存放所有localstorage键值与过期日期的映射
    this._keyCache = 'SYSTEM_KEY_TIMEOUT_MAP';

  }
  //获取过期时间,单位为毫秒
  _getDeadline() {
    return this.lifeTime * 60 * 1000;
  }

  //获取一个数据缓存对象,存可以异步,获取我同步即可
  get(key, sign){
    let now = new Date().getTime();
    var data = wx.getStorageSync(key);

    if(!sign) return data.data;
    if(sign === data.sign) return data.data;

    return null;
  }

  /*产出页面组件需要的参数
  sign 为格式化后的请求参数，用于同一请求不同参数时候返回新数据，比如列表为北京的城市，后切换为上海，会判断tag不同而更新缓存数据，tag相当于签名
  每一键值只会缓存一条信息
  */
  set(key, data, sign) {
    let timeout = new Date();
    timeout.setTime(timeout.getTime() + this._getDeadline());
    this._setData(key, data, time, sign);
  }
  _saveData(key, data, time, sign) {
    let entity = {
      inDate: new Date().getTime(),
      deadLine: time.getTime(),
      data: data,
      sign: sign
    };
    let scope = this;

    wx.setStorage({
      key: key,
      data: JSON.stringify(entity),
      success: function () {
        //每次真实存入前,需要往系统中存储一个清单
        scope._saveSysList(key, entity.deadLine);
      }
    });
  }
  _saveSysList(key, timeout) {
    if (!key || !timeout || timeout < new Date().getTime()) return;
    let keyCache = this._keyCache;
    wx.getStorage({
      key: keyCache,
      success: function (oldData) {
        if(oldData) oldData = JSON.parse(oldData);
        else oldData = {};
        oldData[key] = timeout;
        wx.setStorage({
          key: keyCache,
          data: JSON.stringify(oldData)
        });
      }
    });
  }
  //删除过期缓存
  removeOverdueCache() {
    let now = new Date().getTime();
    let keyCache = this._keyCache;
    wx.getStorage({
      key: keyCache,
      success: function (data) {
        if(data) data = JSON.parse(data);
        for(let k in data) {
          if(data.deadLine < now) {
            delete data[k];
            wx.removeStorage({key: k, success: function(){}});
          }
        }
      }
    });

  }

}

module.exports = Store