const util = require('../utils/util.js');
let LayerView = require('behavior-layer');
Component({
  behaviors: [
    LayerView
  ],
  properties: {
    message: {
      type: String
    }
  },
  data: {
    maskEventName: 'onContainerHide'
  },

  attached: function () { 
    //console.log(this)
  },
  methods: {
  }
})