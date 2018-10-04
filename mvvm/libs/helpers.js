//el操作相关集合
import TextParser from './text-parser.js'

//导出属性
export function setElAttrs(el, delimiters) {
  var s = delimiters[0], e = delimiters[1];
  var reg = new RegExp(`^${s}(\.+\)${e}$`);
  var attrs = el.attrsMap;
  for (let key in attrs) {
    let value = attrs[key];
    el.props[key] = TextParser(value, delimiters) ||  "'" + value + "'";
  }
}

export function makeFunction(code) {
  try {
    return new Function(code)
  } catch (e) {
    return function (){};
  }
}

//解析指令，这里完成第一步解析出click事件即可
export function setElDrictive(el, attrs) {
  for(let i = 0, l = attrs.length; i < l; i++) {
    let name = attrs[i].name;

    //这里只判断ontap即可,其余指令不予理睬
    if(name === 'ontap') {
      el['on'] = {
        name: 'on',
        arg: 'ontap',
        expression: 'ontap'
      }
    }

  }

}