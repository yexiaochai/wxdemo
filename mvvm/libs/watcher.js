
import globalDataDep from './dep.js'

//订阅者(观察者)

let uid = 0;

//观察者,在解析模板到data与node映射时期出现
export default class Watcher {
  constructor (vm, cb) {

    this.vm = vm;

    this.id = uid++;
    this.getter = cb;

    globalDataDep.addSub(this);

    //执行首次渲染
    this.value = this.get();

  }

  get () {
    const vm = this.vm

    return this.getter.call(vm, vm)
  }

  update() {
    console.log('update')
    this.get();

  }

}