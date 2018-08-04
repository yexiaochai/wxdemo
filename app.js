//app.js




const Store = require('./utils/abstract-store.js');
global.Store = Store

App({
  onShow: function () {
  },
  onLaunch: function () {

  },
  globalData: {
    userInfo: null
  }
})