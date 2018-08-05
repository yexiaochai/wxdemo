let Store = require('./abstract-store.js');

class CityStore extends Store {
  constructor() {
    super();
    this.key = 'DEMO_CITYLIST';
    //30分钟过期时间
    this.lifeTime = 30;
  }
}

module.exports = {
  cityStore: new CityStore
}