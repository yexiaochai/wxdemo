//el操作相关集合
import TextParser from './text-parser.js'


export const drictiveRE = /^m\-(\w+)(\:[^\.]+)?\.?([^\:]+)?/


//导出属性
export function setElAttrs(el, delimiters) {
  var s = delimiters[0], e = delimiters[1];
  var reg = new RegExp(`^${s}(\.+\)${e}$`);
  var attrs = el.attrsMap;
  for (let key in attrs) {
    let value = attrs[key];
    //el.props[key] = TextParser(value, delimiters) ||  "'" + value + "'";
    el.attrs[key] = TextParser(value, delimiters) ||  "'" + value + "'";
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
        arg: 'click', //现在定义ontap就是click
        expression: attrs[i].value
      }
    }

    //其他事件处理
    let darr = name.match(drictiveRE);
    if (darr) {
      //removeAttr(el, name)
      el[darr[1]] = {
        name: darr[1],
        expression: attrs[i].value,
        modifiers: split(darr[3]),
        arg: darr[2] && darr[2].slice(1)
      }
    }

  }

  function split(modifiers) {
    var map = {};
    var mod = modifiers && modifiers.split('.');
    if (mod) {
      mod.split('.').forEach(function (item, i) {
        map[item] = true;
      });
    }
    return map;
  }
}