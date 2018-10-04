//后续要换成snabbdom



//***虚拟dom部分代码,后续会换成snabdom
class Element {
  constructor(tagName, props, children, vm) {
    this.tagName = tagName;
    this.props = props;
    this.children = children || [];
    this.vm = vm.vm;
  }
  render() {
    //拿着根节点往下面撸
    let el = document.createElement(this.tagName);
    let props = this.props.props;
    let scope = this;

    let events = this.props.on;

    for(let name in props) {
      el.setAttribute(name, props[name]);
    }

    for(name in events) {
      let type = Object.keys(this.props.on);
      type = type[0];
      el.addEventListener(type, function (e) {
        scope.vm.$options.methods[scope.props.on[type]] && scope.vm.$options.methods[scope.props.on[type]].call(scope.vm, e);
      })
    }

    let children = this.children;

    for(let i = 0, l = children.length; i < l; i++) {
      let child = children[i];
      let childEl;
      if(child instanceof Element) {
        //递归调用
        childEl = child.render();
      } else {
        childEl = document.createTextNode(child);
      }
      el.append(childEl);
    }
    return el;
  }
}

export function el(tagName, props, children, vm)  {
  return new Element(tagName, props, children, vm)
}
