
//发布者程序

let uid = 0;

export class Dep {
  constructor () {
    this.id = uid++;
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  notify() {
    let subs = this.subs.slice();
    for(let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }

}
let globalDataDep = new Dep();

export default globalDataDep