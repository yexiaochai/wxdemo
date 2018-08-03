//behavior-layer
const util = require('../utils/util.js')
module.exports = Behavior({
  properties: {
    //重要属性，每个组件必带，定义组件是否显示
    isShow: {
      type: String
    }
  },
  //这里设置弹出层必须带有一个遮盖层，所以每个弹出层都一定具有有个z-index属性
  data: {
    maskzIndex: util.getBiggerzIndex(),
    uiIndex: util.getBiggerzIndex(),
    //默认点击遮盖层不关闭组件
    clickToHide: true
  },
  attached: function() {
  },
  methods: {
    onMaskEvent: function (e) {
      if (this.data.maskEventName)
        this.triggerEvent(this.data.maskEventName, e, {})
    }
  }
})