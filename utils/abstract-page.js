class Page {
  constructor(opts) {
    //用于基础page存储各种默认ui属性
    this.isLoadingShow = 'none';
    this.isToastShow = 'none';
    this.toastMessage = 'toast提示';

    //通用方法列表配置，暂时约定用于点击
    this.methodSet = [
      'onToastHide', 'showToast', 'hideToast', 'showLoading', 'hideLoading'
    ];

    //当前page对象
    this.page = null;
  }
  initPage(pageData) {
    //debugger;

    let _pageData = {};

    //为页面动态添加操作组件的方法
    Object.assign(_pageData, this.getPageFuncs(), pageData);

    //生成真实的页面数据
    _pageData.data = {};
    Object.assign(_pageData.data, this.getPageData(), pageData.data || {});

    console.log(_pageData);
    return _pageData;
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
  //产出页面组件需要的参数
  getPageData() {
    return {
      isLoadingShow: this.isLoadingShow,
      isToastShow: this.isToastShow,
      toastMessage: this.toastMessage
    }
  }
  showToast(message) {
    let scope = this;
    this.setData({
      isToastShow: '',
      toastMessage: message
    });

    // 3秒后关闭loading
    setTimeout(function () {
      scope.hideToast();
    }, 3000);
  }
  hideToast() {
    this.setData({
      isToastShow: 'none'
    });
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