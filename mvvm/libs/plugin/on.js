
export const directiveOn = {
  template2Vnode: function (el, dir) {
    //获取属性值
    let exp = dir.expression;
    if(dir.arg) {
      el.events[dir.arg] = exp;
    }
  }
};
