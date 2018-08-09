class Store {
  constructor(opts) {
    if (typeof opts === 'string') this.key = opts;
    else Object.assign(this, opts);

    //如果没有传过期时间,则默认30分钟
    if (!this.lifeTime) this.lifeTime = 1;

    //本地缓存用以存放所有localstorage键值与过期日期的映射
    this._keyCache = 'SYSTEM_KEY_TIMEOUT_MAP';

  }
  //获取过期时间,单位为毫秒
  _getDeadline() {
    return this.lifeTime * 60 * 1000;
  }

  //获取一个数据缓存对象,存可以异步,获取我同步即可
  get(sign) {
    let key = this.key;
    let now = new Date().getTime();
    var data = wx.getStorageSync(key);
    if (!data) return null;
    data = JSON.parse(data);
    //数据过期
    if (data.deadLine < now) {
      this.removeOverdueCache();
      return null;
    }

    if (data.sign) {
      if (sign === data.sign) return data.data;
      else return null;
    }
    return null;
  }

  /*产出页面组件需要的参数
  sign 为格式化后的请求参数，用于同一请求不同参数时候返回新数据，比如列表为北京的城市，后切换为上海，会判断tag不同而更新缓存数据，tag相当于签名
  每一键值只会缓存一条信息
  */
  set(data, sign) {
    let timeout = new Date();
    let time = timeout.setTime(timeout.getTime() + this._getDeadline());
    this._saveData(data, time, sign);
  }
  _saveData(data, time, sign) {
    let key = this.key;
    let entity = {
      deadLine: time,
      data: data,
      sign: sign
    };
    let scope = this;

    wx.setStorage({
      key: key,
      data: JSON.stringify(entity),
      success: function() {
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
      complete: function(data) {
        let oldData = {};
        if (data.data) oldData = JSON.parse(data.data);
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
      success: function(data) {
        if (data && data.data) data = JSON.parse(data.data);
        for (let k in data) {
          if (data[k] < now) {
            delete data[k];
            wx.removeStorage({
              key: k,
              success: function() {}
            });
          }
        }
        wx.setStorage({
          key: keyCache,
          data: JSON.stringify(data)
        });
      }
    });
  }

}

module.exports = Store