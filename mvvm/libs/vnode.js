//后续要换成snabbdom



//***虚拟dom部分代码,后续会换成snabdom
class Element {
  constructor(tagName, props, children) {
    this.tagName = tagName;
    this.props = props;
    this.children = children || [];
  }
  render() {
    //拿着根节点往下面撸
    let el = document.createElement(this.tagName);
    let props = this.props.props;
    let attrs = this.props.attrs;
    let style = this.props.style;
    let klass = this.props.klass;

    let s = '';

    for(let name in props) {
      el.setAttribute(name, props[name]);
    }

    for(name in attrs) {
      el.setAttribute(name, attrs[name]);
    }

    for(name in style) {
      s += name + ': ' + style[name] + ';';
    }
    if(s) {
      el.setAttribute('style', s);
    }
    s = '';

    for(name in klass) {
      s += name + ': ' + style[name] + ';';
    }
    if(s) {
      el.setAttribute('class', s);
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

export function el(tagName, props, children)  {
  return new Element(tagName, props, children)
}
