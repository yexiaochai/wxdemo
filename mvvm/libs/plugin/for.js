export const forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/
export const forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/

export const directiveFor = {
  template2Vnode: function (el,dir) {
    //获取属性值
    let exp = dir.expression

    //获取数组
    //(key ,index) in arr
    //[0] (key ,index) in arr,[1] (key ,index),[2] arr
    const inMatch = exp.match(forAliasRE)
    if (!inMatch) {
      warn(`Invalid v-for expression: ${exp}`)
      return
    }
    el.for = inMatch[2].trim()
    const alias = inMatch[1].trim()
    //分解 (value,key ,index)
    //alias  value
    //iterator1 key
    //iterator2 index
    const iteratorMatch = alias.match(forIteratorRE)
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim();
      el.iterator1 = iteratorMatch[2].trim()
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim()
      }
    } else {
      el.alias = alias
    }
  },
  vnode2render: function (el, genElement) {
    if (!el.forProcessed) {
      const exp = el.for
      const alias = el.alias
      const iterator1 = el.iterator1 ? `,${el.iterator1}` : ''
      const iterator2 = el.iterator2 ? `,${el.iterator2}` : ''
      return `_l((${exp}),` +
                `function(${alias}${iterator1}${iterator2}){` +
                `return ${genElement(el)}` +
          '})'
      }
    }
  }