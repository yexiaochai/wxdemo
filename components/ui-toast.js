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
  },
  attached: function () { 
    console.log(this)
  },
  methods: {
  }
})