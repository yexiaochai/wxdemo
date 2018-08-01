//因为小程序页面中每个页面应该是独立的作用域
class UIUtil {
  constructor(opts) {
    //用于存储各种默认ui属性
    this.isLoadingShow = 'none';
    this.isToastShow = '';
    this.toastMessage = 'toast提示';

    //通用方法列表配置，暂时约定用于点击
    this.methodSet = [
      'onMaskEvent'
    ];

    //当前page对象
    this.page = null;
  }
  onMaskEvent(e) {
    this.hideToast();
  }
  //设置页面可能使用的方法
  setPageMethods(page) {
    this.page = page;
    for (let i = 0, len = this.methodSet.length; i < len; i++ ) {
      page[this.methodSet[i]] = this[this.methodSet[i]];
    }
  }
  //产出页面组件需要的参数
  getPageData() {
    return {
      isLoadingShow: this.isLoadingShow,
      isToastShow: this.isToastShow,
      toastMessage: this.toastMessage
    }
  }
  showToast(page, message) {
    this.isToastShow = '';
    this.toastMessage = message;
    page.setData({
      isToastShow: this.isToastShow,
      toastMessage: this.toastMessage
    });
  }
  //关闭loading
  hideToast(page, message) {
    this.isToastShow = 'none';
    page.setData({
      isToastShow: this.isToastShow
    });
  }
  //需要传入page实例
  showLoading(page) {
    this.isLoadingShow = '';
    page.setData({
      isLoadingShow: this.isLoadingShow
    });
  }
  //关闭loading
  hideLoading(page) {
    this.isLoadingShow = 'none';
    page.setData({
      isLoadingShow: this.isLoadingShow
    });
  }
}

//直接返回一个UI工具了类的实例
module.exports = new UIUtil