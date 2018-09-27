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