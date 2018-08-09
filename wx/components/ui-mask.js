let LayerView = require('behavior-view')
Component({
  behaviors: [LayerView],
  properties: {
    //只有mask的z-index属性需要被调用的弹出层动态设置
    zIndex: {
      type: String
    },
    clickToHide: {
      type: Boolean
    }
  },
  data: {
  },
  attached: function () { 
    console.log('mask')
  },
  methods: {
    onTap: function(e) {
      this.triggerEvent('maskevent', e, {})
    }
  }
})