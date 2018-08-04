class Model {
  constructor() {

    this.url = '';
    this.param = {};

  }

  pushValidates (handler) {
    if (typeof handler === 'function') {
      this.validates.push(handler, this);
    }
  }

  setParam (key, val) {
    if (typeof key === 'object') {
      Object.assign(this.param, key);
    } else {
      this.param[key] = val;
    }
  }

  //@override
  buildurl() {
    return this.url;
  }

  onDataSuccess() {

  }

  //执行数据请求逻辑
  execute(onComplete) {
    let scope = this;
    let _success = function (data) {
      let _data = data;
      if (typeof data == 'string') _data = JSON.parse(data);

      // @description 开发者可以传入一组验证方法进行验证
      for (let i = 0, len = this.validates.length; i < len; i++) {
        if (!this.validates[i](data)) {
          // @description 如果一个验证不通过就返回
          if (typeof onError === 'function') {
            return onError.call(scope || this, _data, data);
          } else {
            return false;
          }
        }
      }

      // @description 对获取的数据做字段映射
      let datamodel = typeof this.dataformat === 'function' ? this.dataformat(_data) : _data;

      if (this.onDataSuccess) this.onDataSuccess.call(scope, datamodel, data);
      if (typeof onComplete === 'function') {
        onComplete.call(scope, datamodel, data);
      }
    };
    this._sendRequest(_success);
  }

  //删除过期缓存
  _sendRequest(callback) {
    let url = this.buildurl();
    wx.request({
      url: this.buildurl(),
      data: this.param,
      success: function success(data) {
        callback && callback(data);
      }
    });
  }

}

module.exports = Model