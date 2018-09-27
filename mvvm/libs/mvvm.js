import {initData } from './instance.js'
import { query, idToTemplate } from './utils.js'
import { compileToFunctions } from './parser.js'
import { el } from './vnode.js'

//全局数据保证每个MVVM实例拥有唯一id
let uid = 0;

 class MVVM {
  constructor(options) {
    this.$options = options;

    //我们可以在传入参数的地方设置标签替换方式,比如可以设置为['<%=', '%>'],注意这里是数组
    this.$options.delimiters = this.$options.delimiters || ["{{", "}}"];

    //唯一标志
    this._uid = uid++;

    if(options.data) {
      initData(this, options.data);
    }

    this.$mount(options.el);

    let _node = this._render().render();
    this.$el.appendChild( _node)

  }

  //解析模板compileToFunctions,将之形成一个函数
  //很多网上的解释是将实例挂载到dom上,这里有些没明白,我们后面点再看看
  $mount(el) {
    let options = this.$options;

    el = el && query(el);
    this.$el = el;

    //如果用户自定义了render函数则不需要解析template
    //这里所谓的用户自定义,应该是用户生成了框架生成那坨代码,事实上还是将template转换为vnode
    if(!options.render) {
      let  template = options.template;
      if(template) {
        if(typeof template === 'string') {
          //获取script的template模板
          if (template[0] === '#') {
            template = idToTemplate(template)
          }
        } else if (template.nodeType) {
          //如果template是个dom结构,只能有一个根节点
          template = template.innerHTML;
        }
      }

      //上面的代码什么都没做,只是确保正确的拿到了template数据,考虑了各种情况
      //下面这段是关键,也是我们昨天干的事情
      if(template) {
        //***核心函数***/
        let render = compileToFunctions(template, this);
        options.render = render;
      }
    }

    return this;
  }

  _render() {
    let render = this.$options.render
    let vnode
    try {
      //自动解析的template不需要h,用户自定义的函数需要h
      vnode = render.call(this, this._h);
    } catch (e) {
      warn(`render Error : ${e}`)
    }
    return vnode
  }

  _h(tag, data, children) {
    return el(tag, data, children)
  }

  _s(val) {
    return val == null
      ? ''
      : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
  }

}

export default MVVM;