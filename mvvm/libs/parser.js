import HTMLParser from './html-parser.js'
import TextParser from './text-parser.js'
import codeGen   from './codegen.js'

import { makeAttrsMap } from './utils.js'
import { setElAttrs, setElDrictive } from './helpers.js'


//******核心中的核心
export function compileToFunctions(template, vm) {
  let root;
  let currentParent;
  let options = vm.$options;
  let stack = [];
  let hooks = vm.hooks;

  //这段代码昨天做过解释,这里属性参数比昨天多一些
  HTMLParser(template, {
    start: function(tag, attrs, unary) {

      let element = {
        vm: vm,
        //1 标签 2 文本表达式 3 文本
        type: 1,
        tag,
        //数组
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs), //将属性数组转换为对象
        parent: currentParent,
        children: [],
        events: {},

        //下面这些属性先不予关注,因为底层函数没有做校验,不传要报错

        style: null,
        klass: null,
        hook: {},
        props: {},//DOM属性
        attrs: {}//值为true,false则移除该属性

      };

      //解析指令
      //这里第一步完成事件绑定的处理即可,我们这里依然以小程序的事件为主,这里只做tap事件处理
      setElDrictive(element, attrs);

      for (var hkey in hooks) {
        var hook;
        if (element[hkey] && (hook = hooks[hkey].template2Vnode)) {
          hook(element, element[hkey], vm);
        }
      }

      //if(element.on) {
      //  element.events['click'] = '"' + element.on.expression + '"';
      //}


      //处理属性,我们这里无视样式以及class
      setElAttrs(element, vm.$options.delimiters);

      if(!root) {
        vm.$vnode = root = element;
      }

      if(currentParent && !element.forbidden) {
        currentParent.children.push(element);
        element.parent = currentParent;
      }

      if(!unary) {
        currentParent = element;
        stack.push(element);
      }

    },
    end: function (tag) {
      //获取当前元素
      let element = stack[stack.length - 1];
      let lastNode = element.children[element.children.length - 1];
      //删除最后一个空白节点,暂时感觉没撒用呢
      if(lastNode && lastNode.type === 3 && lastNode.text.trim === '') {
        element.children.pop();
      }

      //据说比调用pop节约性能相当于stack.pop()
      stack.length -= 1;
      currentParent = stack[stack.length - 1];

    },
    //处理真实的节点
    chars: function(text) {
      if (!text.trim()) {
        //text = ' '
        return;
      }
      //解析文本节点 exp: a{{b}}c => 'a'+_s(a)+'b'
      let expression = TextParser(text, options.delimiters)
      if (expression) {
        currentParent.children.push({
          type: 2,
          expression,
          text
        })
      } else {
        currentParent && currentParent.children.push({
          type: 3,
          text
        })
      }
    }

  });

  //***关键代码***
  //将vnode转换为render函数,事实上可以直接传入这种render函数,便不会执行这块逻辑,编译时候会把这块工作做掉
  return codeGen(root);

}
