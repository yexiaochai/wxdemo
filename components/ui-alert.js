let LayerView = require('behavior-layer');
Component({
  behaviors: [
    LayerView
  ],
  properties: {
    btns: {
      type: Array
    },
    title: {
      type: String
    },
    message: {
      type: String
    }
  },
  data: {
    maskEventName: 'onToastHide'
  },

  attached: function () { 
    //console.log(this)
  },
  methods: {
    onBtnEvent: function (e) {
      this.triggerEvent('onBtnTap', e, {})
    }
  }
})