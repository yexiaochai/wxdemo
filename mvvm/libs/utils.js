
//与业务无关的工具类

export function isFunction(obj) {
  return typeof obj === 'function'
}

export function query(el) {
  if (typeof el === 'string') {
    const selector = el
    el = document.querySelector(el)
    if (!el) {
      return document.createElement('div')
    }
  }
  return el
}

export function cached(fn) {
  const cache = Object.create(null)
  return function cachedFn(str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

export const idToTemplate = cached((id) => {
  var el = query(id)
  return el && el.innerHTML
})

export function makeAttrsMap(attrs, delimiters) {
  const map = {}
  for (let i = 0, l = attrs.length; i < l; i++) {
    map[attrs[i].name] = attrs[i].value;
  }
  return map;
}

export function noop() { }

export function bind(fn, ctx) {
  function boundFn(a) {
    const l = arguments.length
    return l
      ? l > 1
      ? fn.apply(ctx, arguments)
      : fn.call(ctx, a)
      : fn.call(ctx)
  }
  boundFn._length = fn.length
  return boundFn
}