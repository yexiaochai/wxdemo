class Page {
  constructor(opts) {
    //用于基础page存储各种默认ui属性
    this.isLoadingShow = 'none';
    this.isToastShow = 'none';
    this.isMessageShow = 'none';

    this.toastMessage = 'toast提示';

    this.alertTitle = '';
    this.alertMessage = 'alertMessage';
    this.alertBtn = [];

    //通用方法列表配置，暂时约定用于点击
    this.methodSet = [
      'onToastHide',
      'showToast',
      'hideToast',
      'showLoading',
      'hideLoading',
      'onAlertBtnTap',
      'showMessage',
      'hideMessage'
    ];

    //当前page对象
    this.page = null;
  }
  //产出页面组件需要的参数
  getPageData() {
    return {
      isMessageShow: this.isMessageShow,
      alertTitle: this.alertTitle,
      alertMessage: this.alertMessage,
      alertBtn: this.alertBtn,

      isLoadingShow: this.isLoadingShow,
      isToastShow: this.isToastShow,
      toastMessage: this.toastMessage

    }
  }

  //pageData为页面级别数据,mod为模块数据,要求一定不能重复
  initPage(pageData, mod) {
    //debugger;
    let _pageData = {};
    let key, value, k, v;

    //为页面动态添加操作组件的方法
    Object.assign(_pageData, this.getPageFuncs(), pageData);

    //生成真实的页面数据
    _pageData.data = {};
    Object.assign(_pageData.data, this.getPageData(), pageData.data || {});

    for( key in mod) {
      value = mod[key];
      for(k in value) {
        v = value[k];
        if(k === 'data') {
          Object.assign(_pageData.data, v);
        } else {
          _pageData[k] = v;
        }
      }
    }

    console.log(_pageData);
    return _pageData;
  }
  onAlertBtnTap(e) {
    let type = e.detail.target.dataset.type;
    if (type === 'default') {
      this.hideMessage();
    } else if (type === 'ok') {
      if (this.alertOkCallback) this.alertOkCallback.call(this);
    } else if (type == 'cancel') {
      if (this.alertCancelCallback) this.alertCancelCallback.call(this);
    }
  }
  showMessage(msg) {
    let alertBtn = [{
      type: 'default',
      name: '知道了'
    }];
    let message = msg;
    this.alertOkCallback = null;
    this.alertCancelCallback = null;

    if (typeof msg === 'object') {
      message = msg.message;
      alertBtn = [];
      msg.cancel.type = 'cancel';
      msg.ok.type = 'ok';

      alertBtn.push(msg.cancel);
      alertBtn.push(msg.ok);
      this.alertOkCallback = msg.ok.callback;
      this.alertCancelCallback = msg.cancel.callback;
    }

    this.setData({
      alertBtn: alertBtn,
      isMessageShow: '',
      alertMessage: message
    });
  }
  hideMessage() {
    this.setData({
      isMessageShow: 'none',
    });
  }
  //当关闭toast时触发的事件
  onToastHide(e) {
    this.hideToast();
  }
  //设置页面可能使用的方法
  getPageFuncs() {
    let funcs = {};
    for (let i = 0, len = this.methodSet.length; i < len; i++) {
      funcs[this.methodSet[i]] = this[this.methodSet[i]];
    }
    return funcs;
  }

  showToast(message, callback) {
    this.toastHideCallback = null;
    if (callback) this.toastHideCallback = callback;
    let scope = this;
    this.setData({
      isToastShow: '',
      toastMessage: message
    });

    // 3秒后关闭loading
    setTimeout(function() {
      scope.hideToast();
    }, 3000);
  }
  hideToast() {
    this.setData({
      isToastShow: 'none'
    });
    if (this.toastHideCallback) this.toastHideCallback.call(this);
  }
  //需要传入page实例
  showLoading() {
    this.setData({
      isLoadingShow: ''
    });
  }
  //关闭loading
  hideLoading() {
    this.setData({
      isLoadingShow: 'none'
    });
  }
}
//直接返回一个UI工具了类的实例
module.exports = new Page