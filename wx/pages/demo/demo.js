//logs.js
const util = require('../../utils/util.js')
console.log('log');

Page({
  data: {
    name: 'hello world'
  },
  clickHandler: function () {
    this.setData({
      name: '叶小钗'
    })
  }
})


function _s() { }
function _h() { }

_h('div', { style: { "font-size": 14px, " margin-left": " " + _s(age + 'px') + " " }, attrs: { "data-name": name, "data-flag": 'start', "ontap": 'clickHandler' }, props: { "class": 'c-row search-line {{name}} {{age}}' } }, [_h('div', { props: { "class": 'c-span9 js-start search-line-txt' } }, ["\n    " + _s(name)]), _h('span', {}, [_s(age + 1)]), _h('input', { props: { "type": 'text', "value": _s(age) } }), _h('br', {})])
