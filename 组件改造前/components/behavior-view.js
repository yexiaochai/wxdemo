module.exports = Behavior({
  behaviors: [],
  properties: {
    //重要属性，每个组件必带，定义组件是否显示
    isShow: {
      type: String
    }
  },
  data: {
  },
  attached: function () { 
     console.log('abstractview')
  },
  methods: {
    myBehaviorMethod: function () {
      console.log('log from my-behavior.js')
    }
  }
})