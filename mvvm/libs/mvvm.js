import {initData, initMethods } from './instance.js'
import { query, idToTemplate, resolveAsset} from './utils.js'
import { compileToFunctions } from './parser.js'
import Watcher from './watcher.js'
import globalDataDep from './dep.js'
import { patch, h, VNode } from './vnode.js'
import { directive } from './plugin/index.js'

function  warn (str) {
  console.log(str);
}

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

    if(options.methods) {
      initMethods(this, options.methods);
    }

    this.$mount(options.el);
  }
   //动态插入
   static use(plugin) {
     plugin && plugin.install && plugin.install.call(this, MVVM);
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

    var vm = this;
    this._watcher = new Watcher(this,
      function () {
        vm._update(vm._render(), this._h);
      },
      function updateComponent() {
        vm._update(vm._render(), this._h);
      });

    if (!this._vnode) {
      this._isMounted = true
    }

    return this;
  }

   setData(data) {
     initData(this, Object.assign({}, this.$data, data));
     globalDataDep.notify();
   }

   _update(vnode) {
     if (this._isMounted) {
       callHook(this, 'beforeUpdate')
     }

     //这里会对不新旧虚拟节点,会依赖snabbdom,我们这里先粗暴处理
     const prevVnode = this._vnode
     this._vnode = vnode;

     //这里先不对比新老节点差异,直接执行渲染流程
     if (!prevVnode) {
       this.$el = patch(this.$el, vnode)
     } else {
       this.$el = patch(prevVnode, vnode)
     }

     if (this._isMounted) {
       callHook(this, 'updated')
     }

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
    data = data || {}
    //没有attr时,child顶上
    if (Array.isArray(data)) {
      children = data
      data = {}
    }

    data.hook = data.hook || {}

    if (this.$options.destroy) {
      data.hook.destroy = bind(this.$options.destroy, this)
    }

    if (Array.isArray(children)) {
      let faltChildren = []

      children.forEach((item) => {
        if (Array.isArray(item)) {
        faltChildren = faltChildren.concat(item)
      } else {
        faltChildren.push(item)
      }
    })

      children = faltChildren.length ? faltChildren : children
    }


if (typeof tag == 'string') {
  let Ctor = resolveAsset(this.$options, 'components', tag)
  if (Ctor) {
    return this._createComponent(Ctor, data, children, tag)
  }
}

    let _vnode = h(tag, data, children)

    return _vnode;
  }

//创建组件
//子组件option,属性,子元素,tag
_createComponent(Ctor, data, children, sel) {
 Ctor.data = mergeOptions(Ctor.data);
 let componentVm;
 let Factory = this.constructor
 let parentData = this.$data
 data.hook.insert = (vnode) => {
   Ctor.data = Ctor.data || {};

    //将数据传递下来
    for(let i in Ctor.props) {
      let key = Ctor.props[i]
      Ctor.data[key] = data.attrs[key];
    }

   var el =createElement('sel')
   vnode.elm.append(el)
   Ctor.el = el;
   componentVm = new Factory(Ctor);
   vnode.key = componentVm.uid;
   componentVm._isComponent = true
   componentVm.$parent = this;
   (this.$children || (this.$children = [])).push(componentVm);
   //写在调用父组件值
   for (let key in data.attrs) {
     if (Ctor.data[key]) {
       warn(`data:${key},已存在`);
       continue;
     }
   }
 }
 Ctor._vnode = new VNode(sel,null,data, [], undefined, createElement(sel));
 return Ctor._vnode
}


  _s(val) {
    return val == null
      ? ''
      : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
  }

   //渲染for时,返回多个render
   _l(val, render) {
     let ret, i, l, keys, key
     if (Array.isArray(val) || typeof val === 'string') {
       ret = new Array(val.length)
       for (i = 0, l = val.length; i < l; i++) {
         ret[i] = render(val[i], i)
       }
     } else if (typeof val === 'number') {
       ret = new Array(val)
       for (i = 0; i < val; i++) {
         ret[i] = render(i + 1, i)
       }
     } else if (isObject(val)) {
       keys = Object.keys(val)
       ret = new Array(keys.length)
       for (i = 0, l = keys.length; i < l; i++) {
         key = keys[i]
         ret[i] = render(val[key], key, i)
       }
     }
     return ret
   }

}

function createElement(tagName) {
  return document.createElement(tagName);
}

//获取data 因为data有可能为
function mergeOptions(options) {
  let opt = Object.assign({}, options)
  let data = opt.data
  if (typeof data === 'function') {
    opt.data = data()
  }
  return opt
}

//添加指令特性
MVVM.use(directive)


export default MVVM;