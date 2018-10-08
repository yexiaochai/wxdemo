import { makeFunction } from './helpers.js'


const simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/
const modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: 'if($event.target !== $event.currentTarget)return;',
  ctrl: 'if(!$event.ctrlKey)return;',
  shift: 'if(!$event.shiftKey)return;',
  alt: 'if(!$event.altKey)return;',
  meta: 'if(!$event.metaKey)return;'
}

const keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
}


export default function codeGen(ast) {
  //解析成h render字符串形式
  const code = ast ? genElement(ast) : '_h("div")'
  //把render函数，包起来，使其在当前作用域内

  //return makeFunction(`with(this){ debugger;  return ${code}}`)

  return makeFunction(`with(this){ return ${code}}`)
}

function genElement(el) {
  //指令阶段
  var hooks = el.vm.hooks;
  if (!el.processed) {
    el.processed = true;
    for (var hkey in hooks) {
      var hook;
      if (el[hkey] && (hook = hooks[hkey].vnode2render)) {
        return hook(el, genElement);
      }
    }
  }
  //无指令
  return nodir(el)
}

//没有指令时运行,或者指令解析完毕
function nodir(el) {
  let code
  //设置属性 等值
  const data = genData(el);
  //转换子节点
  const children = genChildren(el, true);
  code = `_h('${el.tag}'${
        data ? `,${data}` : '' // data
}${
        children ? `,${children}` : '' // children
})`
return code
}

function genChildren(el, checkSkip) {
  const children = el.children
  if (children.length) {
    const el = children[0]
    // 如果是v-for
    //if (children.length === 1 && el.for) {
    //  return genElement(el)
    //}
    const normalizationType = 0
    return `[${children.map(genNode).join(',')}]${
            checkSkip
                ? normalizationType ? `,${normalizationType}` : ''
  : ''
  }`
}
}

function genNode(node) {
  if (node.type === 1) {
    return genElement(node)
  } else {
    return genText(node)
  }
}

function genText(text) {
  return text.type === 2 ? text.expression : JSON.stringify(text.text)
}

function genData(el) {
  let data = '{'
  // attributes
  if (el.style) {
    data += 'style:' + genProps(el.style) + ','
  }
  if (Object.keys(el.attrs).length) {
    data += 'attrs:' + genProps(el.attrs) + ','
  }
  if (Object.keys(el.props).length) {
    data += 'props:' + genProps(el.props) + ','
  }
  if (Object.keys(el.events).length) {
    data += 'on:' + genProps(el.events) + ','
  }
  if (Object.keys(el.hook).length) {
    data += 'hook:' + genProps(el.hook) + ','
  }
  data = data.replace(/,$/, '') + '}'
  return data
}

function genProps(props) {
  let res = '{';
  for (let key in props) {
    res += `"${key}":${props[key]},`
  }
  return res.slice(0, -1) + '}'
}
