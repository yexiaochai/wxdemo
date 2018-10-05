
//实例要用到的方法集合在此
import { isFunction, noop, bind } from './utils.js'



//因为我们后面采用setData的方式通知更新,不做响应式更新,这里也先不考虑update,不考虑监控,先关注首次渲染
//要做到更新数据,DOM跟着更新,事实上就是所有的data数据被监控(劫持)起来了,一旦更新都会调用对应的回调,我们这里做到更新再说
export function initData(vm, data) {
  if (isFunction(data)) {
    data = data()
  }
  //这里将data上的数据移植到this上,后面要监控
  for(let key in data) {
    //这里有可能会把自身方法覆盖,所以自身的属性方法需要+$
    vm[key] = data[key];
  }

  vm.$data = data;
}

//将传入参数的方法挂到对象上,这里感觉又可能发生覆盖
export function initMethods(vm, methods) {
  //遍历到原型链属性
  for (const key in methods) {
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm)
  }
}
